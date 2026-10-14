"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.absoluteDurationToString = absoluteDurationToString;
exports.durationToString = durationToString;
const secondsInAMinute = 60;
const secondsInAnHour = secondsInAMinute * 60;
const secondsInADay = secondsInAnHour * 24;
const secondsInAYear = 365 * secondsInADay;
function absoluteDurationToString(durationInMilliseconds) {
    const seconds = Math.abs(durationInMilliseconds / 1000);
    const numYears = Math.floor(seconds / secondsInAYear);
    const numDays = Math.floor((seconds % secondsInAYear) / secondsInADay);
    const numHours = Math.floor(((seconds % secondsInAYear) % secondsInADay) / secondsInAnHour);
    const numMinutes = Math.floor((((seconds % secondsInAYear) % secondsInADay) % secondsInAnHour) / secondsInAMinute);
    const numSeconds = ((((seconds % secondsInAYear) % secondsInADay) % secondsInAnHour) % secondsInAMinute).toFixed(3);
    const str = [];
    if (numYears !== 0) {
        return `${numYears} years ${numDays} days ${numHours} hours ${numMinutes} minutes ${numSeconds} seconds`;
    }
    if (numDays !== 0) {
        return `${numDays} days ${numHours} hours ${numMinutes} minutes ${numSeconds} seconds`;
    }
    if (numHours !== 0) {
        return `${numHours} hours ${numMinutes} minutes ${numSeconds} seconds`;
    }
    if (numMinutes !== 0) {
        return `${numMinutes} minutes ${numSeconds} seconds`;
    }
    return `${numSeconds} seconds`;
}
function durationToString(durationInMilliseconds) {
    if (durationInMilliseconds < 0) {
        return `late by ${absoluteDurationToString(-durationInMilliseconds)}`;
    }
    return `early by ${absoluteDurationToString(durationInMilliseconds)}`;
}
//# sourceMappingURL=duration_to_string.js.map