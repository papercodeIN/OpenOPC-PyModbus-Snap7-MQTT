import { NodeId, ExpandedNodeId } from "node-opcua-nodeid";
import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { EnumNodeClass } from "./enum_node_class";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |AddReferencesItem                                           |
 * | isAbstract|false                                                       |
 */
export interface DTAddReferencesItem extends DTStructure {
    sourceNodeId: NodeId;
    referenceTypeId: NodeId;
    isForward: boolean;
    targetServerUri: UAString;
    targetNodeId: ExpandedNodeId;
    targetNodeClass: EnumNodeClass;
}
export interface UDTAddReferencesItem extends ExtensionObject, DTAddReferencesItem {
}
