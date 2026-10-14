/**
 * @module node-opcua-client-private
 */
import { EventEmitter } from "events";
import { DataValue } from "node-opcua-data-value";
import { ExtensionObject } from "node-opcua-extension-object";
import { ReadValueId, ReadValueIdOptions, TimestampsToReturn } from "node-opcua-service-read";
import { MonitoredItemCreateResult, MonitoringMode, MonitoringParameters, MonitoringParametersOptions } from "node-opcua-service-subscription";
import { StatusCode } from "node-opcua-status-code";
import { Variant } from "node-opcua-variant";
import { Callback, ErrorCallback } from "node-opcua-status-code";
import { ClientMonitoredItem } from "../client_monitored_item";
import { ClientSubscription } from "../client_subscription";
import { ClientSubscriptionImpl } from "./client_subscription_impl";
export type PrepareForMonitoringResult = {
    error: string;
} | {
    error?: null;
    itemToMonitor: ReadValueIdOptions;
    monitoringMode: MonitoringMode;
    requestedParameters: MonitoringParameters;
};
/**
 * ClientMonitoredItem
 * @class ClientMonitoredItem
 * @extends ClientMonitoredItemBase
 *
 * - event:
 *   - "initialized"
 *   - "err"
 *   - "changed"
 *
 *  note: this.monitoringMode = subscription_service.MonitoringMode.Reporting;
 */
export declare class ClientMonitoredItemImpl extends EventEmitter implements ClientMonitoredItem {
    itemToMonitor: ReadValueId;
    monitoringParameters: MonitoringParameters;
    subscription: ClientSubscriptionImpl;
    monitoringMode: MonitoringMode;
    statusCode: StatusCode;
    monitoredItemId?: any;
    result?: MonitoredItemCreateResult;
    filterResult?: ExtensionObject;
    timestampsToReturn: TimestampsToReturn;
    private _pendingDataValue?;
    private _pendingEvents?;
    constructor(subscription: ClientSubscription, itemToMonitor: ReadValueIdOptions, monitoringParameters: MonitoringParametersOptions, timestampsToReturn: TimestampsToReturn, monitoringMode?: MonitoringMode);
    toString(): string;
    /**
     * terminate the monitored item by removing the MonitoredItem from its subscription
     */
    terminate(): Promise<void>;
    terminate(done: ErrorCallback): void;
    modify(parameters: MonitoringParametersOptions): Promise<StatusCode>;
    modify(parameters: MonitoringParametersOptions, timestampsToReturn: TimestampsToReturn): Promise<StatusCode>;
    modify(parameters: MonitoringParametersOptions, callback: (err: Error | null, statusCode?: StatusCode) => void): void;
    modify(parameters: MonitoringParametersOptions, timestampsToReturn: TimestampsToReturn | null, callback: (err: Error | null, statusCode?: StatusCode) => void): void;
    setMonitoringMode(monitoringMode: MonitoringMode): Promise<StatusCode>;
    setMonitoringMode(monitoringMode: MonitoringMode, callback: Callback<StatusCode>): void;
    /**
     * @internal
     * @param value
     * @private
     */
    _notify_value_change(value: DataValue): void;
    /**
     * @internal
     * @param eventFields
     * @private
     */
    _notify_event(eventFields: Variant[]): void;
    /**
     * @internal
     * @private
     */
    _prepare_for_monitoring(): PrepareForMonitoringResult;
    /**
     * @internal
     * @param monitoredItemResult
     * @private
     */
    _applyResult(monitoredItemResult: MonitoredItemCreateResult): void;
    _before_create(): void;
    /**
     * @internal
     * @param monitoredItemResult
     * @private
     */
    _after_create(monitoredItemResult: MonitoredItemCreateResult): void;
    _terminate_and_emit(err?: Error): void;
}
