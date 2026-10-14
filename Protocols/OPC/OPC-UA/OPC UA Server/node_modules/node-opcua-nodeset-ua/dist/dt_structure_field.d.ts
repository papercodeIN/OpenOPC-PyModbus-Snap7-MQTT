import { LocalizedText } from "node-opcua-data-model";
import { NodeId } from "node-opcua-nodeid";
import { UInt32, Int32, UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |StructureField                                              |
 * | isAbstract|false                                                       |
 */
export interface DTStructureField extends DTStructure {
    name: UAString;
    description: LocalizedText;
    dataType: NodeId;
    valueRank: Int32;
    arrayDimensions: UInt32[];
    maxStringLength: UInt32;
    isOptional: boolean;
}
export interface UDTStructureField extends ExtensionObject, DTStructureField {
}
