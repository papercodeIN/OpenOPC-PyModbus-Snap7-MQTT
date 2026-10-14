import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTDataSetReaderTransport } from "./dt_data_set_reader_transport";
import { EnumBrokerTransportQualityOfService } from "./enum_broker_transport_quality_of_service";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |BrokerDataSetReaderTransportDataType                        |
 * | isAbstract|false                                                       |
 */
export interface DTBrokerDataSetReaderTransport extends DTDataSetReaderTransport {
    queueName: UAString;
    resourceUri: UAString;
    authenticationProfileUri: UAString;
    requestedDeliveryGuarantee: EnumBrokerTransportQualityOfService;
    metaDataQueueName: UAString;
}
export interface UDTBrokerDataSetReaderTransport extends ExtensionObject, DTBrokerDataSetReaderTransport {
}
