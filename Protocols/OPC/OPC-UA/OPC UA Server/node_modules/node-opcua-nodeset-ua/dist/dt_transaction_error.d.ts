import { LocalizedText } from "node-opcua-data-model";
import { NodeId } from "node-opcua-nodeid";
import { StatusCode } from "node-opcua-status-code";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |TransactionErrorType                                        |
 * | isAbstract|false                                                       |
 */
export interface DTTransactionError extends DTStructure {
    targetId: NodeId;
    error: StatusCode;
    message: LocalizedText;
}
export interface UDTTransactionError extends ExtensionObject, DTTransactionError {
}
