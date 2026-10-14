/**
 * @module node-opcua-client-private
 */
import { EventEmitter } from "events";
import { ReadValueIdOptions, TimestampsToReturn } from "node-opcua-service-read";
import { MonitoringParametersOptions, NotificationMessage, SetTriggeringResponse, MonitoringMode } from "node-opcua-service-subscription";
import { StatusCode } from "node-opcua-status-code";
import { Callback, ErrorCallback } from "node-opcua-status-code";
import { ClientMonitoredItemBase } from "../client_monitored_item_base";
import { ClientMonitoredItemGroup } from "../client_monitored_item_group";
import { ClientSession, MonitoredItemData, SubscriptionId } from "../client_session";
import { ClientHandle, ClientMonitoredItemBaseMap, ClientSubscription, ClientSubscriptionOptions, ModifySubscriptionOptions, ModifySubscriptionResult } from "../client_subscription";
import { ClientMonitoredItem } from "../client_monitored_item";
import { ClientMonitoredItemGroupImpl } from "./client_monitored_item_group_impl";
import { ClientSidePublishEngine } from "./client_publish_engine";
import { ClientSessionImpl } from "./client_session_impl";
export declare const PENDING_SUBSCRIPTION_ID = 3234512922;
export declare const TERMINATED_SUBSCRIPTION_ID = 3234512923;
export declare const TERMINATING_SUBSCRIPTION_ID = 3234512924;
export declare class ClientSubscriptionImpl extends EventEmitter implements ClientSubscription {
    /**
     * the associated session
     * @property session
     * @type {ClientSession}
     */
    get session(): ClientSessionImpl;
    get hasSession(): boolean;
    get isActive(): boolean;
    subscriptionId: SubscriptionId;
    publishingInterval: number;
    lifetimeCount: number;
    maxKeepAliveCount: number;
    maxNotificationsPerPublish: number;
    publishingEnabled: boolean;
    priority: number;
    monitoredItems: ClientMonitoredItemBaseMap;
    monitoredItemGroups: ClientMonitoredItemGroup[];
    timeoutHint: number;
    publishEngine: ClientSidePublishEngine;
    lastSequenceNumber: number;
    private _nextClientHandle;
    hasTimedOut: boolean;
    constructor(session: ClientSession, options: ClientSubscriptionOptions);
    terminate(...args: any[]): any;
    /**

     */
    nextClientHandle(): number;
    monitor(itemToMonitor: ReadValueIdOptions, requestedParameters: MonitoringParametersOptions, timestampsToReturn: TimestampsToReturn, monitoringMode: MonitoringMode): Promise<ClientMonitoredItemBase>;
    monitor(itemToMonitor: ReadValueIdOptions, requestedParameters: MonitoringParametersOptions, timestampsToReturn: TimestampsToReturn, monitoringMode: MonitoringMode, done: Callback<ClientMonitoredItemBase>): void;
    monitorItems(itemsToMonitor: ReadValueIdOptions[], requestedParameters: MonitoringParametersOptions, timestampsToReturn: TimestampsToReturn): Promise<ClientMonitoredItemGroup>;
    monitorItems(itemsToMonitor: ReadValueIdOptions[], requestedParameters: MonitoringParametersOptions, timestampsToReturn: TimestampsToReturn, done: Callback<ClientMonitoredItemGroup>): void;
    _delete_monitored_items(monitoredItems: ClientMonitoredItemBase[], callback: ErrorCallback): void;
    setPublishingMode(publishingEnabled: boolean): Promise<StatusCode>;
    setPublishingMode(publishingEnabled: boolean, callback: Callback<StatusCode>): void;
    /**
     *
     */
    setTriggering(triggeringItem: ClientMonitoredItemBase, linksToAdd: ClientMonitoredItemBase[] | null, linksToRemove?: ClientMonitoredItemBase[] | null): Promise<SetTriggeringResponse>;
    setTriggering(triggeringItem: ClientMonitoredItemBase, linksToAdd: ClientMonitoredItemBase[] | null, linksToRemove: ClientMonitoredItemBase[] | null, callback: Callback<SetTriggeringResponse>): void;
    modify(options: ModifySubscriptionOptions, callback: Callback<ModifySubscriptionResult>): void;
    modify(options: ModifySubscriptionOptions): Promise<ModifySubscriptionResult>;
    getMonitoredItems(): Promise<MonitoredItemData>;
    getMonitoredItems(callback: Callback<MonitoredItemData>): void;
    toString(): string;
    /**
     * returns the approximated remaining life time of this subscription in milliseconds
     */
    evaluateRemainingLifetime(): number;
    _add_monitored_item(clientHandle: ClientHandle, monitoredItem: ClientMonitoredItemBase): void;
    _add_monitored_items_group(monitoredItemGroup: ClientMonitoredItemGroupImpl): void;
    _wait_for_subscription_to_be_ready(done: ErrorCallback): void;
    private __on_publish_response_DataChangeNotification;
    private __on_publish_response_StatusChangeNotification;
    private __on_publish_response_EventNotificationList;
    onNotificationMessage(notificationMessage: NotificationMessage): void;
    private _terminate_step2;
    private _remove;
    _removeGroup(monitoredItemGroup: ClientMonitoredItemGroup): void;
    /**
     * @private
     * @param itemToMonitor
     * @param monitoringParameters
     * @param timestampsToReturn
     */
    _createMonitoredItem(itemToMonitor: ReadValueIdOptions, monitoringParameters: MonitoringParametersOptions, timestampsToReturn: TimestampsToReturn, monitoringMode?: MonitoringMode): ClientMonitoredItem;
}
export declare function ClientMonitoredItem_create(subscription: ClientSubscription, itemToMonitor: ReadValueIdOptions, monitoringParameters: MonitoringParametersOptions, timestampsToReturn: TimestampsToReturn, monitoringMode?: MonitoringMode, callback?: (err3?: Error | null, monitoredItem?: ClientMonitoredItem) => void): ClientMonitoredItem;
export declare function __create_subscription(subscription: ClientSubscriptionImpl, callback: ErrorCallback): void;
