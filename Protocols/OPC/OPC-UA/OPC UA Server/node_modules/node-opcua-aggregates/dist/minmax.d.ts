/**
 * @module node-opca-aggregates
 */
import { UAVariable } from "node-opcua-address-space";
import { DataValue } from "node-opcua-data-value";
import { AggregateConfigurationOptions, Interval } from "./interval";
export declare function calculateIntervalMinValue(interval: Interval, options: AggregateConfigurationOptions): DataValue;
export declare function calculateIntervalMaxValue(interval: Interval, options: AggregateConfigurationOptions): DataValue;
/**
 *
 * @param node
 * @param processingInterval
 * @param startDate
 * @param endDate
 * @param callback
 */
export declare function getMinData(node: UAVariable, processingInterval: number, startDate: Date, endDate: Date, callback: (err: Error | null, dataValues?: DataValue[]) => void): void;
export declare function getMaxData(node: UAVariable, processingInterval: number, startDate: Date, endDate: Date, callback: (err: Error | null, dataValues?: DataValue[]) => void): void;
