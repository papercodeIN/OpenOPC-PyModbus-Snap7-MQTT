# Basic MQTT Publisher using JavaScript

This project demonstrates a simple MQTT publisher implemented in JavaScript. It allows you to send messages to an MQTT broker using configurable settings.

## Features
- Connects to an MQTT broker
- Publishes messages to a specified topic
- Configuration via `config.json`

## Prerequisites
- Node.js installed
- MQTT broker (e.g., Mosquitto, HiveMQ)

## Setup
1. Clone the repository:
   ```powershell
   git clone <repo-url>
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Configure your MQTT settings in `config.json`.

## Usage
Run the publisher:
```powershell
node index.js
```

## Configuration
Edit `config.json` to set your MQTT broker URL, topic, and message payload.

## Example `config.json`
```json
{
  "brokerUrl": "mqtt://localhost:1883",
  "topic": "test/topic",
  "message": "Hello MQTT!"
}
```

## License
MIT
