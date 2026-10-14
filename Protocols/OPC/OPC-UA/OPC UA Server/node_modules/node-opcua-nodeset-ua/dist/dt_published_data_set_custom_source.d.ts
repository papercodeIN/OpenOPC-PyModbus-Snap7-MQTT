import { ExtensionObject } from "node-opcua-extension-object";
import { DTPublishedDataSetSource } from "./dt_published_data_set_source";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |PublishedDataSetCustomSourceDataType                        |
 * | isAbstract|false                                                       |
 */
export interface DTPublishedDataSetCustomSource extends DTPublishedDataSetSource {
    cyclicDataSet: boolean;
}
export interface UDTPublishedDataSetCustomSource extends ExtensionObject, DTPublishedDataSetCustomSource {
}
