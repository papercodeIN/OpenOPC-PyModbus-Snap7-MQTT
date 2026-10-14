"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hrtime = void 0;
// polyfil for window.performance.now
const performance = (typeof global === "object" && global.performance) || {};
const performanceNow = performance.now ||
    performance.mozNow ||
    performance.msNow ||
    performance.oNow ||
    performance.webkitNow ||
    function () {
        return new Date().getTime();
    };
// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime_for_browser(previousTimestamp) {
    previousTimestamp = previousTimestamp || [0, 0];
    const clocktime = performanceNow.call(performance) * 1e-3;
    let seconds = Math.floor(clocktime);
    let nanoseconds = Math.floor((clocktime % 1) * 1e9);
    if (previousTimestamp) {
        seconds = seconds - previousTimestamp[0];
        nanoseconds = nanoseconds - previousTimestamp[1];
        if (nanoseconds < 0) {
            seconds--;
            nanoseconds += 1e9;
        }
    }
    return [seconds, nanoseconds];
}
exports.hrtime = typeof process === "object" ? (process.hrtime || hrtime_for_browser) : hrtime_for_browser;
//# sourceMappingURL=hrtime.js.map