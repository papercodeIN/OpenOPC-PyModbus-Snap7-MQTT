import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTDataSetWriterTransport } from "./dt_data_set_writer_transport";
import { EnumBrokerTransportQualityOfService } from "./enum_broker_transport_quality_of_service";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |BrokerDataSetWriterTransportDataType                        |
 * | isAbstract|false                                                       |
 */
export interface DTBrokerDataSetWriterTransport extends DTDataSetWriterTransport {
    queueName: UAString;
    resourceUri: UAString;
    authenticationProfileUri: UAString;
    requestedDeliveryGuarantee: EnumBrokerTransportQualityOfService;
    metaDataQueueName: UAString;
    metaDataUpdateTime: number;
}
export interface UDTBrokerDataSetWriterTransport extends ExtensionObject, DTBrokerDataSetWriterTransport {
}
