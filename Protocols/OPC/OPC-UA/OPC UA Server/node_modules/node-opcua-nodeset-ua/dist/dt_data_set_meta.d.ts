import { LocalizedText } from "node-opcua-data-model";
import { UAString, Guid } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTDataTypeSchemaHeader } from "./dt_data_type_schema_header";
import { DTStructureDescription } from "./dt_structure_description";
import { DTEnumDescription } from "./dt_enum_description";
import { DTSimpleTypeDescription } from "./dt_simple_type_description";
import { DTFieldMetaData } from "./dt_field_meta_data";
import { DTConfigurationVersion } from "./dt_configuration_version";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |DataSetMetaDataType                                         |
 * | isAbstract|false                                                       |
 */
export interface DTDataSetMeta extends DTDataTypeSchemaHeader {
    namespaces: UAString[];
    structureDataTypes: DTStructureDescription[];
    enumDataTypes: DTEnumDescription[];
    simpleDataTypes: DTSimpleTypeDescription[];
    name: UAString;
    description: LocalizedText;
    fields: DTFieldMetaData[];
    dataSetClassId: Guid;
    configurationVersion: DTConfigurationVersion;
}
export interface UDTDataSetMeta extends ExtensionObject, DTDataSetMeta {
}
