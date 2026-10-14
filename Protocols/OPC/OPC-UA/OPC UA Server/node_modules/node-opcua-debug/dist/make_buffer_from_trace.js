"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inlineText = inlineText;
exports.makeBufferFromTrace = makeBufferFromTrace;
/**
 * @module node-opcua-debug
 */
const node_opcua_buffer_utils_1 = require("node-opcua-buffer-utils");
function inlineText(f) {
    let k = f
        .toString()
        .replace(/^[^/]+\/\*!?/, "")
        .replace(/\*\/[^/]+$/, "");
    k = k
        .split("\n")
        .map((t) => t.trim())
        .join("\n");
    return k;
}
function hexString(str) {
    let hexLine = "";
    let lines = str.split("\n");
    if (lines.length === 0) {
        return hexLine;
    }
    while (lines.length && lines[0].length === 0) {
        lines = lines.splice(1);
    }
    // find prefix
    const m = lines[0].match(/[0-9a-fA-F:]* +/);
    if (!m)
        return hexLine;
    const prefixLength = m[0].length;
    for (let line of lines) {
        line = line.trim();
        if (line.length > 80) {
            line = line.substring(10, 98 + 10).trim();
            hexLine = hexLine ? hexLine + " " + line : line;
        }
        else if (line.length > 60) {
            line = line.substring(7, 48 + 7).trim();
            hexLine = hexLine ? hexLine + " " + line : line;
        }
        else if (line.length > prefixLength) {
            line = line.substring(prefixLength, prefixLength + 48).trim();
            hexLine = hexLine ? hexLine + " " + line : line;
        }
    }
    return hexLine;
}
// tslint:disable:ban-types
function makeBufferFromTrace(func) {
    if (typeof func === "string") {
        return (0, node_opcua_buffer_utils_1.makeBuffer)(hexString(func));
    }
    return (0, node_opcua_buffer_utils_1.makeBuffer)(hexString(inlineText(func)));
}
//# sourceMappingURL=make_buffer_from_trace.js.map