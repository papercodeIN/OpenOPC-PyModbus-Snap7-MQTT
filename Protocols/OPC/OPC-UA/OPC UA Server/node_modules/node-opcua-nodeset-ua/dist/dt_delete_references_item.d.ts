import { NodeId, ExpandedNodeId } from "node-opcua-nodeid";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |DeleteReferencesItem                                        |
 * | isAbstract|false                                                       |
 */
export interface DTDeleteReferencesItem extends DTStructure {
    sourceNodeId: NodeId;
    referenceTypeId: NodeId;
    isForward: boolean;
    targetNodeId: ExpandedNodeId;
    deleteBidirectional: boolean;
}
export interface UDTDeleteReferencesItem extends ExtensionObject, DTDeleteReferencesItem {
}
