import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |PortableQualifiedName                                       |
 * | isAbstract|false                                                       |
 */
export interface DTPortableQualifiedName extends DTStructure {
    namespaceUri: UAString;
    name: UAString;
}
export interface UDTPortableQualifiedName extends ExtensionObject, DTPortableQualifiedName {
}
