"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buffer_ellipsis = buffer_ellipsis;
/**
 * @module node-opcua-utils
 */
function buffer_ellipsis(buffer, start, end) {
    start = start || 0;
    end = end || buffer.length;
    if (end - start < 40) {
        return buffer.subarray(start, end).toString("hex");
    }
    return buffer.subarray(start, start + 10).toString("hex") + " ... " + buffer.subarray(end - 10, end).toString("hex");
}
exports.buffer_ellipsis = buffer_ellipsis;
//# sourceMappingURL=buffer_ellipsis.js.map