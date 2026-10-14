import { UInt32, UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { DTRolePermission } from "./dt_role_permission";
import { DTKeyValuePair } from "./dt_key_value_pair";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |SecurityGroupDataType                                       |
 * | isAbstract|false                                                       |
 */
export interface DTSecurityGroup extends DTStructure {
    name: UAString;
    securityGroupFolder: UAString[];
    keyLifetime: number;
    securityPolicyUri: UAString;
    maxFutureKeyCount: UInt32;
    maxPastKeyCount: UInt32;
    securityGroupId: UAString;
    rolePermissions: DTRolePermission[];
    groupProperties: DTKeyValuePair[];
}
export interface UDTSecurityGroup extends ExtensionObject, DTSecurityGroup {
}
