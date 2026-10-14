import { QualifiedName } from "node-opcua-data-model";
import { NodeId } from "node-opcua-nodeid";
import { Byte } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTDataTypeDescription } from "./dt_data_type_description";
import { DTEnumDefinition } from "./dt_enum_definition";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |EnumDescription                                             |
 * | isAbstract|false                                                       |
 */
export interface DTEnumDescription extends DTDataTypeDescription {
    dataTypeId: NodeId;
    name: QualifiedName;
    enumDefinition: DTEnumDefinition;
    builtInType: Byte;
}
export interface UDTEnumDescription extends ExtensionObject, DTEnumDescription {
}
