import { LocalizedText } from "node-opcua-data-model";
import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { EnumApplication } from "./enum_application";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |ApplicationDescription                                      |
 * | isAbstract|false                                                       |
 */
export interface DTApplicationDescription extends DTStructure {
    applicationUri: UAString;
    productUri: UAString;
    applicationName: LocalizedText;
    applicationType: EnumApplication;
    gatewayServerUri: UAString;
    discoveryProfileUri: UAString;
    discoveryUrls: UAString[];
}
export interface UDTApplicationDescription extends ExtensionObject, DTApplicationDescription {
}
