import { UAMethod, UAProperty } from "node-opcua-address-space-base";
import { DataType } from "node-opcua-variant";
import { UAString } from "node-opcua-basic-types";
import { UAFolder, UAFolder_Base } from "./ua_folder";
/**
 * |                |                                                            |
 * |----------------|------------------------------------------------------------|
 * |namespace       |http://opcfoundation.org/UA/                                |
 * |nodeClass       |ObjectType                                                  |
 * |typedDefinition |SecurityGroupFolderType i=15452                             |
 * |isAbstract      |false                                                       |
 */
export interface UASecurityGroupFolder_Base extends UAFolder_Base {
    addSecurityGroup: UAMethod;
    removeSecurityGroup: UAMethod;
    addSecurityGroupFolder?: UAMethod;
    removeSecurityGroupFolder?: UAMethod;
    supportedSecurityPolicyUris?: UAProperty<UAString[], DataType.String>;
}
export interface UASecurityGroupFolder extends UAFolder, UASecurityGroupFolder_Base {
}
