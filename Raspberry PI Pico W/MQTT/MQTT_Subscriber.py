import time
import network
from machine import Pin
from umqtt.simple import MQTTClient

# Setup the onboard LED so we can turn it on/off
led = Pin("LED", Pin.OUT)

# Fill in your WiFi network name (ssid) and password here:
wifi_ssid = ""
wifi_password = ""

# Connect to WiFi
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(wifi_ssid, wifi_password)
while wlan.isconnected() == False:
    print('Waiting for connection...')
    time.sleep(1)
print("Connected to WiFi")

# Fill in your Adafruit IO Authentication and Feed MQTT Topic details
mqtt_host = ""
mqtt_username = ""  # Your Adafruit IO username
mqtt_password = ""  # Adafruit IO Key
mqtt_receive_topic = ""  # The MQTT topic for your Adafruit IO Feed

# Enter a random ID for this MQTT Client
# It needs to be globally unique across all of Adafruit IO.
mqtt_client_id = "Fusion_Automate_PI_PICO_W_SUB"

# Initialize our MQTTClient and connect to the MQTT server
mqtt_client = MQTTClient(
        client_id=mqtt_client_id,
        server=mqtt_host,
        user=mqtt_username,
        password=mqtt_password)


# So that we can respond to messages on an MQTT topic, we need a callback
# function that will handle the messages.
def mqtt_subscription_callback(topic, message):
    print (f'Topic {topic} received message {message}')  # Debug print out of what was received over MQTT
    if message == b'on':
        print("LED ON")
        led.value(1)
    elif message == b'off':
        print("LED OFF")
        led.value(0)

# Before connecting, tell the MQTT client to use the callback
mqtt_client.set_callback(mqtt_subscription_callback)
mqtt_client.connect()

# Set the initial state of the LED to off, and let the MQTT topic know about it
led.value(0)
mqtt_client.publish(mqtt_receive_topic, "off")

# Once connected, subscribe to the MQTT topic
mqtt_client.subscribe(mqtt_receive_topic)
print("Connected and subscribed")

try:
    while True:
        # Infinitely wait for messages on the topic.
        # Note wait_msg() is a blocking call, if you're doing multiple things
        # on the Pico you may want to look at putting this on another thread.
        print(f'Waiting for messages on {mqtt_receive_topic}')
        mqtt_client.wait_msg()
except Exception as e:
    print(f'Failed to wait for MQTT messages: {e}')
finally:
    mqtt_client.disconnect()
