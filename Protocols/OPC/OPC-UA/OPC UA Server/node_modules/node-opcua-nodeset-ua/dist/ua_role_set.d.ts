import { UAObject, UAMethod } from "node-opcua-address-space-base";
/**
 * |                |                                                            |
 * |----------------|------------------------------------------------------------|
 * |namespace       |http://opcfoundation.org/UA/                                |
 * |nodeClass       |ObjectType                                                  |
 * |typedDefinition |RoleSetType i=15607                                         |
 * |isAbstract      |false                                                       |
 */
export interface UARoleSet_Base {
    addRole: UAMethod;
    removeRole: UAMethod;
}
export interface UARoleSet extends UAObject, UARoleSet_Base {
}
