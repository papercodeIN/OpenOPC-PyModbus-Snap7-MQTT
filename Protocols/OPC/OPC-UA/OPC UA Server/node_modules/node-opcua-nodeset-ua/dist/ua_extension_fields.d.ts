import { UAObject, UAMethod } from "node-opcua-address-space-base";
/**
 * |                |                                                            |
 * |----------------|------------------------------------------------------------|
 * |namespace       |http://opcfoundation.org/UA/                                |
 * |nodeClass       |ObjectType                                                  |
 * |typedDefinition |ExtensionFieldsType i=15489                                 |
 * |isAbstract      |false                                                       |
 */
export interface UAExtensionFields_Base {
    addExtensionField: UAMethod;
    removeExtensionField: UAMethod;
}
export interface UAExtensionFields extends UAObject, UAExtensionFields_Base {
}
