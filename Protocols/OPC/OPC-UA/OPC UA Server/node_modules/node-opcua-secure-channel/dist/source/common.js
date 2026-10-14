"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFirstCertificateInChain = extractFirstCertificateInChain;
exports.getThumbprint = getThumbprint;
/**
 * @module node-opcua-secure-channel
 */
const web_1 = require("node-opcua-crypto/web");
function extractFirstCertificateInChain(certificateChain) {
    if (!certificateChain || certificateChain.length === 0) {
        return null;
    }
    const c = (0, web_1.split_der)(certificateChain);
    return c[0];
}
function getThumbprint(certificateChain) {
    if (!certificateChain) {
        return null;
    }
    return (0, web_1.makeSHA1Thumbprint)(extractFirstCertificateInChain(certificateChain));
}
//# sourceMappingURL=common.js.map