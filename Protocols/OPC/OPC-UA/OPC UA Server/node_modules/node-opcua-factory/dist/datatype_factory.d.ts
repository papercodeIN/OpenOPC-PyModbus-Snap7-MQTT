import { ExpandedNodeId, NodeId } from "node-opcua-nodeid";
import { EnumerationDefinitionSchema } from "./enumerations";
import { CommonInterface, IStructuredTypeSchema, ConstructorFuncWithSchema, ConstructorFunc, IBaseUAObject } from "./types";
export interface StructureInfo {
    constructor: ConstructorFuncWithSchema | null;
    schema: IStructuredTypeSchema;
}
export declare class DataTypeFactory {
    defaultByteOrder: string;
    targetNamespace: string;
    imports: string[];
    private _structureInfoByName;
    private _structureInfoByDataTypeMap;
    private _structureInfoByEncodingMap;
    private _enumerations;
    private baseDataFactories;
    constructor(baseDataFactories: DataTypeFactory[]);
    getStructureIterator(): IterableIterator<StructureInfo>;
    getEnumIterator(): IterableIterator<EnumerationDefinitionSchema>;
    repairBaseDataFactories(baseDataFactories: DataTypeFactory[]): void;
    hasBuiltInType(name: string): boolean;
    getBuiltInType(name: string): CommonInterface;
    getBuiltInTypeByDataType(nodeId: NodeId): CommonInterface;
    registerEnumeration(enumeration: EnumerationDefinitionSchema): void;
    hasEnumeration(enumName: string): boolean;
    getEnumeration(enumName: string): EnumerationDefinitionSchema | null;
    findStructureInfoForDataType(dataTypeNodeId: NodeId): StructureInfo;
    getStructureInfoForDataType(dataTypeNodeId: NodeId): StructureInfo | null;
    structuredTypesNames(): IterableIterator<string>;
    enumerations(): IterableIterator<string>;
    getStructureInfoByTypeName(typeName: string): StructureInfo;
    hasStructureByTypeName(typeName: string): boolean;
    getStructuredTypeSchema(typeName: string): IStructuredTypeSchema;
    dump(): void;
    registerAbstractStructure(dataTypeNodeId: NodeId, className: string, schema: IStructuredTypeSchema): void;
    registerClassDefinition(dataTypeNodeId: NodeId, className: string, classConstructor: ConstructorFuncWithSchema): void;
    getConstructor(binaryEncodingNodeId: NodeId): ConstructorFunc | null;
    hasConstructor(binaryEncodingNodeId: NodeId): boolean;
    constructObject(binaryEncodingNodeId: NodeId): IBaseUAObject;
    associateWithBinaryEncoding(className: string, expandedNodeId: ExpandedNodeId): void;
    toString(): string;
    private _registerFactory;
}
