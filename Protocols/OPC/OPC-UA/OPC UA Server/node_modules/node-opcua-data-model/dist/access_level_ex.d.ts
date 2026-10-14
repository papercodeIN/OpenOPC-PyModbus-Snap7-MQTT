import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
/**
 * from https://reference.opcfoundation.org/v104/Core/docs/Part3/8.58/:
 *
 * This is a subtype of the UInt32 DataType with the OptionSetValues Property defined.
 * It is used to indicate how the Value of a Variable can be accessed (read/write),
 * if it contains current and/or historic data and its atomicity.
 * The AccessLevelExType DataType is an extended version of the AccessLevelType DataType and
 * as such contains the 8 bits of the AccessLevelType as the first 8 bits.
 * The NonatomicRead, and NonatomicWrite Fields represent the atomicity of a Variable.
 *  In general Atomicity is expected of OPC UA read and write operations.
 * These Fields are used by systems, in particular hard-realtime controllers, which can not ensure atomicity.
 */
export declare enum AccessLevelExFlag {
    CurrentRead = 1,// bit 0 : Indicate if the current value is readable (0 means not readable, 1 means readable).
    CurrentWrite = 2,// bit 1 : Indicate if the current value is writable (0 means not writable, 1 means writable).
    HistoryRead = 4,// bit 2 : Indicates if the history of the value is readable (0 means not readable, 1 means readable).
    HistoryWrite = 8,// bit 3 : Indicates if the history of the value is writable (0 means not writable, 1 means writable).
    SemanticChange = 16,// bit 4 : Indicates if the Variable used as Property generates SemanticChangeEvents
    StatusWrite = 32,// bit 5 : Indicates if the current StatusCode of the value is writable (0 means not writable, 1 means writable).
    TimestampWrite = 64,// bit 6 : Indicates if the current SourceTimestamp of the value is writable (0 means not writable, 1 means writable).
    NonatomicRead = 128,// bit 8	 Indicates non-atomicity for Read access (0 means that atomicity is assured).
    NonatomicWrite = 256,// bit 9  Indicates non-atomicity for Write access (0 means that atomicity is assured).
    WriteFullArrayOnly = 512,// bit 10 Indicates if Write of IndexRange is supported.(0 means Write of IndexRange is supported)
    NoSubDataTypes = 1024,// bit 11 Indicates if the Variable doesn’t allow its DataType to be subtyped (0 means the Variable accepts the defined DataType and subtypes of that DataType)
    NonVolatile = 2048,// bit 12 Indicates if the Variable is non-volatile (0 means it is volatile or not known to be, 1 means non-volatile
    Constant = 4096,// bit 13   Indicates if the Value of the Variable can be considered constant (0 means the Value is not constant, 1 means the Value is constant)
    None = 2048
}
export declare function makeAccessLevelExFlag(str: string | number | null): AccessLevelExFlag;
export declare function randomAccessLevelEx(): AccessLevelExFlag;
export declare function accessLevelExFlagToString(accessLevelFlag: AccessLevelExFlag): string;
export declare function encodeAccessLevelExFlag(value: AccessLevelExFlag, stream: OutputBinaryStream): void;
export declare function decodeAccessLevelExFlag(stream: BinaryStream): AccessLevelExFlag;
