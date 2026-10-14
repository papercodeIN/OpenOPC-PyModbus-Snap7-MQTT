import { TimestampsToReturn } from "node-opcua-data-value";
import { MonitoredItemModifyResult, MonitoringMode } from "node-opcua-service-subscription";
import { StatusCode } from "node-opcua-status-code";
import { Callback, ErrorCallback } from "node-opcua-status-code";
import { MonitoringParametersOptions } from "node-opcua-types";
import { ClientMonitoredItemBase } from "./client_monitored_item_base";
import { ClientSubscription } from "./client_subscription";
/**
 * @internal
 */
export declare class ClientMonitoredItemToolbox {
    static _toolbox_monitor(subscription: ClientSubscription, timestampsToReturn: TimestampsToReturn, monitoredItems: ClientMonitoredItemBase[], done: ErrorCallback): void;
    static _toolbox_modify(subscription: ClientSubscription, monitoredItems: ClientMonitoredItemBase[], parameters: MonitoringParametersOptions, timestampsToReturn: TimestampsToReturn, callback: Callback<MonitoredItemModifyResult[]>): void;
    static _toolbox_setMonitoringMode(subscription: ClientSubscription, monitoredItems: ClientMonitoredItemBase[], monitoringMode: MonitoringMode, callback: Callback<StatusCode[]>): void;
}
