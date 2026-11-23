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
  
  // Publish random data on the defined topic every second
  setInterval(() => {
    const randomData = Math.random() * 100; // Generate random data
    const topic = baseTopic + '/random';
    client.publish(topic, randomData.toString());
    console.log('Published:', randomData, 'on topic:', topic);
  }, 2000);
});

client.on('error', function (error) {
  console.error('Error:', error);
});
