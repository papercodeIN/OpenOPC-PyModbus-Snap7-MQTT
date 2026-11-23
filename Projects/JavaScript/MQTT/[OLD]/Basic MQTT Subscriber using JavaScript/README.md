# Basic MQTT Subscriber using JavaScript

This project demonstrates a simple MQTT subscriber implemented in JavaScript. It connects to an MQTT broker, subscribes to a topic, and logs incoming messages.

## Features
- Connects to an MQTT broker
- Subscribes to a specified topic
- Logs received messages to the console
- Configuration via `config.json`

## Prerequisites
- Node.js installed

## Installation
1. Clone the repository:
   ```sh
   git clone <repo-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd Basic MQTT Subscriber using JavaScript
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

## Configuration
Edit the `config.json` file to set your MQTT broker details and topic:
```json
{
  "brokerAddress": "127.0.0.1",
  "brokerPort": 1883,
  "username": "",
  "password": "",
  "baseTopic": "JavaScript"
}

```

## Usage
Run the subscriber:
```sh
node index.js
```

## Files
- `index.js`: Main subscriber script
- `config.json`: Configuration for broker and topic
- `package.json`: Project metadata and dependencies
