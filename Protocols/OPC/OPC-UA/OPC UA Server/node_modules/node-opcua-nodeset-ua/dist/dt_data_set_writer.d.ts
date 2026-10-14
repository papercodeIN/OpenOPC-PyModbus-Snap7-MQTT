import { UInt32, UInt16, UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { DTKeyValuePair } from "./dt_key_value_pair";
import { DTDataSetWriterTransport } from "./dt_data_set_writer_transport";
import { DTDataSetWriterMessage } from "./dt_data_set_writer_message";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |DataSetWriterDataType                                       |
 * | isAbstract|false                                                       |
 */
export interface DTDataSetWriter extends DTStructure {
    name: UAString;
    enabled: boolean;
    dataSetWriterId: UInt16;
    dataSetFieldContentMask: UInt32;
    keyFrameCount: UInt32;
    dataSetName: UAString;
    dataSetWriterProperties: DTKeyValuePair[];
    transportSettings: DTDataSetWriterTransport;
    messageSettings: DTDataSetWriterMessage;
}
export interface UDTDataSetWriter extends ExtensionObject, DTDataSetWriter {
}
