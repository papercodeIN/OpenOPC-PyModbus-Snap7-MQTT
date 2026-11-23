
# OPC UA to MQTT Raw Payload Publisher

This project connects to an OPC UA server, reads node values, and publishes each value as a raw payload to its own MQTT topic. Each tag gets its own topic, and the payload is the raw value (not JSON). The application is designed for reliability, automatic reconnection, and easy configuration.

## Features
- Reads multiple OPC UA nodes at regular intervals
- Publishes each tag's value as a raw payload to its own MQTT topic
- Automatic reconnection for both OPC UA and MQTT connections (startup and runtime)
- Supports MQTT authentication (username/password) and TLS/SSL
- Supports OPC UA authentication (username/password)
- Clear, prefixed logging for debugging and monitoring
- Clean, modular, and maintainable code

## Configuration
Edit `config.json` to set up OPC UA and MQTT connection details:

```
{
  "opcua": {
    "endpointUrl": "opc.tcp://DESKTOP-FAFB2HS:53532/OPCUA/SimulationServer",
    "nodesToRead": [
      { "name": "Constant", "nodeId": "ns=3;i=1001" },
      { "name": "Counter", "nodeId": "ns=3;i=1002" },
      { "name": "Random", "nodeId": "ns=3;i=1003" }
      // ... more nodes ...
    ],
    "username": "",         // Optional: for OPC UA authentication
    "password": ""          // Optional: for OPC UA authentication
  },
  "mqtt": {
    "hostname": "127.0.0.1",
    "port": 1883,
    "masterTopic": "opcua_data", // Used as a prefix for each tag's topic
    "username": "",         // Optional: for MQTT authentication
    "password": "",         // Optional: for MQTT authentication
    "qos": 1,               // Optional: 0, 1, or 2
    "tls": false,           // Optional: true for secure connection
    "ca": "",               // Optional: path to CA certificate for TLS
    "cert": "",             // Optional: path to client certificate for TLS
    "key": ""               // Optional: path to client private key for TLS
  }
}
```

## Usage

1. Install dependencies:
   ```powershell
   npm install
   ```
2. Run the publisher:
   ```powershell
   node index.js
   ```

## Authentication
- **MQTT:** Add `username` and `password` in the `mqtt` section of `config.json`.
- **OPC UA:** Add `username` and `password` in the `opcua` section of `config.json`. The application will automatically use these credentials when creating the OPC UA session.

## Logging
The application provides clear, prefixed logging to help with debugging and monitoring:
- `[OPCUA]` - OPC UA connection, session, and read operations
- `[MQTT]` - MQTT broker connection and status
- `[PUBLISH]` - Each value published to MQTT (topic and payload)
- `[SYSTEM]` - Application startup, shutdown, and system events

Example output:
```
[OPCUA] Connecting to server: opc.tcp://localhost:4840/OPCUA/SimulationServer
[OPCUA] Connected to server
[OPCUA] Creating session with anonymous authentication
[OPCUA] Session created
[MQTT] Connected to broker: 127.0.0.1:1883
[PUBLISH] Topic: opcua_data/Constant | Payload: 42
[PUBLISH] Topic: opcua_data/Counter | Payload: 123
```

## Reliability
- The application will automatically reconnect to the OPC UA server and MQTT broker if connections are lost at startup or during runtime.
- All resources are cleaned up before reconnecting.

## Example MQTT Output
Each tag's value is published as a raw payload to its own topic. The topic format is:

```
<masterTopic>/<tagName>
```
or, if no masterTopic is set:
```
<tagName>
```

The payload is the raw value of the tag, e.g.:

Topic: `opcua_data/Constant`
Payload: `42`

Topic: `opcua_data/Counter`
Payload: `123`

Each tag is published individually to its own topic, not as a JSON array.