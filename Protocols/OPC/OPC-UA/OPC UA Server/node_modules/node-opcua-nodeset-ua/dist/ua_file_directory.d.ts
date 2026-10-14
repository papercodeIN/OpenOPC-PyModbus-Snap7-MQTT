import { UAMethod } from "node-opcua-address-space-base";
import { UAFolder, UAFolder_Base } from "./ua_folder";
/**
 * |                |                                                            |
 * |----------------|------------------------------------------------------------|
 * |namespace       |http://opcfoundation.org/UA/                                |
 * |nodeClass       |ObjectType                                                  |
 * |typedDefinition |FileDirectoryType i=13353                                   |
 * |isAbstract      |false                                                       |
 */
export interface UAFileDirectory_Base extends UAFolder_Base {
    createDirectory: UAMethod;
    createFile: UAMethod;
    delete: UAMethod;
    moveOrCopy: UAMethod;
}
export interface UAFileDirectory extends UAFolder, UAFileDirectory_Base {
}
