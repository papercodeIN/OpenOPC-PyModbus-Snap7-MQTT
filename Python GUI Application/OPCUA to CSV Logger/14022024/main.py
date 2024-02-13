import sys
from PyQt5.QtWidgets import (
    QDialog, QApplication, QWidget, QVBoxLayout, QGroupBox, 
    QPushButton, QTextEdit, QHBoxLayout, QLabel, QFormLayout, QLineEdit, QMessageBox
)
from PyQt5.QtCore import QDateTime, QTimer, Qt
from PyQt5.QtGui import QClipboard
import pandas as pd
import os
import time
import configparser
import logging
from logging.handlers import TimedRotatingFileHandler
from datetime import datetime
from opcua import Client

class AuthenticationDialog(QDialog):
    def __init__(self):
        super().__init__()

        self.username_input = QLineEdit(self)
        self.password_input = QLineEdit(self)
        self.password_input.setEchoMode(QLineEdit.Password)

        login_button = QPushButton("Login", self)
        login_button.clicked.connect(self.authenticate)

        layout = QVBoxLayout()
        layout.addWidget(QLabel("Username:"))
        layout.addWidget(self.username_input)
        layout.addWidget(QLabel("Password:"))
        layout.addWidget(self.password_input)
        layout.addWidget(login_button)

        self.setLayout(layout)
        self.setWindowTitle("Login")

    def authenticate(self):
        # Replace the condition below with your actual authentication logic
        if self.username_input.text() == "root" and self.password_input.text() == "toor":
            self.accept()
        else:
            self.reject()

