import { LocalizedText } from "node-opcua-data-model";
import { NodeId } from "node-opcua-nodeid";
import { UInt32, Int32, UInt16, Byte, UAString, Guid } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { DTKeyValuePair } from "./dt_key_value_pair";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |FieldMetaData                                               |
 * | isAbstract|false                                                       |
 */
export interface DTFieldMetaData extends DTStructure {
    name: UAString;
    description: LocalizedText;
    fieldFlags: UInt16;
    builtInType: Byte;
    dataType: NodeId;
    valueRank: Int32;
    arrayDimensions: UInt32[];
    maxStringLength: UInt32;
    dataSetFieldId: Guid;
    properties: DTKeyValuePair[];
}
export interface UDTFieldMetaData extends ExtensionObject, DTFieldMetaData {
}
