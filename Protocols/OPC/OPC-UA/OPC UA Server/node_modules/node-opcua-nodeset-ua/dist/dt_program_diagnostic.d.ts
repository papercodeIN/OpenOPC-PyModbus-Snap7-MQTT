import { NodeId } from "node-opcua-nodeid";
import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { DTArgument } from "./dt_argument";
import { DTStatusResult } from "./dt_status_result";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |ProgramDiagnosticDataType                                   |
 * | isAbstract|false                                                       |
 */
export interface DTProgramDiagnostic extends DTStructure {
    createSessionId: NodeId;
    createClientName: UAString;
    invocationCreationTime: Date;
    lastTransitionTime: Date;
    lastMethodCall: UAString;
    lastMethodSessionId: NodeId;
    lastMethodInputArguments: DTArgument[];
    lastMethodOutputArguments: DTArgument[];
    lastMethodCallTime: Date;
    lastMethodReturnStatus: DTStatusResult;
}
export interface UDTProgramDiagnostic extends ExtensionObject, DTProgramDiagnostic {
}
