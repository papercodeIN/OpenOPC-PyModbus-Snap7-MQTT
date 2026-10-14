import { QualifiedName } from "node-opcua-data-model";
import { NodeId } from "node-opcua-nodeid";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTDataTypeDescription } from "./dt_data_type_description";
import { DTStructureDefinition } from "./dt_structure_definition";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |StructureDescription                                        |
 * | isAbstract|false                                                       |
 */
export interface DTStructureDescription extends DTDataTypeDescription {
    dataTypeId: NodeId;
    name: QualifiedName;
    structureDefinition: DTStructureDefinition;
}
export interface UDTStructureDescription extends ExtensionObject, DTStructureDescription {
}
