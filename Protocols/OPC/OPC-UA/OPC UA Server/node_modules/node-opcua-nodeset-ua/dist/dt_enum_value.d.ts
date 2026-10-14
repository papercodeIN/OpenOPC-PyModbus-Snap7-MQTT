import { LocalizedText } from "node-opcua-data-model";
import { Int64 } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |EnumValueType                                               |
 * | isAbstract|false                                                       |
 */
export interface DTEnumValue extends DTStructure {
    value: Int64;
    displayName: LocalizedText;
    description: LocalizedText;
}
export interface UDTEnumValue extends ExtensionObject, DTEnumValue {
}
