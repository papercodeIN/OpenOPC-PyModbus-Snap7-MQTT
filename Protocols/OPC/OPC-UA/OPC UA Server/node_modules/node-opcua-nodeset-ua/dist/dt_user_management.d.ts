import { UInt32, UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |UserManagementDataType                                      |
 * | isAbstract|false                                                       |
 */
export interface DTUserManagement extends DTStructure {
    userName: UAString;
    userConfiguration: UInt32;
    description: UAString;
}
export interface UDTUserManagement extends ExtensionObject, DTUserManagement {
}
