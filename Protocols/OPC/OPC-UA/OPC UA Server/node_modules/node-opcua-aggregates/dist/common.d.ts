/**
 * @module node-opca-aggregates
 */
import { UAVariable } from "node-opcua-address-space";
import { DataValue } from "node-opcua-data-value";
import { Interval, AggregateConfigurationOptionsEx } from "./interval";
export declare function getAggregateData(node: UAVariable, processingInterval: number, startDate: Date, endDate: Date, lambda: (interval: Interval, aggregateConfiguration: AggregateConfigurationOptionsEx) => DataValue, callback: (err: Error | null, dataValues?: DataValue[]) => void): void;
export declare function interpolateValue(dataValue1: DataValue, dataValue2: DataValue, date: Date): DataValue;
