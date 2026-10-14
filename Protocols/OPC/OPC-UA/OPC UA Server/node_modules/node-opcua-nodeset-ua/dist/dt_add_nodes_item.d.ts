import { QualifiedName } from "node-opcua-data-model";
import { NodeId, ExpandedNodeId } from "node-opcua-nodeid";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { EnumNodeClass } from "./enum_node_class";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |AddNodesItem                                                |
 * | isAbstract|false                                                       |
 */
export interface DTAddNodesItem extends DTStructure {
    parentNodeId: ExpandedNodeId;
    referenceTypeId: NodeId;
    requestedNewNodeId: ExpandedNodeId;
    browseName: QualifiedName;
    ["$nodeClass"]: EnumNodeClass;
    nodeAttributes: DTStructure;
    typeDefinition: ExpandedNodeId;
}
export interface UDTAddNodesItem extends ExtensionObject, DTAddNodesItem {
}
