import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |DoubleComplexNumberType                                     |
 * | isAbstract|false                                                       |
 */
export interface DTDoubleComplexNumber extends DTStructure {
    real: number;
    imaginary: number;
}
export interface UDTDoubleComplexNumber extends ExtensionObject, DTDoubleComplexNumber {
}
