"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceBufferWithHexDump = replaceBufferWithHexDump;
/**
 * @module node-opcua-utils
 */
function replaceBufferWithHexDump(obj) {
    for (const p in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, p)) {
            if (obj[p] instanceof Buffer) {
                obj[p] = "<BUFFER>" + obj[p].toString("hex") + "</BUFFER>";
            }
            else if (typeof obj[p] === "object") {
                replaceBufferWithHexDump(obj[p]);
            }
        }
    }
    return obj;
}
//# sourceMappingURL=replace_buffer_with_hex_dump.js.map