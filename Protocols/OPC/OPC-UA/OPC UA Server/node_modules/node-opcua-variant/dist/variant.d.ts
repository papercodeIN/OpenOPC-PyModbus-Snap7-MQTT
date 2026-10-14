import { BaseUAObject, DecodeDebugOptions } from "node-opcua-factory";
import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
import { DataType } from "./DataType_enum";
import { VariantArrayType } from "./VariantArrayType_enum";
declare function _coerceVariant(variantLike: VariantOptions | Variant): Variant;
export interface VariantOptions {
    dataType?: DataType | string;
    arrayType?: VariantArrayType | string;
    value?: any;
    dimensions?: number[] | null;
}
export interface VariantOptions2 {
    dataType: DataType;
    arrayType: VariantArrayType;
    value: any;
    dimensions: number[] | null;
}
export declare class Variant extends BaseUAObject {
    static maxTypedArrayLength: number;
    static maxArrayLength: number;
    static schema: import("node-opcua-factory").IStructuredTypeSchema;
    static coerce: typeof _coerceVariant;
    static computer_default_value: () => Variant;
    dataType: DataType;
    arrayType: VariantArrayType;
    value: any;
    dimensions: number[] | null;
    constructor(options?: VariantOptions | null);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    decodeDebug(stream: BinaryStream, options: DecodeDebugOptions): void;
    toString(): string;
    isValid(): boolean;
    clone(): Variant;
}
export type VariantLike = VariantOptions;
/***
 * @private
 */
export declare const VARIANT_ARRAY_MASK = 128;
/***
 * @private
 */
export declare const VARIANT_ARRAY_DIMENSIONS_MASK = 64;
/***
 * @private
 */
export declare const VARIANT_TYPE_MASK = 63;
/***
 * @private
 */
export declare function encodeVariant(variant: Variant | undefined | null, stream: OutputBinaryStream): void;
/***
 * @private
 */
export declare function decodeVariant(stream: BinaryStream, value?: Variant): Variant;
/***
 * @private
 */
export type BufferedArray2 = Float32Array | Float64Array | Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array;
export declare function coerceVariantType(dataType: DataType, value: undefined | any): any;
export declare function isValidVariant(arrayType: VariantArrayType, dataType: DataType, value: unknown, dimensions?: number[] | null): boolean;
export declare function buildVariantArray(dataType: DataType, nbElements: number, defaultValue: unknown): Float32Array | Float64Array | Uint32Array | Int32Array | Uint16Array | Int16Array | Uint8Array | Int8Array | Array<unknown>;
/***
 *  returns true if the two variant represent the same value
 * @param v1 the first variant to compare
 * @param v2  the variant to compare with
 */
export declare function sameVariant(v1: Variant, v2: Variant): boolean;
export interface VariantOptionsT<T, DT extends DataType> extends VariantOptions {
    dataType: DT;
    arrayType?: VariantArrayType | string;
    value: T;
    dimensions?: number[] | null;
}
export interface VariantT<T, DT extends DataType> extends Variant {
    value: T;
    dataType: DT;
}
export declare type VariantByteString = VariantT<Buffer, DataType.ByteString>;
export declare type VariantDouble = VariantT<number, DataType.Double>;
export {};
