import { QualifiedName } from "node-opcua-data-model";
import { NodeId } from "node-opcua-nodeid";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |DataTypeDescription                                         |
 * | isAbstract|true                                                        |
 */
export interface DTDataTypeDescription extends DTStructure {
    dataTypeId: NodeId;
    name: QualifiedName;
}
export interface UDTDataTypeDescription extends ExtensionObject, DTDataTypeDescription {
}
