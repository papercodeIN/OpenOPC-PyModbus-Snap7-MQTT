import { VariantOptions } from "node-opcua-variant";
import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTDataTypeSchemaHeader } from "./dt_data_type_schema_header";
import { DTStructureDescription } from "./dt_structure_description";
import { DTEnumDescription } from "./dt_enum_description";
import { DTSimpleTypeDescription } from "./dt_simple_type_description";
import { DTKeyValuePair } from "./dt_key_value_pair";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |UABinaryFileDataType                                        |
 * | isAbstract|false                                                       |
 */
export interface DTUABinaryFile extends DTDataTypeSchemaHeader {
    namespaces: UAString[];
    structureDataTypes: DTStructureDescription[];
    enumDataTypes: DTEnumDescription[];
    simpleDataTypes: DTSimpleTypeDescription[];
    schemaLocation: UAString;
    fileHeader: DTKeyValuePair[];
    body: VariantOptions;
}
export interface UDTUABinaryFile extends ExtensionObject, DTUABinaryFile {
}
