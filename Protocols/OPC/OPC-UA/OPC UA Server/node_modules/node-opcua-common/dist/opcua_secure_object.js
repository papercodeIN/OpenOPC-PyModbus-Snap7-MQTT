"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPCUASecureObject = void 0;
exports.getPartialCertificateChain1 = getPartialCertificateChain1;
exports.getPartialCertificateChain = getPartialCertificateChain;
/**
 * @module node-opcua-common
 */
const events_1 = require("events");
const fs_1 = __importDefault(require("fs"));
const node_opcua_assert_1 = require("node-opcua-assert");
const web_1 = require("node-opcua-crypto/web");
const node_opcua_crypto_1 = require("node-opcua-crypto");
function _load_certificate(certificateFilename) {
    const der = (0, node_opcua_crypto_1.readCertificate)(certificateFilename);
    return der;
}
function _load_private_key(privateKeyFilename) {
    return (0, node_opcua_crypto_1.readPrivateKey)(privateKeyFilename);
}
function getPartialCertificateChain1(certificateChain, maxSize) {
    return certificateChain || undefined;
}
function getPartialCertificateChain(certificateChain, maxSize) {
    if (!certificateChain || certificateChain.length === 0) {
        return undefined;
    }
    if (maxSize === undefined) {
        return certificateChain;
    }
    const certificates = (0, web_1.split_der)(certificateChain);
    // at least include first certificate
    let buffer = certificates.length == 1 ? certificateChain : Buffer.from(certificates[0]);
    // Throw if first certificate already exceed maxSize
    if (buffer.length > maxSize) {
        throw new Error(`getPartialCertificateChain not enough space for leaf certificate ${maxSize} < ${buffer.length}`);
    }
    let index = 1;
    while (index < certificates.length && buffer.length + certificates[index].length < maxSize) {
        buffer = Buffer.concat([buffer, certificates[index]]);
        index++;
    }
    return buffer;
}
/**
 * an object that provides a certificate and a privateKey
 */
class OPCUASecureObject extends events_1.EventEmitter {
    constructor(options) {
        super();
        (0, node_opcua_assert_1.assert)(typeof options.certificateFile === "string");
        (0, node_opcua_assert_1.assert)(typeof options.privateKeyFile === "string");
        this.certificateFile = options.certificateFile || "invalid certificate file";
        this.privateKeyFile = options.privateKeyFile || "invalid private key file";
    }
    getCertificate() {
        const priv = this;
        if (!priv.$$certificate) {
            const certChain = this.getCertificateChain();
            priv.$$certificate = (0, web_1.split_der)(certChain)[0];
        }
        return priv.$$certificate;
    }
    getCertificateChain() {
        const priv = this;
        if (!priv.$$certificateChain) {
            (0, node_opcua_assert_1.assert)(fs_1.default.existsSync(this.certificateFile), "Certificate file must exist :" + this.certificateFile);
            priv.$$certificateChain = _load_certificate(this.certificateFile);
            if (priv.$$certificateChain && priv.$$certificateChain.length === 0) {
                // do it again for debug purposes
                priv.$$certificateChain = _load_certificate(this.certificateFile);
                throw new Error("Invalid certificate length = 0 " + this.certificateFile);
            }
        }
        return priv.$$certificateChain;
    }
    getPrivateKey() {
        const priv = this;
        if (!priv.$$privateKey) {
            (0, node_opcua_assert_1.assert)(fs_1.default.existsSync(this.privateKeyFile), "private file must exist :" + this.privateKeyFile);
            priv.$$privateKey = _load_private_key(this.privateKeyFile);
        }
        (0, node_opcua_assert_1.assert)(!(priv.$$privateKey instanceof Buffer), "should not be a buffer");
        return priv.$$privateKey;
    }
}
exports.OPCUASecureObject = OPCUASecureObject;
//# sourceMappingURL=opcua_secure_object.js.map