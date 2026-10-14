import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { DTEndpointUrlList } from "./dt_endpoint_url_list";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |NetworkGroupDataType                                        |
 * | isAbstract|false                                                       |
 */
export interface DTNetworkGroup extends DTStructure {
    serverUri: UAString;
    networkPaths: DTEndpointUrlList[];
}
export interface UDTNetworkGroup extends ExtensionObject, DTNetworkGroup {
}