class OPCUAToCsvLogger(QWidget):
    def __init__(self):
        super().__init__()

        self.logger = None
        self.opcua_client = None
        self.selected_tags = []
        self.config = self.read_config()

        self.setup_logging()

        self.log_textedit = QTextEdit(self)
        self.current_filename = None

        authentication_dialog = AuthenticationDialog()
        result = authentication_dialog.exec_()

        if result != QDialog.Accepted:
            sys.exit()

        app = QApplication.instance()
        if app is not None:
            app.aboutToQuit.connect(self.close_opcua_connection)

        self.connect_to_opcua_server()
        self.logging_enabled = False
        self.init_ui()

    def setup_logging(self):
        log_folder = self.config.get('logging', 'application_log')
        today_date = datetime.today().strftime('%Y-%m-%d')
        log_file = os.path.join(log_folder, f'application_{today_date}.log')

        if not os.path.exists(log_folder):
            os.makedirs(log_folder)

        log_handler = TimedRotatingFileHandler(log_file, when="midnight", interval=1, backupCount=7)
        log_handler.setLevel(logging.INFO)

        log_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        log_handler.setFormatter(log_formatter)

        self.logger = logging.getLogger()
        self.logger.addHandler(log_handler)
        self.logger.setLevel(logging.INFO)

    def close_opcua_connection(self):
        if self.opcua_client is not None:
            try:
                self.opcua_client.disconnect()
                self.logger.info("OPC-UA server connection closed.")
            except Exception as e:
                self.logger.error(f"Error closing OPC-UA server connection: {str(e)}")

    def read_config(self):
        config = configparser.ConfigParser()
        config.read('config.ini')
        return config

    def init_ui(self):
        
        config_info_label = QLabel("Configuration Information:")
        config_info_label.setAlignment(Qt.AlignCenter)

        config_layout = QFormLayout()
        config_layout.addRow("OPC-UA Endpoint URL:", QLabel(self.config.get('opcua', 'endpoint_url')))
        config_layout.addRow("Logging Interval:", QLabel(str(self.config.get('logging', 'logging_interval'))))

        buttons_layout = QHBoxLayout()
        self.start_logging_button = QPushButton("Start Data Logging", self)
        self.start_logging_button.clicked.connect(self.start_logging)
        buttons_layout.addWidget(self.start_logging_button)

        self.stop_logging_button = QPushButton("Stop Data Logging", self)
        self.stop_logging_button.clicked.connect(self.stop_logging)
        buttons_layout.addWidget(self.stop_logging_button)

        log_groupbox = QGroupBox("Logs:")
        log_layout = QVBoxLayout()
        log_layout.addWidget(self.log_textedit)
        log_groupbox.setLayout(log_layout)

        additional_buttons_layout = QHBoxLayout()
        self.copy_logs_button = QPushButton("Copy Logs to Clipboard", self)
        self.copy_logs_button.clicked.connect(self.copy_logs_to_clipboard)
        additional_buttons_layout.addWidget(self.copy_logs_button)

        self.clear_logs_button = QPushButton("Clear Logs", self)
        self.clear_logs_button.clicked.connect(self.clear_logs)
        additional_buttons_layout.addWidget(self.clear_logs_button)

        self.exit_button = QPushButton("Exit", self)
        self.exit_button.clicked.connect(self.close)
        additional_buttons_layout.addWidget(self.exit_button)

        main_layout = QVBoxLayout()
        main_layout.addWidget(config_info_label)
        main_layout.addLayout(config_layout)
        main_layout.addLayout(buttons_layout)
        main_layout.addWidget(log_groupbox)
        main_layout.addLayout(additional_buttons_layout)

        self.setLayout(main_layout)
        self.setWindowTitle('OPC-UA to CSV Logger')
        self.setGeometry(100, 100, 800, 800)

        app = QApplication.instance()
        app.aboutToQuit.connect(self.send_alert_on_exit)

        try:
            logging_folder = self.config.get('logging', 'folder')
            if not os.path.exists(logging_folder):
                os.makedirs(logging_folder)
        except configparser.Error as e:
            self.logger.error(f"Error reading configuration: {e}")

    def connect_to_opcua_server(self):
        try:
            selected_opc_server = self.config.get('opcua', 'endpoint_url')
        except configparser.Error as e:
            self.logger.error(f"Error reading configuration: {e}")
            return

        max_retries = 15  # Set the maximum number of connection retries
        retry_interval = 60  # Set the interval between retries in seconds

        for retry in range(1, max_retries + 1):
            try:
                self.opcua_client = Client(selected_opc_server)
                self.opcua_client.connect()
                self.logger.info(f"Connected to OPC-UA server {selected_opc_server}.")
                self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - Connected to OPC-UA server {selected_opc_server}.")
                break  # Exit the loop if the connection is successful
            
            except Exception as e:
                log_message = f"Error connecting to OPC-UA server {selected_opc_server} (Retry {retry}/{max_retries}): {e}"
                self.logger.error(log_message)
                self.send_alert(log_message)

                if retry == max_retries:
                    error_message = f"Maximum connection retries reached. Unable to connect to OPC-UA server {selected_opc_server}."
                    self.logger.error(error_message)

                    # Send Teams alert on max retries
                    teams_alert_message = f"Failed to connect to OPC-UA server {selected_opc_server} after {max_retries} retries."
                    self.send_alert(teams_alert_message)
                    return

                time.sleep(retry_interval)

        try:
            csv_file_path = self.config.get('tag', 'file_path')
            csv_file = os.path.join(csv_file_path)  # Provide the actual CSV filename

            tags_df = pd.read_csv(csv_file)
            unique_tags = tags_df['Tag'].unique().tolist()
            self.selected_tags = unique_tags
            self.logger.info(f"Connected to OPC-UA server {selected_opc_server}.")

        except FileNotFoundError as e:
            self.logger.error(f"Error reading CSV file: {e}")
        except pd.errors.EmptyDataError:
            self.logger.error("CSV file is empty or malformed.")
        except pd.errors.ParserError as e:
            self.logger.error(f"Error parsing CSV file: {e}")

    def start_logging(self):
        # Check if data logging is already running
        if self.logging_enabled:
            log_message = "Data logging is already running."
            self.logger.warning(log_message)
            self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - {log_message}")
            return

        filepath = self.config.get('logging', 'folder')

        # Validate filepath
        if not filepath.endswith(os.path.sep):
            filepath += os.path.sep

        # Form the filename with the timestamp in the format YYYY-MM-DD HHMM
        filename = f"{datetime.today().strftime('%Y-%m-%d_%H%M')}.csv"
        # Enable data logging
        self.logging_enabled = True

        log_message = f"Started logging OPC data to CSV file: {filename} at {filepath}."
        self.logger.info(log_message)

        # Print message that data logging has started
        print(">>>>> Data logging started.")

        # Get the logging interval from the config.ini file
        try:
            logging_interval = int(self.config.get('logging', 'logging_interval'))
        except (configparser.Error, ValueError) as e:
            logging_interval = 5000  # Default to 5000 milliseconds (5 seconds)

        self.logger.info(f"Logging Interval: {logging_interval} milliseconds")        

        # Start a timer to periodically log OPC data and check for a new file every 15 minutes
        self.logging_timer = QTimer(self)

        def on_timer_timeout():
            current_time = datetime.now()
            minutes = current_time.minute

            # Form the folder structure based on year, month, and day
            folder_path = os.path.join(
                filepath,
                str(current_time.year),
                f"{current_time.strftime('%m')}",
                f"{current_time.strftime('%d')}"
            )

            # Ensure the folder structure exists, create if not
            os.makedirs(folder_path, exist_ok=True)

            # Check if the current minute is a multiple of 15 (i.e., 0, 15, 30, 45)
            if minutes % 15 == 0:
                # Form the filename with the updated timestamp
                new_filename = f"{current_time.strftime('%Y-%m-%d_%H%M')}.csv"

                # Full path to the new CSV file
                full_filepath = os.path.join(folder_path, new_filename)

                # Log OPC data to the new CSV file
                self.log_data_to_csv(full_filepath, filepath)
                self.current_filename = new_filename  # Update current filename

                log_message = f"Started logging OPC data to CSV file: {filename}"
                self.logger.info(log_message)

            else:
                # Continue logging to the current file
                if self.current_filename is None:
                    # This is the initial case or if the timer is started before the first 15-minute interval
                    self.current_filename = f"{current_time.strftime('%Y-%m-%d_%H%M')}.csv"

                # Full path to the current CSV file
                full_filepath = os.path.join(folder_path, self.current_filename)

                self.log_data_to_csv(full_filepath, filepath)

        # Connect the timer to the logic for the subsequent intervals
        self.logging_timer.timeout.connect(on_timer_timeout)

        # Set the timer interval based on the configured logging interval
        self.logging_timer.start(logging_interval)

        self.logger.info(f"Timer Status after starting: {self.logging_timer.isActive()}")

        # Disable the exit button
        self.exit_button.setEnabled(False)



    def stop_logging(self):
        # Check if data logging is already stopped
        if not self.logging_enabled:
            log_message = "Data logging is already stopped."
            self.logger.warning(log_message)
            self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - {log_message}")
            return

        # Log the attempt to stop logging
        log_attempt_message = "Attempting to stop logging. Prompting for authentication."
        self.logger.info(log_attempt_message)
        self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - {log_attempt_message}")

        # Prompt user for authentication before stopping logging
        authentication_dialog = AuthenticationDialog()
        result = authentication_dialog.exec_()

        if result == QDialog.Accepted:
            # Stop the logging timer
            if hasattr(self, 'logging_timer'):
                self.logging_timer.stop()

            # Send alert when logging stops with timestamp
            alert_timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            alert_message = f"Data logging stopped at {alert_timestamp}."
            self.send_alert(alert_message)

            log_message = "Stopped logging OPC data to CSV."
            self.logger.info(log_message)
            self.log_textedit.append(f"{QDateTime.currentDateTime().toString()} - {log_message}")

            # Disable data logging
            self.logging_enabled = False
                
            # Enable the exit button
            self.exit_button.setEnabled(True)

        else:
            # Authentication failed, notify the user
            QMessageBox.warning(self, "Authentication Failed", "Authentication failed. Please provide valid credentials.")

    def log_data_to_csv(self, filename, filepath):
        try:
            data = []
            # print("Selected Tags: ", self.selected_tags )
            # Read OPC-UA data for each selected tag
            for tag in self.selected_tags:
                node = self.opcua_client.get_node(tag)
                raw_value = node.get_data_value()
                data.append((raw_value.SourceTimestamp, node.get_browse_name().Name, raw_value.Value.Value, raw_value.StatusCode.name))


            # Log OPC-UA data to CSV file
            log_message = self.csv_append(data, filename, filepath)
            self.logger.info(log_message)

        except Exception as e:
            error_message = f"Error logging OPC-UA data to CSV: {str(e)}"
            self.logger.error(error_message)
            return error_message

        return None  # Return None if the operation is successful



    def csv_append(self, results, filename, filepath):
        try:
            full_filepath = os.path.join(filepath, filename)

            if os.path.exists(full_filepath):
                # File exists, append to it
                with open(full_filepath, 'a') as file:
                    for result in results:
                        file.write(','.join(map(str, result)) + '\n')

                log_message = f'{len(results)} No. of Records Logged into CSV.'
                self.logger.info(log_message)

            else:
                # File doesn't exist, create and append
                with open(full_filepath, 'w') as file:
                    # Write header
                    file.write('TimeStamp,Tag,Value,Quality\n')
                    # Write data
                    for result in results:
                        file.write(','.join(map(str, result)) + '\n')

                log_message = f'{len(results)} No. of Records Logged into CSV.'
                self.logger.info(log_message)

        except Exception as e:
            error_message = f'Error: Unable to Log Records Into CSV: {str(e)}'
            self.logger.error(error_message)
            return error_message

        return log_message  # Return success message

    def send_alert(self, msg):
        pass

    def copy_logs_to_clipboard(self):
        clipboard = QApplication.clipboard()
        clipboard.setText(self.log_textedit.toPlainText())

    def clear_logs(self):
        self.log_textedit.clear()

    def send_alert_on_exit(self):
        pass


if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = OPCUAToCsvLogger()
    window.show()
    sys.exit(app.exec_())
