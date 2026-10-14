import { ExtensionObject } from "node-opcua-extension-object";
import { DTVector } from "./dt_vector";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |3DVector                                                    |
 * | isAbstract|false                                                       |
 */
export interface DT3DVector extends DTVector {
    x: number;
    y: number;
    z: number;
}
export interface UDT3DVector extends ExtensionObject, DT3DVector {
}
