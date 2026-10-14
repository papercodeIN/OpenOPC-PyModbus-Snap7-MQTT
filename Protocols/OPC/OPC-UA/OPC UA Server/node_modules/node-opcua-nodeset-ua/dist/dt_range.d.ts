import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |Range                                                       |
 * | isAbstract|false                                                       |
 */
export interface DTRange extends DTStructure {
    low: number;
    high: number;
}
export interface UDTRange extends ExtensionObject, DTRange {
}
