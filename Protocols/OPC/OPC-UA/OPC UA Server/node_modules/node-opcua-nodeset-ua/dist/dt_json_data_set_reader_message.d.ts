import { UInt32 } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTDataSetReaderMessage } from "./dt_data_set_reader_message";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |JsonDataSetReaderMessageDataType                            |
 * | isAbstract|false                                                       |
 */
export interface DTJsonDataSetReaderMessage extends DTDataSetReaderMessage {
    networkMessageContentMask: UInt32;
    dataSetMessageContentMask: UInt32;
}
export interface UDTJsonDataSetReaderMessage extends ExtensionObject, DTJsonDataSetReaderMessage {
}
