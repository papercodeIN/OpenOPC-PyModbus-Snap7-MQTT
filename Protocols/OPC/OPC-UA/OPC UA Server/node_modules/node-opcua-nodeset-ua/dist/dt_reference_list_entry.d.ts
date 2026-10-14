import { NodeId, ExpandedNodeId } from "node-opcua-nodeid";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |ReferenceListEntryDataType                                  |
 * | isAbstract|false                                                       |
 */
export interface DTReferenceListEntry extends DTStructure {
    referenceType: NodeId;
    isForward: boolean;
    targetNode: ExpandedNodeId;
}
export interface UDTReferenceListEntry extends ExtensionObject, DTReferenceListEntry {
}
