import { UInt32, UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTPubSubGroup } from "./dt_pub_sub_group";
import { EnumMessageSecurityMode } from "./enum_message_security_mode";
import { DTEndpointDescription } from "./dt_endpoint_description";
import { DTKeyValuePair } from "./dt_key_value_pair";
import { DTReaderGroupTransport } from "./dt_reader_group_transport";
import { DTReaderGroupMessage } from "./dt_reader_group_message";
import { DTDataSetReader } from "./dt_data_set_reader";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |ReaderGroupDataType                                         |
 * | isAbstract|false                                                       |
 */
export interface DTReaderGroup extends DTPubSubGroup {
    name: UAString;
    enabled: boolean;
    securityMode: EnumMessageSecurityMode;
    securityGroupId: UAString;
    securityKeyServices: DTEndpointDescription[];
    maxNetworkMessageSize: UInt32;
    groupProperties: DTKeyValuePair[];
    transportSettings: DTReaderGroupTransport;
    messageSettings: DTReaderGroupMessage;
    dataSetReaders: DTDataSetReader[];
}
export interface UDTReaderGroup extends ExtensionObject, DTReaderGroup {
}
