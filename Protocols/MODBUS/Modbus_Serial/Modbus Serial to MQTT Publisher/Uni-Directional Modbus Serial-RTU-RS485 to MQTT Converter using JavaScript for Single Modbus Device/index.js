const ModbusRTU = require("modbus-serial");
const mqtt = require("mqtt");
const fs = require("fs");

// Load configuration
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));

// Modbus client setup
const modbusClient = new ModbusRTU();
modbusClient.connectRTUBuffered(config.modbus.serialPort, {
    baudRate: config.modbus.baudRate,
    parity: config.modbus.parity,
    stopBits: config.modbus.stopBits,
    dataBits: config.modbus.dataBits
}, function(err) {
    if (err) {
        console.error('Error connecting to Modbus device:', err.message);
        return;
    }
    console.log('Connected to Modbus device on', config.modbus.serialPort);
    modbusClient.setID(config.modbus.slaveID);

    // Start polling Modbus registers using the interval from the config
    setInterval(pollModbusRegisters, config.modbus.interval);
});

// MQTT client setup
let mqttClient = null; // Initialize MQTT client variable

function connectMQTT() {
    if (mqttClient && mqttClient.connected) {
        console.log("MQTT client is already connected.");
        return mqttClient; // Return the existing client if already connected
    }

    console.log("Attempting to connect to MQTT broker...");
    mqttClient = mqtt.connect({
        host: config.mqtt.broker.ip,
        port: config.mqtt.broker.port,
        username: config.mqtt.broker.username,
        password: config.mqtt.broker.password
    });

    mqttClient.on("connect", () => {
        console.log("Connected to MQTT broker on", config.mqtt.broker.ip, "port", config.mqtt.broker.port);
    });

    mqttClient.on("close", () => {
        console.log("MQTT connection closed. Attempting to reconnect...");
    });

    mqttClient.on("error", (err) => {
        console.error("MQTT connection error:", err.message);
    });

    mqttClient.on("reconnect", () => {
        console.log("Attempting to reconnect to MQTT broker...");
    });

    return mqttClient;
}

async function pollModbusRegisters() {
    // Check if MQTT client is initialized and connected
    if (!mqttClient || !mqttClient.connected) {
        console.log("MQTT client is not connected. Skipping MQTT message publishing.");
        return;
    }

    const payloads = {
        "Holding Register": {},
        "Input Register": {},
        "Coil Status": {},
        "Discrete Input Status": {}
    };

    for (const registerConfig of config.modbus.registers) {
        const length = registerConfig.endAddress - registerConfig.startAddress + 1;
        const type = registerConfig.type;
        const tags = registerConfig.tags;

        let readFunction;
        switch (type) {
            case "holding":
                readFunction = modbusClient.readHoldingRegisters;
                break;
            case "input":
                readFunction = modbusClient.readInputRegisters;
                break;
            case "coil":
                readFunction = modbusClient.readCoils;
                break;
            case "discrete":
                readFunction = modbusClient.readDiscreteInputs;
                break;
            default:
                console.error("Unknown register type:", type);
                continue;
        }

        try {
            const data = await readFunction.call(modbusClient, registerConfig.startAddress, length);
            data.data.forEach((value, index) => {
                payloads[getPayloadKey(type)][tags[index]] = value;
            });
        } catch (err) {
            console.error(`Error reading ${type} registers from ${registerConfig.startAddress} to ${registerConfig.endAddress}:`, err.message);
        }
    }

    const timestamp = new Date().toISOString();
    for (const [type, payload] of Object.entries(payloads)) {
        payload.timestamp = timestamp; // Add timestamp to the payload
        const topic = `${config.mqtt.baseTopic}/${type}`;
        mqttClient.publish(topic, JSON.stringify(payload));
        // console.log(`Published data to MQTT topic ${topic}:`, payload);
    }
}

function getPayloadKey(type) {
    switch (type) {
        case "holding":
            return "Holding Register";
        case "input":
            return "Input Register";
        case "coil":
            return "Coil Status";
        case "discrete":
            return "Discrete Input Status";
        default:
            throw new Error("Unknown register type");
    }
}

// Connect to MQTT broker
connectMQTT();
