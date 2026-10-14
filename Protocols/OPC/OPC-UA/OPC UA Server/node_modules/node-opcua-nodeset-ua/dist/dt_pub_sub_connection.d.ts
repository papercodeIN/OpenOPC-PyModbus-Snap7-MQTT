import { VariantOptions } from "node-opcua-variant";
import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { DTNetworkAddress } from "./dt_network_address";
import { DTKeyValuePair } from "./dt_key_value_pair";
import { DTConnectionTransport } from "./dt_connection_transport";
import { DTWriterGroup } from "./dt_writer_group";
import { DTReaderGroup } from "./dt_reader_group";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |PubSubConnectionDataType                                    |
 * | isAbstract|false                                                       |
 */
export interface DTPubSubConnection extends DTStructure {
    name: UAString;
    enabled: boolean;
    publisherId: VariantOptions;
    transportProfileUri: UAString;
    address: DTNetworkAddress;
    connectionProperties: DTKeyValuePair[];
    transportSettings: DTConnectionTransport;
    writerGroups: DTWriterGroup[];
    readerGroups: DTReaderGroup[];
}
export interface UDTPubSubConnection extends ExtensionObject, DTPubSubConnection {
}
