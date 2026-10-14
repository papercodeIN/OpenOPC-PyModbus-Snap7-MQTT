import json
import asyncio
from datetime import datetime
from asyncua import Client
from gmqtt import Client as MQTTClient

def load_config(config_file):
    try:
        with open(config_file, 'r') as file:
            data = file.read()
            # print(f"Config file content:\n{data}")  # Debugging line
            return json.loads(data)
    except FileNotFoundError:
        print(f"Configuration file {config_file} not found.")
        return None
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON from the configuration file: {e}")
        return None

def on_connect(client, flags, rc, properties):
    print('Connected to MQTT Broker!')

async def publish_opcua_data(mqtt_client, master_topic, data):
    timestamp = datetime.now().isoformat()
    payload = {
        "timestamp": timestamp,
        "data": data
    }
    mqtt_client.publish(master_topic, json.dumps(payload))

async def main():
    config = load_config('config.json')

    if config is None:
        return

    opcua_endpoint = config['opcua']['endpointUrl']
    opcua_tags = config['opcua']['nodesToRead']
    polling_interval = config['opcua']['pollingInterval']
    mqtt_hostname = config['mqtt']['hostname']
    mqtt_port = config['mqtt']['port']
    master_topic = config['mqtt']['masterTopic']

    # Connect to OPC UA server
    opcua_client = Client(opcua_endpoint)
    await opcua_client.connect()

    # Connect to MQTT broker
    mqtt_client = MQTTClient("mqtt_client_id")
    
    # Ensure on_connect is a regular function
    mqtt_client.on_connect = on_connect

    await mqtt_client.connect(mqtt_hostname, mqtt_port)
    
    # Pre-fetch nodes
    nodes = [opcua_client.get_node(tag['nodeId']) for tag in opcua_tags]

    try:
        while True:
            values = await opcua_client.read_values(nodes)
            data = {tag['name']: value for tag, value in zip(opcua_tags, values)}
            
            await publish_opcua_data(mqtt_client, master_topic, data)
            await asyncio.sleep(polling_interval)

    except KeyboardInterrupt:
        print("Interrupted by user")
    finally:
        await opcua_client.disconnect()
        await mqtt_client.disconnect()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Script terminated by user")