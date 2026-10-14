"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeArray = encodeArray;
exports.decodeArray = decodeArray;
/***
 * @module node-opcua-basic-types
 */
const node_opcua_assert_1 = require("node-opcua-assert");
/**

 * @param arr     the array to encode.
 * @param stream  the stream.
 * @param encodeElementFunc   The  function to encode a single array element.
 */
function encodeArray(arr, stream, encodeElementFunc) {
    if (arr === null) {
        stream.writeUInt32(0xffffffff);
        return;
    }
    (0, node_opcua_assert_1.assert)(Array.isArray(arr));
    stream.writeUInt32(arr.length);
    for (const value of arr) {
        encodeElementFunc(value, stream);
    }
}
/**
 * decode an array from a BinaryStream
 * @param stream  the stream.
 * @param decodeElementFunc   The  function to decode a single array element.
 *                            This function returns the element decoded from the stream
 * @returns an array of elements or nul
 */
function decodeArray(stream, decodeElementFunc) {
    const length = stream.readUInt32();
    if (length === 0xffffffff) {
        return null;
    }
    const arr = [];
    for (let i = 0; i < length; i++) {
        arr.push(decodeElementFunc(stream));
    }
    return arr;
}
//# sourceMappingURL=array.js.map