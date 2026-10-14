import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTSubscribedDataSet } from "./dt_subscribed_data_set";
import { DTRolePermission } from "./dt_role_permission";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |SubscribedDataSetMirrorDataType                             |
 * | isAbstract|false                                                       |
 */
export interface DTSubscribedDataSetMirror extends DTSubscribedDataSet {
    parentNodeName: UAString;
    rolePermissions: DTRolePermission[];
}
export interface UDTSubscribedDataSetMirror extends ExtensionObject, DTSubscribedDataSetMirror {
}
