const ModbusRTU = require("modbus-serial");
const net = require("net");
const fs = require("fs");

// Load configuration
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));

// Modbus serial client setup
const modbusSerialClient = new ModbusRTU();
modbusSerialClient.connectRTUBuffered(config.modbus.serial.port, { baudRate: config.modbus.serial.baudRate }, function(err) {
    if (err) {
        console.error('Error connecting to Modbus device:', err.message);
        return;
    }
    console.log('Connected to Modbus device on', config.modbus.serial.port, 'with baud rate', config.modbus.serial.baudRate);
    modbusSerialClient.setID(config.modbus.slaveID);

    // Start TCP server
    startModbusTCPServer();
});

function startModbusTCPServer() {
    const server = net.createServer(socket => {
        socket.on("data", async data => {
            const functionCode = data[7];
            const startAddress = data.readUInt16BE(8);
            const quantity = data.readUInt16BE(10);

            let response;
            try {
                switch (functionCode) {
                    case 3: // Read Holding Registers
                        response = await modbusSerialClient.readHoldingRegisters(startAddress, quantity);
                        break;
                    case 4: // Read Input Registers
                        response = await modbusSerialClient.readInputRegisters(startAddress, quantity);
                        break;
                    case 1: // Read Coils
                        response = await modbusSerialClient.readCoils(startAddress, quantity);
                        break;
                    case 2: // Read Discrete Inputs
                        response = await modbusSerialClient.readDiscreteInputs(startAddress, quantity);
                        break;
                    default:
                        throw new Error('Unsupported function code');
                }

                const responseBuffer = createModbusTCPResponse(data, response.data, functionCode, quantity);
                socket.write(responseBuffer);
            } catch (err) {
                console.error(`Error handling Modbus request: ${err.message}`);
                // Handle error response (Modbus exception response)
            }
        });

        socket.on("error", err => {
            console.error('Socket error:', err.message);
        });
    });

    server.listen(config.modbus.tcp.port, () => {
        console.log('Modbus TCP server listening on port', config.modbus.tcp.port);
    });
}

function createModbusTCPResponse(requestBuffer, data, functionCode, quantity) {
    let byteCount;
    let responseBuffer;

    if (functionCode === 1 || functionCode === 2) { // Coils or Discrete Inputs
        byteCount = Math.ceil(quantity / 8);
        responseBuffer = Buffer.alloc(9 + byteCount);
        requestBuffer.copy(responseBuffer, 0, 0, 6); // Copy MBAP header
        responseBuffer[5] = byteCount + 3; // Update length field
        responseBuffer[7] = functionCode;
        responseBuffer[8] = byteCount;

        for (let i = 0; i < quantity; i++) {
            const byteIndex = Math.floor(i / 8);
            const bitIndex = i % 8;
            if (data[i]) {
                responseBuffer[9 + byteIndex] |= (1 << bitIndex);
            }
        }
    } else { // Holding Registers or Input Registers
        byteCount = data.length * 2;
        responseBuffer = Buffer.alloc(9 + byteCount);
        requestBuffer.copy(responseBuffer, 0, 0, 6); // Copy MBAP header
        responseBuffer[5] = byteCount + 3; // Update length field
        responseBuffer[7] = functionCode;
        responseBuffer[8] = byteCount;

        data.forEach((value, index) => {
            responseBuffer.writeUInt16BE(value, 9 + index * 2);
        });
    }

    return responseBuffer;
}
