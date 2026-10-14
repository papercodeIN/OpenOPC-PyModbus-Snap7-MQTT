import { UInt32, UInt16, Guid } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTDataSetReaderMessage } from "./dt_data_set_reader_message";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |UadpDataSetReaderMessageDataType                            |
 * | isAbstract|false                                                       |
 */
export interface DTUadpDataSetReaderMessage extends DTDataSetReaderMessage {
    groupVersion: UInt32;
    networkMessageNumber: UInt16;
    dataSetOffset: UInt16;
    dataSetClassId: Guid;
    networkMessageContentMask: UInt32;
    dataSetMessageContentMask: UInt32;
    publishingInterval: number;
    receiveOffset: number;
    processingOffset: number;
}
export interface UDTUadpDataSetReaderMessage extends ExtensionObject, DTUadpDataSetReaderMessage {
}
