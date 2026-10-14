import { UInt32, UInt16 } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |PubSubConfigurationRefDataType                              |
 * | isAbstract|false                                                       |
 */
export interface DTPubSubConfigurationRef extends DTStructure {
    configurationMask: UInt32;
    elementIndex: UInt16;
    connectionIndex: UInt16;
    groupIndex: UInt16;
}
export interface UDTPubSubConfigurationRef extends ExtensionObject, DTPubSubConfigurationRef {
}
