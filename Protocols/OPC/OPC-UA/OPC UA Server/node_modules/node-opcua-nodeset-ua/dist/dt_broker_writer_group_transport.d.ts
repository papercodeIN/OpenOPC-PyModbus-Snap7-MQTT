import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTWriterGroupTransport } from "./dt_writer_group_transport";
import { EnumBrokerTransportQualityOfService } from "./enum_broker_transport_quality_of_service";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |BrokerWriterGroupTransportDataType                          |
 * | isAbstract|false                                                       |
 */
export interface DTBrokerWriterGroupTransport extends DTWriterGroupTransport {
    queueName: UAString;
    resourceUri: UAString;
    authenticationProfileUri: UAString;
    requestedDeliveryGuarantee: EnumBrokerTransportQualityOfService;
}
export interface UDTBrokerWriterGroupTransport extends ExtensionObject, DTBrokerWriterGroupTransport {
}
