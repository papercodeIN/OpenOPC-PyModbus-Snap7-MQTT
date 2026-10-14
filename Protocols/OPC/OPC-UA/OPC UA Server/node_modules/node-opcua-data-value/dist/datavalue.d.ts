import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
import { PreciseClock } from "node-opcua-date-time";
import { BaseUAObject, DecodeDebugOptions, IStructuredTypeSchema } from "node-opcua-factory";
import { StatusCode } from "node-opcua-status-code";
import { DataType, Variant, VariantOptions, VariantOptionsT, VariantT } from "node-opcua-variant";
import { DateTime, UInt16 } from "node-opcua-basic-types";
import { AttributeIds } from "node-opcua-data-model";
import { TimestampsToReturn } from "./TimestampsToReturn_enum";
type NumericalRange = any;
/**
 * @internal
 * @param dataValue
 * @param stream
 */
export declare function encodeDataValue(dataValue: DataValue, stream: OutputBinaryStream): void;
export declare function decodeDataValue(stream: BinaryStream, dataValue?: DataValue): DataValue;
export interface DataValueOptions {
    value?: VariantOptions;
    statusCode?: StatusCode;
    sourceTimestamp?: DateTime;
    sourcePicoseconds?: UInt16;
    serverTimestamp?: DateTime;
    serverPicoseconds?: UInt16;
}
export declare class DataValue extends BaseUAObject {
    /**
     * @internal
     */
    static possibleFields: string[];
    /**
     * @internal
     */
    static schema: IStructuredTypeSchema;
    value: Variant;
    statusCode: StatusCode;
    sourceTimestamp: DateTime;
    sourcePicoseconds: UInt16;
    serverTimestamp: DateTime;
    serverPicoseconds: UInt16;
    /**
     *
     */
    constructor(options?: DataValueOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    decodeDebug(stream: BinaryStream, options: DecodeDebugOptions): void;
    isValid(): boolean;
    toString(): string;
    clone(): DataValue;
}
export type DataValueLike = DataValueOptions | DataValue;
/**
 * apply the provided timestampsToReturn flag to the dataValue and return a cloned dataValue
 * with the specified timestamps.
 * @param dataValue
 * @param timestampsToReturn
 * @param attributeId
 * @returns
 */
export declare function apply_timestamps(dataValue: DataValue, timestampsToReturn: TimestampsToReturn, attributeId: AttributeIds): DataValue;
/**
 *
 * @param dataValue a DataValue
 * @param timestampsToReturn  a TimestampsToReturn flag to determine which timestamp should be kept
 * @param attributeId if attributeId is not Value, sourceTimestamp will forcefully be set to null
 * @param now an optional current clock to be used to set the serverTimestamp
 * @returns
 */
export declare function apply_timestamps_no_copy(dataValue: DataValue, timestampsToReturn: TimestampsToReturn, attributeId: AttributeIds, now?: PreciseClock): DataValue;
/**
 * return a deep copy of the dataValue by applying indexRange if necessary on  Array/Matrix
 * @param dataValue {DataValue}
 * @param indexRange {NumericalRange}
 * @return {DataValue}
 */
export declare function extractRange(dataValue: DataValue, indexRange: NumericalRange): DataValue;
/**
 * returns true if the sourceTimestamp and sourcePicoseconds of the two dataValue are different
 * @param dataValue1
 * @param dataValue2
 * @returns
 */
export declare function sourceTimestampHasChanged(dataValue1: DataValue, dataValue2: DataValue): boolean;
/**
 * returns true if the serverTimestamp and serverPicoseconds of the two dataValue are different
 * @param dataValue1
 * @param dataValue2
 * @returns
 */
export declare function serverTimestampHasChanged(dataValue1: DataValue, dataValue2: DataValue): boolean;
/**
 * return if the timestamps of the two dataValue are different
 *
 * - if timestampsToReturn is not specified, both sourceTimestamp are compared
 * - if timestampsToReturn is **Neither**, the function returns false
 * - if timestampsToReturn is **Both**, both sourceTimestamp and serverTimestamp are compared
 * - if timestampsToReturn is **Source**, only sourceTimestamp are compared
 * - if timestampsToReturn is **Server**, only serverTimestamp are compared
 *
 * @param dataValue1
 * @param dataValue2
 * @param timestampsToReturn
 * @returns
 */
export declare function timestampHasChanged(dataValue1: DataValue, dataValue2: DataValue, timestampsToReturn?: TimestampsToReturn): boolean;
/**
 * @param statusCode1
 * @param statusCode2
 * @returns true if the two statusCodes are identical, i.e have the same value
 */
export declare function sameStatusCode(statusCode1: StatusCode, statusCode2: StatusCode): boolean;
/**
 * @return {boolean} true if data values are identical
 */
export declare function sameDataValue(v1: DataValue, v2: DataValue, timestampsToReturn?: TimestampsToReturn): boolean;
/**
 * a DataValueOptions specialized for a specific DataType
 */
export interface DataValueOptionsT<T, DT extends DataType> extends DataValueOptions {
    value: VariantOptionsT<T, DT>;
}
/**
 * a DataValue specialized for a specific DataType
 */
export declare interface DataValueT<T, DT extends DataType> extends DataValue {
    value: VariantT<T, DT>;
}
export declare class DataValueT<T, DT extends DataType> extends DataValue {
}
export {};
