import { NodeId } from "node-opcua-nodeid";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |DeleteNodesItem                                             |
 * | isAbstract|false                                                       |
 */
export interface DTDeleteNodesItem extends DTStructure {
    nodeId: NodeId;
    deleteTargetReferences: boolean;
}
export interface UDTDeleteNodesItem extends ExtensionObject, DTDeleteNodesItem {
}
