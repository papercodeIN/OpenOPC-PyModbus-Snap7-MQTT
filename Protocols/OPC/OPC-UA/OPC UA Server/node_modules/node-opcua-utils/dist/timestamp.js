"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timestamp = timestamp;
function w(s, length) {
    return ("" + s).padStart(length, "0");
}
function t(d) {
    return w(d.getUTCHours(), 2) + ":" + w(d.getUTCMinutes(), 2) + ":" + w(d.getUTCSeconds(), 2) + ":" + w(d.getMilliseconds(), 3);
}
function timestamp() {
    return t(new Date());
}
//# sourceMappingURL=timestamp.js.map