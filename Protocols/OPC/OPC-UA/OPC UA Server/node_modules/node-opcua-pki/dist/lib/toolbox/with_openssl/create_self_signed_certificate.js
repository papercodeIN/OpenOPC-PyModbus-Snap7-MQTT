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
exports.createSelfSignedCertificate = createSelfSignedCertificate;
const assert_1 = __importDefault(require("assert"));
const fs_1 = __importDefault(require("fs"));
const subject_1 = require("../../misc/subject");
const common_1 = require("../common");
const common_2 = require("../common");
const display_1 = require("../display");
const execute_openssl_1 = require("./execute_openssl");
const toolbox_1 = require("./toolbox");
const _env_1 = require("./_env");
const common2_1 = require("../common2");
const node_opcua_crypto_1 = require("node-opcua-crypto");
const q = common_1.quote;
const n = common2_1.makePath;
/**
 * @param certificate: the filename of the certificate to create
 */
function createSelfSignedCertificate(certificate, params) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, execute_openssl_1.ensure_openssl_installed)();
        params.purpose = params.purpose || node_opcua_crypto_1.CertificatePurpose.ForApplication;
        (0, assert_1.default)(params.purpose, "Please provide a Certificate Purpose");
        /**
         * note: due to a limitation of openssl ,
         *       it is not possible to control the startDate of the certificate validity
         *       to achieve this the certificateAuthority tool shall be used.
         */
        (0, assert_1.default)(fs_1.default.existsSync(params.configFile));
        (0, assert_1.default)(fs_1.default.existsSync(params.rootDir));
        (0, assert_1.default)(fs_1.default.existsSync(params.privateKey));
        if (!params.subject) {
            throw new Error("Missing subject");
        }
        (0, assert_1.default)(typeof params.applicationUri === "string");
        (0, assert_1.default)(params.dns instanceof Array);
        // xx no key size in self-signed assert(params.keySize == 2048 || params.keySize == 4096);
        (0, _env_1.processAltNames)(params);
        (0, common_2.adjustDate)(params);
        (0, assert_1.default)(Object.prototype.hasOwnProperty.call(params, "validity"));
        let subject = new subject_1.Subject(params.subject);
        subject = subject.toString();
        const certificateRequestFilename = certificate + ".csr";
        const configFile = (0, toolbox_1.generateStaticConfig)(params.configFile);
        const configOption = " -config " + q(n(configFile));
        let extension;
        switch (params.purpose) {
            case node_opcua_crypto_1.CertificatePurpose.ForApplication:
                extension = "v3_selfsigned";
                break;
            case node_opcua_crypto_1.CertificatePurpose.ForCertificateAuthority:
                extension = "v3_ca";
                break;
            case node_opcua_crypto_1.CertificatePurpose.ForUserAuthentication:
            default:
                extension = "v3_selfsigned";
        }
        (0, display_1.displayTitle)("Generate a certificate request");
        // Once the private key is generated a Certificate Signing Request can be generated.
        // The CSR is then used in one of two ways. Ideally, the CSR will be sent to a Certificate Authority, such as
        // Thawte or Verisign who will verify the identity of the requestor and issue a signed certificate.
        // The second option is to self-sign the CSR, which will be demonstrated in the next section
        yield (0, execute_openssl_1.execute_openssl)("req -new" +
            " -sha256 " +
            " -text " +
            " -extensions " +
            extension +
            " " +
            configOption +
            " -key " +
            q(n(params.privateKey)) +
            " -out " +
            q(n(certificateRequestFilename)) +
            ' -subj "' +
            subject +
            '"', {});
        // Xx // Step 3: Remove Passphrase from Key
        // Xx execute("cp private/cakey.pem private/cakey.pem.org");
        // Xx execute(openssl_path + " rsa -in private/cakey.pem.org
        // Xx -out private/cakey.pem -passin pass:"+paraphrase);
        (0, display_1.displayTitle)("Generate Certificate (self-signed)");
        yield (0, execute_openssl_1.execute_openssl)(" x509 -req " +
            " -days " +
            params.validity +
            " -extensions " +
            extension +
            " " +
            " -extfile " +
            q(n(configFile)) +
            " -in " +
            q(n(certificateRequestFilename)) +
            " -signkey " +
            q(n(params.privateKey)) +
            " -text " +
            " -out " +
            q(certificate) +
            " -text ", {});
        // remove unnecessary certificate request file
        yield fs_1.default.promises.unlink(certificateRequestFilename);
    });
}
//# sourceMappingURL=create_self_signed_certificate.js.map