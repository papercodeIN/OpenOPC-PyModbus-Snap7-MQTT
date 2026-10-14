import asyncio
import pandas as pd
import time
from asyncua import Client
from datetime import datetime

async def read_tag(node_id: str, client: Client) -> tuple:
    node = client.get_node(node_id)
    value = await node.read_value()
    return node_id, value

async def main():
    # Define the OPC UA server URL
    server_url = "opc.tcp://127.0.0.1:49320"

    # Read node IDs from CSV file using Pandas
    df = pd.read_csv(r"D:\Users\Parrot\Documents\GitHub\Python\Python GUI Application\OPCUA to CSV Logger\20022024\tag_list.csv")
    node_ids = df["Tag"].tolist()

    # Create an OPC UA client
    client = Client(url=server_url)
    await client.connect()

    try:
        while True:
            # Print start time of the iteration
            iteration_start_time = time.time()
            print("Iteration start time:", datetime.now())

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

            end_time = time.time()
            # Print total execution time
            print(f"Total execution time: {end_time - start_time} seconds")

            # Print end time of the iteration
            iteration_end_time = time.time()
            print("Iteration end time:", datetime.now())
            print("Iteration duration:", iteration_end_time - iteration_start_time, "seconds")

            # Calculate the remaining sleep time
            sleep_time = max(60 - (iteration_end_time - iteration_start_time), 0)
            
            # Wait for the remaining sleep time before the next iteration
            await asyncio.sleep(sleep_time)

    except KeyboardInterrupt:
        print("KeyboardInterrupt: Exiting gracefully...")
        await client.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
