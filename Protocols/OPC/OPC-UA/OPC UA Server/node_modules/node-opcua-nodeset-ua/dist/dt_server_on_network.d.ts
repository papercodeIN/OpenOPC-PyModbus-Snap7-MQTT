import { UInt32, UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |ServerOnNetwork                                             |
 * | isAbstract|false                                                       |
 */
export interface DTServerOnNetwork extends DTStructure {
    recordId: UInt32;
    serverName: UAString;
    discoveryUrl: UAString;
    serverCapabilities: UAString[];
}
export interface UDTServerOnNetwork extends ExtensionObject, DTServerOnNetwork {
}
