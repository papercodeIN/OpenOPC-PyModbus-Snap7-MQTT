import { UInt32, Byte, UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |PriorityMappingEntryType                                    |
 * | isAbstract|false                                                       |
 */
export interface DTPriorityMappingEntry extends DTStructure {
    mappingUri: UAString;
    priorityLabel: UAString;
    priorityValue_PCP: Byte;
    priorityValue_DSCP: UInt32;
}
export interface UDTPriorityMappingEntry extends ExtensionObject, DTPriorityMappingEntry {
}
