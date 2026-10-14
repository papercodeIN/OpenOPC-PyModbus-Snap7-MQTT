"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDecoration = removeDecoration;
const nonTextReg = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
function removeDecoration(str) {
    return str.replace(nonTextReg, "");
}
//# sourceMappingURL=remove_decoration.js.map