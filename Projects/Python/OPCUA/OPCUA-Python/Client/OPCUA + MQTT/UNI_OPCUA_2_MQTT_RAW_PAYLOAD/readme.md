# OPCUA to MQTT Bridge

This project bridges OPC UA servers and MQTT brokers, allowing you to read values from OPC UA nodes and publish them to MQTT topics. It is designed for industrial automation, IIoT, and SCADA integration.

## Features
- Robust connection handling for both OPC UA and MQTT (auto-reconnect on drop)
- Publishes only changed values to reduce network traffic
- Configurable polling interval and node mapping via JSON
- Easy setup and cross-platform (tested on Windows)
- Clear console output for status and errors
- Graceful shutdown on keyboard interrupt
- Previous versions retained for reference

## Requirements
You can install all required packages using the provided `requirements.txt` file:

```
pip install -r requirements.txt
```


| Package   | Version  | Notes                      |
|-----------|----------|----------------------------|
| opcua     | 0.98.13  | Synchronous OPC UA client  |
| paho-mqtt | 2.1.0    | MQTT client (sync)         |

## Configuration
Edit `config.json` to set your OPC UA server, MQTT broker, and node details:

```json
{
  "opcua_server_url": "opc.tcp://localhost:4840",
  "mqtt": {
    "broker": "localhost",
    "port": 1883
  },
  "nodes": {
    "Node1": "ns=2;s=Demo.Static.Scalar.Int32",
    "Node2": "ns=2;s=Demo.Static.Scalar.String"
  },
  "interval": 2,
  "reconnect_delay": 5
}
```
- `opcua_server_url`: OPC UA server endpoint
- `mqtt.broker`: MQTT broker address
- `mqtt.port`: MQTT broker port
- `nodes`: Dictionary of MQTT topic names to OPC UA node IDs
- `interval`: Polling interval in seconds
- `reconnect_delay`: Cap for MQTT's automatic reconnect backoff in seconds (default 5)

## Usage
1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
2. Edit `config.json` as needed.
3. Run the main script:
   ```
   python main.py
   ```
   An alternate config file can be passed as an argument:
   `python main.py path\to\other-config.json`

## Expected Output

When you run the script, you should see console messages like:

```
Connected to MQTT broker: 127.0.0.1:1883
Connected to OPC UA server: opc.tcp://localhost:4840
Published initial value for Node1: 42
Published initial value for Node2: Hello
Published updated value for Node1: 43
Published updated value for Node2: World
MQTT disconnected (Unexpected EOF); network loop will reconnect automatically
OPC UA connection lost. Attempting to reconnect...
Connected to OPC UA server: opc.tcp://localhost:4840
```

On the MQTT broker, you will see topics updated with the latest values from the OPC UA nodes, for example:
- Topic `Node1` receives payloads like `42`, `43`, etc.
- Topic `Node2` receives payloads like `Hello`, `World`, etc.

Error messages will be printed if connections drop or node reads fail, and the script will attempt to reconnect automatically.

## Troubleshooting
- Ensure all required packages are installed (see above).
- Check that OPC UA server and MQTT broker are running and accessible.
- Review console output for errors and status.
- For Windows, run scripts from an elevated command prompt if needed.

## File Overview
- `main.py`: Main script; publishes each node's raw value to its own MQTT topic. Shares config/connection helpers with the JSON payload variant via `../uni_common.py`.
- `config.json`: Configuration file for server, broker, nodes, and interval.
- `requirements.txt`: Python dependencies.

## Previous Versions
Older versions are in the `previous_versions/before_01092025/` folder for reference.