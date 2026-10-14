/**
 * @module node-opcua-pseudo-session
 */
import { CreateMonitoredItemsRequest, CreateMonitoredItemsResponse } from "node-opcua-service-subscription";
import { IBasicSessionWithSubscription } from "./basic_session_with_subscription";
export declare function createMonitoredItemsLimit(maxMonitoredItemsPerCall: number, session: IBasicSessionWithSubscription, createMonitoredItemsRequest: CreateMonitoredItemsRequest): Promise<CreateMonitoredItemsResponse>;
