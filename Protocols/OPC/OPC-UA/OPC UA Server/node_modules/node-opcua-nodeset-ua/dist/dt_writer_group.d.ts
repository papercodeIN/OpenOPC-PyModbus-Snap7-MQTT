import { UInt32, UInt16, Byte, UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTPubSubGroup } from "./dt_pub_sub_group";
import { EnumMessageSecurityMode } from "./enum_message_security_mode";
import { DTEndpointDescription } from "./dt_endpoint_description";
import { DTKeyValuePair } from "./dt_key_value_pair";
import { DTWriterGroupTransport } from "./dt_writer_group_transport";
import { DTWriterGroupMessage } from "./dt_writer_group_message";
import { DTDataSetWriter } from "./dt_data_set_writer";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |WriterGroupDataType                                         |
 * | isAbstract|false                                                       |
 */
export interface DTWriterGroup extends DTPubSubGroup {
    name: UAString;
    enabled: boolean;
    securityMode: EnumMessageSecurityMode;
    securityGroupId: UAString;
    securityKeyServices: DTEndpointDescription[];
    maxNetworkMessageSize: UInt32;
    groupProperties: DTKeyValuePair[];
    writerGroupId: UInt16;
    publishingInterval: number;
    keepAliveTime: number;
    priority: Byte;
    localeIds: UAString[];
    headerLayoutUri: UAString;
    transportSettings: DTWriterGroupTransport;
    messageSettings: DTWriterGroupMessage;
    dataSetWriters: DTDataSetWriter[];
}
export interface UDTWriterGroup extends ExtensionObject, DTWriterGroup {
}
