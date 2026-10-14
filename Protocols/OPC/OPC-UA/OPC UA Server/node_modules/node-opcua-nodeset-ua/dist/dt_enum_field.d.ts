import { LocalizedText } from "node-opcua-data-model";
import { Int64, UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTEnumValue } from "./dt_enum_value";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |EnumField                                                   |
 * | isAbstract|false                                                       |
 */
export interface DTEnumField extends DTEnumValue {
    value: Int64;
    displayName: LocalizedText;
    description: LocalizedText;
    name: UAString;
}
export interface UDTEnumField extends ExtensionObject, DTEnumField {
}
