"use strict";
/***
 * @module node-opcua-basic-types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeUAString = exports.decodeUAString = void 0;
exports.isValidString = isValidString;
exports.randomString = randomString;
exports.decodeString = decodeString;
exports.encodeString = encodeString;
const utils_1 = require("./utils");
function isValidString(value) {
    return typeof value === "string";
}
function randomString() {
    const nbCar = (0, utils_1.getRandomInt)(1, 20);
    const cars = [];
    for (let i = 0; i < nbCar; i++) {
        cars.push(String.fromCharCode(65 + (0, utils_1.getRandomInt)(0, 26)));
    }
    return cars.join("");
}
function decodeString(stream, value) {
    return stream.readString();
}
function encodeString(value, stream) {
    stream.writeString(value);
}
exports.decodeUAString = decodeString;
exports.encodeUAString = encodeString;
//# sourceMappingURL=string.js.map