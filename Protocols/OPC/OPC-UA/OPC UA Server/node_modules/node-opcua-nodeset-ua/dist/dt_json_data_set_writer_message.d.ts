import { UInt32 } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTDataSetWriterMessage } from "./dt_data_set_writer_message";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |JsonDataSetWriterMessageDataType                            |
 * | isAbstract|false                                                       |
 */
export interface DTJsonDataSetWriterMessage extends DTDataSetWriterMessage {
    dataSetMessageContentMask: UInt32;
}
export interface UDTJsonDataSetWriterMessage extends ExtensionObject, DTJsonDataSetWriterMessage {
}
