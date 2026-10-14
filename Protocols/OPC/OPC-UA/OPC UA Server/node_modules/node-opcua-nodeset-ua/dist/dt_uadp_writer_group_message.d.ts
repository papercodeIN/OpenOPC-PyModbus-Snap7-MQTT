import { UInt32 } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTWriterGroupMessage } from "./dt_writer_group_message";
import { EnumDataSetOrdering } from "./enum_data_set_ordering";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |UadpWriterGroupMessageDataType                              |
 * | isAbstract|false                                                       |
 */
export interface DTUadpWriterGroupMessage extends DTWriterGroupMessage {
    groupVersion: UInt32;
    dataSetOrdering: EnumDataSetOrdering;
    networkMessageContentMask: UInt32;
    samplingOffset: number;
    publishingOffset: number[];
}
export interface UDTUadpWriterGroupMessage extends ExtensionObject, DTUadpWriterGroupMessage {
}
