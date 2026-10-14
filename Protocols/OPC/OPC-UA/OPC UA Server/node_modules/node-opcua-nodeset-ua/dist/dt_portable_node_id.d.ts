import { NodeId } from "node-opcua-nodeid";
import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |PortableNodeId                                              |
 * | isAbstract|false                                                       |
 */
export interface DTPortableNodeId extends DTStructure {
    namespaceUri: UAString;
    identifier: NodeId;
}
export interface UDTPortableNodeId extends ExtensionObject, DTPortableNodeId {
}
