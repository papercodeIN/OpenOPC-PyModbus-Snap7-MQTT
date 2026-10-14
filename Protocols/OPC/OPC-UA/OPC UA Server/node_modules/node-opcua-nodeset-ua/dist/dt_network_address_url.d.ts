import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTNetworkAddress } from "./dt_network_address";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |NetworkAddressUrlDataType                                   |
 * | isAbstract|false                                                       |
 */
export interface DTNetworkAddressUrl extends DTNetworkAddress {
    networkInterface: UAString;
    url: UAString;
}
export interface UDTNetworkAddressUrl extends ExtensionObject, DTNetworkAddressUrl {
}
