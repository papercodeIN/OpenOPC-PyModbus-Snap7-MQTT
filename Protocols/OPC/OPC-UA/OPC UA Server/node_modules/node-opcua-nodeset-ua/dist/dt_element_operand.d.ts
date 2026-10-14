import { UInt32 } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTFilterOperand } from "./dt_filter_operand";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |ElementOperand                                              |
 * | isAbstract|false                                                       |
 */
export interface DTElementOperand extends DTFilterOperand {
    index: UInt32;
}
export interface UDTElementOperand extends ExtensionObject, DTElementOperand {
}
