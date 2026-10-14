/**
 * @module node-opcua-client-private
 */
import { EventEmitter } from "events";
import { TimestampsToReturn } from "node-opcua-data-value";
import { MonitoringMode, MonitoringParametersOptions } from "node-opcua-service-subscription";
import { StatusCode } from "node-opcua-status-code";
import { Callback, ErrorCallback } from "node-opcua-status-code";
import { ClientMonitoredItemBase } from "../client_monitored_item_base";
import { ClientMonitoredItemGroup } from "../client_monitored_item_group";
import { ClientSubscription } from "../client_subscription";
/**
 * ClientMonitoredItemGroup
 * event:
 *    "initialized"
 *    "err"
 *    "changed"
 *
 *  note: this.monitoringMode = subscription_service.MonitoringMode.Reporting;
 */
export declare class ClientMonitoredItemGroupImpl extends EventEmitter implements ClientMonitoredItemGroup {
    readonly monitoredItems: ClientMonitoredItemBase[];
    private readonly subscription;
    private timestampsToReturn;
    private readonly monitoringMode;
    constructor(subscription: ClientSubscription, itemsToMonitor: any[], monitoringParameters: MonitoringParametersOptions, timestampsToReturn: TimestampsToReturn, monitoringMode?: MonitoringMode);
    toString(): string;
    /**
     * remove the MonitoredItem from its subscription
     */
    terminate(): Promise<void>;
    terminate(done: ErrorCallback): void;
    /**

     */
    modify(parameters: MonitoringParametersOptions): Promise<StatusCode>;
    modify(parameters: MonitoringParametersOptions, timestampsToReturn: TimestampsToReturn): Promise<StatusCode>;
    modify(parameters: MonitoringParametersOptions, callback: (err: Error | null, statusCode?: StatusCode) => void): void;
    modify(parameters: MonitoringParametersOptions, timestampsToReturn: TimestampsToReturn | null, callback: (err: Error | null, statusCode?: StatusCode) => void): void;
    setMonitoringMode(monitoringMode: MonitoringMode): Promise<StatusCode>;
    setMonitoringMode(monitoringMode: MonitoringMode, callback: Callback<StatusCode>): void;
    /**
     * @internal

     * Creates the monitor item (monitoring mode = Reporting)
     * @private
     */
    _monitor(done: ErrorCallback): void;
    _terminate_and_emit(err?: Error): void;
}
