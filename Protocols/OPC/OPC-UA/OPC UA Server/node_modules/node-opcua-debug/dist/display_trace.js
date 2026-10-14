"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.traceFromThisProjectOnly = traceFromThisProjectOnly;
exports.displayTraceFromThisProjectOnly = displayTraceFromThisProjectOnly;
/**
 * @module node-opcua-debug
 */
// tslint:disable:no-console
const chalk_1 = __importDefault(require("chalk"));
function traceFromThisProjectOnly(err) {
    const str = [];
    str.push(chalk_1.default.cyan.bold(" display_trace_from_this_project_only = "));
    if (err) {
        str.push(err.message);
    }
    err = err || new Error("Error used to extract stack trace");
    let stack = err.stack;
    if (stack) {
        stack = stack.split("\n").filter((el) => el.match(/node-opcua/) && !el.match(/node_modules/));
        str.push(chalk_1.default.yellow(stack.join("\n")));
    }
    else {
        str.push(chalk_1.default.red(" NO STACK TO TRACE !!!!"));
    }
    return str.join("\n");
}
function displayTraceFromThisProjectOnly(err) {
    console.log(traceFromThisProjectOnly(err));
}
//# sourceMappingURL=display_trace.js.map