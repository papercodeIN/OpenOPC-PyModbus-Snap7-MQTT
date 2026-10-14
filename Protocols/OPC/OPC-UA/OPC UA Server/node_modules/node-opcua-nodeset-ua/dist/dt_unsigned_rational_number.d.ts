import { UInt32 } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |UnsignedRationalNumber                                      |
 * | isAbstract|false                                                       |
 */
export interface DTUnsignedRationalNumber extends DTStructure {
    numerator: UInt32;
    denominator: UInt32;
}
export interface UDTUnsignedRationalNumber extends ExtensionObject, DTUnsignedRationalNumber {
}
