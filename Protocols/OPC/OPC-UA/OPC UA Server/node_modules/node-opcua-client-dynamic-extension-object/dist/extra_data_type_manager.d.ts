import { ConstructorFunc, DataTypeFactory } from "node-opcua-factory";
import { NodeId } from "node-opcua-nodeid";
import { AnyConstructorFunc } from "node-opcua-schemas";
export declare class ExtraDataTypeManager {
    namespaceArray: string[];
    private dataTypeFactoryMapByNamespace;
    constructor();
    setNamespaceArray(namespaceArray: string[]): void;
    hasDataTypeFactory(namespaceIndex: number): boolean;
    registerDataTypeFactory(namespaceIndex: number, dataTypeFactory: DataTypeFactory): void;
    getDataTypeFactoryForNamespace(namespaceIndex: number): DataTypeFactory;
    getDataTypeFactory(namespaceIndex: number): DataTypeFactory;
    getExtensionObjectConstructorFromDataType(dataTypeNodeId: NodeId): AnyConstructorFunc;
    getExtensionObjectConstructorFromBinaryEncoding(binaryEncodingNodeId: NodeId): ConstructorFunc;
    toString(): string;
}
