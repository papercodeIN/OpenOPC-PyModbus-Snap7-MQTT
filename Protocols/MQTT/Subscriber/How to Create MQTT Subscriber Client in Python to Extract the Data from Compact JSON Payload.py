import paho.mqtt.client as mqtt
import json

# Define MQTT broker settings
broker_address = "127.0.0.1"
broker_port = 1883
topic = "N3uron"

# Callback function to handle incoming messages
def on_message(client, userdata, message):
    print("-"*50)
    payload = json.loads(message.payload.decode())
    for tag_name, values in payload.items():
        tag_value = values[0]["v"] if values else None
        print("Tag Name:", tag_name)
        print("Tag Value:", tag_value)
        print()

# Create MQTT client
client = mqtt.Client()

# Assign callback function
client.on_message = on_message

# Connect to MQTT broker
client.connect(broker_address, broker_port)

# Subscribe to topic
client.subscribe(topic)

# Loop to process incoming messages
client.loop_forever()
