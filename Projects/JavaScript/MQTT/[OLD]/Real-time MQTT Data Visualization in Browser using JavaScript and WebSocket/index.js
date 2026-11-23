const mqtt = require('mqtt');
const fs = require('fs');
const WebSocket = require('ws');

// Load config from config.json file
const config = JSON.parse(fs.readFileSync('config.json'));

// MQTT broker settings
const brokerAddress = config.brokerAddress;
const brokerPort = config.brokerPort;
const username = config.username;
const password = config.password;
const baseTopic = config.baseTopic;

// Connect to MQTT broker
const client = mqtt.connect({
  host: brokerAddress,
  port: brokerPort,
  username: username,
  password: password
});

// Create WebSocket server
const wss = new WebSocket.Server({ port: 9292 }); // WebSocket server port

wss.on('connection', function connection(ws) {
  console.log('WebSocket client connected');

  // Subscribe to the topic
  const topic = baseTopic + '/random';
  client.subscribe(topic, function (err) {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to topic:', topic);
    }
  });

  // Handle incoming MQTT messages and send them to WebSocket clients
  client.on('message', function (mqttTopic, message) {
    if (mqttTopic === topic) {
      const data = message.toString();
      console.log('Received message on topic:', mqttTopic, 'Message:', data);
      ws.send(data); // Send message to WebSocket client
    }
  });

  client.on('error', function (error) {
    console.error('Error:', error);
  });

  ws.on('close', function () {
    console.log('WebSocket client disconnected');
  });
});
