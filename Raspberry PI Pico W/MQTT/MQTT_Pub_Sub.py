import time
import ubinascii
from umqtt.simple import MQTTClient
import machine
import random

# Default  MQTT_BROKER to connect to
mqtt_host = ""
mqtt_client_id = ubinascii.hexlify(machine.unique_id())
mqtt_username = ""  # Your Adafruit IO username
mqtt_password = ""  # Adafruit IO Key
mqtt_receive_topic = b""
mqtt_publish_topic = b""

# Setup built in PICO LED as Output
led = machine.Pin("LED",machine.Pin.OUT)

# Publish MQTT messages after every set timeout
last_publish = time.time()
publish_interval = 5

# Received messages from subscriptions will be delivered to this callback
def mqtt_subscription_callback(topic, msg):
    print((topic, msg))
    if msg.decode() == "on":
        led.value(1)
    elif msg.decode() == "off":
        led.value(0)


def reset():
    print("Resetting...")
    time.sleep(5)
    machine.reset()

# Generate dummy random temperature readings    
def get_temperature_reading():
    return random.randint(0, 99)
    
def main():
    print(f"Begin connection with MQTT Broker :: {mqtt_host}")
    mqtt_client = MQTTClient(
        client_id=mqtt_client_id,
        server=mqtt_host,
        user=mqtt_username,
        password=mqtt_password,
        keepalive=60)
    mqtt_client.set_callback(mqtt_subscription_callback)
    mqtt_client.connect()

    # Set the initial state of the LED to off, and let the MQTT topic know about it
    led.value(0)
    mqtt_client.publish(mqtt_receive_topic, "off")
    
    mqtt_client.subscribe(mqtt_receive_topic)
    print(f"Connected to MQTT  Broker :: {mqtt_host}, and waiting for callback function to be called!")
    while True:
            # Non-blocking wait for message
            mqtt_client.check_msg()
            global last_publish
            if (time.time() - last_publish) >= publish_interval:
                random_temp = get_temperature_reading()
                mqtt_client.publish(mqtt_publish_topic, str(random_temp).encode())
                last_publish = time.time()
            time.sleep(1)


if __name__ == "__main__":
    while True:
        try:
            main()
        except OSError as e:
            print("Error: " + str(e))
            reset()

