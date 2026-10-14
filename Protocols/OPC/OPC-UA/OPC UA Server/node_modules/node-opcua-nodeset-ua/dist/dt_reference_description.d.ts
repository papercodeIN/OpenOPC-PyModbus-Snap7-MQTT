import { NodeId, ExpandedNodeId } from "node-opcua-nodeid";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |ReferenceDescriptionDataType                                |
 * | isAbstract|false                                                       |
 */
export interface DTReferenceDescription extends DTStructure {
    sourceNode: NodeId;
    referenceType: NodeId;
    isForward: boolean;
    targetNode: ExpandedNodeId;
}
export interface UDTReferenceDescription extends ExtensionObject, DTReferenceDescription {
}
