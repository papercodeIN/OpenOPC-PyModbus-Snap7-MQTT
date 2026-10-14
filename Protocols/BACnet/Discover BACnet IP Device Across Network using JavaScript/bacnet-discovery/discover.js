const Bacnet = require('bacstack');
const client = new Bacnet();

// Listen for 'iAm' messages from devices
client.on('iAm', (device) => {
  console.log('BACnet Device discovered:', device);
});

// Broadcast 'Who-Is'
client.whoIs();

// Stop after 5 seconds
setTimeout(() => {
  client.close();
  console.log('Scan finished.');
}, 5000);
