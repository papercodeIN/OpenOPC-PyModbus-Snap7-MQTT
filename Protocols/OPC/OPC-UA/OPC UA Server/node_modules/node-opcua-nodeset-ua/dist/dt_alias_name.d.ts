import { QualifiedName } from "node-opcua-data-model";
import { ExpandedNodeId } from "node-opcua-nodeid";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |AliasNameDataType                                           |
 * | isAbstract|false                                                       |
 */
export interface DTAliasName extends DTStructure {
    aliasName: QualifiedName;
    referencedNodes: ExpandedNodeId[];
}
export interface UDTAliasName extends ExtensionObject, DTAliasName {
}
