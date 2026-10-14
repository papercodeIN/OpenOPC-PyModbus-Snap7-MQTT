const ModbusRTU = require("modbus-serial");
const fs = require('fs');

// Read configuration from config.json
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const client = new ModbusRTU();

// Open connection to a serial port
client.connectRTUBuffered(config.comPort, {
    baudRate: config.baudRate,
    dataBits: config.dataBits,
    parity: config.parity,
    stopBits: config.stopBits
}, function(err) {
    if (err) {
        console.error('Error connecting to Modbus device:', err.message);
        return;
    }
    console.log(`Connected to Modbus device on ${config.comPort}`);

    // Set the Modbus slave ID
    client.setID(config.slaveID);

    // Function to read holding registers
    function readHoldingRegisters() {
        client.readHoldingRegisters(config.holdingRegisters.startAddress, config.holdingRegisters.count, function(err, data) {
            if (err) {
                console.error('Error reading holding registers:', err.message);
                return;
            }
            console.log('Read holding registers:', data.data);
        });
    }

    // Read holding registers at specified intervals
    setInterval(readHoldingRegisters, config.holdingRegisters.interval);
});

// Handling SIGINT signal (Ctrl+C)
process.on('SIGINT', () => {
    console.log("\nShutting down...");
    // Close the Modbus client connection
    client.close(() => {
        console.log("Modbus client connection closed.");
        process.exit(0);
    });
});
