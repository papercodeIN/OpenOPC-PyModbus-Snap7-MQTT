import paho.mqtt.client as mqtt
import json
import time
import random

# Define MQTT broker settings
broker_address = "127.0.0.1"
broker_port = 1883
topic = "weather"

# Create MQTT client
client = mqtt.Client()

# Connect to MQTT broker
client.connect(broker_address, broker_port)

# Simulate weather data and publish
while True:
    temperature = round(random.uniform(20, 30), 2)  # Random temperature between 20 and 30
    humidity = round(random.uniform(50, 80), 2)  # Random humidity between 50 and 80
    wind_speed = round(random.uniform(5, 15), 2)  # Random wind speed between 5 and 15

    weather_data = {
        "temperature": temperature,
        "humidity": humidity,
        "wind_speed": wind_speed
    }

    payload = json.dumps(weather_data)

    client.publish(topic, payload)

    print("Published: ", payload)

    time.sleep(5)  # Publish every 5 seconds

# Disconnect from MQTT broker
client.disconnect()