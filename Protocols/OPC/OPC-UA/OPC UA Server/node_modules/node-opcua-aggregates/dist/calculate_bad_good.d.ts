import { StatusCode } from "node-opcua-status-code";
import { Interval, AggregateConfigurationOptions } from "./interval";
export declare function calculateBadAndGood(interval: Interval, options: AggregateConfigurationOptions): {
    durationGood: number;
    durationBad: number;
    durationUnknown: number;
    percentBad: number;
    percentGood: number;
    statusCode: StatusCode;
};
