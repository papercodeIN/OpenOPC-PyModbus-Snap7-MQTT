import { UInt32, UInt16 } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTDataSetWriterMessage } from "./dt_data_set_writer_message";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |UadpDataSetWriterMessageDataType                            |
 * | isAbstract|false                                                       |
 */
export interface DTUadpDataSetWriterMessage extends DTDataSetWriterMessage {
    dataSetMessageContentMask: UInt32;
    configuredSize: UInt16;
    networkMessageNumber: UInt16;
    dataSetOffset: UInt16;
}
export interface UDTUadpDataSetWriterMessage extends ExtensionObject, DTUadpDataSetWriterMessage {
}
