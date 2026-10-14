import { DiagnosticInfo } from "node-opcua-data-model";
import { StatusCode } from "node-opcua-status-code";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |StatusResult                                                |
 * | isAbstract|false                                                       |
 */
export interface DTStatusResult extends DTStructure {
    statusCode: StatusCode;
    diagnosticInfo: DiagnosticInfo;
}
export interface UDTStatusResult extends ExtensionObject, DTStatusResult {
}
