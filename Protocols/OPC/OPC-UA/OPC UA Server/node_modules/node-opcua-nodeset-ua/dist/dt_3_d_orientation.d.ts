import { ExtensionObject } from "node-opcua-extension-object";
import { DTOrientation } from "./dt_orientation";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |3DOrientation                                               |
 * | isAbstract|false                                                       |
 */
export interface DT3DOrientation extends DTOrientation {
    a: number;
    b: number;
    c: number;
}
export interface UDT3DOrientation extends ExtensionObject, DT3DOrientation {
}
