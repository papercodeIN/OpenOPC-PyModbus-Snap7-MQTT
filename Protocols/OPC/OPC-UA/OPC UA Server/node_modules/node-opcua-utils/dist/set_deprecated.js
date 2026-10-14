"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDeprecated = setDeprecated;
/**
 * @module node-opcua-utils
 */
// tslint:disable:ban-types
const chalk_1 = __importDefault(require("chalk"));
const node_opcua_assert_1 = require("node-opcua-assert");
/* istanbul ignore next */
function setDeprecated(constructor, methodName, helpString) {
    const oldMethod = constructor.prototype[methodName];
    (0, node_opcua_assert_1.assert)(oldMethod instanceof Function, "expecting a valid " + methodName + "method on class " + constructor.constructor.name);
    let counter = 0;
    constructor.prototype[methodName] = function (...args) {
        if (counter % 1000 === 0) {
            // tslint:disable:no-console
            console.log(chalk_1.default.green("Warning !"), chalk_1.default.green(chalk_1.default.bold(constructor.name + "#" + methodName), " is now deprecated"));
            console.log("         ", helpString);
        }
        counter++;
        return oldMethod.call(this, ...args);
    };
}
//# sourceMappingURL=set_deprecated.js.map