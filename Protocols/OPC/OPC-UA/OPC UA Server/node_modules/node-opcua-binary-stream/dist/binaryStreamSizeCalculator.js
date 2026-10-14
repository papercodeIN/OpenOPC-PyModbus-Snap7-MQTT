"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryStreamSizeCalculator = void 0;
/**
 * @module node-opcua-binary-stream
 */
const node_opcua_assert_1 = require("node-opcua-assert");
const binaryStream_1 = require("./binaryStream");
/**
 * a BinaryStreamSizeCalculator can be used to quickly evaluate the required size
 * of a buffer by performing the same sequence of write operation.
 *
 * a BinaryStreamSizeCalculator has the same writeXXX methods as the BinaryStream stream
 * object.
 *
 * @class BinaryStreamSizeCalculator
 * @extends BinaryStream
 * @constructor
 *
 */
class BinaryStreamSizeCalculator {
    constructor() {
        this.length = 0;
    }
    rewind() {
        this.length = 0;
    }
    writeInt8(value) {
        this.length += 1;
    }
    writeUInt8(value) {
        this.length += 1;
    }
    writeInt16(value) {
        this.length += 2;
    }
    writeInteger(value) {
        this.length += 4;
    }
    writeUInt32(value) {
        this.length += 4;
    }
    writeUInt16(value) {
        this.length += 2;
    }
    writeFloat(value) {
        this.length += 4;
    }
    writeDouble(value) {
        this.length += 8;
    }
    writeArrayBuffer(arrayBuf, offset, byteLength) {
        offset = offset || 0;
        (0, node_opcua_assert_1.assert)(arrayBuf instanceof ArrayBuffer);
        this.length += byteLength || arrayBuf.byteLength;
    }
    writeByteStream(buf) {
        if (!buf) {
            this.writeUInt32(0);
        }
        else {
            this.writeUInt32(buf.length);
            this.length += buf.length;
        }
    }
    writeString(str) {
        if (str === undefined || str === null) {
            this.writeUInt32(-1);
            return;
        }
        const bufLength = (0, binaryStream_1.calculateByteLength)(str);
        this.writeUInt32(bufLength);
        this.length += bufLength;
    }
}
exports.BinaryStreamSizeCalculator = BinaryStreamSizeCalculator;
//# sourceMappingURL=binaryStreamSizeCalculator.js.map