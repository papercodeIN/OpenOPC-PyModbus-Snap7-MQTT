"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeUABoolean = exports.encodeUABoolean = void 0;
exports.isValidBoolean = isValidBoolean;
exports.randomBoolean = randomBoolean;
exports.encodeBoolean = encodeBoolean;
exports.decodeBoolean = decodeBoolean;
exports.coerceBoolean = coerceBoolean;
/***
 * @module node-opcua-basic-types
 */
const node_opcua_assert_1 = require("node-opcua-assert");
function isValidBoolean(value) {
    return typeof value === "boolean";
}
function randomBoolean() {
    return Math.random() > 0.5;
}
function encodeBoolean(value, stream) {
    (0, node_opcua_assert_1.assert)(isValidBoolean(value));
    stream.writeUInt8(value ? 1 : 0);
}
function decodeBoolean(stream, _value) {
    return !!stream.readUInt8();
}
const falseDetectionRegex = /^(?:f(?:alse)?|no?|0+)$/i;
function coerceBoolean(value) {
    if (value === null || value === undefined) {
        return false;
    }
    // http://stackoverflow.com/a/24744599/406458
    return !falseDetectionRegex.test(value.toString()) && !!value;
}
exports.encodeUABoolean = encodeBoolean;
exports.decodeUABoolean = decodeBoolean;
//# sourceMappingURL=boolean.js.map