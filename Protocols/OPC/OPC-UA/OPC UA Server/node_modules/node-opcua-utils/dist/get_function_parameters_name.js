"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunctionParameterNames = getFunctionParameterNames;
/**
 * @module node-opcua-utils
 */
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
const ARGUMENT_NAMES = /([^\s,]+)/g;
function getFunctionParameterNames(func) {
    const fnStr = func.toString().replace(STRIP_COMMENTS, "");
    const result = fnStr.slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")")).match(ARGUMENT_NAMES);
    if (!result) {
        return [];
    }
    return result;
}
//# sourceMappingURL=get_function_parameters_name.js.map