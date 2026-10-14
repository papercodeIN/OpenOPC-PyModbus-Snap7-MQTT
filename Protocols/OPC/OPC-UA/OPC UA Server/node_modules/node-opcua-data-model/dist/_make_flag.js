"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._make_flag = _make_flag;
function _make_flag(str, noneValue, T) {
    if (typeof str === "number") {
        const value = str;
        if (value === 0) {
            return noneValue;
        }
        return value;
    }
    let accessFlag = 0;
    if (str === "" || str === null) {
        accessFlag = noneValue;
    }
    else {
        const flags = str.split(" | ");
        accessFlag = 0;
        for (const flag of flags) {
            accessFlag |= T[flag];
        }
    }
    return accessFlag;
}
//# sourceMappingURL=_make_flag.js.map