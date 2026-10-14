import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { DTPublishedDataSet } from "./dt_published_data_set";
import { DTPubSubConnection } from "./dt_pub_sub_connection";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |PubSubConfigurationDataType                                 |
 * | isAbstract|false                                                       |
 */
export interface DTPubSubConfiguration extends DTStructure {
    publishedDataSets: DTPublishedDataSet[];
    connections: DTPubSubConnection[];
    enabled: boolean;
}
export interface UDTPubSubConfiguration extends ExtensionObject, DTPubSubConfiguration {
}
