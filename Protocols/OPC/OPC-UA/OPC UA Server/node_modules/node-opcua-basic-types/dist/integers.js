"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeInt64 = exports.encodeInt64 = exports.isValidInt64 = exports.coerceInt64 = exports.decodeByte = exports.encodeByte = exports.randomByte = exports.isValidByte = exports.decodeSByte = exports.encodeSByte = exports.randomSByte = exports.isValidSByte = void 0;
exports.isValidUInt16 = isValidUInt16;
exports.randomUInt16 = randomUInt16;
exports.encodeUInt16 = encodeUInt16;
exports.decodeUInt16 = decodeUInt16;
exports.isValidInt16 = isValidInt16;
exports.randomInt16 = randomInt16;
exports.encodeInt16 = encodeInt16;
exports.decodeInt16 = decodeInt16;
exports.isValidInt32 = isValidInt32;
exports.randomInt32 = randomInt32;
exports.encodeInt32 = encodeInt32;
exports.decodeInt32 = decodeInt32;
exports.isValidUInt32 = isValidUInt32;
exports.randomUInt32 = randomUInt32;
exports.encodeUInt32 = encodeUInt32;
exports.decodeUInt32 = decodeUInt32;
exports.isValidInt8 = isValidInt8;
exports.randomInt8 = randomInt8;
exports.encodeInt8 = encodeInt8;
exports.decodeInt8 = decodeInt8;
exports.isValidUInt8 = isValidUInt8;
exports.randomUInt8 = randomUInt8;
exports.encodeUInt8 = encodeUInt8;
exports.decodeUInt8 = decodeUInt8;
exports.isValidUInt64 = isValidUInt64;
exports.randomUInt64 = randomUInt64;
exports.encodeUInt64 = encodeUInt64;
exports.decodeUInt64 = decodeUInt64;
exports.constructInt64 = constructInt64;
exports.coerceUInt64 = coerceUInt64;
exports.randomInt64 = randomInt64;
exports.coerceInt8 = coerceInt8;
exports.coerceUInt8 = coerceUInt8;
exports.coerceByte = coerceByte;
exports.coerceSByte = coerceSByte;
exports.coerceUInt16 = coerceUInt16;
exports.coerceInt16 = coerceInt16;
exports.coerceUInt32 = coerceUInt32;
exports.coerceInt32 = coerceInt32;
exports.Int64ToBigInt = Int64ToBigInt;
exports.UInt64ToBigInt = UInt64ToBigInt;
exports.coerceInt64toInt32 = coerceInt64toInt32;
exports.coerceUInt64toInt32 = coerceUInt64toInt32;
/***
 * @module node-opcua-basic-types
 */
