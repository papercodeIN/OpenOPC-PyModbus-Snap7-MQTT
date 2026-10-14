"use strict";
/***
 * @module node-opcua-basic-types
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyGuid = exports.isValidGuid = void 0;
exports.randomGuid = randomGuid;
exports.encodeGuid = encodeGuid;
exports.decodeGuid = decodeGuid;
const node_opcua_assert_1 = __importDefault(require("node-opcua-assert"));
const node_opcua_binary_stream_1 = require("node-opcua-binary-stream");
const node_opcua_guid_1 = require("node-opcua-guid");
const utils_1 = require("./utils");
var node_opcua_guid_2 = require("node-opcua-guid");
Object.defineProperty(exports, "isValidGuid", { enumerable: true, get: function () { return node_opcua_guid_2.isValidGuid; } });
Object.defineProperty(exports, "emptyGuid", { enumerable: true, get: function () { return node_opcua_guid_2.emptyGuid; } });
function toHex(i, nb) {
    return i.toString(16).padStart(nb, "0");
}
function randomGuid() {
    const b = new node_opcua_binary_stream_1.BinaryStream(20);
    for (let i = 0; i < 20; i++) {
        b.writeUInt8((0, utils_1.getRandomInt)(0, 255));
    }
    b.rewind();
    const value = decodeGuid(b);
    return value;
}
//           1         2         3
// 012345678901234567890123456789012345
// |        |    |    | |  | | | | | |
// 12345678-1234-1234-ABCD-0123456789AB
// 00000000-0000-0000-0000-000000000000";
const hexCharToNum = (h) => {
    // tslint:disable-next-line: no-bitwise
    const l = h & 0x5f;
    const r = l <= 25 ? l - 16 : l - 55;
    // xx assert(r >= 0 && r < 16);
    return r;
};
(0, node_opcua_assert_1.default)(hexCharToNum("A".charCodeAt(0)) === 10);
(0, node_opcua_assert_1.default)(hexCharToNum("a".charCodeAt(0)) === 10);
(0, node_opcua_assert_1.default)(hexCharToNum("b".charCodeAt(0)) === 11);
(0, node_opcua_assert_1.default)(hexCharToNum("B".charCodeAt(0)) === 11);
(0, node_opcua_assert_1.default)(hexCharToNum("0".charCodeAt(0)) === 0);
(0, node_opcua_assert_1.default)(hexCharToNum("9".charCodeAt(0)) === 9);
function write_UInt32(stream, guid, starts) {
    const n = starts.length;
    for (let i = 0; i < n; i++) {
        const start = starts[i];
        const d1 = hexCharToNum(guid.charCodeAt(start));
        const d2 = hexCharToNum(guid.charCodeAt(start + 1));
        const d3 = hexCharToNum(guid.charCodeAt(start + 2));
        const d4 = hexCharToNum(guid.charCodeAt(start + 3));
        const d5 = hexCharToNum(guid.charCodeAt(start + 4));
        const d6 = hexCharToNum(guid.charCodeAt(start + 5));
        const d7 = hexCharToNum(guid.charCodeAt(start + 6));
        const d8 = hexCharToNum(guid.charCodeAt(start + 7));
        // tslint:disable-next-line: no-bitwise
        const value = (((((((((((((d1 << 4) | d2) << 4) | d3) << 4) | d4) << 4) | d5) << 4) | d6) << 4) | d7) << 4) | d8;
        stream.writeInteger(value);
    }
}
function write_UInt16(stream, guid, starts) {
    const n = starts.length;
    for (let i = 0; i < n; i++) {
        const start = starts[i];
        const d1 = hexCharToNum(guid.charCodeAt(start));
        const d2 = hexCharToNum(guid.charCodeAt(start + 1));
        const d3 = hexCharToNum(guid.charCodeAt(start + 2));
        const d4 = hexCharToNum(guid.charCodeAt(start + 3));
        // tslint:disable-next-line: no-bitwise
        const value = (((((d1 << 4) | d2) << 4) | d3) << 4) | d4;
        stream.writeUInt16(value);
    }
}
function write_UInt8(stream, guid, starts) {
    const n = starts.length;
    for (let i = 0; i < n; i++) {
        const start = starts[i];
        const d1 = hexCharToNum(guid.charCodeAt(start));
        const d2 = hexCharToNum(guid.charCodeAt(start + 1));
        // tslint:disable-next-line: no-bitwise
        const value = (d1 << 4) | d2;
        stream.writeUInt8(value);
    }
}
function encodeGuid(guid, stream) {
    if (!(0, node_opcua_guid_1.isValidGuid)(guid)) {
        throw new Error(" Invalid GUID : '" + JSON.stringify(guid) + ": the format should be 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'");
    }
    write_UInt32(stream, guid, [0]);
    write_UInt16(stream, guid, [9, 14]);
    write_UInt8(stream, guid, [19, 21, 24, 26, 28, 30, 32, 34]);
}
function read_UInt32(stream) {
    return toHex(stream.readUInt32(), 8);
}
function read_UInt16(stream) {
    return toHex(stream.readUInt16(), 4);
}
function read_UInt8(stream) {
    return toHex(stream.readUInt8(), 2);
}
function read_many(stream, func, nb) {
    let result = "";
    for (let i = 0; i < nb; i++) {
        result += func(stream);
    }
    return result;
}
function decodeGuid(stream, value) {
    const data1 = read_UInt32(stream);
    const data2 = read_UInt16(stream);
    const data3 = read_UInt16(stream);
    const data45 = read_many(stream, read_UInt8, 2);
    const data6B = read_many(stream, read_UInt8, 6);
    const guid = data1 + "-" + data2 + "-" + data3 + "-" + data45 + "-" + data6B;
    return guid.toUpperCase();
}
//# sourceMappingURL=guid.js.map