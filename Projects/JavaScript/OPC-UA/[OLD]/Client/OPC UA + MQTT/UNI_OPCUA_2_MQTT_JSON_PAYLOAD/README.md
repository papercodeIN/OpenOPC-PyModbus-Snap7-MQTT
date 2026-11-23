# OPC UA to MQTT JSON Payload Publisher

This project connects to an OPC UA server, reads node values, and publishes them as JSON payloads to an MQTT broker. It is designed for reliability, automatic reconnection, and easy configuration.

## Features
- Reads multiple OPC UA nodes at regular intervals
- Publishes data to MQTT broker in JSON format
- Automatic reconnection for both OPC UA and MQTT connections (startup and runtime)
- Supports MQTT authentication (username/password) and TLS/SSL
- Easily extendable for OPC UA authentication (username/password)
- Clean, modular, and maintainable code

## Configuration
Edit `config.json` to set up OPC UA and MQTT connection details:

```
{
    "opcua": {
        "endpointUrl": "opc.tcp://Parrot:4840/OPCUA/SimulationServer",
        "nodesToRead": [
            { "name": "Constant", "nodeId": "ns=3;i=1001" },
            { "name": "Counter", "nodeId": "ns=3;i=1002" }
            // ... more nodes ...
        ],
        "username": "",         // Optional: for OPC UA authentication
        "password": ""          // Optional: for OPC UA authentication
    },
    "mqtt": {
        "hostname": "mqtt://broker.hivemq.com",
        "port": 1883,
        "masterTopic": "opcua_data",
        "username": "",         // Optional: for MQTT authentication
        "password": "",         // Optional: for MQTT authentication
        "qos": 1,               // Optional: 0, 1, or 2
        "tls": false            // Optional: true for secure connection
        // "ca": "path/to/ca.crt",    // Optional for TLS
        // "cert": "path/to/client.crt", // Optional for TLS
        // "key": "path/to/client.key"   // Optional for TLS
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

## Extending Authentication
- **MQTT:** Add `username` and `password` in the `mqtt` section of `config.json`.
- **OPC UA:** Add `username` and `password` in the `opcua` section and update the code to use these when creating the session.

## Reliability
- The application will automatically reconnect to the OPC UA server and MQTT broker if connections are lost at startup or during runtime.
- All resources are cleaned up before reconnecting.

## Example MQTT Output
The published message on the MQTT broker (under your configured topic) will look like:

```
[
  {
    "Timestamp": "2025-09-03T09:00:00.000Z",
    "Name": "Constant",
    "NodeId": "ns=3;i=1001",
    "Value": 42
  },
  {
    "Timestamp": "2025-09-03T09:00:00.000Z",
    "Name": "Counter",
    "NodeId": "ns=3;i=1002",
    "Value": 123
  }
  // ... more nodes ...
]
```

Each array element represents a node value read from OPC UA, with its timestamp, name, nodeId, and value.