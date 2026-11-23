const mqtt = require('mqtt');
const fs = require('fs');

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

client.on('connect', function () {
  console.log('Connected to MQTT broker');

  // Subscribe to the topic
  const topic = baseTopic + '/random';
  client.subscribe(topic, function (err) {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to topic:', topic);
    }
  });
});

// Handle incoming messages
client.on('message', function (topic, message) {
  console.log('Received message on topic:', topic, 'Message:', message.toString());
});

client.on('error', function (error) {
  console.error('Error:', error);
});
