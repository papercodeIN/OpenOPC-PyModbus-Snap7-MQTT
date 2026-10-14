import { UInt32 } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |ServerDiagnosticsSummaryDataType                            |
 * | isAbstract|false                                                       |
 */
export interface DTServerDiagnosticsSummary extends DTStructure {
    serverViewCount: UInt32;
    currentSessionCount: UInt32;
    cumulatedSessionCount: UInt32;
    securityRejectedSessionCount: UInt32;
    rejectedSessionCount: UInt32;
    sessionTimeoutCount: UInt32;
    sessionAbortCount: UInt32;
    currentSubscriptionCount: UInt32;
    cumulatedSubscriptionCount: UInt32;
    publishingIntervalCount: UInt32;
    securityRejectedRequestsCount: UInt32;
    rejectedRequestsCount: UInt32;
}
export interface UDTServerDiagnosticsSummary extends ExtensionObject, DTServerDiagnosticsSummary {
}
