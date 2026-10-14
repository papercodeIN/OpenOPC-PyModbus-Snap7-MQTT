"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
// ---------------------------------------------------------------------------------------------------------------------
// node-opcua-pki
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
// tslint:disable:no-console
// tslint:disable:no-shadowed-variable
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
exports.generateStaticConfig = generateStaticConfig;
exports.getPublicKeyFromPrivateKey = getPublicKeyFromPrivateKey;
exports.getPublicKeyFromCertificate = getPublicKeyFromCertificate;
exports.x509Date = x509Date;
exports.dumpCertificate = dumpCertificate;
exports.toDer = toDer;
exports.fingerprint = fingerprint;
const assert_1 = __importDefault(require("assert"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const common_1 = require("../common");
const common2_1 = require("../common2");
const config_1 = require("../config");
const execute_openssl_1 = require("./execute_openssl");
const _env_1 = require("./_env");
function openssl_require2DigitYearInDate() {
    // istanbul ignore next
    if (!config_1.g_config.opensslVersion) {
        throw new Error("openssl_require2DigitYearInDate : openssl version is not known:" + "  please call ensure_openssl_installed()");
    }
    return config_1.g_config.opensslVersion.match(/OpenSSL 0\.9/);
}
config_1.g_config.opensslVersion = "";
function generateStaticConfig(configPath, options) {
    const prePath = (options && options.cwd) || "";
    const originalFilename = !path_1.default.isAbsolute(configPath) ? path_1.default.join(prePath, configPath) : configPath;
    let staticConfig = fs_1.default.readFileSync(originalFilename, { encoding: "utf8" });
    for (const envVar of (0, _env_1.getEnvironmentVarNames)()) {
        staticConfig = staticConfig.replace(new RegExp(envVar.pattern, "gi"), (0, _env_1.getEnv)(envVar.key));
    }
    const staticConfigPath = configPath + ".tmp";
    const temporaryConfigPath = !path_1.default.isAbsolute(configPath) ? path_1.default.join(prePath, staticConfigPath) : staticConfigPath;
    fs_1.default.writeFileSync(temporaryConfigPath, staticConfig);
    if (options && options.cwd) {
        return path_1.default.relative(options.cwd, temporaryConfigPath);
    }
    else {
        return temporaryConfigPath;
    }
}
const q = common_1.quote;
const n = common2_1.makePath;
/**
 *   calculate the public key from private key
 *   openssl rsa -pubout -in private_key.pem
 *
 * @method getPublicKeyFromPrivateKey
 * @param privateKeyFilename: the existing file with the private key
 * @param publicKeyFilename: the file where to store the public key
 */
function getPublicKeyFromPrivateKey(privateKeyFilename, publicKeyFilename) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, assert_1.default)(fs_1.default.existsSync(privateKeyFilename));
        yield (0, execute_openssl_1.execute_openssl)("rsa -pubout -in " + q(n(privateKeyFilename)) + " -out " + q(n(publicKeyFilename)), {});
    });
}
/**
 * extract public key from a certificate
 *   openssl x509 -pubkey -in certificate.pem -nottext
 *
 * @method getPublicKeyFromCertificate
 * @param certificateFilename
 * @param publicKeyFilename
 */
function getPublicKeyFromCertificate(certificateFilename, publicKeyFilename) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, assert_1.default)(fs_1.default.existsSync(certificateFilename));
        yield (0, execute_openssl_1.execute_openssl)("x509 -pubkey -in " + q(n(certificateFilename)) + " > " + q(n(publicKeyFilename)), {});
    });
}
function x509Date(date) {
    date = date || new Date();
    const Y = date.getUTCFullYear();
    const M = date.getUTCMonth() + 1;
    const D = date.getUTCDate();
    const h = date.getUTCHours();
    const m = date.getUTCMinutes();
    const s = date.getUTCSeconds();
    function w(s, l) {
        return ("" + s).padStart(l, "0");
    }
    if (openssl_require2DigitYearInDate()) {
        // for example: on MacOS , where openssl 0.98 is installed by default
        return w(Y, 2) + w(M, 2) + w(D, 2) + w(h, 2) + w(m, 2) + w(s, 2) + "Z";
    }
    else {
        // for instance when openssl version is greater than 1.0.0
        return w(Y, 4) + w(M, 2) + w(D, 2) + w(h, 2) + w(m, 2) + w(s, 2) + "Z";
    }
}
/**
 * @param certificate - the certificate file in PEM format, file must exist
 */
function dumpCertificate(certificate) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, assert_1.default)(fs_1.default.existsSync(certificate));
        return yield (0, execute_openssl_1.execute_openssl)("x509 " + " -in " + q(n(certificate)) + " -text " + " -noout", {});
    });
}
function toDer(certificatePem) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, assert_1.default)(fs_1.default.existsSync(certificatePem));
        const certificateDer = certificatePem.replace(".pem", ".der");
        return yield (0, execute_openssl_1.execute_openssl)("x509  " + " -outform der " + " -in " + certificatePem + " -out " + certificateDer, {});
    });
}
function fingerprint(certificatePem) {
    return __awaiter(this, void 0, void 0, function* () {
        // openssl x509 -in my_certificate.pem -hash -dates -noout -fingerprint
        (0, assert_1.default)(fs_1.default.existsSync(certificatePem));
        return yield (0, execute_openssl_1.execute_openssl)("x509  " + " -fingerprint " + " -noout " + " -in " + certificatePem, {});
    });
}
//# sourceMappingURL=toolbox.js.map