import { BaseUAObject, IStructuredTypeSchema } from "node-opcua-factory";
import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
import { ExpandedNodeId } from "node-opcua-nodeid";
import { UAString, UInt16 } from "node-opcua-basic-types";
export declare const schemaQualifiedName: IStructuredTypeSchema;
export interface QualifiedNameOptions {
    namespaceIndex?: UInt16;
    name?: UAString;
}
export declare class QualifiedName extends BaseUAObject {
    static schema: IStructuredTypeSchema;
    static possibleFields: string[];
    static encodingDefaultBinary: ExpandedNodeId;
    static encodingDefaultXml: ExpandedNodeId;
    namespaceIndex: UInt16;
    name: UAString;
    constructor(options?: QualifiedNameOptions | null | string);
    /**
     * encode the object into a binary stream
     */
    encode(stream: OutputBinaryStream): void;
    /**
     * decode the object from a binary stream
     */
    decode(stream: BinaryStream): void;
    toString(): string;
    isEmpty(): boolean;
    equals(other: QualifiedName): boolean;
}
export type QualifiedNameLike = QualifiedNameOptions | string;
/**

 * @param value {String}
 * @return {{namespaceIndex: Number, name: String}}
 *
 * @example
 *
 *  stringToQualifiedName("Hello")   => {namespaceIndex: 0, name: "Hello"}
 *  stringToQualifiedName("3:Hello") => {namespaceIndex: 3, name: "Hello"}
 */
export declare function stringToQualifiedName(value: string): QualifiedName;
export declare function coerceQualifiedName(value: null): null;
export declare function coerceQualifiedName(value: QualifiedNameLike): QualifiedName;
export declare function coerceQualifiedName(value: string): QualifiedName;
export declare function encodeQualifiedName(value: QualifiedName, stream: OutputBinaryStream): void;
export declare function decodeQualifiedName(stream: BinaryStream, value?: QualifiedName): QualifiedName;
