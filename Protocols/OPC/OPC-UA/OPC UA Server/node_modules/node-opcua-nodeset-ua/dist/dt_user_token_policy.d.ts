import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { EnumUserToken } from "./enum_user_token";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |UserTokenPolicy                                             |
 * | isAbstract|false                                                       |
 */
export interface DTUserTokenPolicy extends DTStructure {
    policyId: UAString;
    tokenType: EnumUserToken;
    issuedTokenType: UAString;
    issuerEndpointUrl: UAString;
    securityPolicyUri: UAString;
}
export interface UDTUserTokenPolicy extends ExtensionObject, DTUserTokenPolicy {
}
