
# Real-time MQTT Data Visualization in Browser using JavaScript and WebSocket

## Overview
This project provides a simple real-time data visualization system using MQTT for data communication and WebSocket for streaming data to a web browser. It is ideal for IoT applications where lightweight, real-time messaging is required.

## Features
- Connects to an MQTT broker and subscribes to a topic
- Streams incoming MQTT messages to web clients via WebSocket
- Displays live data in the browser

## Project Structure
- `index.js`: Node.js server that connects to MQTT and relays messages to WebSocket clients
- `config.json`: Configuration for MQTT broker and topic
- `ws.html`: Simple web page to display live data
- `package.json`: Project dependencies

## Setup Instructions
1. **Install dependencies**
	```powershell
	npm install mqtt ws
	```

2. **Configure MQTT broker**
	Edit `config.json` to set your MQTT broker address, port, credentials, and topic:
	```json
	{
	  "brokerAddress": "broker.hivemq.com",
	  "brokerPort": 1883,
	  "username": "",
	  "password": "",
	  "baseTopic": "JavaScript"
	}
	```

3. **Start the server**
	```powershell
	node index.js
	```

4. **Open the web client**
	Open `ws.html` in your browser. It will connect to the WebSocket server at `ws://localhost:9292` and display live MQTT data.

## How It Works
- The Node.js server (`index.js`) connects to the MQTT broker and subscribes to `<baseTopic>/random`.
- Incoming MQTT messages are sent to all connected WebSocket clients.
- The web page (`ws.html`) receives and displays the live value.

## Customization
- Change the topic or broker settings in `config.json` as needed.
- Modify `ws.html` for more advanced visualizations.

## License
ISC
