import { Byte } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTWriterGroupTransport } from "./dt_writer_group_transport";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |DatagramWriterGroupTransportDataType                        |
 * | isAbstract|false                                                       |
 */
export interface DTDatagramWriterGroupTransport extends DTWriterGroupTransport {
    messageRepeatCount: Byte;
    messageRepeatDelay: number;
}
export interface UDTDatagramWriterGroupTransport extends ExtensionObject, DTDatagramWriterGroupTransport {
}
