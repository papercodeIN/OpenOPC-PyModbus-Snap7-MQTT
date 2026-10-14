import { QualifiedName } from "node-opcua-data-model";
import { NodeId } from "node-opcua-nodeid";
import { UInt32, UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTFilterOperand } from "./dt_filter_operand";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |SimpleAttributeOperand                                      |
 * | isAbstract|false                                                       |
 */
export interface DTSimpleAttributeOperand extends DTFilterOperand {
    typeDefinitionId: NodeId;
    browsePath: QualifiedName[];
    attributeId: UInt32;
    indexRange: UAString;
}
export interface UDTSimpleAttributeOperand extends ExtensionObject, DTSimpleAttributeOperand {
}
