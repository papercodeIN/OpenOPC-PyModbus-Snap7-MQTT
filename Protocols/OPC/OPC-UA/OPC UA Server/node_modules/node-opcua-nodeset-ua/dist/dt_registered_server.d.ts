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
 * | name      |RegisteredServer                                            |
 * | isAbstract|false                                                       |
 */
export interface DTRegisteredServer extends DTStructure {
    serverUri: UAString;
    productUri: UAString;
    serverNames: LocalizedText[];
    serverType: EnumApplication;
    gatewayServerUri: UAString;
    discoveryUrls: UAString[];
    semaphoreFilePath: UAString;
    isOnline: boolean;
}
export interface UDTRegisteredServer extends ExtensionObject, DTRegisteredServer {
}
