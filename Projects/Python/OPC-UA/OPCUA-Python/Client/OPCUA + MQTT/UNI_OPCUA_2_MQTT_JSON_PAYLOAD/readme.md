# OPCUA to MQTT Bridge
This project connects to an OPC UA server, reads values from specified nodes, and publishes their values as a JSON payload to a single MQTT topic. It is useful for integrating industrial data into IoT platforms via MQTT.

## Project Features
- Reads values from multiple OPC UA nodes and publishes them as a single JSON object to an MQTT topic.
- Publishes only when node values change (reduces traffic).
- Robust reconnection for OPC UA; MQTT reconnection handled by paho's network loop with automatic backoff (`reconnect_delay`).
- Configuration via `config.json` (server, broker, topic, nodes, interval).
- Clean shutdown on keyboard interrupt.
- Initial values are published on startup.

## Requirements
Install dependencies:
```powershell
python -m pip install -r requirements.txt
```
| Package   | Version  | Notes                      |
|-----------|----------|----------------------------|
| opcua     | 0.98.13  | Synchronous OPC UA client  |
| paho-mqtt | 2.1.0    | MQTT client (sync)         |


## Configuration
Edit `config.json` to set your OPC UA server, MQTT broker, topic, nodes, and interval:
```json
{
	"opcua_server_url": "opc.tcp://DESKTOP-FAFB2HS:53532/OPCUA/SimulationServer",
	"mqtt": {
		"broker": "127.0.0.1",
		"port": 1883,
		"master_topic": "OPC_UA_Nodes"
	},
  "nodes": {
	"Counter": "ns=3;i=1002",
	"Random": "ns=3;i=1003",
	"Sawtooth": "ns=3;i=1004"
  },
  "interval": 5,
  "reconnect_delay": 5
}
```
- `opcua_server_url`: OPC UA server endpoint
- `mqtt.broker` / `mqtt.port`: MQTT broker address and port
- `mqtt.master_topic`: topic for the JSON snapshot (code default: `opcua_values`)
- `nodes`: map of node names to OPC UA NodeIds
- `interval`: poll interval in seconds
- `reconnect_delay`: MQTT auto-reconnect backoff cap in seconds (default 5)

## Usage
Run the main script:
```powershell
python main.py
# or: python main.py path\to\other-config.json
```

## How It Works
1. Loads configuration from `config.json`.
2. Connects to the OPC UA server and MQTT broker (with auto-reconnect).
3. Reads initial values from configured OPC UA nodes and publishes as JSON to the MQTT topic.
4. Periodically checks for changes in node values and publishes updates only when values change.
5. Handles connection loss and attempts to reconnect automatically.
6. Clean shutdown on keyboard interrupt.


## File Overview
- `main.py`: Main script for OPC UA to MQTT bridge.
- `config.json`: Configuration file for server, broker, nodes, and interval.
- `requirements.txt`: Python dependencies.
- `../uni_common.py`: Shared config loading and OPC UA / MQTT connection helpers used by this bridge and the RAW payload variant.


### main.py
The `main.py` script loads configuration from `config.json`, connects to the OPC UA server and MQTT broker, reads values from configured OPC UA nodes, and publishes their values as a JSON object to a single MQTT topic. It uses the synchronous `opcua` and `paho-mqtt` clients listed in `requirements.txt`, and only publishes updates when node values change, reducing unnecessary traffic. Shared config/connection helpers live in `../uni_common.py`.

## Expected Output (MQTT Broker)
When values are published to the MQTT broker (topic: `OPC_UA_Nodes`), the payload will be a JSON object containing the latest values for each OPC UA node:

Example:
```
{
	"Counter": 123,
	"Random": 45.67,
	"Sawtooth": 89
}
```

The payload is published only when at least one value changes. Initial values are published on startup.