/***
 * @module node-opcua-basic-types
 */
import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
export declare function isValidFloat(value: number): boolean;
export type Float = number;
export declare function randomFloat(): Float;
export declare function encodeFloat(value: Float, stream: OutputBinaryStream): void;
export declare function decodeFloat(stream: BinaryStream, value?: number): Float;
export declare function isValidDouble(value: number): boolean;
export type Double = number;
export declare function randomDouble(): Double;
export declare function encodeDouble(value: Double, stream: OutputBinaryStream): void;
export declare function decodeDouble(stream: BinaryStream, value?: number): Double;
export declare function coerceFloat(value: number | null | string): Float;
export declare function coerceDouble(value: number | null | string): Double;
