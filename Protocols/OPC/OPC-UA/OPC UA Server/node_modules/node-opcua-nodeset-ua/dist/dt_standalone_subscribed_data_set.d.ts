import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTSubscribedDataSet } from "./dt_subscribed_data_set";
import { DTDataSetMeta } from "./dt_data_set_meta";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |StandaloneSubscribedDataSetDataType                         |
 * | isAbstract|false                                                       |
 */
export interface DTStandaloneSubscribedDataSet extends DTSubscribedDataSet {
    name: UAString;
    dataSetFolder: UAString[];
    dataSetMetaData: DTDataSetMeta;
    subscribedDataSet: DTSubscribedDataSet;
}
export interface UDTStandaloneSubscribedDataSet extends ExtensionObject, DTStandaloneSubscribedDataSet {
}
