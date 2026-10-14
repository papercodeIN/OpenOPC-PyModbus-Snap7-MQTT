/**
 * @module node-opcua-client
 */
import { EventEmitter } from "events";
import { DataValue, TimestampsToReturn } from "node-opcua-data-value";
import { ReadValueIdOptions } from "node-opcua-service-read";
import { Variant } from "node-opcua-variant";
import { MonitoringParametersOptions } from "node-opcua-types";
import { ClientMonitoredItemBase, ClientMonitoredItemOrGroupAction } from "./client_monitored_item_base";
import { ClientSubscription } from "./client_subscription";
export interface ClientMonitoredItem extends ClientMonitoredItemBase, ClientMonitoredItemOrGroupAction, EventEmitter {
    on(event: "changed", eventHandler: (dataValue: DataValue) => void): this;
    on(event: "changed", eventHandler: (values: Variant[]) => void): this;
    on(event: "terminated", eventHandler: () => void): this;
    on(event: "initialized", eventHandler: () => void): this;
    on(event: "err", eventHandler: (message: string) => void): this;
}
export declare class ClientMonitoredItem {
    static create(subscription: ClientSubscription, itemToMonitor: ReadValueIdOptions, monitoringParameters: MonitoringParametersOptions, timestampsToReturn?: TimestampsToReturn): ClientMonitoredItem;
}
