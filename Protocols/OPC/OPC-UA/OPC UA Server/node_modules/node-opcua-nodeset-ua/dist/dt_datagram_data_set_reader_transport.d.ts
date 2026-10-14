import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTDataSetReaderTransport } from "./dt_data_set_reader_transport";
import { DTNetworkAddress } from "./dt_network_address";
import { DTReceiveQos } from "./dt_receive_qos";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |DatagramDataSetReaderTransportDataType                      |
 * | isAbstract|false                                                       |
 */
export interface DTDatagramDataSetReaderTransport extends DTDataSetReaderTransport {
    address: DTNetworkAddress;
    qosCategory: UAString;
    datagramQos: DTReceiveQos[];
    topic: UAString;
}
export interface UDTDatagramDataSetReaderTransport extends ExtensionObject, DTDatagramDataSetReaderTransport {
}
