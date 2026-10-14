"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dump = dump;
exports.dumpIf = dumpIf;
/**
 * @module node-opcua-debug
 */
// tslint:disable:no-console
const util_1 = require("util");
function dump(obj) {
    console.log("\n", (0, util_1.inspect)(JSON.parse(JSON.stringify(obj)), { colors: true, depth: 10 }));
}
function dumpIf(condition, obj) {
    if (condition) {
        dump(obj);
    }
}
//# sourceMappingURL=dump_if.js.map