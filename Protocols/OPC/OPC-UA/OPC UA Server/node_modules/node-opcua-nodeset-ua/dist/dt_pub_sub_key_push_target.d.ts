import { UInt16, UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { DTUserTokenPolicy } from "./dt_user_token_policy";
import { DTKeyValuePair } from "./dt_key_value_pair";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |PubSubKeyPushTargetDataType                                 |
 * | isAbstract|false                                                       |
 */
export interface DTPubSubKeyPushTarget extends DTStructure {
    applicationUri: UAString;
    pushTargetFolder: UAString[];
    endpointUrl: UAString;
    securityPolicyUri: UAString;
    userTokenType: DTUserTokenPolicy;
    requestedKeyCount: UInt16;
    retryInterval: number;
    pushTargetProperties: DTKeyValuePair[];
    securityGroups: UAString[];
}
export interface UDTPubSubKeyPushTarget extends ExtensionObject, DTPubSubKeyPushTarget {
}
