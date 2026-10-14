"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomInt = getRandomInt;
/***
 * @module node-opcua-basic-types
 */
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
//# sourceMappingURL=utils.js.map