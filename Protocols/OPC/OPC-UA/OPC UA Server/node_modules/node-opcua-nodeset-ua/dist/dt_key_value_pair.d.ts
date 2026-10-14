import { VariantOptions } from "node-opcua-variant";
import { QualifiedName } from "node-opcua-data-model";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |KeyValuePair                                                |
 * | isAbstract|false                                                       |
 */
export interface DTKeyValuePair extends DTStructure {
    key: QualifiedName;
    value: VariantOptions;
}
export interface UDTKeyValuePair extends ExtensionObject, DTKeyValuePair {
}
