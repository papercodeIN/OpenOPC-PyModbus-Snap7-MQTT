import { NodeId } from "node-opcua-nodeid";
import { UInt32, UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { DTApplicationDescription } from "./dt_application_description";
import { DTServiceCounter } from "./dt_service_counter";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |SessionDiagnosticsDataType                                  |
 * | isAbstract|false                                                       |
 */
export interface DTSessionDiagnostics extends DTStructure {
    sessionId: NodeId;
    sessionName: UAString;
    clientDescription: DTApplicationDescription;
    serverUri: UAString;
    endpointUrl: UAString;
    localeIds: UAString[];
    actualSessionTimeout: number;
    maxResponseMessageSize: UInt32;
    clientConnectionTime: Date;
    clientLastContactTime: Date;
    currentSubscriptionsCount: UInt32;
    currentMonitoredItemsCount: UInt32;
    currentPublishRequestsInQueue: UInt32;
    totalRequestCount: DTServiceCounter;
    unauthorizedRequestCount: UInt32;
    readCount: DTServiceCounter;
    historyReadCount: DTServiceCounter;
    writeCount: DTServiceCounter;
    historyUpdateCount: DTServiceCounter;
    callCount: DTServiceCounter;
    createMonitoredItemsCount: DTServiceCounter;
    modifyMonitoredItemsCount: DTServiceCounter;
    setMonitoringModeCount: DTServiceCounter;
    setTriggeringCount: DTServiceCounter;
    deleteMonitoredItemsCount: DTServiceCounter;
    createSubscriptionCount: DTServiceCounter;
    modifySubscriptionCount: DTServiceCounter;
    setPublishingModeCount: DTServiceCounter;
    publishCount: DTServiceCounter;
    republishCount: DTServiceCounter;
    transferSubscriptionsCount: DTServiceCounter;
    deleteSubscriptionsCount: DTServiceCounter;
    addNodesCount: DTServiceCounter;
    addReferencesCount: DTServiceCounter;
    deleteNodesCount: DTServiceCounter;
    deleteReferencesCount: DTServiceCounter;
    browseCount: DTServiceCounter;
    browseNextCount: DTServiceCounter;
    translateBrowsePathsToNodeIdsCount: DTServiceCounter;
    queryFirstCount: DTServiceCounter;
    queryNextCount: DTServiceCounter;
    registerNodesCount: DTServiceCounter;
    unregisterNodesCount: DTServiceCounter;
}
export interface UDTSessionDiagnostics extends ExtensionObject, DTSessionDiagnostics {
}
