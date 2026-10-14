import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |XVType                                                      |
 * | isAbstract|false                                                       |
 */
export interface DTXV extends DTStructure {
    x: number;
    value: number;
}
export interface UDTXV extends ExtensionObject, DTXV {
}
