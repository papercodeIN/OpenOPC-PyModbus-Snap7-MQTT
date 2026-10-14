import { UInt32, Byte, UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTDatagramWriterGroupTransport } from "./dt_datagram_writer_group_transport";
import { DTNetworkAddress } from "./dt_network_address";
import { DTTransmitQos } from "./dt_transmit_qos";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |DatagramWriterGroupTransport2DataType                       |
 * | isAbstract|false                                                       |
 */
export interface DTDatagramWriterGroupTransport2 extends DTDatagramWriterGroupTransport {
    messageRepeatCount: Byte;
    messageRepeatDelay: number;
    address: DTNetworkAddress;
    qosCategory: UAString;
    datagramQos: DTTransmitQos[];
    discoveryAnnounceRate: UInt32;
    topic: UAString;
}
export interface UDTDatagramWriterGroupTransport2 extends ExtensionObject, DTDatagramWriterGroupTransport2 {
}
