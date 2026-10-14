import { ExtensionObject } from "node-opcua-extension-object";
import { DTDataTypeDefinition } from "./dt_data_type_definition";
import { DTEnumField } from "./dt_enum_field";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |EnumDefinition                                              |
 * | isAbstract|false                                                       |
 */
export interface DTEnumDefinition extends DTDataTypeDefinition {
    fields: DTEnumField[];
}
export interface UDTEnumDefinition extends ExtensionObject, DTEnumDefinition {
}
