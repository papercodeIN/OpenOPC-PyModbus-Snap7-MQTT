import { UInt32 } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |ServiceCounterDataType                                      |
 * | isAbstract|false                                                       |
 */
export interface DTServiceCounter extends DTStructure {
    totalCount: UInt32;
    errorCount: UInt32;
}
export interface UDTServiceCounter extends ExtensionObject, DTServiceCounter {
}
