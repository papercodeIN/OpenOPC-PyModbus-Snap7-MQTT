/**
 * @module node-opcua-schemas
 */
import { DataTypeFactory } from "node-opcua-factory";
import { NodeId } from "node-opcua-nodeid";
export interface EnumeratedType {
    name: string;
    documentation?: string;
    enumeratedValues: any;
    lengthInBits?: number;
}
export interface StructureTypeRaw {
    name: string;
    baseType: string;
    base?: StructureTypeRaw;
    fields: any[];
}
export interface ITypeDictionary {
    targetNamespace: string;
    defaultByteOrder: string;
    imports: string[];
}
export declare class InternalTypeDictionary implements ITypeDictionary {
    targetNamespace: string;
    defaultByteOrder: string;
    imports: string[];
    private structuredTypesRaw;
    private enumeratedTypesRaw;
    _namespaces: Record<string, string>;
    constructor();
    addEnumeration(name: string, e: EnumeratedType): void;
    getEnumerations(): EnumeratedType[];
    getStructures(): StructureTypeRaw[];
    addStructureRaw(structuredType: StructureTypeRaw): void;
    getStructuredTypesRawByName(name: string): StructureTypeRaw;
}
export interface DataTypeAndEncodingId {
    dataTypeNodeId: NodeId;
    binaryEncodingNodeId: NodeId;
    xmlEncodingNodeId: NodeId;
    jsonEncodingNodeId: NodeId;
}
export interface MapDataTypeAndEncodingIdProvider {
    getDataTypeAndEncodingId(key: string): DataTypeAndEncodingId | null;
}
export declare function parseBinaryXSD(xmlString: string, idProvider: MapDataTypeAndEncodingIdProvider, dataTypeFactory: DataTypeFactory): Promise<void>;
