import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
import { Func1, IStructuredTypeSchema, IBaseUAObject, DecodeDebugOptions } from "./types";
export interface BaseUAObject extends IBaseUAObject {
    schema: IStructuredTypeSchema;
}
/**
 * base class for all OPCUA objects
 */
export declare class BaseUAObject {
    constructor();
    /**
     * Encode the object to the binary stream.
     */
    encode(stream: OutputBinaryStream): void;
    /**
     * Decode the object from the binary stream.
     */
    decode(stream: BinaryStream): void;
    /**
     * Calculate the required size to store this object in a binary stream.
     */
    binaryStoreSize(): number;
    /**
     */
    toString(...args: any[]): string;
    /**
     *
     * verify that all object attributes values are valid according to schema
     */
    isValid(): boolean;
    /**
     *
     */
    decodeDebug(stream: BinaryStream, options: DecodeDebugOptions): void;
    explore(): string;
    applyOnAllFields<T>(func: Func1<T>, data: T): void;
    toJSON(): any;
    clone(): any;
}
