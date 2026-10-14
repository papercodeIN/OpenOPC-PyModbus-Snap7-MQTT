import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |BuildInfo                                                   |
 * | isAbstract|false                                                       |
 */
export interface DTBuildInfo extends DTStructure {
    productUri: UAString;
    manufacturerName: UAString;
    productName: UAString;
    softwareVersion: UAString;
    buildNumber: UAString;
    buildDate: Date;
}
export interface UDTBuildInfo extends ExtensionObject, DTBuildInfo {
}
