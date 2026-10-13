from opcua import Client
import time

# OPC UA server endpoint URL
url = "opc.tcp://Parrot:4840/OPCUA/SimulationServer"

# Dictionary to hold variable names and their node ids
variables = {
    'Constant': "ns=3;i=1001",
    'Counter': "ns=3;i=1002",
    'Random': "ns=3;i=1003",
    'Sawtooth': "ns=3;i=1004",
    'Sinusoid': "ns=3;i=1005",
    'Square': "ns=3;i=1006",
    'Triangle': "ns=3;i=1007"
}

# Create a client object
client = Client(url)

try:
    # Connect to the server
    client.connect()

    while True:
        try:
            # Read values for each variable
            print('-'*50)
            for var_name, node_id in variables.items():
                node = client.get_node(node_id)
                value = node.get_value()
                print(f"{var_name}:", value)

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
