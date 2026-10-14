import { LocalizedText } from "node-opcua-data-model";
import { Int16, SByte, UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |CurrencyUnitType                                            |
 * | isAbstract|false                                                       |
 */
export interface DTCurrencyUnit extends DTStructure {
    numericCode: Int16;
    exponent: SByte;
    alphabeticCode: UAString;
    currency: LocalizedText;
}
export interface UDTCurrencyUnit extends ExtensionObject, DTCurrencyUnit {
}
