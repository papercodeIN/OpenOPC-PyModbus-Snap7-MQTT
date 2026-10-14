import { VariantOptions } from "node-opcua-variant";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTFilterOperand } from "./dt_filter_operand";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |LiteralOperand                                              |
 * | isAbstract|false                                                       |
 */
export interface DTLiteralOperand extends DTFilterOperand {
    value: VariantOptions;
}
export interface UDTLiteralOperand extends ExtensionObject, DTLiteralOperand {
}
