/**
 * @module node-opca-aggregates
 */
import { DataValue } from "node-opcua-data-value";
import { StatusCode } from "node-opcua-status-code";
import { AggregateConfigurationOptions } from "node-opcua-types";
export { AggregateConfigurationOptions } from "node-opcua-types";
export interface AggregateConfigurationOptionsEx extends AggregateConfigurationOptions {
    stepped?: boolean;
}
export declare function isGoodish2(statusCode: StatusCode, { treatUncertainAsBad }: {
    treatUncertainAsBad?: boolean;
}): boolean;
export declare function isUncertain(statusCode: StatusCode): boolean;
export interface IntervalOptions {
    startTime: Date;
    dataValues: DataValue[];
    index: number;
    count: number;
    isPartial: boolean;
    processingInterval: number;
}
interface DataValueWithIndex {
    index: number;
    dataValue: DataValue;
}
export declare function _findGoodDataValueBefore(dataValues: DataValue[], index: number, bTreatUncertainAsBad: boolean): DataValueWithIndex;
export declare function _findGoodDataValueAfter(dataValues: DataValue[], index: number, bTreatUncertainAsBad: boolean): DataValueWithIndex;
export declare function adjustProcessingOptions(options: AggregateConfigurationOptionsEx | null): AggregateConfigurationOptionsEx;
export declare class Interval {
    startTime: Date;
    dataValues: DataValue[];
    index: number;
    count: number;
    isPartial: boolean;
    processingInterval: number;
    constructor(options: IntervalOptions);
    getPercentBad(): number;
    /**
     * returns true if a raw data exists at start
     */
    hasRawDataAsStart(): boolean;
    /**
     * Find the first good or uncertain dataValue
     * just preceding this interval
     * @returns {*}
     */
    beforeStartDataValue(bTreatUncertainAsBad: boolean): DataValueWithIndex;
    nextStartDataValue(bTreatUncertainAsBad: boolean): DataValueWithIndex;
    toString(): string;
    getEffectiveEndTime(): number;
    /**
     *
     * @returns the interval duration
     */
    duration(): number;
    /**
     * returns the region duration starting at index and finishing at index+1 or end limit of the interval
     */
    regionDuration(index: number): number;
}
export declare function getInterval(startTime: Date, processingInterval: number, indexHint: number, dataValues: DataValue[]): Interval;
