import { NodeId } from "node-opcua-nodeid";
import { UInt32, UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTFilterOperand } from "./dt_filter_operand";
import { DTRelativePath } from "./dt_relative_path";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |AttributeOperand                                            |
 * | isAbstract|false                                                       |
 */
export interface DTAttributeOperand extends DTFilterOperand {
    nodeId: NodeId;
    alias: UAString;
    browsePath: DTRelativePath;
    attributeId: UInt32;
    indexRange: UAString;
}
export interface UDTAttributeOperand extends ExtensionObject, DTAttributeOperand {
}
