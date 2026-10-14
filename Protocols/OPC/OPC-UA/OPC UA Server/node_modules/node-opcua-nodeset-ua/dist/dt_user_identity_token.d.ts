import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |UserIdentityToken                                           |
 * | isAbstract|true                                                        |
 */
export interface DTUserIdentityToken extends DTStructure {
    policyId: UAString;
}
export interface UDTUserIdentityToken extends ExtensionObject, DTUserIdentityToken {
}
