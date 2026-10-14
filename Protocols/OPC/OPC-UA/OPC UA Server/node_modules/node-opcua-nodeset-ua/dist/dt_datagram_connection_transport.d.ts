import { ExtensionObject } from "node-opcua-extension-object";
import { DTConnectionTransport } from "./dt_connection_transport";
import { DTNetworkAddress } from "./dt_network_address";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |DatagramConnectionTransportDataType                         |
 * | isAbstract|false                                                       |
 */
export interface DTDatagramConnectionTransport extends DTConnectionTransport {
    discoveryAddress: DTNetworkAddress;
}
export interface UDTDatagramConnectionTransport extends ExtensionObject, DTDatagramConnectionTransport {
}
