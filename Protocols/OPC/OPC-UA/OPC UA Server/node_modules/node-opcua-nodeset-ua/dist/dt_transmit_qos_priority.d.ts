import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTTransmitQos } from "./dt_transmit_qos";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |TransmitQosPriorityDataType                                 |
 * | isAbstract|false                                                       |
 */
export interface DTTransmitQosPriority extends DTTransmitQos {
    priorityLabel: UAString;
}
export interface UDTTransmitQosPriority extends ExtensionObject, DTTransmitQosPriority {
}
