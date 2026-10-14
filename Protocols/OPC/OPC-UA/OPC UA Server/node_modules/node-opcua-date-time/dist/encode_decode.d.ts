/**
 * @module node-opcua-date-time
 */
import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
export declare function isValidDateTime(value: any): value is Date;
export declare function randomDateTime(): Date;
/**
 *
 * @param date {Date}
 * @param picoseconds {null} {number of picoseconds to improve javascript date... }
 * @param stream {BinaryStream}
 */
export declare function encodeHighAccuracyDateTime(date: Date | null, picoseconds: number, stream: OutputBinaryStream): void;
export declare function encodeDateTime(date: Date | null, stream: OutputBinaryStream): void;
/**
 *
 * @param stream
 * @returns {Date}
 */
export declare function decodeDateTime(stream: BinaryStream, _value?: Date | null): Date;
export declare function decodeHighAccuracyDateTime(stream: BinaryStream, _value?: Date | null): [Date, number];
export declare function coerceDateTime(value: any): Date;