const node_opcua_assert_1 = require("node-opcua-assert");
const utils_1 = require("./utils");
function isValidUInt16(value) {
    if (!isFinite(value)) {
        return false;
    }
    return value >= 0 && value <= 0xffff;
}
// ---------------------------------------
function randomUInt16() {
    return (0, utils_1.getRandomInt)(0, 0xffff);
}
function encodeUInt16(value, stream) {
    stream.writeUInt16(value);
}
function decodeUInt16(stream, value) {
    return stream.readUInt16();
}
function isValidInt16(value) {
    if (!isFinite(value)) {
        return false;
    }
    return value >= -0x8000 && value <= 0x7fff;
}
function randomInt16() {
    return (0, utils_1.getRandomInt)(-0x8000, 0x7fff);
}
function encodeInt16(value, stream) {
    (0, node_opcua_assert_1.assert)(isFinite(value));
    stream.writeInt16(value);
}
function decodeInt16(stream, value) {
    return stream.readInt16();
}
function isValidInt32(value) {
    if (!isFinite(value)) {
        return false;
    }
    return value >= -0x80000000 && value <= 0x7fffffff;
}
function randomInt32() {
    return (0, utils_1.getRandomInt)(-0x80000000, 0x7fffffff);
}
function encodeInt32(value, stream) {
    (0, node_opcua_assert_1.assert)(isFinite(value));
    stream.writeInteger(value);
}
function decodeInt32(stream, value) {
    return stream.readInteger();
}
function isValidUInt32(value) {
    if (!isFinite(value)) {
        return false;
    }
    return value >= 0 && value <= 0xffffffff;
}
function randomUInt32() {
    return (0, utils_1.getRandomInt)(0, 0xffffffff);
}
function encodeUInt32(value, stream) {
    stream.writeUInt32(value);
}
function decodeUInt32(stream, value) {
    return stream.readUInt32();
}
function isValidInt8(value) {
    if (!isFinite(value)) {
        return false;
    }
    return value >= -0x80 && value <= 0x7f;
}
function randomInt8() {
    return (0, utils_1.getRandomInt)(-0x7f, 0x7e);
}
function encodeInt8(value, stream) {
    (0, node_opcua_assert_1.assert)(isValidInt8(value));
    stream.writeInt8(value);
}
function decodeInt8(stream, value) {
    return stream.readInt8();
}
exports.isValidSByte = isValidInt8;
exports.randomSByte = randomInt8;
exports.encodeSByte = encodeInt8;
exports.decodeSByte = decodeInt8;
function isValidUInt8(value) {
    if (!isFinite(value)) {
        return false;
    }
    return value >= 0x00 && value <= 0xff;
}
function randomUInt8() {
    return (0, utils_1.getRandomInt)(0x00, 0xff);
}
function encodeUInt8(value, stream) {
    stream.writeUInt8(value);
}
function decodeUInt8(stream, value) {
    return stream.readUInt8();
}
exports.isValidByte = isValidUInt8;
exports.randomByte = randomUInt8;
exports.encodeByte = encodeUInt8;
exports.decodeByte = decodeUInt8;
function isValidUInt64(value) {
    return value instanceof Array && value.length === 2;
}
function randomUInt64() {
    return [(0, utils_1.getRandomInt)(0, 0xffffffff), (0, utils_1.getRandomInt)(0, 0xffffffff)];
}
function encodeUInt64(value, stream) {
    if (typeof value === "number") {
        const arr = coerceUInt64(value);
        stream.writeUInt32(arr[1]);
        stream.writeUInt32(arr[0]);
    }
    else {
        stream.writeUInt32(value[1]);
        stream.writeUInt32(value[0]);
    }
}
function decodeUInt64(stream, value) {
    const low = stream.readUInt32();
    const high = stream.readUInt32();
    return constructInt64(high, low);
}
function constructInt64(high, low) {
    if (high === 0 && low < 0) {
        high = 0xffffffff;
        low = 0xffffffff + low + 1;
    }
    (0, node_opcua_assert_1.assert)(low >= 0 && low <= 0xffffffff);
    (0, node_opcua_assert_1.assert)(high >= 0 && high <= 0xffffffff);
    return [high, low];
}
function coerceUInt64(value) {
    let high;
    let low;
    let v;
    if (value === null || value === undefined) {
        return [0, 0];
    }
    if (value instanceof Array) {
        (0, node_opcua_assert_1.assert)(typeof value[0] === "number");
        (0, node_opcua_assert_1.assert)(typeof value[1] === "number");
        return value;
    }
    if (typeof value === "string") {
        v = value.split(",");
        if (v.length === 1) {
            // was a single string, good news ! BigInt can be used with nodejs >=12
            let a = BigInt(value);
            if (a < BigInt(0)) {
                const mask = BigInt("0xFFFFFFFFFFFFFFFF");
                a = (mask + a + BigInt(1)) & mask;
            }
            high = Number(a >> BigInt(32));
            low = Number(a & BigInt(0xffffffff));
        }
        else {
            high = parseInt(v[0], 10);
            low = parseInt(v[1], 10);
        }
        return constructInt64(high, low);
    }
    if (value > 0xffffffff) {
        // beware : as per javascript, value is a double here !
        //          our conversion will suffer from some inaccuracy
        high = Math.floor(value / 0x100000000);
        low = value - high * 0x100000000;
        return constructInt64(high, low);
    }
    return constructInt64(0, value);
}
function randomInt64() {
    // High, low
    return [(0, utils_1.getRandomInt)(0, 0xffffffff), (0, utils_1.getRandomInt)(0, 0xffffffff)];
}
exports.coerceInt64 = coerceUInt64;
exports.isValidInt64 = isValidUInt64;
exports.encodeInt64 = encodeUInt64;
exports.decodeInt64 = decodeUInt64;
function coerceInt8(value) {
    if (value === null || value === undefined) {
        return 0;
    }
    if (typeof value === "number") {
        return value;
    }
    return parseInt(value, 10);
}
function coerceUInt8(value) {
    if (value === null || value === undefined) {
        return 0;
    }
    if (typeof value === "number") {
        return value;
    }
    return parseInt(value, 10);
}
function coerceByte(value) {
    if (value === null || value === undefined) {
        return 0;
    }
    if (typeof value === "number") {
        return value;
    }
    return parseInt(value, 10);
}
function coerceSByte(value) {
    if (value === null || value === undefined) {
        return 0;
    }
    if (typeof value === "number") {
        return value;
    }
    return parseInt(value, 10);
}
function coerceUInt16(value) {
    if (value === null || value === undefined) {
        return 0;
    }
    if (typeof value === "number") {
        return value;
    }
    return parseInt(value, 10);
}
function coerceInt16(value) {
    if (value === null || value === undefined) {
        return 0;
    }
    if (typeof value === "number") {
        return value;
    }
    return parseInt(value, 10);
}
function coerceUInt32(value) {
    if (value === null || value === undefined) {
        return 0;
    }
    if (value && Object.prototype.hasOwnProperty.call(value, "value")) {
        return coerceUInt32(value.value);
    }
    if (typeof value === "number") {
        return value;
    }
    return parseInt(value, 10);
}
function coerceInt32(value) {
    if (value === null || value === undefined) {
        return 0;
    }
    if (value instanceof Array) {
        // Int64 as a [high,low]
        return coerceInt64toInt32(value);
    }
    if (typeof value === "number") {
        return value;
    }
    return parseInt(value, 10);
}
const signMask = 1n << 31n;
const shiftHigh = 1n << 32n;
function Int64ToBigInt(value) {
    const h = BigInt(value[0]);
    const l = BigInt(value[1]);
    if ((h & signMask) === signMask) {
        const v = (h & ~signMask) * shiftHigh + l - 0x8000000000000000n;
        return v;
    }
    else {
        const v = h * shiftHigh + l;
        return v;
    }
}
function UInt64ToBigInt(value) {
    const h = BigInt(value[0]);
    const l = BigInt(value[1]);
    const v = h * shiftHigh + l;
    return v;
}
function coerceInt64toInt32(value) {
    if (value instanceof Array) {
        const b = Int64ToBigInt(value);
        return Number(b);
    }
    return value;
}
function coerceUInt64toInt32(value) {
    if (value instanceof Array) {
        const b = UInt64ToBigInt(value);
        return Number(b);
    }
    return value;
}
//# sourceMappingURL=integers.js.map