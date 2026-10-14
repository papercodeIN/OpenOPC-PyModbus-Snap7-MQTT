import { UInt32 } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |SamplingIntervalDiagnosticsDataType                         |
 * | isAbstract|false                                                       |
 */
export interface DTSamplingIntervalDiagnostics extends DTStructure {
    samplingInterval: number;
    monitoredItemCount: UInt32;
    maxMonitoredItemCount: UInt32;
    disabledMonitoredItemCount: UInt32;
}
export interface UDTSamplingIntervalDiagnostics extends ExtensionObject, DTSamplingIntervalDiagnostics {
}
