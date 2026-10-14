import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
import { ExtensionObject } from "node-opcua-extension-object";
import { ConstructorFuncWithSchema, DataTypeFactory, IStructuredTypeSchema } from "node-opcua-factory";
import { ExpandedNodeId } from "node-opcua-nodeid";
export declare function getOrCreateConstructor(dataTypeName: string, dataTypeFactory: DataTypeFactory, encodingDefaultBinary?: ExpandedNodeId, encodingDefaultXml?: ExpandedNodeId): AnyConstructorFunc;
export declare class DynamicExtensionObject extends ExtensionObject {
    static schema: IStructuredTypeSchema;
    static possibleFields: string[];
    constructor(options: Record<string, unknown>, schema: IStructuredTypeSchema, dataTypeFactory: DataTypeFactory);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    get schema(): IStructuredTypeSchema;
    toJSON(): any;
}
interface AnyConstructable {
    schema: IStructuredTypeSchema;
    possibleFields: string[];
    new (options?: any, schema?: IStructuredTypeSchema, factory?: DataTypeFactory): any;
}
export type AnyConstructorFunc = AnyConstructable;
export declare function createDynamicObjectConstructor(schema: IStructuredTypeSchema, dataTypeFactory: DataTypeFactory): ConstructorFuncWithSchema;
export {};
