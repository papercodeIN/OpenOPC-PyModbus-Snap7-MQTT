import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { DTStructureDescription } from "./dt_structure_description";
import { DTEnumDescription } from "./dt_enum_description";
import { DTSimpleTypeDescription } from "./dt_simple_type_description";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |DataTypeSchemaHeader                                        |
 * | isAbstract|true                                                        |
 */
export interface DTDataTypeSchemaHeader extends DTStructure {
    namespaces: UAString[];
    structureDataTypes: DTStructureDescription[];
    enumDataTypes: DTEnumDescription[];
    simpleDataTypes: DTSimpleTypeDescription[];
}
export interface UDTDataTypeSchemaHeader extends ExtensionObject, DTDataTypeSchemaHeader {
}
