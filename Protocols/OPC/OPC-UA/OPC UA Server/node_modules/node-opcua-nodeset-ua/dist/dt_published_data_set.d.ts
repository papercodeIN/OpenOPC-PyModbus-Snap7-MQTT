import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { DTDataSetMeta } from "./dt_data_set_meta";
import { DTKeyValuePair } from "./dt_key_value_pair";
import { DTPublishedDataSetSource } from "./dt_published_data_set_source";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |PublishedDataSetDataType                                    |
 * | isAbstract|false                                                       |
 */
export interface DTPublishedDataSet extends DTStructure {
    name: UAString;
    dataSetFolder: UAString[];
    dataSetMetaData: DTDataSetMeta;
    extensionFields: DTKeyValuePair[];
    dataSetSource: DTPublishedDataSetSource;
}
export interface UDTPublishedDataSet extends ExtensionObject, DTPublishedDataSet {
}
