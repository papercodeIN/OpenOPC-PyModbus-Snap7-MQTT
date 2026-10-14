"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
// ---------------------------------------------------------------------------------------------------------------------
// node-opcua
// ---------------------------------------------------------------------------------------------------------------------
// Copyright (c) 2014-2022 - Etienne Rossignon - etienne.rossignon (at) gadz.org
// Copyright (c) 2022-2025 - Sterfive.com
// ---------------------------------------------------------------------------------------------------------------------
//
// This  project is licensed under the terms of the MIT license.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so,  subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
// Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
// WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// ---------------------------------------------------------------------------------------------------------------------
// tslint:disable:no-shadowed-variable
// tslint:disable:member-ordering
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateManager = exports.CertificateManagerState = exports.VerificationStatus = void 0;
exports.findIssuerCertificateInChain = findIssuerCertificateInChain;
const assert_1 = __importDefault(require("assert"));
const chalk_1 = __importDefault(require("chalk"));
const chokidar_1 = __importDefault(require("chokidar"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const global_mutex_1 = require("@ster5/global-mutex");
const node_opcua_crypto_1 = require("node-opcua-crypto");
const debug_1 = require("../toolbox/debug");
const common2_1 = require("../toolbox/common2");
const without_openssl_1 = require("../toolbox/without_openssl");
const simple_config_template_cnf_1 = __importDefault(require("./templates/simple_config_template.cnf"));
/**
 *
 * a minimalist config file for openssl that allows
 * self-signed certificate to be generated.
 *
 */
// tslint:disable-next-line:variable-name
const configurationFileSimpleTemplate = simple_config_template_cnf_1.default;
const fsWriteFile = fs_1.default.promises.writeFile;
var VerificationStatus;
(function (VerificationStatus) {
    /** The certificate provided as a parameter is not valid. */
    VerificationStatus["BadCertificateInvalid"] = "BadCertificateInvalid";
    /** An error occurred verifying security. */
    VerificationStatus["BadSecurityChecksFailed"] = "BadSecurityChecksFailed";
    /** The certificate does not meet the requirements of the security policy. */
    VerificationStatus["BadCertificatePolicyCheckFailed"] = "BadCertificatePolicyCheckFailed";
    /** The certificate has expired or is not yet valid. */
    VerificationStatus["BadCertificateTimeInvalid"] = "BadCertificateTimeInvalid";
    /** An issuer certificate has expired or is not yet valid. */
    VerificationStatus["BadCertificateIssuerTimeInvalid"] = "BadCertificateIssuerTimeInvalid";
    /** The HostName used to connect to a server does not match a HostName in the certificate. */
    VerificationStatus["BadCertificateHostNameInvalid"] = "BadCertificateHostNameInvalid";
    /** The URI specified in the ApplicationDescription does not match the URI in the certificate. */
    VerificationStatus["BadCertificateUriInvalid"] = "BadCertificateUriInvalid";
    /** The certificate may not be used for the requested operation. */
    VerificationStatus["BadCertificateUseNotAllowed"] = "BadCertificateUseNotAllowed";
    /** The issuer certificate may not be used for the requested operation. */
    VerificationStatus["BadCertificateIssuerUseNotAllowed"] = "BadCertificateIssuerUseNotAllowed";
    /** The certificate is not trusted. */
    VerificationStatus["BadCertificateUntrusted"] = "BadCertificateUntrusted";
    /** It was not possible to determine if the certificate has been revoked. */
    VerificationStatus["BadCertificateRevocationUnknown"] = "BadCertificateRevocationUnknown";
    /** It was not possible to determine if the issuer certificate has been revoked. */
    VerificationStatus["BadCertificateIssuerRevocationUnknown"] = "BadCertificateIssuerRevocationUnknown";
    /** The certificate has been revoked. */
    VerificationStatus["BadCertificateRevoked"] = "BadCertificateRevoked";
    /** The issuer certificate has been revoked. */
    VerificationStatus["BadCertificateIssuerRevoked"] = "BadCertificateIssuerRevoked";
    /** The certificate chain is incomplete. */
    VerificationStatus["BadCertificateChainIncomplete"] = "BadCertificateChainIncomplete";
    /** Validation OK. */
    VerificationStatus["Good"] = "Good";
})(VerificationStatus || (exports.VerificationStatus = VerificationStatus = {}));
function makeFingerprint(certificate) {
    return (0, node_opcua_crypto_1.makeSHA1Thumbprint)(certificate).toString("hex");
}
function short(stringToShorten) {
    return stringToShorten.substring(0, 10);
}
const forbiddenChars = /[\x00-\x1F<>:"\/\\|?*]/g;
function buildIdealCertificateName(certificate) {
    const fingerprint = makeFingerprint(certificate);
    try {
        const commonName = (0, node_opcua_crypto_1.exploreCertificate)(certificate).tbsCertificate.subject.commonName || "";
        // commonName may contain invalid characters for a filename such as / or \ or :
        // that we need to replace with a valid character.
        // replace / or \ or : with _
        const sanitizedCommonName = commonName.replace(forbiddenChars, "_");
        return sanitizedCommonName + "[" + fingerprint + "]";
    }
    catch (err) {
        // make be certificate is incorrect !
        return "invalid_certificate_[" + fingerprint + "]";
    }
}
function findMatchingIssuerKey(entries, wantedIssuerKey) {
    const selected = entries.filter(({ certificate }) => {
        const info = (0, node_opcua_crypto_1.exploreCertificate)(certificate);
        return info.tbsCertificate.extensions && info.tbsCertificate.extensions.subjectKeyIdentifier === wantedIssuerKey;
    });
    return selected;
}
function isSelfSigned2(info) {
    var _a, _b, _c;
    return (((_a = info.tbsCertificate.extensions) === null || _a === void 0 ? void 0 : _a.subjectKeyIdentifier) ===
        ((_c = (_b = info.tbsCertificate.extensions) === null || _b === void 0 ? void 0 : _b.authorityKeyIdentifier) === null || _c === void 0 ? void 0 : _c.keyIdentifier));
}
function isSelfSigned3(certificate) {
    const info = (0, node_opcua_crypto_1.exploreCertificate)(certificate);
    return isSelfSigned2(info);
}
function findIssuerCertificateInChain(certificate, chain) {
    var _a, _b;
    if (!certificate) {
        return null;
    }
    const certInfo = (0, node_opcua_crypto_1.exploreCertificate)(certificate);
    // istanbul ignore next
    if (isSelfSigned2(certInfo)) {
        // the certificate is self signed so is it's own issuer.
        return certificate;
    }
    const wantedIssuerKey = (_b = (_a = certInfo.tbsCertificate.extensions) === null || _a === void 0 ? void 0 : _a.authorityKeyIdentifier) === null || _b === void 0 ? void 0 : _b.keyIdentifier;
    // istanbul ignore next
    if (!wantedIssuerKey) {
        // Certificate has no extension 3 ! the certificate might have been generated by an old system
        (0, debug_1.debugLog)("Certificate has no extension 3");
        return null;
    }
    const potentialIssuers = chain.filter((c) => {
        const info = (0, node_opcua_crypto_1.exploreCertificate)(c);
        return info.tbsCertificate.extensions && info.tbsCertificate.extensions.subjectKeyIdentifier === wantedIssuerKey;
        return true;
    });
    if (potentialIssuers.length === 1) {
        return potentialIssuers[0];
    }
    if (potentialIssuers.length > 1) {
        (0, debug_1.debugLog)("findIssuerCertificateInChain: certificate is not self-signed but has several issuers");
        return potentialIssuers[0];
    }
    return null;
}
var CertificateManagerState;
(function (CertificateManagerState) {
    CertificateManagerState[CertificateManagerState["Uninitialized"] = 0] = "Uninitialized";
    CertificateManagerState[CertificateManagerState["Initializing"] = 1] = "Initializing";
    CertificateManagerState[CertificateManagerState["Initialized"] = 2] = "Initialized";
    CertificateManagerState[CertificateManagerState["Disposing"] = 3] = "Disposing";
    CertificateManagerState[CertificateManagerState["Disposed"] = 4] = "Disposed";
})(CertificateManagerState || (exports.CertificateManagerState = CertificateManagerState = {}));
class CertificateManager {
    constructor(options) {
        this.untrustUnknownCertificate = true;
        this.state = CertificateManagerState.Uninitialized;
        this.folderPoolingInterval = 5000;
        this._watchers = [];
        this._readCertificatesCalled = false;
        this._filenameToHash = {};
        this._thumbs = {
            rejected: {},
            trusted: {},
            issuers: {
                certs: {},
            },
            crl: {},
            issuersCrl: {},
        };
        this._pending_crl_to_process = 0;
        this.queue = [];
        options.keySize = options.keySize || 2048;
        (0, assert_1.default)(Object.prototype.hasOwnProperty.call(options, "location"));
        (0, assert_1.default)(Object.prototype.hasOwnProperty.call(options, "keySize"));
        (0, assert_1.default)(this.state === CertificateManagerState.Uninitialized);
        this.location = (0, common2_1.makePath)(options.location, "");
        this.keySize = options.keySize;
        (0, common2_1.mkdirRecursiveSync)(options.location);
        // istanbul ignore next
        if (!fs_1.default.existsSync(this.location)) {
            throw new Error("CertificateManager cannot access location " + this.location);
        }
    }
    get configFile() {
        return path_1.default.join(this.rootDir, "own/openssl.cnf");
    }
    get rootDir() {
        return this.location;
    }
    get privateKey() {
        return path_1.default.join(this.rootDir, "own/private/private_key.pem");
    }
    get randomFile() {
        return path_1.default.join(this.rootDir, "./random.rnd");
    }
    /**
     * returns the certificate status trusted/rejected
     * @param certificate
     */
    getCertificateStatus(certificate) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initialize();
            let status = yield this._checkRejectedOrTrusted(certificate);
            if (status === "unknown") {
                (0, assert_1.default)(certificate instanceof Buffer);
                const pem = (0, node_opcua_crypto_1.toPem)(certificate, "CERTIFICATE");
                const fingerprint = makeFingerprint(certificate);
                const filename = path_1.default.join(this.rejectedFolder, buildIdealCertificateName(certificate) + ".pem");
                yield fs_1.default.promises.writeFile(filename, pem);
                this._thumbs.rejected[fingerprint] = {
                    certificate,
                    filename,
                };
                status = "rejected";
            }
            return status;
        });
    }
    rejectCertificate(certificate) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._moveCertificate(certificate, "rejected");
        });
    }
    trustCertificate(certificate) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._moveCertificate(certificate, "trusted");
        });
    }
    get rejectedFolder() {
        return path_1.default.join(this.rootDir, "rejected");
    }
    get trustedFolder() {
        return path_1.default.join(this.rootDir, "trusted/certs");
    }
    get crlFolder() {
        return path_1.default.join(this.rootDir, "trusted/crl");
    }
    get issuersCertFolder() {
        return path_1.default.join(this.rootDir, "issuers/certs");
    }
    get issuersCrlFolder() {
        return path_1.default.join(this.rootDir, "issuers/crl");
    }
    isCertificateTrusted(certificate) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const fingerprint = makeFingerprint(certificate);
            const certificateInTrust = (_a = this._thumbs.trusted[fingerprint]) === null || _a === void 0 ? void 0 : _a.certificate;
            if (certificateInTrust) {
                return "Good";
            }
            else {
                const certificateInRejected = this._thumbs.rejected[fingerprint];
                if (!certificateInRejected) {
                    const certificateFilenameInRejected = path_1.default.join(this.rejectedFolder, buildIdealCertificateName(certificate) + ".pem");
                    if (!this.untrustUnknownCertificate) {
                        return "Good";
                    }
                    // Certificate should be mark as untrusted
                    // let's first verify that certificate is valid ,as we don't want to write invalid data
                    try {
                        const certificateInfo = (0, node_opcua_crypto_1.exploreCertificateInfo)(certificate);
                        certificateInfo;
                    }
                    catch (err) {
                        return "BadCertificateInvalid";
                    }
                    (0, debug_1.debugLog)("certificate has never been seen before and is now rejected (untrusted) ", certificateFilenameInRejected);
                    yield fsWriteFile(certificateFilenameInRejected, (0, node_opcua_crypto_1.toPem)(certificate, "CERTIFICATE"));
                }
                return "BadCertificateUntrusted";
            }
        });
    }
    _innerVerifyCertificateAsync(certificate, isIssuer, level, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            if (level >= 5) {
                // maximum level of certificate in chain reached !
                return VerificationStatus.BadSecurityChecksFailed;
            }
            const chain = (0, node_opcua_crypto_1.split_der)(certificate);
            (0, debug_1.debugLog)("NB CERTIFICATE IN CHAIN = ", chain.length);
            const info = (0, node_opcua_crypto_1.exploreCertificate)(chain[0]);
            let hasValidIssuer = false;
            let hasTrustedIssuer = false;
            // check if certificate is attached to a issuer
            const hasIssuerKey = (_b = (_a = info.tbsCertificate.extensions) === null || _a === void 0 ? void 0 : _a.authorityKeyIdentifier) === null || _b === void 0 ? void 0 : _b.keyIdentifier;
            (0, debug_1.debugLog)("Certificate as an Issuer Key", hasIssuerKey);
            if (hasIssuerKey) {
                const isSelfSigned = isSelfSigned2(info);
                (0, debug_1.debugLog)("Is the Certificate self-signed  ?", isSelfSigned);
                if (!isSelfSigned) {
                    (0, debug_1.debugLog)("Is issuer found in the list of know issuers ?", "\n subjectKeyIdentifier   = ", (_c = info.tbsCertificate.extensions) === null || _c === void 0 ? void 0 : _c.subjectKeyIdentifier, "\n authorityKeyIdentifier = ", (_e = (_d = info.tbsCertificate.extensions) === null || _d === void 0 ? void 0 : _d.authorityKeyIdentifier) === null || _e === void 0 ? void 0 : _e.keyIdentifier);
                    let issuerCertificate = yield this.findIssuerCertificate(chain[0]);
                    if (!issuerCertificate) {
                        // the issuer has not been found in the list of trusted certificate
                        // may be the issuer certificate is in the chain itself ?
                        issuerCertificate = findIssuerCertificateInChain(chain[0], chain);
                        if (!issuerCertificate) {
                            (0, debug_1.debugLog)(" the issuer has not been found in the chain itself nor in the issuer.cert list => the chain is incomplete!");
                            return VerificationStatus.BadCertificateChainIncomplete;
                        }
                        (0, debug_1.debugLog)(" the issuer certificate has been found in the chain itself ! the chain is complete !");
                    }
                    else {
                        (0, debug_1.debugLog)(" the issuer certificate has been found in the issuer.cert folder !");
                    }
                    const issuerStatus = yield this._innerVerifyCertificateAsync(issuerCertificate, true, level + 1, options);
                    if (issuerStatus === VerificationStatus.BadCertificateRevocationUnknown) {
                        // the issuer must have a CRL available .... !
                        return VerificationStatus.BadCertificateIssuerRevocationUnknown;
                    }
                    if (issuerStatus === VerificationStatus.BadCertificateIssuerRevocationUnknown) {
                        // the issuer must have a CRL available .... !
                        return VerificationStatus.BadCertificateIssuerRevocationUnknown;
                    }
                    if (issuerStatus === VerificationStatus.BadCertificateTimeInvalid) {
                        if (!options || !options.acceptOutDatedIssuerCertificate) {
                            // the issuer must have valid dates ....
                            return VerificationStatus.BadCertificateIssuerTimeInvalid;
                        }
                    }
                    if (issuerStatus == VerificationStatus.BadCertificateUntrusted) {
                        (0, debug_1.debugLog)("warning issuerStatus = ", issuerStatus.toString(), "the issuer certificate is not trusted");
                        // return VerificationStatus.BadSecurityChecksFailed;
                    }
                    if (issuerStatus !== VerificationStatus.Good && issuerStatus !== VerificationStatus.BadCertificateUntrusted) {
                        // if the issuer has other issue => let's drop!
                        return VerificationStatus.BadSecurityChecksFailed;
                    }
                    // verify that certificate was signed by issuer
                    const isCertificateSignatureOK = (0, node_opcua_crypto_1.verifyCertificateSignature)(certificate, issuerCertificate);
                    if (!isCertificateSignatureOK) {
                        (0, debug_1.debugLog)(" the certificate was not signed by the issuer as it claim to be ! Danger");
                        return VerificationStatus.BadSecurityChecksFailed;
                    }
                    hasValidIssuer = true;
                    // let detected if our certificate is in the revocation list
                    let revokedStatus = yield this.isCertificateRevoked(certificate);
                    if (revokedStatus === VerificationStatus.BadCertificateRevocationUnknown) {
                        if (options && options.ignoreMissingRevocationList) {
                            // continue as if the certificate was not revoked
                            revokedStatus = VerificationStatus.Good;
                        }
                    }
                    if (revokedStatus !== VerificationStatus.Good) {
                        // certificate is revoked !!!
                        (0, debug_1.debugLog)("revokedStatus", revokedStatus);
                        return revokedStatus;
                    }
                    // let check if the issuer is explicitly trusted
                    const issuerTrustedStatus = yield this._checkRejectedOrTrusted(issuerCertificate);
                    (0, debug_1.debugLog)("issuerTrustedStatus", issuerTrustedStatus);
                    if (issuerTrustedStatus === "unknown") {
                        hasTrustedIssuer = false;
                    }
                    else if (issuerTrustedStatus === "trusted") {
                        hasTrustedIssuer = true;
                    }
                    else if (issuerTrustedStatus === "rejected") {
                        // we should never get there: this should have been detected before !!!
                        return VerificationStatus.BadSecurityChecksFailed;
                    }
                }
                else {
                    // verify that certificate was signed by issuer (self in this case)
                    const isCertificateSignatureOK = (0, node_opcua_crypto_1.verifyCertificateSignature)(certificate, certificate);
                    if (!isCertificateSignatureOK) {
                        (0, debug_1.debugLog)("Self-signed Certificate signature is not valid");
                        return VerificationStatus.BadSecurityChecksFailed;
                    }
                    const revokedStatus = yield this.isCertificateRevoked(certificate);
                    (0, debug_1.debugLog)("revokedStatus of self signed certificate:", revokedStatus);
                }
            }
            const status = yield this._checkRejectedOrTrusted(certificate);
            if (status === "rejected") {
                return VerificationStatus.BadCertificateUntrusted;
            }
            const c2 = chain[1] ? (0, node_opcua_crypto_1.exploreCertificateInfo)(chain[1]) : "non";
            c2;
            // Has SoftwareCertificate passed its issue date and has it not expired ?
            // check dates
            const certificateInfo = (0, node_opcua_crypto_1.exploreCertificateInfo)(certificate);
            const now = new Date();
            let isTimeInvalid = false;
            // check that certificate is active
            if (certificateInfo.notBefore.getTime() > now.getTime()) {
                // certificate is not active yet
                (0, debug_1.debugLog)(chalk_1.default.red("certificate is invalid : certificate is not active yet !") +
                    "  not before date =" +
                    certificateInfo.notBefore);
                if (!options.acceptPendingCertificate) {
                    isTimeInvalid = true;
                }
            }
            //  check that certificate has not expired
            if (certificateInfo.notAfter.getTime() <= now.getTime()) {
                // certificate is obsolete
                (0, debug_1.debugLog)(chalk_1.default.red("certificate is invalid : certificate has expired !") + " not after date =" + certificateInfo.notAfter);
                if (!options.acceptOutdatedCertificate) {
                    isTimeInvalid = true;
                }
            }
            if (status === "trusted") {
                return isTimeInvalid ? VerificationStatus.BadCertificateTimeInvalid : VerificationStatus.Good;
            }
            (0, assert_1.default)(status === "unknown");
            if (hasIssuerKey) {
                if (!hasTrustedIssuer) {
                    return VerificationStatus.BadCertificateUntrusted;
                }
                if (!hasValidIssuer) {
                    return VerificationStatus.BadCertificateUntrusted;
                }
                return isTimeInvalid ? VerificationStatus.BadCertificateTimeInvalid : VerificationStatus.Good;
            }
            else {
                return VerificationStatus.BadCertificateUntrusted;
            }
        });
    }
    verifyCertificateAsync(certificate, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const status1 = yield this._innerVerifyCertificateAsync(certificate, false, 0, options);
            return status1;
        });
    }
    /**
     * Verify certificate validity
     * @method verifyCertificate
     * @param certificate
     */
    verifyCertificate(certificate, options) {
        return __awaiter(this, void 0, void 0, function* () {
            // Is the  signature on the SoftwareCertificate valid .?
            if (!certificate) {
                // missing certificate
                return VerificationStatus.BadSecurityChecksFailed;
            }
            return yield this.verifyCertificateAsync(certificate, options || {});
        });
    }
    /*
     *
     *  PKI
     *    +---> trusted
     *    +---> rejected
     *    +---> own
     *           +---> cert
     *           +---> own
     *
     */
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.state !== CertificateManagerState.Uninitialized) {
                return;
            }
            this.state = CertificateManagerState.Initializing;
            yield this._initialize();
            this.state = CertificateManagerState.Initialized;
        });
    }
    _initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, assert_1.default)((this.state = CertificateManagerState.Initializing));
            const pkiDir = this.location;
            (0, common2_1.mkdirRecursiveSync)(pkiDir);
            (0, common2_1.mkdirRecursiveSync)(path_1.default.join(pkiDir, "own"));
            (0, common2_1.mkdirRecursiveSync)(path_1.default.join(pkiDir, "own/certs"));
            (0, common2_1.mkdirRecursiveSync)(path_1.default.join(pkiDir, "own/private"));
            (0, common2_1.mkdirRecursiveSync)(path_1.default.join(pkiDir, "rejected"));
            (0, common2_1.mkdirRecursiveSync)(path_1.default.join(pkiDir, "trusted"));
            (0, common2_1.mkdirRecursiveSync)(path_1.default.join(pkiDir, "trusted/certs"));
            (0, common2_1.mkdirRecursiveSync)(path_1.default.join(pkiDir, "trusted/crl"));
            (0, common2_1.mkdirRecursiveSync)(path_1.default.join(pkiDir, "issuers"));
            (0, common2_1.mkdirRecursiveSync)(path_1.default.join(pkiDir, "issuers/certs")); // contains Trusted CA certificates
            (0, common2_1.mkdirRecursiveSync)(path_1.default.join(pkiDir, "issuers/crl")); // contains CRL of revoked CA certificates
            if (!fs_1.default.existsSync(this.configFile) || !fs_1.default.existsSync(this.privateKey)) {
                return yield this.withLock2(() => __awaiter(this, void 0, void 0, function* () {
                    (0, assert_1.default)(this.state !== CertificateManagerState.Disposing);
                    if (this.state === CertificateManagerState.Disposed) {
                        return;
                    }
                    (0, assert_1.default)(this.state === CertificateManagerState.Initializing);
                    if (!fs_1.default.existsSync(this.configFile)) {
                        fs_1.default.writeFileSync(this.configFile, configurationFileSimpleTemplate);
                    }
                    // note : openssl 1.1.1 has a bug that causes a failure if
                    // random file cannot be found. (should be fixed in 1.1.1.a)
                    // if this issue become important we may have to consider checking that rndFile exists and recreate
                    // it if not . this could be achieved with the command :
                    //      "openssl rand -writerand ${this.randomFile}"
                    //
                    // cf: https://github.com/node-opcua/node-opcua/issues/554
                    if (!fs_1.default.existsSync(this.privateKey)) {
                        (0, debug_1.debugLog)("generating private key ...");
                        //   setEnv("RANDFILE", this.randomFile);
                        yield (0, node_opcua_crypto_1.generatePrivateKeyFile)(this.privateKey, this.keySize);
                        yield this._readCertificates();
                    }
                    else {
                        // debugLog("   initialize :  private key already exists ... skipping");
                        yield this._readCertificates();
                    }
                }));
            }
            else {
                yield this._readCertificates();
            }
        });
    }
    dispose() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.state === CertificateManagerState.Disposing) {
                throw new Error("Already disposing");
            }
            if (this.state === CertificateManagerState.Uninitialized) {
                this.state = CertificateManagerState.Disposed;
                return;
            }
            // wait for initialization to be completed
            if (this.state === CertificateManagerState.Initializing) {
                yield new Promise((resolve) => setTimeout(resolve, 100));
                return yield this.dispose();
            }
            try {
                this.state = CertificateManagerState.Disposing;
                yield Promise.all(this._watchers.map((w) => w.close()));
                this._watchers.forEach((w) => w.removeAllListeners());
                this._watchers.splice(0);
            }
            finally {
                this.state = CertificateManagerState.Disposed;
            }
        });
    }
    withLock2(action) {
        return __awaiter(this, void 0, void 0, function* () {
            const lockFileName = path_1.default.join(this.rootDir, "mutex.lock");
            return (0, global_mutex_1.withLock)({ fileToLock: lockFileName }, () => __awaiter(this, void 0, void 0, function* () {
                return yield action();
            }));
        });
    }
    /**
     *
     * create a self-signed certificate for the CertificateManager private key
     *
     */
    createSelfSignedCertificate(params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, assert_1.default)(typeof params.applicationUri === "string", "expecting applicationUri");
            if (!fs_1.default.existsSync(this.privateKey)) {
                throw new Error("Cannot find private key " + this.privateKey);
            }
            let certificateFilename = path_1.default.join(this.rootDir, "own/certs/self_signed_certificate.pem");
            certificateFilename = params.outputFile || certificateFilename;
            const _params = params;
            _params.rootDir = this.rootDir;
            _params.configFile = this.configFile;
            _params.privateKey = this.privateKey;
            _params.subject = params.subject || "CN=FIXME";
            yield this.withLock2(() => __awaiter(this, void 0, void 0, function* () {
                yield (0, without_openssl_1.createSelfSignedCertificate)(certificateFilename, _params);
            }));
        });
    }
    createCertificateRequest(params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, assert_1.default)(params);
            const _params = params;
            if (Object.prototype.hasOwnProperty.call(_params, "rootDir")) {
                throw new Error("rootDir should not be specified ");
            }
            (0, assert_1.default)(!_params.rootDir);
            (0, assert_1.default)(!_params.configFile);
            (0, assert_1.default)(!_params.privateKey);
            _params.rootDir = path_1.default.resolve(this.rootDir);
            _params.configFile = path_1.default.resolve(this.configFile);
            _params.privateKey = path_1.default.resolve(this.privateKey);
            return yield this.withLock2(() => __awaiter(this, void 0, void 0, function* () {
                // compose a file name for the request
                const now = new Date();
                const today = now.toISOString().slice(0, 10) + "_" + now.getTime();
                const certificateSigningRequestFilename = path_1.default.join(this.rootDir, "own/certs", "certificate_" + today + ".csr");
                yield (0, without_openssl_1.createCertificateSigningRequestAsync)(certificateSigningRequestFilename, _params);
                return certificateSigningRequestFilename;
            }));
        });
    }
    addIssuer(certificate_1) {
        return __awaiter(this, arguments, void 0, function* (certificate, validate = false, addInTrustList = false) {
            if (validate) {
                const status = yield this.verifyCertificate(certificate);
                if (status !== VerificationStatus.Good && status !== VerificationStatus.BadCertificateUntrusted) {
                    return status;
                }
            }
            const pemCertificate = (0, node_opcua_crypto_1.toPem)(certificate, "CERTIFICATE");
            const fingerprint = makeFingerprint(certificate);
            if (this._thumbs.issuers.certs[fingerprint]) {
                // already in .. simply ignore
                return VerificationStatus.Good;
            }
            // write certificate
            const filename = path_1.default.join(this.issuersCertFolder, "issuer_" + buildIdealCertificateName(certificate) + ".pem");
            yield fs_1.default.promises.writeFile(filename, pemCertificate, "ascii");
            // first time seen, let's save it.
            this._thumbs.issuers.certs[fingerprint] = { certificate, filename };
            if (addInTrustList) {
                // add certificate in the trust list as well
                yield this.trustCertificate(certificate);
            }
            return VerificationStatus.Good;
        });
    }
    addRevocationList(crl) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.withLock2(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const crlInfo = (0, node_opcua_crypto_1.exploreCertificateRevocationList)(crl);
                    const key = crlInfo.tbsCertList.issuerFingerprint;
                    if (!this._thumbs.issuersCrl[key]) {
                        this._thumbs.issuersCrl[key] = { crls: [], serialNumbers: {} };
                    }
                    const pemCertificate = (0, node_opcua_crypto_1.toPem)(crl, "X509 CRL");
                    const filename = path_1.default.join(this.issuersCrlFolder, "crl_" + buildIdealCertificateName(crl) + ".pem");
                    yield fs_1.default.promises.writeFile(filename, pemCertificate, "ascii");
                    yield this._on_crl_file_added(this._thumbs.issuersCrl, filename);
                    yield this.waitAndCheckCRLProcessingStatus();
                    return VerificationStatus.Good;
                }
                catch (err) {
                    (0, debug_1.debugLog)(err);
                    return VerificationStatus.BadSecurityChecksFailed;
                }
            }));
        });
    }
    /**
     *  find the issuer certificate among the trusted  issuer certificates.
     *
     *  The findIssuerCertificate method is an asynchronous method that attempts to find
     *  the issuer certificate for a given certificate from the list of issuer certificate declared in the PKI
     *
     *  - If the certificate is self-signed, it returns the certificate itself.
     *
     *  - If the certificate has no extension 3, it is assumed to be generated by an old system, and a null value is returned.
     *
     *  - the method checks both issuer and trusted certificates and returns the appropriate issuercertificate,
     *    if found. If multiple matching certificates are found, a warning is logged to the console.
     *
     */
    findIssuerCertificate(certificate) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const certInfo = (0, node_opcua_crypto_1.exploreCertificate)(certificate);
            // istanbul ignore next
            if (isSelfSigned2(certInfo)) {
                // the certificate is self signed so is it's own issuer.
                return certificate;
            }
            const wantedIssuerKey = (_b = (_a = certInfo.tbsCertificate.extensions) === null || _a === void 0 ? void 0 : _a.authorityKeyIdentifier) === null || _b === void 0 ? void 0 : _b.keyIdentifier;
            // istanbul ignore next
            if (!wantedIssuerKey) {
                // Certificate has no extension 3 ! the certificate might have been generated by an old system
                (0, debug_1.debugLog)("Certificate has no extension 3");
                return null;
            }
            const issuerCertificates = Object.values(this._thumbs.issuers.certs);
            const selectedIssuerCertificates = findMatchingIssuerKey(issuerCertificates, wantedIssuerKey);
            if (selectedIssuerCertificates.length > 0) {
                if (selectedIssuerCertificates.length > 1) {
                    // tslint:disable-next-line: no-console
                    (0, debug_1.warningLog)("Warning more than one issuer certificate exists with subjectKeyIdentifier ", wantedIssuerKey);
                }
                return selectedIssuerCertificates[0].certificate || null;
            }
            // check also in trusted  list
            const trustedCertificates = Object.values(this._thumbs.trusted);
            const selectedTrustedCertificates = findMatchingIssuerKey(trustedCertificates, wantedIssuerKey);
            // istanbul ignore next
            if (selectedTrustedCertificates.length > 1) {
                // tslint:disable-next-line: no-console
                (0, debug_1.warningLog)("Warning more than one certificate exists with subjectKeyIdentifier in trusted certificate list ", wantedIssuerKey, selectedTrustedCertificates.length);
            }
            return selectedTrustedCertificates.length > 0 ? selectedTrustedCertificates[0].certificate : null;
        });
    }
    /**
     * @internal
     * @private
     */
    _checkRejectedOrTrusted(certificate) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, assert_1.default)(certificate instanceof Buffer);
            const fingerprint = makeFingerprint(certificate);
            (0, debug_1.debugLog)("_checkRejectedOrTrusted fingerprint ", short(fingerprint));
            yield this._readCertificates();
            if (Object.prototype.hasOwnProperty.call(this._thumbs.rejected, fingerprint)) {
                return "rejected";
            }
            if (Object.prototype.hasOwnProperty.call(this._thumbs.trusted, fingerprint)) {
                return "trusted";
            }
            return "unknown";
        });
    }
    _moveCertificate(certificate, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            // a mutex is requested here
            var _a;
            (0, assert_1.default)(certificate instanceof Buffer);
            const fingerprint = makeFingerprint(certificate);
            const status = yield this.getCertificateStatus(certificate);
            (0, debug_1.debugLog)("_moveCertificate", fingerprint.substring(0, 10), "from", status, "to", newStatus);
            (0, assert_1.default)(status === "rejected" || status === "trusted");
            if (status !== newStatus) {
                const certificateSrc = (_a = this._thumbs[status][fingerprint]) === null || _a === void 0 ? void 0 : _a.filename;
                // istanbul ignore next
                if (!certificateSrc) {
                    (0, debug_1.debugLog)(" cannot find certificate ", fingerprint.substring(0, 10), " in", this._thumbs, [status]);
                    throw new Error("internal");
                }
                const destFolder = newStatus === "rejected" ? this.rejectedFolder : newStatus === "trusted" ? this.trustedFolder : this.rejectedFolder;
                const certificateDest = path_1.default.join(destFolder, path_1.default.basename(certificateSrc));
                (0, debug_1.debugLog)("_moveCertificate1", fingerprint.substring(0, 10), "old name", certificateSrc);
                (0, debug_1.debugLog)("_moveCertificate1", fingerprint.substring(0, 10), "new name", certificateDest);
                yield fs_1.default.promises.rename(certificateSrc, certificateDest);
                delete this._thumbs[status][fingerprint];
                this._thumbs[newStatus][fingerprint] = {
                    certificate,
                    filename: certificateDest,
                };
            }
        });
    }
    _findAssociatedCRLs(issuerCertificate) {
        const issuerCertificateInfo = (0, node_opcua_crypto_1.exploreCertificate)(issuerCertificate);
        const key = issuerCertificateInfo.tbsCertificate.subjectFingerPrint;
        return this._thumbs.issuersCrl[key] ? this._thumbs.issuersCrl[key] : this._thumbs.crl[key] ? this._thumbs.crl[key] : null;
    }
    isCertificateRevoked(certificate, issuerCertificate) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            // istanbul ignore next
            if (isSelfSigned3(certificate)) {
                return VerificationStatus.Good;
            }
            if (!issuerCertificate) {
                issuerCertificate = yield this.findIssuerCertificate(certificate);
            }
            if (!issuerCertificate) {
                return VerificationStatus.BadCertificateChainIncomplete;
            }
            const crls = this._findAssociatedCRLs(issuerCertificate);
            if (!crls) {
                return VerificationStatus.BadCertificateRevocationUnknown;
            }
            const certInfo = (0, node_opcua_crypto_1.exploreCertificate)(certificate);
            const serialNumber = certInfo.tbsCertificate.serialNumber || ((_b = (_a = certInfo.tbsCertificate.extensions) === null || _a === void 0 ? void 0 : _a.authorityKeyIdentifier) === null || _b === void 0 ? void 0 : _b.serial) || "";
            const key = ((_d = (_c = certInfo.tbsCertificate.extensions) === null || _c === void 0 ? void 0 : _c.authorityKeyIdentifier) === null || _d === void 0 ? void 0 : _d.authorityCertIssuerFingerPrint) || "<unknown>";
            const crl2 = this._thumbs.crl[key] || null;
            if (crls.serialNumbers[serialNumber] || (crl2 && crl2.serialNumbers[serialNumber])) {
                return VerificationStatus.BadCertificateRevoked;
            }
            return VerificationStatus.Good;
        });
    }
    _on_crl_file_added(index, filename) {
        this.queue.push({ index, filename });
        this._pending_crl_to_process += 1;
        if (this._pending_crl_to_process === 1) {
            this._process_next_crl();
        }
    }
    _process_next_crl() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { index, filename } = this.queue.shift();
                const crl = yield (0, node_opcua_crypto_1.readCertificateRevocationList)(filename);
                const crlInfo = (0, node_opcua_crypto_1.exploreCertificateRevocationList)(crl);
                (0, debug_1.debugLog)(chalk_1.default.cyan("add CRL in folder "), filename); // stat);
                const fingerprint = crlInfo.tbsCertList.issuerFingerprint;
                index[fingerprint] = index[fingerprint] || {
                    crls: [],
                    serialNumbers: {},
                };
                index[fingerprint].crls.push({ crlInfo, filename });
                const serialNumbers = index[fingerprint].serialNumbers;
                // now inject serial numbers
                for (const revokedCertificate of crlInfo.tbsCertList.revokedCertificates) {
                    const serialNumber = revokedCertificate.userCertificate;
                    if (!serialNumbers[serialNumber]) {
                        serialNumbers[serialNumber] = revokedCertificate.revocationDate;
                    }
                }
                (0, debug_1.debugLog)(chalk_1.default.cyan("CRL"), fingerprint, "serial numbers = ", Object.keys(serialNumbers)); // stat);
            }
            catch (err) {
                (0, debug_1.debugLog)("CRL filename error =");
                (0, debug_1.debugLog)(err);
            }
            this._pending_crl_to_process -= 1;
            if (this._pending_crl_to_process === 0) {
                if (this._on_crl_process) {
                    this._on_crl_process();
                    this._on_crl_process = undefined;
                }
            }
            else {
                this._process_next_crl();
            }
        });
    }
    _readCertificates() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._readCertificatesCalled) {
                return;
            }
            this._readCertificatesCalled = true;
            const options = {
                usePolling: true,
                interval: Math.min(10 * 60 * 1000, Math.max(100, this.folderPoolingInterval)),
                persistent: false,
                awaitWriteFinish: {
                    stabilityThreshold: 2000,
                    pollInterval: 600,
                },
            };
            function _walkCRLFiles(folder, index) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield new Promise((resolve, reject) => {
                        const w = chokidar_1.default.watch(folder, options);
                        w.on("unlink", (filename, stat) => {
                            filename;
                            stat;
                            // CRL never removed
                        });
                        w.on("add", (filename, stat) => {
                            stat;
                            this._on_crl_file_added(index, filename);
                        });
                        w.on("change", (path, stat) => {
                            (0, debug_1.debugLog)("change in folder ", folder, path, stat);
                        });
                        this._watchers.push(w);
                        w.on("ready", () => {
                            resolve();
                        });
                    });
                });
            }
            function _walkAllFiles(folder, index) {
                return __awaiter(this, void 0, void 0, function* () {
                    const w = chokidar_1.default.watch(folder, options);
                    w.on("unlink", (filename, stat) => {
                        stat;
                        (0, debug_1.debugLog)(chalk_1.default.cyan("unlink in folder " + folder), filename);
                        const h = this._filenameToHash[filename];
                        if (h && index[h]) {
                            delete index[h];
                        }
                    });
                    w.on("add", (filename, stat) => {
                        var _a, _b;
                        stat;
                        (0, debug_1.debugLog)(chalk_1.default.cyan("add in folder " + folder), filename); // stat);
                        try {
                            const certificate = (0, node_opcua_crypto_1.readCertificate)(filename);
                            const info = (0, node_opcua_crypto_1.exploreCertificate)(certificate);
                            const fingerprint = makeFingerprint(certificate);
                            index[fingerprint] = {
                                certificate,
                                filename,
                            };
                            this._filenameToHash[filename] = fingerprint;
                            (0, debug_1.debugLog)(chalk_1.default.magenta("CERT"), info.tbsCertificate.subjectFingerPrint, info.tbsCertificate.serialNumber, (_b = (_a = info.tbsCertificate.extensions) === null || _a === void 0 ? void 0 : _a.authorityKeyIdentifier) === null || _b === void 0 ? void 0 : _b.authorityCertIssuerFingerPrint);
                        }
                        catch (err) {
                            (0, debug_1.debugLog)("Walk files in folder " + folder + " with file " + filename);
                            (0, debug_1.debugLog)(err);
                        }
                    });
                    w.on("change", (path, stat) => {
                        stat;
                        (0, debug_1.debugLog)("change in folder ", folder, path);
                    });
                    this._watchers.push(w);
                    yield new Promise((resolve, reject) => {
                        w.on("ready", () => {
                            (0, debug_1.debugLog)("ready");
                            (0, debug_1.debugLog)(Object.entries(index).map((kv) => kv[0].substring(0, 10)));
                            resolve();
                        });
                    });
                });
            }
            const promises = [
                _walkAllFiles.bind(this, this.trustedFolder, this._thumbs.trusted)(),
                _walkAllFiles.bind(this, this.issuersCertFolder, this._thumbs.issuers.certs)(),
                _walkAllFiles.bind(this, this.rejectedFolder, this._thumbs.rejected)(),
                _walkCRLFiles.bind(this, this.crlFolder, this._thumbs.crl)(),
                _walkCRLFiles.bind(this, this.issuersCrlFolder, this._thumbs.issuersCrl)(),
            ];
            yield Promise.all(promises);
            yield this.waitAndCheckCRLProcessingStatus();
        });
    }
    // make sure that all crls have been processed.
    waitAndCheckCRLProcessingStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (this._pending_crl_to_process === 0) {
                    setImmediate(resolve);
                    return;
                }
                // istanbul ignore next
                if (this._on_crl_process) {
                    return reject(new Error("Internal Error"));
                }
                this._on_crl_process = resolve;
            });
        });
    }
}
exports.CertificateManager = CertificateManager;
//# sourceMappingURL=certificate_manager.js.map