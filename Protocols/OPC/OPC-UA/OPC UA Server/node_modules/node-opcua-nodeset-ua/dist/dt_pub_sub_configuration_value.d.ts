import { VariantOptions } from "node-opcua-variant";
import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { DTPubSubConfigurationRef } from "./dt_pub_sub_configuration_ref";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |PubSubConfigurationValueDataType                            |
 * | isAbstract|false                                                       |
 */
export interface DTPubSubConfigurationValue extends DTStructure {
    configurationElement: DTPubSubConfigurationRef;
    name: UAString;
    identifier: VariantOptions;
}
export interface UDTPubSubConfigurationValue extends ExtensionObject, DTPubSubConfigurationValue {
}
