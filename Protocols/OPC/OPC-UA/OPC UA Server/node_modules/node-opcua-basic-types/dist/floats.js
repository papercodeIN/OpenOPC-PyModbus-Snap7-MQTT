"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidFloat = isValidFloat;
exports.randomFloat = randomFloat;
exports.encodeFloat = encodeFloat;
exports.decodeFloat = decodeFloat;
exports.isValidDouble = isValidDouble;
exports.randomDouble = randomDouble;
exports.encodeDouble = encodeDouble;
exports.decodeDouble = decodeDouble;
exports.coerceFloat = coerceFloat;
exports.coerceDouble = coerceDouble;
const minFloat = -3.4 * Math.pow(10, 38);
const maxFloat = 3.4 * Math.pow(10, 38);
/**
 * return a random float value in the range of  min inclusive and  max exclusive

 * @param min
 * @param max
 * @return {*}
 * @private
 */
function getRandomDouble(min, max) {
    return Math.random() * (max - min) + min;
}
function isValidFloat(value) {
    if (!isFinite(value)) {
        return false;
    }
    return value > minFloat && value < maxFloat;
}
const r = new Float32Array(1);
function roundToFloat(float) {
    r[0] = float;
    const floatR = r[0];
    return floatR;
}
function randomFloat() {
    return roundToFloat(getRandomDouble(-1000, 1000));
}
function encodeFloat(value, stream) {
    stream.writeFloat(value);
}
function decodeFloat(stream, value) {
    return stream.readFloat();
}
function isValidDouble(value) {
    if (!isFinite(value)) {
        return false;
    }
    return true;
}
function randomDouble() {
    return getRandomDouble(-1000000, 1000000);
}
function encodeDouble(value, stream) {
    stream.writeDouble(value);
}
function decodeDouble(stream, value) {
    return stream.readDouble();
}
function coerceFloat(value) {
    if (value === null || value === undefined) {
        return 0.0;
    }
    if (typeof value === "number") {
        return value;
    }
    return parseFloat(value);
}
function coerceDouble(value) {
    if (value === null || value === undefined) {
        return 0.0;
    }
    if (typeof value === "number") {
        return value;
    }
    return parseFloat(value);
}
//# sourceMappingURL=floats.js.map