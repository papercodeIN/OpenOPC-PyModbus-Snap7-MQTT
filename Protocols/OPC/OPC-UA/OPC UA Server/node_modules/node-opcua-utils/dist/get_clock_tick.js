"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_clock_tick = void 0;
require("./hrtime");
if (typeof process === "object" && process.hrtime) {
    const tickOrigin = process.hrtime();
    // clock it as a double in millisecond
    // so we can measure very tiny time intervals
    exports.get_clock_tick = () => {
        const hrt = process.hrtime(tickOrigin);
        const r = (hrt[0]) * 1000.0 + Math.ceil((hrt[1] / 1e6) * 1000) / 1000;
        return r;
    };
}
else {
    exports.get_clock_tick = () => Date.now();
}
//# sourceMappingURL=get_clock_tick.js.map