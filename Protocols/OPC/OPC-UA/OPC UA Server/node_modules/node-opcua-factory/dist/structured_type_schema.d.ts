import { BinaryStream } from "node-opcua-binary-stream";
import { ExpandedNodeId, NodeId } from "node-opcua-nodeid";
import { TypeSchemaBase } from "./builtin_types";
import { BitField, FieldType, IStructuredTypeSchema, StructuredTypeOptions } from "./types";
import { DataTypeFactory } from "./datatype_factory";
export declare class StructuredTypeSchema extends TypeSchemaBase implements IStructuredTypeSchema {
    fields: FieldType[];
    dataTypeNodeId: NodeId;
    baseType: string;
    private _baseSchema;
    documentation?: string;
    isValid?: (options: any) => boolean;
    decodeDebug?: (stream: BinaryStream, options: any) => any;
    constructHook?: (options: any) => any;
    encodingDefaultBinary?: ExpandedNodeId;
    encodingDefaultXml?: ExpandedNodeId;
    encodingDefaultJson?: ExpandedNodeId;
    bitFields?: BitField[];
    private _dataTypeFactory;
    constructor(options: StructuredTypeOptions);
    getDataTypeFactory(): DataTypeFactory;
    getBaseSchema(): IStructuredTypeSchema | null;
    getPossibleFieldsLocal(): string[];
    toString(): string;
}
/**
 * extract a list of all possible fields for a schema
 * (by walking up the inheritance chain)
 *
 */
export declare function extractAllPossibleFields(schema: IStructuredTypeSchema): string[];
/**
 * check correctness of option fields against scheme
 *

 *
 */
export declare function check_options_correctness_against_schema(obj: any, schema: IStructuredTypeSchema, options: any): boolean;
export declare function buildStructuredType(schemaLight: Omit<StructuredTypeOptions, "dataTypeFactory">): IStructuredTypeSchema;
