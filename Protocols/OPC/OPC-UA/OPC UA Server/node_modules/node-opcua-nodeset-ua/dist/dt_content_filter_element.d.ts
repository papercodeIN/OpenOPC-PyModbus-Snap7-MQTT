import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { EnumFilterOperator } from "./enum_filter_operator";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |ContentFilterElement                                        |
 * | isAbstract|false                                                       |
 */
export interface DTContentFilterElement extends DTStructure {
    filterOperator: EnumFilterOperator;
    filterOperands: DTStructure[];
}
export interface UDTContentFilterElement extends ExtensionObject, DTContentFilterElement {
}
