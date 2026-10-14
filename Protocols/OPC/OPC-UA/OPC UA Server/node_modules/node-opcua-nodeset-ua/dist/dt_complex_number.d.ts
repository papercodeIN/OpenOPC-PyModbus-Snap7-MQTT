import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |ComplexNumberType                                           |
 * | isAbstract|false                                                       |
 */
export interface DTComplexNumber extends DTStructure {
    real: number;
    imaginary: number;
}
export interface UDTComplexNumber extends ExtensionObject, DTComplexNumber {
}
