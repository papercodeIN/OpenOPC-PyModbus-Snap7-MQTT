import { VariantOptions } from "node-opcua-variant";
import { NodeId } from "node-opcua-nodeid";
import { UInt32, UAString, Guid } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { EnumOverrideValueHandling } from "./enum_override_value_handling";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |FieldTargetDataType                                         |
 * | isAbstract|false                                                       |
 */
export interface DTFieldTarget extends DTStructure {
    dataSetFieldId: Guid;
    receiverIndexRange: UAString;
    targetNodeId: NodeId;
    attributeId: UInt32;
    writeIndexRange: UAString;
    overrideValueHandling: EnumOverrideValueHandling;
    overrideValue: VariantOptions;
}
export interface UDTFieldTarget extends ExtensionObject, DTFieldTarget {
}
