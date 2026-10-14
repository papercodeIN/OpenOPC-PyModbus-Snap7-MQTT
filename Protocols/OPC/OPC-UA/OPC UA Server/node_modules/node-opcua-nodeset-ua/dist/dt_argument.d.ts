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
 * | name      |Argument                                                    |
 * | isAbstract|false                                                       |
 */
export interface DTArgument extends DTStructure {
    name: UAString;
    dataType: NodeId;
    valueRank: Int32;
    arrayDimensions: UInt32[];
    description: LocalizedText;
}
export interface UDTArgument extends ExtensionObject, DTArgument {
}
