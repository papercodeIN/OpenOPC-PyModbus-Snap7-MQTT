import { DataTypeFactory, FieldCategory, IStructuredTypeSchema, TypeDefinition } from "node-opcua-factory";
import { NodeId } from "node-opcua-nodeid";
import { IBasicSessionAsync2 } from "node-opcua-pseudo-session";
import { DataTypeDefinition } from "node-opcua-types";
import { DataTypeAndEncodingId } from "node-opcua-schemas";
import { DataType } from "node-opcua-variant";
export interface CacheForFieldResolution {
    fieldTypeName: string;
    schema: TypeDefinition;
    category: FieldCategory;
    allowSubType?: boolean;
    dataType?: NodeId;
}
export type ResolveReject = [
    resolve: (value: any) => void,
    reject: (err: Error) => void
];
export interface ICache {
    superType?: Map<string, NodeId>;
    fieldResolution?: Map<string, CacheForFieldResolution>;
    dataTypes?: Map<string, DataType>;
    browseNameCache?: Map<string, string>;
    hitCount?: number;
    $$resolveStuff?: Map<string, ResolveReject[]>;
}
export interface IDataTypeDescriptionMini {
    encodings?: DataTypeAndEncodingId;
    isAbstract?: boolean;
}
export declare function convertDataTypeDefinitionToStructureTypeSchema(session: IBasicSessionAsync2, dataTypeNodeId: NodeId, name: string, definition: DataTypeDefinition, dataTypeDescription: IDataTypeDescriptionMini | null, dataTypeFactory: DataTypeFactory, isAbstract: boolean, cache: ICache): Promise<IStructuredTypeSchema>;
