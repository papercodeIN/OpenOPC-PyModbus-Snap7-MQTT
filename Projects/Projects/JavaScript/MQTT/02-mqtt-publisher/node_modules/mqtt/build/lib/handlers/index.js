"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const publish_1 = __importDefault(require("./publish"));
const auth_1 = __importDefault(require("./auth"));
const connack_1 = __importDefault(require("./connack"));
const ack_1 = __importDefault(require("./ack"));
const pubrel_1 = __importDefault(require("./pubrel"));
const shared_1 = require("../shared");
const remainingLengthBytes = (remainingLength) => {
    if (remainingLength < 128)
        return 1;
    if (remainingLength < 16384)
        return 2;
    if (remainingLength < 2097152)
        return 3;
    return 4;
};
const totalPacketSize = (remainingLength) => 1 + remainingLengthBytes(remainingLength) + remainingLength;
const handle = (client, packet, done, pump) => {
    const { options } = client;
    const maximumPacketSize = options.properties?.maximumPacketSize;
    const packetSize = totalPacketSize(packet.length);
    if (options.protocolVersion === 5 &&
        maximumPacketSize &&
        maximumPacketSize < packetSize) {
        client.log('_handlePacket :: %s packet of %d bytes exceeds the advertised maximumPacketSize %d', packet.cmd, packetSize, maximumPacketSize);
        pump?.discardParsedPackets();
        client['_cleanUp'](true);
        done();
        client.emit('error', new shared_1.ErrorWithReasonCode(`exceeding packets size ${packet.cmd}: ${packetSize} bytes, maximumPacketSize is ${maximumPacketSize}`, 149));
        return client;
    }
    client.log('_handlePacket :: emitting packetreceive');
    client.emit('packetreceive', packet);
    switch (packet.cmd) {
        case 'publish':
            (0, publish_1.default)(client, packet, done, pump);
            break;
        case 'puback':
        case 'pubrec':
        case 'pubcomp':
        case 'suback':
        case 'unsuback':
            client.reschedulePing();
            try {
                (0, ack_1.default)(client, packet);
            }
            finally {
                done();
            }
            break;
        case 'pubrel':
            client.reschedulePing();
            (0, pubrel_1.default)(client, packet, done);
            break;
        case 'connack':
            try {
                (0, connack_1.default)(client, packet, pump);
            }
            finally {
                done();
            }
            break;
        case 'auth':
            client.reschedulePing();
            try {
                (0, auth_1.default)(client, packet, pump);
            }
            finally {
                done();
            }
            break;
        case 'pingresp':
            client.log('_handlePacket :: received pingresp');
            client.reschedulePing(true);
            done();
            break;
        case 'disconnect':
            client.emit('disconnect', packet);
            done();
            break;
        default:
            client.log('_handlePacket :: unknown command');
            done();
            break;
    }
};
exports.default = handle;
//# sourceMappingURL=index.js.map