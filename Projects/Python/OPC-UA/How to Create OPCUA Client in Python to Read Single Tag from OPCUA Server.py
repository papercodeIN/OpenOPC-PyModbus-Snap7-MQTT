from opcua import Client
import time

# OPC UA server endpoint URL
url = "opc.tcp://Parrot:4840/OPCUA/SimulationServer"

# Create a client object
client = Client(url)

try:
    # Connect to the server
    client.connect()

    while True:
        try:
            # Read the Counter Tag Value
            counter_node = client.get_node("ns=3;i=1002")
            counter_value = counter_node.get_value()

            # Print the value
            print("Counter Tag Value:", counter_value)

            # Wait for 1 second
            time.sleep(1)

        except KeyboardInterrupt:
            print("Program interrupted by user.")
            break

        except Exception as e:
            print("Error reading value:", e)

except ConnectionError:
    print("Failed to connect to OPC UA server. Please check the server URL.")

finally:
    # Disconnect from the server
    client.disconnect()