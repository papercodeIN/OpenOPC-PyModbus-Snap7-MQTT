/***
 * @module node-opcua-basic-types
 */
import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
export declare function isValidString(value: unknown): boolean;
export declare function randomString(): string;
export declare function decodeString(stream: BinaryStream, value?: string | null): string | null;
export declare function encodeString(value: null | string, stream: OutputBinaryStream): void;
export type CharArray = string;
export type UAString = string | null;
export declare const decodeUAString: typeof decodeString;
export declare const encodeUAString: typeof encodeString;
