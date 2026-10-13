import paho.mqtt.client as mqtt
import json

# Define MQTT broker settings
broker_address = "127.0.0.1"
broker_port = 1883
topic = "weather"

# Callback function to handle incoming messages
def on_message(client, userdata, message):
    payload = json.loads(message.payload.decode())
    temperature = payload["temperature"]
    humidity = payload["humidity"]
    wind_speed = payload["wind_speed"]
    
    print("Temperature:", temperature)
    print("Humidity:", humidity)
    print("Wind Speed:", wind_speed)
    print("-"*50)

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
