import { UInt32, UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { EnumMessageSecurityMode } from "./enum_message_security_mode";
import { DTEndpointDescription } from "./dt_endpoint_description";
import { DTKeyValuePair } from "./dt_key_value_pair";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |PubSubGroupDataType                                         |
 * | isAbstract|true                                                        |
 */
export interface DTPubSubGroup extends DTStructure {
    name: UAString;
    enabled: boolean;
    securityMode: EnumMessageSecurityMode;
    securityGroupId: UAString;
    securityKeyServices: DTEndpointDescription[];
    maxNetworkMessageSize: UInt32;
    groupProperties: DTKeyValuePair[];
}
export interface UDTPubSubGroup extends ExtensionObject, DTPubSubGroup {
}
