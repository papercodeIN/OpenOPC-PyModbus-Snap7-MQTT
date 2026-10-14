import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTReceiveQos } from "./dt_receive_qos";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |ReceiveQosPriorityDataType                                  |
 * | isAbstract|false                                                       |
 */
export interface DTReceiveQosPriority extends DTReceiveQos {
    priorityLabel: UAString;
}
export interface UDTReceiveQosPriority extends ExtensionObject, DTReceiveQosPriority {
}
