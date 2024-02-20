import asyncio
import pandas as pd
import time
import os
from asyncua import Client
from datetime import datetime

# async def read_tag(node_id: str, client: Client) -> tuple:
#     node = client.get_node(node_id)
#     value = await node.read_value()
#     return node_id, value

async def read_tag(node_id: str, client: Client, timeout=10) -> tuple:
    try:
        node = client.get_node(node_id)
        value = await asyncio.wait_for(node.read_value(), timeout)
        return node_id, value
    except asyncio.TimeoutError:
        print(f"Timeout reading tag {node_id}")
        return node_id, None
    except Exception as e:
        print(f"Error reading tag {node_id}: {e}")
        return node_id, None


async def main():
    # Define the OPC UA server URL
    server_url = "opc.tcp://127.0.0.1:49320"

    # Read node IDs from CSV file using Pandas
    df = pd.read_csv(r"D:\Users\Parrot\Documents\GitHub\Python\Python GUI Application\OPCUA to CSV Logger\14022024\tag_list.csv")
    node_ids = df["Tag"].tolist()

    # Print the number of tags provided by the user
    print(f"Number of tags provided: {len(node_ids)}")

    # Create an OPC UA client
    client = Client(url=server_url)
    await client.connect()

    # Split node IDs into batches
    batch_size = 10000  # Adjust batch size as needed
    node_id_batches = [node_ids[i:i+batch_size] for i in range(0, len(node_ids), batch_size)]

    while True:
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

        # Save results to CSV file
        result_df = pd.DataFrame(results, columns=["Tag", "Value", "Timestamp"])
        result_df.to_csv("tag_values_with_timestamp.csv", mode='a', index=False, header=not os.path.exists("tag_values_with_timestamp.csv"))

        # Wait for 10 seconds before the next iteration
        await asyncio.sleep(10)

if __name__ == "__main__":
    asyncio.run(main())
