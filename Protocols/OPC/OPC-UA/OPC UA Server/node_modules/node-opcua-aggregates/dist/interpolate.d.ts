/**
 * @module node-opcua-aggregates
 */
import { UAVariable } from "node-opcua-address-space";
import { DataValue } from "node-opcua-data-value";
import { AggregateConfigurationOptionsEx, Interval } from "./interval";
export declare function interpolatedValue(interval: Interval, options: AggregateConfigurationOptionsEx): DataValue;
/**
 *
 * @param node
 * @param processingInterval
 * @param startDate
 * @param endDate
 * @param callback
 */
export declare function getInterpolatedData(node: UAVariable, processingInterval: number, startDate: Date, endDate: Date, callback: (err: Error | null, dataValues?: DataValue[]) => void): void;
