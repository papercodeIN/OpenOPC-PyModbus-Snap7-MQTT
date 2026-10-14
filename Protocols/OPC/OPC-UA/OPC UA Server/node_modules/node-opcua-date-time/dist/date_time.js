"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.minOPCUADate = exports.minDate = exports.periodicClockAdjustment = exports.offsetFactor1601 = void 0;
exports.bn_dateToHundredNanoSecondFrom1601 = bn_dateToHundredNanoSecondFrom1601;
exports.bn_dateToHundredNanoSecondFrom1601Excess = bn_dateToHundredNanoSecondFrom1601Excess;
exports.bn_hundredNanoSecondFrom1601ToDate = bn_hundredNanoSecondFrom1601ToDate;
exports.getCurrentClockWithJavascriptDate = getCurrentClockWithJavascriptDate;
exports.installPeriodicClockAdjustment = installPeriodicClockAdjustment;
exports.uninstallPeriodicClockAdjustment = uninstallPeriodicClockAdjustment;
exports.getCurrentClock = getCurrentClock;
exports.coerceClock = coerceClock;
exports.isMinDate = isMinDate;
exports.getMinOPCUADate = getMinOPCUADate;
/**
 * @module node-opcua-date-time
 */
const long_1 = __importStar(require("long"));
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_utils_1 = require("node-opcua-utils");
exports.offsetFactor1601 = (function offset_factor_1601() {
    const utc1600 = new Date(Date.UTC(1601, 0, 1, 0, 0, 0));
    const t1600 = utc1600.getTime();
    const utc1600PlusOneDay = new Date(Date.UTC(1601, 0, 2, 0, 0, 0));
    const t1600OneDay = utc1600PlusOneDay.getTime();
    const factor1 = (24 * 60 * 60 * 1000 * 10000) / (t1600OneDay - t1600);
    const utc1970 = new Date(Date.UTC(1970, 0, 1, 0, 0, 0));
    const t1970 = utc1970.getTime();
    const offsetToGregorianCalendarZero = -t1600 + t1970;
    (0, node_opcua_assert_1.assert)(factor1 === 10000);
    (0, node_opcua_assert_1.assert)(offsetToGregorianCalendarZero === 11644473600000);
    return [offsetToGregorianCalendarZero, factor1];
})();
const offset = exports.offsetFactor1601[0];
const factor = exports.offsetFactor1601[1];
const offsetLong = (0, long_1.fromNumber)(offset, true);
const factorLong = (0, long_1.fromNumber)(factor, true);
// Extracted from OpcUA Spec v1.02 : part 6:
//
// 5.2.2.5 DateTime
// A DateTime value shall be encoded as a 64-bit signed integer (see Clause 5.2.2.2) which represents
// the number of 100 nanosecond intervals since January 1, 1601 (UTC) .
// Not all DevelopmentPlatforms will be able to represent the full range of dates and times that can be
// represented with this DataEncoding. For example, the UNIX time_t structure only has a 1 second
// resolution and cannot represent dates prior to 1970. For this reason, a number of rules shall be
// applied when dealing with date/time values that exceed the dynamic range of a DevelopmentPlatform.
//
// These rules are:
// a) A date/time value is encoded as 0 if either
//    1) The value is equal to or earlier than 1601-01-01 12:00AM.
//    2) The value is the earliest date that can be represented with the DevelopmentPlatform‟s encoding.
//
// b) A date/time is encoded as the maximum value for an Int64 if either
//     1) The value is equal to or greater than 9999-01-01 11:59:59PM,
//     2) The value is the latest date that can be represented with the DevelopmentPlatform‟s encoding.
//
// c) A date/time is decoded as the earliest time that can be represented on the platform if either
//    1) The encoded value is 0,
//    2) The encoded value represents a time earlier than the earliest time that can be
//       represented with the DevelopmentPlatform‟s encoding.
//
//  d) A date/time is decoded as the latest time that can be represented on the platform if either
//    1) The encoded value is the maximum value for an Int64,
//    2) The encoded value represents a time later than the latest time that can be represented with the
//       DevelopmentPlatform‟s encoding.
//
// These rules imply that the earliest and latest times that can be represented on a given platform are
// invalid date/time values and should be treated that way by Applications.
// A decoder shall truncate the value if a decoder encounters a DateTime value with a resolution that is
// greater than the resolution supported on the DevelopmentPlatform.
//
/**
 *
 * @param date        {Date}
 * @param picoseconds {Number} : represent the portion of the date that cannot be managed by the javascript Date object
 *
 * @returns {[high,low]}
 */
