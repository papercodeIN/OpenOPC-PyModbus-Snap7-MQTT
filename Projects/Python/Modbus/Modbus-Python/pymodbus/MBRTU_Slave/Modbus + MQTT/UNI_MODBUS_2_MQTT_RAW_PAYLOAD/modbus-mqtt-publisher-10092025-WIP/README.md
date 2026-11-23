# Modbus RTU (Serial) to MQTT Publisher — Raw payload per register

This project bridges Modbus RTU serial devices and MQTT brokers, publishing each Modbus value to its own MQTT topic with a raw payload (stringified scalar). Built with `pymodbus` and `paho-mqtt`.

## Library Version Details
| Package     | Version | Description                     |
|-------------|---------|---------------------------------|
| pymodbus    | 3.11.1  | Modbus protocol implementation  |
| paho-mqtt   | 2.1.0   | MQTT client library for Python  |
| pyserial    | 3.5     | Serial backend for RTU          |

## Features

- Supports coils, discrete inputs, holding registers, input registers
- Per-address reading for non-consecutive lists
- Change-based publishing per address
- One topic per register/coil: `<base_topic>/<address>`
- Raw scalar payloads (e.g., `"0"`, `"1"`, `"1234"`)
- Configurable update interval
- Robust MQTT connection with managed reconnect in the main loop and status callbacks
- Easy configuration via `config.py`

## Project Structure

```
modbus-mqtt-publisher
├── src
│   ├── main.py               # Main application logic
│   ├── modbus_client.py      # Modbus RTU (serial) client wrapper
│   ├── mqtt_publisher.py     # MQTT publisher; main loop manages reconnect
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
- Modbus serial settings: `MODBUS_SERIAL_PORT`, `MODBUS_BAUDRATE`, `MODBUS_PARITY`, `MODBUS_STOPBITS`, `MODBUS_BYTESIZE`, `MODBUS_SLAVE_ID`
- MQTT broker IP and port
- Register types and addresses to read (can be any list)
- Base MQTT topic for each register type (final topic becomes `base/address`)
- Update interval (in seconds)
 - Client details: `CLIENT_ID`, `KEEP_ALIVE`

Example:
```python
CLIENT_ID = 'modbus_mqtt_publisher'
KEEP_ALIVE = 60
UPDATE_INTERVAL = 5  # seconds

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
```

## Usage

Start the publisher (Windows PowerShell example):
```powershell
python src/main.py
```

Notes:
- On Windows, set `MODBUS_SERIAL_PORT` to something like `"COM3"`.
- On Linux, use `/dev/ttyUSB0` or similar.

- The app reads configured Modbus addresses at the set interval.
- Only changed values are published to MQTT.
- One message per address. Topic format: `<base_topic>/<address>`.

Example MQTT publish for holding register 5 with base `modbus/holding_registers`:
- Topic: `modbus/holding_registers/5`
- Payload: `"1234"`

### Raw payload format
- Payloads are sent as raw bytes (encoded from the string representation). MQTT clients may display quotes depending on UI, but the underlying payload is not JSON.
- Booleans are published as `"0"` or `"1"`.

## Testing

- Ensure your Modbus server and MQTT broker are running and accessible.
- Use any MQTT client to subscribe to wildcard topics (e.g., `modbus/holding_registers/#`, `modbus/coils/#`).
- Change Modbus values to see per-address updates.

## Advanced

- Supports all Modbus data types (add to `MODBUS_READ_CONFIG` as needed).
- Reconnects are handled by the main loop with backoff; the MQTT on_disconnect does not auto-loop reconnections to avoid storms.
- Easy to extend for logging, QoS/retain flags, or custom payload formats.

## Troubleshooting
- Connection storms: Ensure you’re on this version where reconnect is handled only in the main loop (no auto-reconnect loop in the MQTT callback).
- No data published: Verify `MODBUS_READ_CONFIG` addresses exist on your device and that `MODBUS_SLAVE_ID` is correct.
- Broker access denied: Confirm broker credentials and that port `1883` is open.
