/**
 * @module node-opcua-binary-stream
 */
import "util";
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
export declare class BinaryStream {
    static maxByteStringLength: number;
    static maxStringLength: number;
    /**
     * the current position inside the buffer
     */
    length: number;
    /**
     * @internal
     */
    buffer: Buffer;
    constructor(data: undefined | Buffer | number);
    /**
     * set the cursor to the begining of the stream

     */
    rewind(): void;
    /**
     * write a single signed byte (8 bits) to the stream.
     * value must be in the range of [-127,128]
     * @param value the value to write
     */
    writeInt8(value: number): void;
    /**
     * write a single unsigned byte (8 bits) to the stream.
     * @param value  the value to write
     */
    writeUInt8(value: number): void;
    /**
     * write a single 16 bit signed integer to the stream.
     * @param  value  the value to write
     */
    writeInt16(value: number): void;
    /**
     * write a single 16 bit unsigned integer to the stream.
     * @param  value  the value to write
     */
    writeUInt16(value: number): void;
    /**
     * write a single 32 bit signed integer to the stream.
     * @param  value  the value to write
     */
    writeInteger(value: number): void;
    /**
     * write a single 32 bit unsigned integer to the stream.
     *
     * @param  value the value to write
     */
    writeUInt32(value: number): void;
    /**
     * write a single 32 bit floating number to the stream.
     * @param  value  the value to write
     */
    writeFloat(value: number): void;
    /**
     * write a single 64 bit floating number to the stream.
     * @param  value  the value to write
     */
    writeDouble(value: number): void;
    /**
     * @param arrayBuf a buffer or byte array write
     * @param offset   the offset position (default =0)
     * @param length   the number of byte to write
     */
    writeArrayBuffer(arrayBuf: ArrayBuffer, offset?: number, length?: number): void;
    /**
     * read a single signed byte  (8 bits) from the stream.
     * @return the value read
     */
    readByte(): number;
    readInt8(): number;
    /**
     * read a single unsigned byte (8 bits) from the stream.
     */
    readUInt8(): number;
    /**
     * read a single signed 16-bit integer from the stream.
     */
    readInt16(): number;
    /**
     * read a single unsigned 16-bit integer from the stream.
     */
    readUInt16(): number;
    /**
     * read a single signed 32-bit integer from the stream.
     */
    readInteger(): number;
    /**
     * read a single unsigned 32-bit integer from the stream.
     */
    readUInt32(): number;
    /**
     * read a single  32-bit floating point number from the stream.
     */
    readFloat(): number;
    /**
     * read a single 64-bit floating point number from the stream.
     */
    readDouble(): number;
    /**
     * write a byte stream to the stream.
     * The method writes the length of the byte array into the stream as a 32 bits integer before the byte stream.
     *
     * @param buf the buffer to write.
     */
    writeByteStream(buf: Buffer): void;
    writeString(value: null | string): void;
    /**

     * @param length
     */
    readArrayBuffer(length: number): Uint8Array;
    /**
     * read a byte stream to the stream.
     * The method reads the length of the byte array from the stream as a 32 bits integer
     * before reading the byte stream.
     *
     */
    readByteStream(): Buffer | null;
    readString(): string | null;
}
/**
 * @function calculateByteLength
 * calculate the size in bytes of a utf8 string
 * @param str {String}
 * @internal
 */
export declare function calculateByteLength(str: string): number;
