import { LocalizedText } from "node-opcua-data-model";
import { Int32, UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |EUInformation                                               |
 * | isAbstract|false                                                       |
 */
export interface EUInformation extends DTStructure {
    namespaceUri: UAString;
    unitId: Int32;
    displayName: LocalizedText;
    description: LocalizedText;
}
export interface UEUInformation extends ExtensionObject, EUInformation {
}
