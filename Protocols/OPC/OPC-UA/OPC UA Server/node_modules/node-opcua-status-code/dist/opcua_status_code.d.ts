/**
 * @module node-opcua-status-code
 */
import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
/**
 * StatusCode Special bits
 */
export declare const extraStatusCodeBits: {
    [key: string]: number;
};
/**
 * a particular StatusCode , with it's value , name and description
 */
export declare abstract class StatusCode {
    /**
     *  returns a status code that can be modified
     */
    static makeStatusCode(statusCode: StatusCode | string, optionalBits: string | number): StatusCode;
    /**
     * returns status code value in numerical form, including extra bits
     */
    abstract get value(): number;
    /***
     * status code by name, (including  extra bits in textual forms)
     */
    abstract get name(): string;
    /**
     * return the long description of the status code
     */
    abstract get description(): string;
    valueOf(): number;
    toString(): string;
    checkBit(mask: number): boolean;
    /** returns true if the overflow bit is set */
    get hasOverflowBit(): boolean;
    /** returns true if the semanticChange bit is set */
    get hasSemanticChangedBit(): boolean;
    /** returns true if the structureChange bit is set */
    get hasStructureChangedBit(): boolean;
    isNot(other: StatusCode): boolean;
    equals(other: StatusCode): boolean;
    toJSON(): any;
    toJSONFull(): any;
    isGood(): boolean;
    isNotGood(): boolean;
    isGoodish(): boolean;
    isBad(): boolean;
}
export declare class ConstantStatusCode extends StatusCode {
    private readonly _value;
    private readonly _description;
    private readonly _name;
    /**
     *
     * @param options
     * @param options
     * @param options.value
     * @param options.description
     * @param options.name
     *
     */
    constructor(options: {
        value: number;
        description: string;
        name: string;
    });
    get value(): number;
    get name(): string;
    get description(): string;
}
export declare function encodeStatusCode(statusCode: StatusCode | ConstantStatusCode, stream: OutputBinaryStream): void;
/**
 * returns the StatusCode corresponding to the provided value, if any
 * @note: if code is not known , then StatusCodes.Bad will be returned
 * @param code
 */
export declare function getStatusCodeFromCode(code: number): StatusCode;
export declare function decodeStatusCode(stream: BinaryStream, _value?: StatusCode): StatusCode;
export declare class ModifiableStatusCode extends StatusCode {
    private readonly _base;
    private _extraBits;
    constructor(options: {
        _base: StatusCode;
    });
    get value(): number;
    get name(): string;
    get description(): string;
    set(bit: string | number): void;
    unset(bit: string | number): void;
    private _getExtraName;
}
export { StatusCodes } from "./_generated_status_codes";
export declare function coerceStatusCode(statusCode: StatusCode | number | string | {
    value: number;
}): StatusCode;
