import { VariantOptions } from "node-opcua-variant";
import { QualifiedName } from "node-opcua-data-model";
import { NodeId } from "node-opcua-nodeid";
import { UInt32, UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |PublishedVariableDataType                                   |
 * | isAbstract|false                                                       |
 */
export interface DTPublishedVariable extends DTStructure {
    publishedVariable: NodeId;
    attributeId: UInt32;
    samplingIntervalHint: number;
    deadbandType: UInt32;
    deadbandValue: number;
    indexRange: UAString;
    substituteValue: VariantOptions;
    metaDataProperties: QualifiedName[];
}
export interface UDTPublishedVariable extends ExtensionObject, DTPublishedVariable {
}
