import { NodeId } from "node-opcua-nodeid";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |SemanticChangeStructureDataType                             |
 * | isAbstract|false                                                       |
 */
export interface DTSemanticChangeStructure extends DTStructure {
    affected: NodeId;
    affectedType: NodeId;
}
export interface UDTSemanticChangeStructure extends ExtensionObject, DTSemanticChangeStructure {
}
