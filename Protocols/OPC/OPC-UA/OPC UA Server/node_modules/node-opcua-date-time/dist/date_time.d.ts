export declare const offsetFactor1601: number[];
/**
 *
 * @param date        {Date}
 * @param picoseconds {Number} : represent the portion of the date that cannot be managed by the javascript Date object
 *
 * @returns {[high,low]}
 */
export declare function bn_dateToHundredNanoSecondFrom1601(date: Date, picoseconds: number): number[];
export declare function bn_dateToHundredNanoSecondFrom1601Excess(date: Date, picoseconds: number): number;
export declare function bn_hundredNanoSecondFrom1601ToDate(high: number, low: number, picoseconds?: number, _value?: Date | null): [Date, number];
export interface PreciseClock {
    timestamp: Date;
    picoseconds: number;
}
export interface PreciseClockEx extends PreciseClock {
    tick: number[];
}
/**
 *
 * @return PreciseClock
 */
export declare function getCurrentClockWithJavascriptDate(): PreciseClock;
export declare const periodicClockAdjustment: {
    adjustmentCount: number;
    interval: number;
    timerInstallationCount: number;
};
export declare function installPeriodicClockAdjustment(): void;
export declare function uninstallPeriodicClockAdjustment(): void;
export declare function getCurrentClock(): PreciseClock;
export declare function coerceClock(timestamp: undefined | null | Date, picoseconds?: number): PreciseClock;
export declare function isMinDate(date?: Date | null): boolean;
export declare function getMinOPCUADate(): Date;
export declare const minDate: Date;
export declare const minOPCUADate: Date;
