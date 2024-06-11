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
    for item in payload:
        tag_name = item["t"]
        tag_value = item["v"]
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
