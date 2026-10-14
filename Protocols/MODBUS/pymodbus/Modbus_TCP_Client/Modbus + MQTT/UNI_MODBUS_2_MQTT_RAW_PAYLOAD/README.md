# Modbus TCP/IP to MQTT Publisher

This project bridges Modbus TCP/IP devices and MQTT brokers, publishing Modbus register values as raw payloads to individual MQTT topics. It uses `pymodbus` and `paho-mqtt` for Modbus and MQTT communication.

## Library Version Details

| Package     | Version | Description                     |
|-------------|---------|---------------------------------|
| pymodbus    | 3.11.1  | Modbus protocol implementation  |
| paho-mqtt   | 2.1.0   | MQTT client library for Python  |

## Features

- Reads Modbus holding registers (default configuration)
- Per-address reading for flexibility (supports non-consecutive addresses)
- Publishes only when values change
- Each register/address is published to its own MQTT topic
- Configurable update interval
- Robust MQTT connection with auto-reconnect and status callbacks
- Easy configuration via `src/config.py`

## Project Structure

```
modbus-mqtt-publisher-01092025
├── src
│   ├── main.py               # Main application logic
│   ├── modbus_client.py      # Modbus TCP client wrapper
│   ├── mqtt_publisher.py     # MQTT publisher with auto-reconnect
│   └── config.py             # User configuration for Modbus/MQTT/topics/interval
├── requirements.txt          # Python dependencies
├── README.md                 # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd modbus-mqtt-publisher-01092025
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

## Configuration

Edit `src/config.py` to set:
- Modbus server IP and port
- MQTT broker IP and port
- Register types and addresses to read (currently only holding registers enabled)
- MQTT topics for each register type
- Update interval (in seconds)

Example (`src/config.py`):
```python
MODBUS_READ_CONFIG = {
    "holding_registers": {
        "addresses": [0, 1, 2, 5, 6, 7],
        "mqtt_topic": "modbus/holding_registers"
    }
}
UPDATE_INTERVAL = 5  # seconds
```

To enable other data types (coils, discrete inputs, input registers), uncomment and configure them in `MODBUS_READ_CONFIG`.

## Usage

Start the publisher:
```
python src/main.py
```

- The app reads configured Modbus addresses at the set interval.
- Only changed values are published to MQTT.
- Each value is sent to its own topic, e.g. `modbus/holding_registers/2`.

## Testing

- Ensure your Modbus server and MQTT broker are running and accessible.
- Use any MQTT client to subscribe to topics and verify published values.
- Change Modbus register values to see updates on MQTT.

## Advanced

- Supports all Modbus data types (add to `MODBUS_READ_CONFIG` as needed).
- MQTT connection is robust and auto-reconnects if dropped.
- Easily extend for JSON payloads, logging, or batch reads if required.
