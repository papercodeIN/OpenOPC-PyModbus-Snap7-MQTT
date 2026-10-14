import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
import { BaseUAObject, IStructuredTypeSchema } from "node-opcua-factory";
import { NodeId } from "node-opcua-nodeid";
export declare class ExtensionObject extends BaseUAObject {
    static schema: IStructuredTypeSchema;
    constructor(options?: null | Record<string, any>);
}
export declare function encodeExtensionObject(object: BaseUAObject | null, stream: OutputBinaryStream): void;
export declare class OpaqueStructure extends ExtensionObject {
    nodeId: NodeId;
    buffer: Buffer;
    constructor(nodeId: NodeId, buffer: Buffer);
    toString(): string;
}
export declare function decodeExtensionObject(stream: BinaryStream, _value?: ExtensionObject | null): ExtensionObject | null;
