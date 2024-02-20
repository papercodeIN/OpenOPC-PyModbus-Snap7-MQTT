import asyncio
import pandas as pd
import os.path
import time
from asyncua import Client
from datetime import datetime, date
import configparser
import logging

async def read_tag(node_id: str, client: Client) -> tuple:
    node = client.get_node(node_id)
    value = await node.read_value()
    return node_id, value

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

    # Create log file path based on today's date
    current_date = date.today()
    log_file_name = f"application_log_{current_date.strftime('%Y-%m-%d')}.log"
    log_file_path = os.path.join(logging_folder, log_file_name)

    # Configure logging
    logging.basicConfig(filename=log_file_path, level=logging.INFO,
                        format='%(asctime)s - %(levelname)s - %(message)s')

    # Read node IDs from CSV file using Pandas
    df = pd.read_csv(tag_file_path)
    node_ids = df["Tag"].tolist()

    # Create an OPC UA client
    client = Client(url=server_url)
    await client.connect()

    try:
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

            # Print start time of the iteration
            iteration_start_time = time.time()
            print("Iteration start time:", datetime.now())
            logging.info("Iteration start time: %s", datetime.now())

            # Split node IDs into batches
            batch_size = 5000  # Adjust batch size as needed
            node_id_batches = [node_ids[i:i+batch_size] for i in range(0, len(node_ids), batch_size)]

            start_time = time.time()
            results = []

            # Generate timestamp for all batches
            batch_timestamp = datetime.now().strftime("%d-%m-%Y %H:%M:%S")

            # Iterate over batches
            for batch_index, node_id_batch in enumerate(node_id_batches):
                # Read tags concurrently for each batch
                tasks = [read_tag(node_id, client) for node_id in node_id_batch]
                batch_results = await asyncio.gather(*tasks)
                # Append batch results with the common timestamp
                results.extend([(tag, value, batch_timestamp) for tag, value in batch_results])
                # Print progress
                print(f"Batch {batch_index + 1}/{len(node_id_batches)} completed.")
                logging.info("Batch %s/%s completed.", batch_index + 1, len(node_id_batches))

            end_time = time.time()
            # Print total execution time
            print(f"Total execution time: {end_time - start_time} seconds")
            logging.info("Total execution time: %s seconds", end_time - start_time)

            # Print end time of the iteration
            iteration_end_time = time.time()
            print("Iteration end time:", datetime.now())
            logging.info("Iteration end time: %s", datetime.now())
            print("Iteration duration:", iteration_end_time - iteration_start_time, "seconds")
            logging.info("Iteration duration: %s seconds", iteration_end_time - iteration_start_time)

            # Save results to CSV file in the specified folder
            result_df = pd.DataFrame(results, columns=["Tag", "Value", "Timestamp"])
            csv_file_path = os.path.join(logging_folder, "tag_values_with_timestamp.csv")
            if not os.path.exists(csv_file_path):
                # If CSV file doesn't exist, add header
                result_df.to_csv(csv_file_path, index=False)
            else:
                # If CSV file exists, append data without header
                result_df.to_csv(csv_file_path, mode='a', header=False, index=False)

            # Calculate the remaining sleep time
            sleep_time = max(logging_interval - (time.time() - start_time), 0)
            
            # Wait for the remaining sleep time before the next iteration
            await asyncio.sleep(sleep_time)

    except KeyboardInterrupt:
        print("KeyboardInterrupt: Exiting gracefully...")
        logging.info("KeyboardInterrupt: Exiting gracefully...")
        await client.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
