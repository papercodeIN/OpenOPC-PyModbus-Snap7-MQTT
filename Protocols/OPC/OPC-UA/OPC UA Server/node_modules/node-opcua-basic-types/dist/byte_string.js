"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidByteString = isValidByteString;
exports.randomByteString = randomByteString;
exports.encodeByteString = encodeByteString;
exports.decodeByteString = decodeByteString;
exports.coerceByteString = coerceByteString;
const node_opcua_buffer_utils_1 = require("node-opcua-buffer-utils");
const utils_1 = require("./utils");
function isValidByteString(value) {
    return value === null || value instanceof Buffer;
}
function randomByteString(value, len) {
    len = len || (0, utils_1.getRandomInt)(1, 200);
    const b = (0, node_opcua_buffer_utils_1.createFastUninitializedBuffer)(len);
    for (let i = 0; i < len; i++) {
        b.writeUInt8((0, utils_1.getRandomInt)(0, 255), i);
    }
    return b;
}
function encodeByteString(byteString, stream) {
    stream.writeByteStream(byteString);
}
function decodeByteString(stream, _value) {
    return stream.readByteStream();
}
function coerceByteString(value) {
    if (Array.isArray(value)) {
        return Buffer.from(value);
    }
    if (typeof value === "string") {
        return Buffer.from(value, "base64");
    }
    return value;
}
//# sourceMappingURL=byte_string.js.map