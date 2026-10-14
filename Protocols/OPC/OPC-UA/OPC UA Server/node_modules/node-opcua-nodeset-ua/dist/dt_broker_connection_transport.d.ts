import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTConnectionTransport } from "./dt_connection_transport";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |BrokerConnectionTransportDataType                           |
 * | isAbstract|false                                                       |
 */
export interface DTBrokerConnectionTransport extends DTConnectionTransport {
    resourceUri: UAString;
    authenticationProfileUri: UAString;
}
export interface UDTBrokerConnectionTransport extends ExtensionObject, DTBrokerConnectionTransport {
}
