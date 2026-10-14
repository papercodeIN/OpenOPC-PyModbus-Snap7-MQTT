"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeMessage = decodeMessage;
exports.packTcpMessage = packTcpMessage;
exports.parseEndpointUrl = parseEndpointUrl;
exports.is_valid_endpointUrl = is_valid_endpointUrl;
exports.writeTCPMessageHeader = writeTCPMessageHeader;
/**
 * @module node-opcua-transport
 */
const url_1 = __importDefault(require("url"));
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_binary_stream_1 = require("node-opcua-binary-stream");
const node_opcua_buffer_utils_1 = require("node-opcua-buffer-utils");
const node_opcua_chunkmanager_1 = require("node-opcua-chunkmanager");
const TCPErrorMessage_1 = require("./TCPErrorMessage");
function is_valid_msg_type(msgType) {
    (0, node_opcua_assert_1.assert)([
        "HEL",
        "ACK",
        "ERR", // Connection Layer
        "OPN",
        "MSG",
        "CLO" // OPC Unified Architecture, Part 6 page 36
    ].indexOf(msgType) >= 0, "invalid message type  " + msgType);
    return true;
}
function decodeMessage(stream, classNameConstructor) {
    (0, node_opcua_assert_1.assert)(stream instanceof node_opcua_binary_stream_1.BinaryStream);
    (0, node_opcua_assert_1.assert)(classNameConstructor instanceof Function, " expecting a function for " + classNameConstructor);
    const header = (0, node_opcua_chunkmanager_1.readMessageHeader)(stream);
    (0, node_opcua_assert_1.assert)(stream.length === 8);
    let obj;
    if (header.msgType === "ERR") {
        obj = new TCPErrorMessage_1.TCPErrorMessage();
        obj.decode(stream);
        return obj;
    }
    else {
        obj = new classNameConstructor();
        obj.decode(stream);
        return obj;
    }
}
function packTcpMessage(msgType, encodableObject) {
    (0, node_opcua_assert_1.assert)(is_valid_msg_type(msgType));
    const messageChunk = (0, node_opcua_buffer_utils_1.createFastUninitializedBuffer)(encodableObject.binaryStoreSize() + 8);
    // encode encode-ableObject in a packet
    const stream = new node_opcua_binary_stream_1.BinaryStream(messageChunk);
    encodeMessage(msgType, encodableObject, stream);
    return messageChunk;
}
// opc.tcp://hostname:51210/UA/SampleServer
function parseEndpointUrl(endpointUrl) {
    const _url = url_1.default.parse(endpointUrl);
    if (!_url.protocol || !_url.hostname) {
        throw new Error("Invalid endpoint url " + endpointUrl);
    }
    return _url;
    /*
    const r = /^([a-z.]*):\/\/([a-zA-Z_\-.\-0-9]*):([0-9]*)(\/.*){0,1}/;

    const matches = r.exec(endpointUrl);

    if (!matches) {
        throw new Error("Invalid endpoint url " + endpointUrl);
    }
    return {
        protocol: matches[1],

        hostname: matches[2],

        port: parseInt(matches[3], 10),

        address: matches[4] || ""
    };
   */
}
function is_valid_endpointUrl(endpointUrl) {
    const e = parseEndpointUrl(endpointUrl);
    return Object.prototype.hasOwnProperty.call(e, "hostname");
}
function writeTCPMessageHeader(msgType, chunkType, totalLength, stream) {
    if (stream instanceof Buffer) {
        stream = new node_opcua_binary_stream_1.BinaryStream(stream);
    }
    (0, node_opcua_assert_1.assert)(is_valid_msg_type(msgType));
    (0, node_opcua_assert_1.assert)(["A", "F", "C"].indexOf(chunkType) !== -1);
    stream.writeUInt8(msgType.charCodeAt(0));
    stream.writeUInt8(msgType.charCodeAt(1));
    stream.writeUInt8(msgType.charCodeAt(2));
    // Chunk type
    stream.writeUInt8(chunkType.charCodeAt(0)); // reserved
    stream.writeUInt32(totalLength);
}
function encodeMessage(msgType, messageContent, stream) {
    // the length of the message, in bytes. (includes the 8 bytes of the message header)
    const totalLength = messageContent.binaryStoreSize() + 8;
    writeTCPMessageHeader(msgType, "F", totalLength, stream);
    messageContent.encode(stream);
    (0, node_opcua_assert_1.assert)(totalLength === stream.length, "invalid message size");
}
//# sourceMappingURL=tools.js.map