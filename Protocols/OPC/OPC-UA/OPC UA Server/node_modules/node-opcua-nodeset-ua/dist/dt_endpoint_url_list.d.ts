import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |EndpointUrlListDataType                                     |
 * | isAbstract|false                                                       |
 */
export interface DTEndpointUrlList extends DTStructure {
    endpointUrlList: UAString[];
}
export interface UDTEndpointUrlList extends ExtensionObject, DTEndpointUrlList {
}
