import { UInt32, Int32 } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |RationalNumber                                              |
 * | isAbstract|false                                                       |
 */
export interface DTRationalNumber extends DTStructure {
    numerator: Int32;
    denominator: UInt32;
}
export interface UDTRationalNumber extends ExtensionObject, DTRationalNumber {
}
