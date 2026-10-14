"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectLongOperation = detectLongOperation;
const LONG_EVENT_HANDLER = process.env.NODEOPCUA_LONG_EVENT_HANDLER ? parseFloat(process.env.NODEOPCUA_LONG_EVENT_HANDLER) : 100; // how long a write can take before we log a warning
const convertHrtimeToMilliseconds = (hrtime) => {
    const seconds = hrtime[0];
    const nanoseconds = hrtime[1];
    return seconds * 1e3 + nanoseconds * 1e-6;
};
function detectLongOperation(lambda, onLongOperation) {
    const start = process.hrtime();
    lambda();
    const duration = convertHrtimeToMilliseconds(process.hrtime(start));
    if (duration > LONG_EVENT_HANDLER) {
        onLongOperation(duration);
    }
}
//# sourceMappingURL=performance.js.map