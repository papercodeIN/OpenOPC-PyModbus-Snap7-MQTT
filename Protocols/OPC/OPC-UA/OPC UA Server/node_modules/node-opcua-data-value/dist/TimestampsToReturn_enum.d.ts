/**
 * @module node-opcua-data-value
 */
import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
/**
 * a enumeration that specifies how the source timestamp should be returned.
 */
export declare enum TimestampsToReturn {
    Source = 0,
    Server = 1,
    Both = 2,
    Neither = 3,
    Invalid = 4
}
/**
 * @private
 */
export declare const schemaTimestampsToReturn: {
    name: string;
    enumValues: typeof TimestampsToReturn;
};
/**
 * @private
 */
export declare function encodeTimestampsToReturn(value: TimestampsToReturn, stream: OutputBinaryStream): void;
/**
 * @private
 */
export declare function decodeTimestampsToReturn(stream: BinaryStream, value?: TimestampsToReturn): TimestampsToReturn;
/**
 * @private
 */
export declare const _enumerationTimestampsToReturn: import("node-opcua-enum").Enum;
export declare function coerceTimestampsToReturn(value: number | null | undefined): TimestampsToReturn;
