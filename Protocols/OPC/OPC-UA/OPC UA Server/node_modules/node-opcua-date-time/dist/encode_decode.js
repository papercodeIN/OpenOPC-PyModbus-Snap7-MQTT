"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidDateTime = isValidDateTime;
exports.randomDateTime = randomDateTime;
exports.encodeHighAccuracyDateTime = encodeHighAccuracyDateTime;
exports.encodeDateTime = encodeDateTime;
exports.decodeDateTime = decodeDateTime;
exports.decodeHighAccuracyDateTime = decodeHighAccuracyDateTime;
exports.coerceDateTime = coerceDateTime;
const date_time_1 = require("./date_time");
//  Date(year, month [, day, hours, minutes, seconds, ms])
function isValidDateTime(value) {
    return value instanceof Date;
}
/**
 * return a random integer value in the range of  min inclusive and  max exclusive

 * @param min
 * @param max
 * @return {*}
 * @private
 */
function getRandomInt(min, max) {
    // note : Math.random() returns a random number between 0 (inclusive) and 1 (exclusive):
    return Math.floor(Math.random() * (max - min)) + min;
}
function randomDateTime() {
    const r = getRandomInt;
    return new Date(1900 + r(0, 200), r(0, 11), r(0, 28), r(0, 24), r(0, 59), r(0, 59), r(0, 1000));
}
/**
 *
 * @param date {Date}
 * @param picoseconds {null} {number of picoseconds to improve javascript date... }
 * @param stream {BinaryStream}
 */
function encodeHighAccuracyDateTime(date, picoseconds, stream) {
    if (date === null) {
        stream.writeUInt32(0);
        stream.writeUInt32(picoseconds % 100000);
        return;
    }
    const hl = (0, date_time_1.bn_dateToHundredNanoSecondFrom1601)(date, picoseconds);
    const hi = hl[0];
    const lo = hl[1];
    stream.writeInteger(lo);
    stream.writeInteger(hi);
}
function encodeDateTime(date, stream) {
    encodeHighAccuracyDateTime(date, 0, stream);
}
/**
 *
 * @param stream
 * @returns {Date}
 */
function decodeDateTime(stream, _value) {
    return decodeHighAccuracyDateTime(stream, _value)[0];
}
function decodeHighAccuracyDateTime(stream, _value) {
    const lo = stream.readInteger();
    const hi = stream.readInteger();
    return (0, date_time_1.bn_hundredNanoSecondFrom1601ToDate)(hi, lo, 0, _value);
}
function coerceDateTime(value) {
    if (!value) {
        return (0, date_time_1.getMinOPCUADate)();
    }
    if (value instanceof Date) {
        return value;
    }
    return new Date(value);
}
//# sourceMappingURL=encode_decode.js.map