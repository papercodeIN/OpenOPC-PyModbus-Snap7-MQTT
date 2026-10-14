import { NodeId } from "node-opcua-nodeid";
import { UInt32 } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |RolePermissionType                                          |
 * | isAbstract|false                                                       |
 */
export interface DTRolePermission extends DTStructure {
    roleId: NodeId;
    permissions: UInt32;
}
export interface UDTRolePermission extends ExtensionObject, DTRolePermission {
}
