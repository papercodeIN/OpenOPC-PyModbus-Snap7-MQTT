/***
 * @module node-opcua-basic-types
 */
import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
export declare function isValidByteString(value: unknown): boolean;
/**
 * @public
 */
export type ByteString = Buffer;
export declare function randomByteString(value: unknown, len: number): ByteString;
export declare function encodeByteString(byteString: ByteString, stream: OutputBinaryStream): void;
export declare function decodeByteString(stream: BinaryStream, _value?: ByteString): ByteString;
export declare function coerceByteString(value: number[] | string | ByteString): ByteString;
