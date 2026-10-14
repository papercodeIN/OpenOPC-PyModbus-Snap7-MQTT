/**
 * @module node-opcua-data-value
 */
import { Enum } from "node-opcua-enum";
/**
 * @private
 */
export declare enum DataValueEncodingByte {
    Value = 1,
    StatusCode = 2,
    SourceTimestamp = 4,
    ServerTimestamp = 8,
    SourcePicoseconds = 16,
    ServerPicoseconds = 32
}
/**
 * @private
 */
export declare const schemaDataValueEncodingByte: {
    name: string;
    enumValues: typeof DataValueEncodingByte;
};
/**
 * @private
 */
export declare const _enumerationDataValueEncodingByte: Enum;
