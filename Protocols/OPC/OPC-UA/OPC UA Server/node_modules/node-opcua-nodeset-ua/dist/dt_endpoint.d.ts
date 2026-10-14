import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { EnumMessageSecurityMode } from "./enum_message_security_mode";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |EndpointType                                                |
 * | isAbstract|false                                                       |
 */
export interface DTEndpoint extends DTStructure {
    endpointUrl: UAString;
    securityMode: EnumMessageSecurityMode;
    securityPolicyUri: UAString;
    transportProfileUri: UAString;
}
export interface UDTEndpoint extends ExtensionObject, DTEndpoint {
}
