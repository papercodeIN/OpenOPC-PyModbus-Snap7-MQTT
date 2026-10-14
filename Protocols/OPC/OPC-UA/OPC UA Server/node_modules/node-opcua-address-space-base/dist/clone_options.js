"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDefaultCloneExtraInfo = exports.defaultCloneFilter = void 0;
const clone_helper_1 = require("./clone_helper");
exports.defaultCloneFilter = {
    shouldKeep: (node) => {
        if (node.modellingRule === "OptionalPlaceholder" || node.modellingRule === "MandatoryPlaceholder") {
            return false;
        }
        return true;
    },
    filterFor(node) {
        return this;
    }
};
const makeDefaultCloneExtraInfo = (node) => {
    const extraInfo = new clone_helper_1.CloneHelper();
    extraInfo.pushContext({ originalParent: node, clonedParent: node });
    return extraInfo;
};
exports.makeDefaultCloneExtraInfo = makeDefaultCloneExtraInfo;
//# sourceMappingURL=clone_options.js.map