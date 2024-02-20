import asyncio
import os
import pandas as pd
import time
from asyncua import Client
from datetime import datetime, date
import configparser
import logging

async def read_tag(node_id: str, client: Client, max_retries: int = 3) -> tuple:
    retries = 0
    while retries < max_retries:
        try:
            node = client.get_node(node_id)
            value = await node.read_value()
            return node_id, value
        except TimeoutError:
            logging.warning("TimeoutError occurred while reading tag: %s. Retrying...", node_id)
            retries += 1
            await asyncio.sleep(1)  # Wait for a short interval before retrying
    logging.error("Maximum retries reached. Failed to read tag: %s", node_id)
    return node_id, None  # Return None as the value if maximum retries reached

async def main():
    # Read configuration from config.ini file
    config = configparser.ConfigParser()
    config.read("config.ini")

    # Get OPC UA server URL from config
    server_url = config.get("opcua", "endpoint_url")

    # Get tag file path from config
    tag_file_path = config.get("tag", "file_path")

    # Get logging interval from config, default to 60 seconds if not provided
    logging_interval = config.getint("logging", "logging_interval", fallback=60)

    # Get folder path for logging CSV files from config
    logging_folder = config.get("logging", "folder")

    # Get current date
    current_date = date.today()

    # Create initial log file
    log_file_name = f"application_log_{current_date.strftime('%Y-%m-%d')}.log"
    log_file_path = os.path.join(logging_folder, log_file_name)
    logging.basicConfig(filename=log_file_path, level=logging.INFO,
                        format='%(asctime)s - %(levelname)s - %(message)s')

    # Read node IDs from CSV file using Pandas
    df = pd.read_csv(tag_file_path)
    node_ids = df["Tag"].tolist()

    # Create an OPC UA client
    client = Client(url=server_url)
    await client.connect()

    try:
        current_filename = None
        prev_minute = None
        while True:
            # Check if the date has changed since the last iteration
            new_date = date.today()
            if new_date != current_date:
                # Update current date and create new log file
                current_date = new_date
                log_file_name = f"application_log_{current_date.strftime('%Y-%m-%d')}.log"
                log_file_path = os.path.join(logging_folder, log_file_name)
                # Reconfigure logging to use the new log file
                logging.basicConfig(filename=log_file_path, level=logging.INFO,
                                    format='%(asctime)s - %(levelname)s - %(message)s')

            # Get current time
            now = datetime.now()

            # Print start time of the iteration
            logging.info("Iteration start time: %s", now)
            print("Iteration start time:", now)

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
                results = await log_opc_data_to_csv(full_filepath, node_ids, client)

                log_message = f"Started logging OPC data to CSV file: {new_filename}"
                logging.info(log_message)
                print(log_message)
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
                results = await log_opc_data_to_csv(full_filepath, node_ids, client)

            prev_minute = now.minute  # Update prev_minute

            # Print end time of the iteration
            iteration_end_time = datetime.now()
            logging.info("Iteration end time: %s", iteration_end_time)
            print("Iteration end time:", iteration_end_time)
            # Calculate and print iteration duration
            iteration_duration = iteration_end_time - now
            logging.info("Iteration duration: %s", iteration_duration)
            print("Iteration duration:", iteration_duration)

            # Calculate the remaining sleep time
            sleep_time = max(logging_interval - (time.time() - now.timestamp()), 0)
            
            # Wait for the remaining sleep time before the next iteration
            await asyncio.sleep(sleep_time)

    except KeyboardInterrupt:
        logging.info("KeyboardInterrupt: Exiting gracefully...")
        await client.disconnect()

async def log_opc_data_to_csv(filepath, node_ids, client):
    results = []
    batch_size = 5000  # Adjust batch size as needed
    node_id_batches = [node_ids[i:i+batch_size] for i in range(0, len(node_ids), batch_size)]
    batch_timestamp = datetime.now().strftime("%d-%m-%Y %H:%M:%S")

    for batch_index, node_id_batch in enumerate(node_id_batches):
        tasks = [read_tag(node_id, client) for node_id in node_id_batch]
        batch_results = await asyncio.gather(*tasks)
        results.extend([(tag, value, batch_timestamp) for tag, value in batch_results])
        # Print progress
        print(f"Batch {batch_index + 1}/{len(node_id_batches)} completed.")
        logging.info(f"Batch {batch_index + 1}/{len(node_id_batches)} completed.")
        
    result_df = pd.DataFrame(results, columns=["Tag", "Value", "Timestamp"])
    if not os.path.exists(filepath):
        result_df.to_csv(filepath, index=False)
    else:
        result_df.to_csv(filepath, mode='a', header=False, index=False)
    return results

if __name__ == "__main__":
    asyncio.run(main())
