"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLocaleId = validateLocaleId;
exports.encodeLocaleId = encodeLocaleId;
exports.decodeLocaleId = decodeLocaleId;
const string_1 = require("./string");
function validateLocaleId(value) {
    // TODO : check that localeID is well-formed
    // see part 3 $8.4 page 63
    return true;
}
function encodeLocaleId(localeId, stream) {
    return (0, string_1.encodeUAString)(localeId, stream);
}
function decodeLocaleId(stream) {
    return (0, string_1.decodeUAString)(stream);
}
//# sourceMappingURL=locale_id.js.map