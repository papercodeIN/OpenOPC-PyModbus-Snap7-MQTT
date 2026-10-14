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
export declare class BinaryStreamSizeCalculator {
    length: number;
    constructor();
    rewind(): void;
    writeInt8(value: number): void;
    writeUInt8(value: number): void;
    writeInt16(value: number): void;
    writeInteger(value: number): void;
    writeUInt32(value: number): void;
    writeUInt16(value: number): void;
    writeFloat(value: number): void;
    writeDouble(value: number): void;
    writeArrayBuffer(arrayBuf: ArrayBuffer, offset: number, byteLength: number): void;
    writeByteStream(buf: Buffer): void;
    writeString(str: null | string): void;
}
