"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjectClassName = getObjectClassName;
/**
 * @module node-opcua-utils
 */
/**

 * @param obj
 * @return {string}
 */
function getObjectClassName(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
}
//# sourceMappingURL=object_classname.js.map