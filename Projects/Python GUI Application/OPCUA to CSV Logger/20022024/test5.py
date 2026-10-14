import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QPushButton, QHBoxLayout, QWidget, QTextEdit, QVBoxLayout
import asyncio
import os
import pandas as pd
import time
from asyncua import Client
from datetime import datetime, date
import configparser
import logging


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("OPC UA Logger")

        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)

        self.layout = QVBoxLayout()
        self.central_widget.setLayout(self.layout)

        # Create a horizontal layout for the buttons
        button_layout = QHBoxLayout()

        self.start_button = QPushButton("Start Logging")
        self.stop_button = QPushButton("Stop Logging")
        self.exit_button = QPushButton("Exit")

        button_layout.addWidget(self.start_button)
        button_layout.addWidget(self.stop_button)
        button_layout.addWidget(self.exit_button)

        # Add the button layout to the main layout
        self.layout.addLayout(button_layout)

        self.log_textedit = QTextEdit()
        self.layout.addWidget(self.log_textedit)

        self.start_button.clicked.connect(self.start_logging)
        self.stop_button.clicked.connect(self.stop_logging)
        self.exit_button.clicked.connect(self.exit_application)

        # Set up logging to a file
        log_file = os.path.join(os.path.dirname(__file__), 'application.log')
        logging.basicConfig(filename=log_file, level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

        self.logging_task = None
        self.client = None

    async def connect_to_opcua_server(self):
        # Read configuration from config.ini file
        config = configparser.ConfigParser()
        config.read("config.ini")

        # Get OPC UA server URL from config
        server_url = config.get("opcua", "endpoint_url")

        try:
            # Create an OPC UA client and connect to the server
            self.client = Client(url=server_url)
            await self.client.connect()
            logging.info("Connected to OPC UA server")
            self.log_textedit.append("Connected to OPC UA server")
            return True
        except Exception as e:
            logging.error("Failed to connect to OPC UA server: %s", e)
            self.log_textedit.append(f"Failed to connect to OPC UA server: {e}")
            return False

    async def disconnect_from_opcua_server(self):
        if self.client is not None:
            await self.client.disconnect()
            logging.info("Disconnected from OPC UA server")
            self.log_textedit.append("Disconnected from OPC UA server")

    async def log_opc_data_to_csv(self, filepath, node_ids):
        results = []
        batch_size = 5000  # Adjust batch size as needed
        node_id_batches = [node_ids[i:i + batch_size] for i in range(0, len(node_ids), batch_size)]
        batch_timestamp = datetime.now().strftime("%d-%m-%Y %H:%M:%S")

        for batch_index, node_id_batch in enumerate(node_id_batches):
            tasks = [self.read_tag(node_id) for node_id in node_id_batch]
            batch_results = await asyncio.gather(*tasks)
            results.extend([(tag, value, batch_timestamp) for tag, value in batch_results])

            # Print progress
            print(f"Batch {batch_index + 1}/{len(node_id_batches)} completed.")
            self.log_textedit.append(f"Batch {batch_index + 1}/{len(node_id_batches)} completed.")
            logging.info(f"Batch {batch_index + 1}/{len(node_id_batches)} completed.")

        result_df = pd.DataFrame(results, columns=["Tag", "Value", "Timestamp"])
        if not os.path.exists(filepath):
            result_df.to_csv(filepath, index=False)
        else:
            result_df.to_csv(filepath, mode='a', header=False, index=False)

        return results

    async def read_tag(self, node_id: str, max_retries: int = 3) -> tuple:
        retries = 0
        while retries < max_retries:
            try:
                node = self.client.get_node(node_id)
                value = await node.read_value()
                return node_id, value
            except TimeoutError:
                logging.warning("TimeoutError occurred while reading tag: %s. Retrying...", node_id)
                retries += 1
                await asyncio.sleep(1)  # Wait for a short interval before retrying

        logging.error("Maximum retries reached. Failed to read tag: %s", node_id)
        return node_id, None  # Return None as the value if maximum retries reached

    async def logging_loop(self, filepath, node_ids):
        try:
            current_filename = None
            prev_minute = None
            while True:
                # Get current time
                now = datetime.now()

                # Print start time of the iteration
                logging.info("Iteration start time: %s", now)
                self.log_textedit.append(f"Iteration start time: {now}")

                # Check if it's the 15th, 30th, 45th, or 0th minute and create a new CSV file
                if ((now.minute == 15 and prev_minute == 14) or
                        (now.minute == 30 and prev_minute == 29) or
                        (now.minute == 45 and prev_minute == 44) or
                        (now.minute == 0 and prev_minute == 59)):
                    # Form the filename with the updated timestamp
                    new_filename = f"{now.strftime('%Y-%m-%d_%H%M')}.csv"

                    # Create folder structure for the CSV file
                    year_folder = os.path.join(logging_folder, str(now.year))
                    month_folder = os.path.join(year_folder, now.strftime("%m"))
                    day_folder = os.path.join(month_folder, now.strftime("%d"))
                    os.makedirs(day_folder, exist_ok=True)

                    # Full path to the new CSV file
                    full_filepath = os.path.join(day_folder, new_filename)

                    # Log OPC data to the new CSV file
                    results = await self.log_opc_data_to_csv(full_filepath, node_ids)

                    log_message = f"Started logging OPC data to CSV file: {new_filename}"
                    logging.info(log_message)
                    self.log_textedit.append(log_message)
                    current_filename = new_filename
                else:
                    # Continue logging to the current file
                    if current_filename is None:
                        current_filename = f"{now.strftime('%Y-%m-%d_%H%M')}.csv"

                    # Create folder structure for the CSV file
                    year_folder = os.path.join(logging_folder, str(now.year))
                    month_folder = os.path.join(year_folder, now.strftime("%m"))
                    day_folder = os.path.join(month_folder, now.strftime("%d"))
                    os.makedirs(day_folder, exist_ok=True)

                    # Full path to the current CSV file
                    full_filepath = os.path.join(day_folder, current_filename)

                    # Log OPC data to the current CSV file
                    results = await self.log_opc_data_to_csv(full_filepath, node_ids)

                prev_minute = now.minute  # Update prev_minute

                # Print end time of the iteration
                iteration_end_time = datetime.now()
                logging.info("Iteration end time: %s", iteration_end_time)
                self.log_textedit.append(f"Iteration end time: {iteration_end_time}")
                # Calculate and print iteration duration
                iteration_duration = iteration_end_time - now
                logging.info("Iteration duration: %s", iteration_duration)
                self.log_textedit.append(f"Iteration duration: {iteration_duration}")

                # Calculate the remaining sleep time
                sleep_time = max(logging_interval - (time.time() - now.timestamp()), 0)

                # Wait for the remaining sleep time before the next iteration
                await asyncio.sleep(sleep_time)

        except asyncio.CancelledError:
            logging.info("Logging task cancelled")

    # def start_logging(self):
    #     if self.client is None:
    #         success = asyncio.run(self.connect_to_opcua_server())
    #         if not success:
    #             return

    #     if self.logging_task is None or self.logging_task.done():
    #         self.logging_task = asyncio.create_task(self.logging_loop(full_filepath, node_ids))

    async def start_logging(self):
        if self.client is None:
            success = await self.connect_to_opcua_server()
            if not success:
                return

        if self.logging_task is None or self.logging_task.done():
            self.logging_task = asyncio.create_task(self.logging_loop(full_filepath, node_ids))

    def stop_logging(self):
        if self.logging_task is not None:
            self.logging_task.cancel()
            self.logging_task = None

    def exit_application(self):
        if self.logging_task is not None and not self.logging_task.done():
            self.logging_task.cancel()
        asyncio.create_task(self.disconnect_from_opcua_server())
        sys.exit()


# def main():
#     app = QApplication(sys.argv)
#     main_window = MainWindow()
#     main_window.show()
#     sys.exit(app.exec_())
        
async def main():
    app = QApplication(sys.argv)
    main_window = MainWindow()
    main_window.show()
    await main_window.start_logging()  # Await start_logging here
    sys.exit(app.exec_())

if __name__ == "__main__":
    # Read configuration from config.ini file
    config = configparser.ConfigParser()
    config.read("config.ini")

    # Get tag file path from config
    tag_file_path = config.get("tag", "file_path")

    # Get logging interval from config, default to 60 seconds if not provided
    logging_interval = config.getint("logging", "logging_interval", fallback=60)

    # Get folder path for logging CSV files from config
    logging_folder = config.get("logging", "folder")

    # Read node IDs from CSV file using Pandas
    df = pd.read_csv(tag_file_path)
    node_ids = df["Tag"].tolist()

    # Full path to the current CSV file
    now = datetime.now()
    year_folder = os.path.join(logging_folder, str(now.year))
    month_folder = os.path.join(year_folder, now.strftime("%m"))
    day_folder = os.path.join(month_folder, now.strftime("%d"))
    full_filepath = os.path.join(day_folder, f"{now.strftime('%Y-%m-%d_%H%M')}.csv")

    asyncio.run(main())
