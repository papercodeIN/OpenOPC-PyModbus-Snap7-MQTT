import { UInt32 } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTPubSubConfiguration } from "./dt_pub_sub_configuration";
import { DTPublishedDataSet } from "./dt_published_data_set";
import { DTPubSubConnection } from "./dt_pub_sub_connection";
import { DTStandaloneSubscribedDataSet } from "./dt_standalone_subscribed_data_set";
import { DTDataSetMeta } from "./dt_data_set_meta";
import { DTEndpointDescription } from "./dt_endpoint_description";
import { DTSecurityGroup } from "./dt_security_group";
import { DTPubSubKeyPushTarget } from "./dt_pub_sub_key_push_target";
import { DTKeyValuePair } from "./dt_key_value_pair";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |PubSubConfiguration2DataType                                |
 * | isAbstract|false                                                       |
 */
export interface DTPubSubConfiguration2 extends DTPubSubConfiguration {
    publishedDataSets: DTPublishedDataSet[];
    connections: DTPubSubConnection[];
    enabled: boolean;
    subscribedDataSets: DTStandaloneSubscribedDataSet[];
    dataSetClasses: DTDataSetMeta[];
    defaultSecurityKeyServices: DTEndpointDescription[];
    securityGroups: DTSecurityGroup[];
    pubSubKeyPushTargets: DTPubSubKeyPushTarget[];
    configurationVersion: UInt32;
    configurationProperties: DTKeyValuePair[];
}
export interface UDTPubSubConfiguration2 extends ExtensionObject, DTPubSubConfiguration2 {
}
