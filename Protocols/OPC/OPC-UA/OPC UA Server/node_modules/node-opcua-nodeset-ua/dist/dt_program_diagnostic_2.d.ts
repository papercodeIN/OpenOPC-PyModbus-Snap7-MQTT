import { VariantOptions } from "node-opcua-variant";
import { NodeId } from "node-opcua-nodeid";
import { StatusCode } from "node-opcua-status-code";
import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { DTArgument } from "./dt_argument";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |ProgramDiagnostic2DataType                                  |
 * | isAbstract|false                                                       |
 */
export interface DTProgramDiagnostic2 extends DTStructure {
    createSessionId: NodeId;
    createClientName: UAString;
    invocationCreationTime: Date;
    lastTransitionTime: Date;
    lastMethodCall: UAString;
    lastMethodSessionId: NodeId;
    lastMethodInputArguments: DTArgument[];
    lastMethodOutputArguments: DTArgument[];
    lastMethodInputValues: VariantOptions[];
    lastMethodOutputValues: VariantOptions[];
    lastMethodCallTime: Date;
    lastMethodReturnStatus: StatusCode;
}
export interface UDTProgramDiagnostic2 extends ExtensionObject, DTProgramDiagnostic2 {
}