function bn_dateToHundredNanoSecondFrom1601(date, picoseconds) {
    // note : The value returned by the getTime method is the number
    //        of milliseconds since 1 January 1970 00:00:00 UTC.
    //
    const t = date.getTime(); // number of milliseconds since since 1 January 1970 00:00:00 UTC.
    const excess100nanosecond = picoseconds !== undefined ? Math.floor(picoseconds / 100000) : 0;
    //           value_64 = (t + offset ) * factor;
    const tL = long_1.default.fromNumber(t, false);
    const a = tL.add(offsetLong).multiply(factorLong).add(excess100nanosecond);
    const high_low = [a.getHighBits(), a.getLowBits()];
    const picoseconds2 = excess100nanosecond * 10000 + +picoseconds;
    picoseconds2;
    return high_low;
}
function bn_dateToHundredNanoSecondFrom1601Excess(date, picoseconds) {
    // 100 nano seconds = 100 x 1000 picoseconds
    return (picoseconds || 0) % 100000;
}
function bn_hundredNanoSecondFrom1601ToDate(high, low, picoseconds = 0, _value = null) {
    (0, node_opcua_assert_1.assert)(low !== undefined);
    //           value_64 / factor  - offset = t
    const l = new long_1.default(low, high, /*unsigned*/ true);
    const value1 = l.div(factor).toNumber() - offset;
    // const date = _value || new Date(value1);
    // if (_value) _value.setTime(value1);
    const date = new Date(value1);
    // enrich the date
    const excess100nanoInPico = l.mod(10000).mul(100000).toNumber();
    // picosecond will contains un-decoded 100 nanoseconds => 10 x 100 nanoseconds = 1 microsecond
    const picoseconds2 = excess100nanoInPico + (picoseconds || 0);
    return [date, picoseconds2];
}
let lastNowDate;
let lastPicoseconds = 0;
const smallTickPicosecond = 1000 * 100; // 100 nano second in picoseconds
/**
 *
 * @return PreciseClock
 */
function getCurrentClockWithJavascriptDate() {
    const now = new Date();
    if (lastNowDate && now.getTime() === lastNowDate.getTime()) {
        lastPicoseconds += smallTickPicosecond; // add 100-nano-second which is the resolution of OPCUA DateTime
    }
    else {
        lastPicoseconds = 0;
        lastNowDate = now;
    }
    return {
        timestamp: lastNowDate,
        picoseconds: lastPicoseconds
    };
}
let origin = (0, node_opcua_utils_1.hrtime)();
let refTime = Date.now();
exports.periodicClockAdjustment = {
    adjustmentCount: 0,
    interval: 3000 /* every 30 seconds */,
    timerInstallationCount: 0
};
// update refTime now and then to make sure that we don't miss
// any system time adjustment here such as a NTP clock event
// see #651
let timerId;
const g_setInterval = typeof global === "object" ? global.setInterval : setInterval;
const g_clearInterval = typeof global === "object" ? global.clearInterval : clearInterval;
function installPeriodicClockAdjustment() {
    exports.periodicClockAdjustment.timerInstallationCount++;
    if (timerId) {
        return;
    }
    timerId = g_setInterval(() => {
        origin = (0, node_opcua_utils_1.hrtime)();
        refTime = Date.now();
        exports.periodicClockAdjustment.adjustmentCount++;
    }, exports.periodicClockAdjustment.interval);
}
function uninstallPeriodicClockAdjustment() {
    exports.periodicClockAdjustment.timerInstallationCount--;
    if (exports.periodicClockAdjustment.timerInstallationCount <= 0) {
        g_clearInterval(timerId);
        timerId = null;
    }
}
const gClock = {
    tick: [0, 0],
    timestamp: new Date(),
    picoseconds: 0
};
// make sure we get a pointer to the actual process.hrtime,
// just in case it get overridden by some library (such as sinon)
const original_hrtime = node_opcua_utils_1.hrtime;
const setTimeout_check = setTimeout;
/*kWithProcessHRTime*/
function getCurrentClock() {
    if (setTimeout_check !== setTimeout) {
        // is fake sinon clock being used ?
        // in this case hrtime is not working
        return getCurrentClockWithJavascriptDate();
    }
    gClock.tick = original_hrtime(origin); // [seconds, nanoseconds]
    const milliseconds = gClock.tick[0] * 1000 + Math.floor(gClock.tick[1] / 1000000) + refTime;
    const picoseconds = (gClock.tick[1] % 1000000) * 1000;
    gClock.timestamp = new Date(milliseconds);
    gClock.picoseconds = picoseconds;
    return gClock;
}
function coerceClock(timestamp, picoseconds = 0) {
    if (timestamp) {
        return { timestamp: timestamp, picoseconds };
    }
    else {
        return getCurrentClock();
    }
}
function isMinDate(date) {
    if (typeof date === "number") {
        throw new Error("isMinDate: invalid argument");
    }
    return !date || date.getTime() === exports.minDate.getTime();
}
function getMinOPCUADate() {
    return new Date(Date.UTC(1601, 0, 1, 0, 0, 0));
}
// @deprecated use getMinOPCUADate() instead
exports.minDate = new Date(Date.UTC(1601, 0, 1, 0, 0, 0));
// @deprecated use getMinOPCUADate() instead
exports.minOPCUADate = exports.minDate;
//# sourceMappingURL=date_time.js.map