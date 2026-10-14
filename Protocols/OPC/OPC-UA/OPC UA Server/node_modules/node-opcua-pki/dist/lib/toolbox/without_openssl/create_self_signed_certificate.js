"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSelfSignedCertificateAsync = createSelfSignedCertificateAsync;
exports.createSelfSignedCertificate = createSelfSignedCertificate;
// ---------------------------------------------------------------------------------------------------------------------
// node-opcua-pki
// ---------------------------------------------------------------------------------------------------------------------
// Copyright (c) 2022-2024 Sterfive.com
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
const assert = require("assert");
const fs = require("fs");
const node_opcua_crypto_1 = require("node-opcua-crypto");
const common_1 = require("../common");
const subject_1 = require("../../misc/subject");
const display_1 = require("../display");
function createSelfSignedCertificateAsync(certificate, params) {
    return __awaiter(this, void 0, void 0, function* () {
        params.purpose = params.purpose || node_opcua_crypto_1.CertificatePurpose.ForApplication;
        assert(params.purpose, "Please provide a Certificate Purpose");
        /**
         * note: due to a limitation of openssl ,
         *       it is not possible to control the startDate of the certificate validity
         *       to achieve this the certificateAuthority tool shall be used.
         */
        assert(fs.existsSync(params.configFile));
        assert(fs.existsSync(params.rootDir));
        assert(fs.existsSync(params.privateKey));
        if (!params.subject) {
            throw Error("Missing subject");
        }
        assert(typeof params.applicationUri === "string");
        assert(params.dns instanceof Array);
        // xx no key size in self-signed assert(params.keySize == 2048 || params.keySize == 4096);
        //            processAltNames(params);
        (0, common_1.adjustDate)(params);
        assert(Object.prototype.hasOwnProperty.call(params, "validity"));
        let subject = new subject_1.Subject(params.subject);
        subject = subject.toString();
        // xx const certificateRequestFilename = certificate + ".csr";
        const purpose = params.purpose;
        (0, display_1.displayTitle)("Generate a certificate request");
        const privateKeyPem = yield fs.promises.readFile(params.privateKey, "utf-8");
        const privateKey = yield (0, node_opcua_crypto_1.pemToPrivateKey)(privateKeyPem);
        const { cert } = yield (0, node_opcua_crypto_1.createSelfSignedCertificate)({
            privateKey,
            notBefore: params.startDate,
            notAfter: params.endDate,
            validity: params.validity,
            dns: params.dns,
            ip: params.ip,
            subject,
            applicationUri: params.applicationUri,
            purpose,
        });
        yield fs.promises.writeFile(certificate, cert, "utf-8");
    });
}
function createSelfSignedCertificate(certificate, params) {
    return __awaiter(this, void 0, void 0, function* () {
        yield createSelfSignedCertificateAsync(certificate, params);
    });
}
//# sourceMappingURL=create_self_signed_certificate.js.map