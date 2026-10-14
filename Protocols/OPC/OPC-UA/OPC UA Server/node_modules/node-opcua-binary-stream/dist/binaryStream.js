"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryStream = void 0;
exports.calculateByteLength = calculateByteLength;
/**
 * @module node-opcua-binary-stream
 */
require("util");
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_buffer_utils_1 = require("node-opcua-buffer-utils");
const MAXUINT32 = 4294967295; // 2**32 -1;
const performCheck = false;
/**
 * a BinaryStream can be use to perform sequential read or write
 * inside a buffer.
 * The BinaryStream maintains a cursor up to date as the caller
 * operates on the stream using the various read/write methods.
 * It uses the [Little Endian](http://en.wikipedia.org/wiki/Little_endian#Little-endian)
 * It uses the [Little Endian](http://en.wikipedia.org/wiki/Little_endian#Little-endian)
 * convention.
 *
 * data can either be:
 *
 * * a Buffer , in this case the BinaryStream operates on this Buffer
 * * null     , in this case a BinaryStream with 1024 bytes is created
 * * any data , in this case the object is converted into a binary buffer.
 *
 * example:
 *
 *    ``` javascript
 *    var stream = new BinaryStream(32)
 *    ```
 *
 
 */
class BinaryStream {
    constructor(data) {
        if (data === undefined) {
            this.buffer = (0, node_opcua_buffer_utils_1.createFastUninitializedBuffer)(1024);
        }
        else if (typeof data === "number") {
            this.buffer = (0, node_opcua_buffer_utils_1.createFastUninitializedBuffer)(data);
        }
        else {
            (0, node_opcua_assert_1.assert)(data instanceof Buffer);
            this.buffer = data;
        }
        this.length = 0;
    }
    /**
     * set the cursor to the begining of the stream

     */
    rewind() {
        this.length = 0;
    }
    /**
     * write a single signed byte (8 bits) to the stream.
     * value must be in the range of [-127,128]
     * @param value the value to write
     */
    writeInt8(value) {
        // istanbul ignore next
        if (performCheck) {
            (0, node_opcua_assert_1.assert)(this.buffer.length >= this.length + 1, "not enough space in buffer");
            (0, node_opcua_assert_1.assert)(value >= -128 && value < 128);
        }
        this.buffer.writeInt8(value, this.length);
        this.length += 1;
    }
    /**
     * write a single unsigned byte (8 bits) to the stream.
     * @param value  the value to write
     */
    writeUInt8(value) {
        // istanbul ignore next
        if (performCheck) {
            (0, node_opcua_assert_1.assert)(this.buffer.length >= this.length + 1, "not enough space in buffer");
            (0, node_opcua_assert_1.assert)(value >= 0 && value < 256, " writeUInt8 : out of bound ");
        }
        this.buffer.writeUInt8(value, this.length);
        this.length += 1;
    }
    /**
     * write a single 16 bit signed integer to the stream.
     * @param  value  the value to write
     */
    writeInt16(value) {
        // istanbul ignore next
        if (performCheck) {
            (0, node_opcua_assert_1.assert)(this.buffer.length >= this.length + 2, "not enough space in buffer");
        }
        this.buffer.writeInt16LE(value, this.length);
        this.length += 2;
    }
    /**
     * write a single 16 bit unsigned integer to the stream.
     * @param  value  the value to write
     */
    writeUInt16(value) {
        // istanbul ignore next
        if (performCheck) {
            (0, node_opcua_assert_1.assert)(this.buffer.length >= this.length + 2, "not enough space in buffer");
        }
        this.buffer.writeUInt16LE(value, this.length);
        this.length += 2;
    }
    /**
     * write a single 32 bit signed integer to the stream.
     * @param  value  the value to write
     */
    writeInteger(value) {
        // istanbul ignore next
        if (performCheck) {
            (0, node_opcua_assert_1.assert)(this.buffer.length >= this.length + 4, "not enough space in buffer");
        }
        this.buffer.writeInt32LE(value, this.length);
        this.length += 4;
    }
    /**
     * write a single 32 bit unsigned integer to the stream.
     *
     * @param  value the value to write
     */
    writeUInt32(value) {
        // istanbul ignore next
        if (performCheck) {
            (0, node_opcua_assert_1.assert)(this.buffer.length >= this.length + 4, "not enough space in buffer");
            (0, node_opcua_assert_1.assert)(isFinite(value));
            (0, node_opcua_assert_1.assert)(value >= 0 && value <= MAXUINT32);
        }
        this.buffer.writeUInt32LE(value, this.length);
        this.length += 4;
        /*
          assert(this.buffer[this.length - 4] === value % 256);
          assert(this.buffer[this.length - 3] === (value >>> 8) % 256);
          assert(this.buffer[this.length - 2] === (value >>> 16) % 256);
          assert(this.buffer[this.length - 1] === (value >>> 24) % 256);
          */
    }
    /**
     * write a single 32 bit floating number to the stream.
     * @param  value  the value to write
     */
    writeFloat(value) {
        // istanbul ignore next
        if (performCheck) {
            (0, node_opcua_assert_1.assert)(this.buffer.length >= this.length + 4, "not enough space in buffer");
        }
        this.buffer.writeFloatLE(value, this.length);
        this.length += 4;
    }
    /**
     * write a single 64 bit floating number to the stream.
     * @param  value  the value to write
     */
    writeDouble(value) {
        // istanbul ignore next
        if (performCheck) {
            (0, node_opcua_assert_1.assert)(this.buffer.length >= this.length + 8, "not enough space in buffer");
        }
        this.buffer.writeDoubleLE(value, this.length);
        this.length += 8;
    }
    /**
     * @param arrayBuf a buffer or byte array write
     * @param offset   the offset position (default =0)
     * @param length   the number of byte to write
     */
    writeArrayBuffer(arrayBuf, offset = 0, length = 0) {
        // istanbul ignore next
        if (performCheck) {
            (0, node_opcua_assert_1.assert)(arrayBuf instanceof ArrayBuffer);
        }
        const byteArr = new Uint8Array(arrayBuf);
        const n = (length || byteArr.length) + offset;
        for (let i = offset; i < n; i++) {
            this.buffer[this.length++] = byteArr[i];
        }
    }
    // writeArrayBuffer(arrayBuf, offset, length) {
    //     offset = offset || 0;
    //
    //     assert(arrayBuf instanceof ArrayBuffer);
    //     const byteArr = new Uint8Array(arrayBuf);
    //     length = length || byteArr.length;
    //     if (length === 0) {
    //         return;
    //     }
    //     this.length += my_memcpy(this.buffer, this.length, byteArr, offset, offset + length);
    // }
    /**
     * read a single signed byte  (8 bits) from the stream.
     * @return the value read
     */
    readByte() {
        const retVal = this.buffer.readInt8(this.length);
        this.length += 1;
        return retVal;
    }
    readInt8() {
        return this.readByte();
    }
    /**
     * read a single unsigned byte (8 bits) from the stream.
     */
    readUInt8() {
        // istanbul ignore next
        if (performCheck) {
            (0, node_opcua_assert_1.assert)(this.buffer.length >= this.length + 1);
        }
        const retVal = this.buffer.readUInt8(this.length);
        this.length += 1;
        return retVal;
    }
    /**
     * read a single signed 16-bit integer from the stream.
     */
    readInt16() {
        const retVal = this.buffer.readInt16LE(this.length);
        this.length += 2;
        return retVal;
    }
    /**
     * read a single unsigned 16-bit integer from the stream.
     */
    readUInt16() {
        const retVal = this.buffer.readUInt16LE(this.length);
        this.length += 2;
        return retVal;
    }
    /**
     * read a single signed 32-bit integer from the stream.
     */
    readInteger() {
        const retVal = this.buffer.readInt32LE(this.length);
        this.length += 4;
        return retVal;
    }
    /**
     * read a single unsigned 32-bit integer from the stream.
     */
    readUInt32() {
        const retVal = this.buffer.readUInt32LE(this.length);
        this.length += 4;
        return retVal;
    }
    /**
     * read a single  32-bit floating point number from the stream.
     */
    readFloat() {
        const retVal = this.buffer.readFloatLE(this.length);
        this.length += 4;
        return retVal;
    }
    /**
     * read a single 64-bit floating point number from the stream.
     */
    readDouble() {
        const retVal = this.buffer.readDoubleLE(this.length);
        this.length += 8;
        return retVal;
    }
    /**
     * write a byte stream to the stream.
     * The method writes the length of the byte array into the stream as a 32 bits integer before the byte stream.
     *
     * @param buf the buffer to write.
     */
    writeByteStream(buf) {
        if (!buf) {
            this.writeInteger(-1);
            return;
        }
        (0, node_opcua_assert_1.assert)(buf instanceof Buffer);
        this.writeInteger(buf.length);
        // make sure there is enough room in destination buffer
        const remainingBytes = this.buffer.length - this.length;
        /* istanbul ignore next */
        if (remainingBytes < buf.length) {
            throw new Error("BinaryStream.writeByteStream error : not enough bytes left in buffer :  bufferLength is " +
                buf.length +
                " but only " +
                remainingBytes +
                " left");
        }
        buf.copy(this.buffer, this.length, 0, buf.length);
        this.length += buf.length;
    }
    writeString(value) {
        if (value === undefined || value === null) {
            this.writeUInt32(0xffffffff);
            return;
        }
        const byteLength = calculateByteLength(value);
        this.writeInteger(byteLength);
        if (byteLength === 0) {
            return;
        }
        // make sure there is enough room in destination buffer
        const remainingBytes = this.buffer.length - this.length;
        /* istanbul ignore next */
        if (remainingBytes < byteLength) {
            throw new Error("BinaryStream.writeByteStream error : not enough bytes left in buffer :  bufferLength is " +
                byteLength +
                " but only " +
                remainingBytes +
                " left");
        }
        this.buffer.write(value, this.length);
        this.length += byteLength;
    }
    // readArrayBuffer(length: number): ArrayBuffer {
    //     assert(this.length + length <= this.buffer.length, "not enough bytes in buffer");
    //     const byteArr = new Uint8Array(new ArrayBuffer(length));
    //     my_memcpy(byteArr, 0, this.buffer, this.length, this.length + length);
    //     this.length += length;
    //     return byteArr;
    // }
    /**

     * @param length
     */
    readArrayBuffer(length) {
        if (length > BinaryStream.maxByteStringLength) {
            throw new Error(`maxStringLength(${BinaryStream.maxByteStringLength}) has been exceeded in BinaryStream.readArrayBuffer len=${length}`);
        }
        // istanbul ignore next
        if (performCheck) {
            (0, node_opcua_assert_1.assert)(this.length + length <= this.buffer.length, "not enough bytes in buffer");
        }
        const slice = this.buffer.subarray(this.length, this.length + length);
        // istanbul ignore next
        if (performCheck) {
            (0, node_opcua_assert_1.assert)(slice.length === length);
        }
        const byteArr = new Uint8Array(slice);
        // istanbul ignore next
        if (performCheck) {
            (0, node_opcua_assert_1.assert)(byteArr.length === length);
        }
        this.length += length;
        return byteArr;
    }
    /**
     * read a byte stream to the stream.
     * The method reads the length of the byte array from the stream as a 32 bits integer
     * before reading the byte stream.
     *
     */
    readByteStream() {
        const bufLen = this.readUInt32();
        if (bufLen === 0xffffffff) {
            return null;
        }
        if (bufLen === 0) {
            return zeroLengthBuffer;
        }
        if (bufLen > BinaryStream.maxByteStringLength) {
            throw new Error(`maxStringLength(${BinaryStream.maxByteStringLength}) has been exceeded in BinaryStream.readArrayBuffer len=${bufLen}`);
        }
        // check that there is enough space in the buffer
        const remainingBytes = this.buffer.length - this.length;
        // istanbul ignore next
        if (remainingBytes < bufLen) {
            throw new Error("BinaryStream.readByteStream error : not enough bytes left in buffer :  bufferLength is " +
                bufLen +
                " but only " +
                remainingBytes +
                " left");
        }
        // create a shared memory buffer ! for speed
        const buf = this.buffer.subarray(this.length, this.length + bufLen);
        this.length += bufLen;
        return buf;
    }
    readString() {
        const bufLen = this.readUInt32();
        if (bufLen === 0xffffffff) {
            return null;
        }
        if (bufLen === 0) {
            return "";
        }
        if (bufLen > BinaryStream.maxStringLength) {
            throw new Error(`maxStringLength(${BinaryStream.maxStringLength}) has been exceeded in BinaryStream.readString len=${bufLen}`);
        }
        // check that there is enough space in the buffer
        const remainingBytes = this.buffer.length - this.length;
        // istanbul ignore next
        if (remainingBytes < bufLen) {
            throw new Error("BinaryStream.readByteStream error : not enough bytes left in buffer :  bufferLength is " +
                bufLen +
                " but only " +
                remainingBytes +
                " left");
        }
        const str = this.buffer.toString("utf-8", this.length, this.length + bufLen);
        this.length += bufLen;
        return str;
    }
}
exports.BinaryStream = BinaryStream;
BinaryStream.maxByteStringLength = 16 * 1024 * 1024;
BinaryStream.maxStringLength = 16 * 1024 * 1024;
/**
 * @function calculateByteLength
 * calculate the size in bytes of a utf8 string
 * @param str {String}
 * @internal
 */
function calculateByteLength(str) {
    // returns the byte length of an utf8 string
    let s = str.length;
    for (let i = s - 1; i >= 0; i--) {
        const code = str.charCodeAt(i);
        if (code > 0x7f && code <= 0x7ff) {
            s++;
        }
        else if (code > 0x7ff && code <= 0xffff) {
            s += 2;
        }
        if (code >= 0xdc00 && code <= 0xdfff) {
            // trail surrogate
            i--;
        }
    }
    return s;
}
const zeroLengthBuffer = (0, node_opcua_buffer_utils_1.createFastUninitializedBuffer)(0);
//# sourceMappingURL=binaryStream.js.map