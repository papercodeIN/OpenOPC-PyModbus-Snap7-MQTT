"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDataEncoding = isDataEncoding;
exports.isValidDataEncoding = isValidDataEncoding;
function isDataEncoding(dataEncoding) {
    return !!dataEncoding && typeof dataEncoding === "object" && typeof dataEncoding.name === "string";
}
const validEncoding = ["DefaultBinary", "DefaultXml", "DefaultJson"];
function isValidDataEncoding(dataEncoding) {
    if (!dataEncoding) {
        return true;
    }
    if (Object.prototype.hasOwnProperty.call(dataEncoding, "name")) {
        dataEncoding = dataEncoding.name;
    }
    if (!dataEncoding) {
        return true;
    }
    return validEncoding.indexOf(dataEncoding) !== -1;
}
//# sourceMappingURL=data_encoding.js.map