# Modbus TCP/IP to MQTT JSON Publisher

This project bridges Modbus TCP/IP devices and MQTT brokers, publishing Modbus register values as **JSON payloads** to main MQTT topics for each data type. It is built with the `pymodbus` and `paho-mqtt` libraries and is designed for flexible, custom use cases.

## Library Version Details
| Package     | Version | Description                     |
|-------------|---------|---------------------------------|
| pymodbus    | 3.11.1  | Modbus protocol implementation  |
| paho-mqtt   | 2.1.0   | MQTT client library for Python  |

## Features

- Supports all Modbus data types: coils, discrete inputs, holding registers, input registers
- Per-address reading for maximum flexibility (handles consecutive and non-consecutive addresses)
- Publishes only when values change
- **All values for each data type are published as a single JSON object to the main topic**
- Configurable update interval
- Robust MQTT connection with auto-reconnect and status callbacks
- Easy configuration via `config.py`

## Project Structure

```
modbus-mqtt-publisher
├── src
│   ├── main.py               # Main application logic
│   ├── modbus_client.py      # Modbus TCP client wrapper
│   ├── mqtt_publisher.py     # MQTT publisher with auto-reconnect
│   └── config.py             # User configuration for Modbus/MQTT/topics/interval
├── requirements.txt          # Python dependencies
├── README.md                 # Project documentation
└── .gitignore                # Version control ignore file
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd modbus-mqtt-publisher
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

## Configuration

Edit `src/config.py` to set:
- Modbus server IP and port
- MQTT broker IP and port
- Register types and addresses to read (can be any list)
- MQTT topics for each register type
- Update interval (in seconds)

Example:
```python
MODBUS_READ_CONFIG = {
    "holding_registers": {
        "addresses": [0, 1, 2, 5, 6, 7],
        "mqtt_topic": "modbus/holding_registers"
    },
    "coils": {
        "addresses": [0, 2, 4],
        "mqtt_topic": "modbus/coils"
    }
}
UPDATE_INTERVAL = 5  # seconds
```

## Usage

Start the publisher:
```
python src/main.py
```

- The app will read configured Modbus addresses at the set interval.
- Only changed values are published to MQTT.
- **All values for each data type are sent as a single JSON object to the main topic.**

Example MQTT payload for holding registers:
```json
{
  "type": "holding_registers",
  "values": {
    "0": 123,
    "1": 456,
    "2": 789,
    "5": 101,
    "6": 202,
    "7": 303
  }
}
```

## Testing

- Ensure your Modbus server and MQTT broker are running and accessible.
- Use any MQTT client to subscribe to main topics (e.g. `modbus/holding_registers`, `modbus/coils`) and verify published JSON payloads.
- Change Modbus register values to see updates on MQTT.

## Advanced

- Supports all Modbus data types (add to `MODBUS_READ_CONFIG` as needed).
- MQTT connection is robust and auto-reconnects if dropped.
- Easily extend for logging, batch reads, or custom payload formats if required.
