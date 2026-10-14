"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexDump = hexDump;
/**
 * @module node-opcua-debug
 */
// tslint:disable:no-var-requires
const hexy = require("hexy");
function hexDump(buffer, width = 32, maxSize = 1024) {
    if (!buffer) {
        return "<>";
    }
    width = width || 32;
    if (buffer.length > maxSize) {
        return hexy.hexy(buffer.subarray(0, maxSize), { width, format: "twos" }) + "\n .... ( " + buffer.length + ")";
    }
    else {
        return hexy.hexy(buffer, { width, format: "twos" });
    }
}
//# sourceMappingURL=hexDump.js.map