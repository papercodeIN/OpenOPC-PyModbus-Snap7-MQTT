import { NodeId } from "node-opcua-nodeid";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTDataTypeDefinition } from "./dt_data_type_definition";
import { EnumStructure } from "./enum_structure";
import { DTStructureField } from "./dt_structure_field";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |StructureDefinition                                         |
 * | isAbstract|false                                                       |
 */
export interface DTStructureDefinition extends DTDataTypeDefinition {
    defaultEncodingId: NodeId;
    baseDataType: NodeId;
    structureType: EnumStructure;
    fields: DTStructureField[];
}
export interface UDTStructureDefinition extends ExtensionObject, DTStructureDefinition {
}
