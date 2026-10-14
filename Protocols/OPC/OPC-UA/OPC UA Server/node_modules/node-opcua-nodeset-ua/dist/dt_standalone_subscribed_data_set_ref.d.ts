import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTSubscribedDataSet } from "./dt_subscribed_data_set";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |StandaloneSubscribedDataSetRefDataType                      |
 * | isAbstract|false                                                       |
 */
export interface DTStandaloneSubscribedDataSetRef extends DTSubscribedDataSet {
    dataSetName: UAString;
}
export interface UDTStandaloneSubscribedDataSetRef extends ExtensionObject, DTStandaloneSubscribedDataSetRef {
}
