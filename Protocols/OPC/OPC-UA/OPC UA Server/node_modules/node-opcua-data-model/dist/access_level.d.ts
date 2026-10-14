/**
 * @module node-opcua-data-model
 */
import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
export declare enum AccessLevelFlag {
    CurrentRead = 1,// bit 0 : Indicate if the current value is readable (0 means not readable, 1 means readable).
    CurrentWrite = 2,// bit 1 : Indicate if the current value is writable (0 means not writable, 1 means writable).
    HistoryRead = 4,// bit 2 : Indicates if the history of the value is readable (0 means not readable, 1 means readable).
    HistoryWrite = 8,// bit 3 : Indicates if the history of the value is writable (0 means not writable, 1 means writable).
    SemanticChange = 16,// bit 4 : Indicates if the Variable used as Property generates SemanticChangeEvents
    StatusWrite = 32,// bit 5 : Indicates if the current StatusCode of the value is writable (0 means not writable, 1 means writable).
    TimestampWrite = 64,// bit 6 : Indicates if the current SourceTimestamp of the value is writable (0 means not writable, 1 means writable).
    NONE = 2048,// Deprecated
    None = 2048
}
export type AccessLevelFlagString = "CurrentRead" | "CurrentWrite" | "HistoryRead" | "HistoryWrite" | "StatusWrite" | "TimestampWrite";
export declare function convertAccessLevelFlagToByte(accessLevel: AccessLevelFlag): number;
export declare function makeAccessLevelFlag(str: string | number | null): AccessLevelFlag;
export declare const coerceAccessLevelFlag: typeof makeAccessLevelFlag;
export declare function randomAccessLevel(): AccessLevelFlag;
export declare function _accessLevelFlagToString(accessLevelFlag: number): string[];
export declare function accessLevelFlagToString(accessLevelFlag: AccessLevelFlag): string;
export declare function decodeAccessLevelFlag(stream: BinaryStream): AccessLevelFlag;
export declare function encodeAccessLevelFlag(value: AccessLevelFlag, stream: OutputBinaryStream): void;
