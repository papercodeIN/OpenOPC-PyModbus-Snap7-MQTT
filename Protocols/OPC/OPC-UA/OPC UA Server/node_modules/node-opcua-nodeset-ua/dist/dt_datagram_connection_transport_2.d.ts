import { UInt32, UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTDatagramConnectionTransport } from "./dt_datagram_connection_transport";
import { DTNetworkAddress } from "./dt_network_address";
import { DTQos } from "./dt_qos";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |DatagramConnectionTransport2DataType                        |
 * | isAbstract|false                                                       |
 */
export interface DTDatagramConnectionTransport2 extends DTDatagramConnectionTransport {
    discoveryAddress: DTNetworkAddress;
    discoveryAnnounceRate: UInt32;
    discoveryMaxMessageSize: UInt32;
    qosCategory: UAString;
    datagramQos: DTQos[];
}
export interface UDTDatagramConnectionTransport2 extends ExtensionObject, DTDatagramConnectionTransport2 {
}
