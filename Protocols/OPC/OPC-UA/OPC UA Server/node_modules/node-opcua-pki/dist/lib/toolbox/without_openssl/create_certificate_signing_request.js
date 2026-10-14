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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCertificateSigningRequestAsync = createCertificateSigningRequestAsync;
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
const assert_1 = __importDefault(require("assert"));
const fs_1 = __importDefault(require("fs"));
const node_opcua_crypto_1 = require("node-opcua-crypto");
const node_opcua_crypto_2 = require("node-opcua-crypto");
const display_1 = require("../display");
/**
 * create a certificate signing request
 */
function createCertificateSigningRequestAsync(certificateSigningRequestFilename, params) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, assert_1.default)(params);
        (0, assert_1.default)(params.rootDir);
        (0, assert_1.default)(params.configFile);
        (0, assert_1.default)(params.privateKey);
        (0, assert_1.default)(typeof params.privateKey === "string");
        (0, assert_1.default)(fs_1.default.existsSync(params.privateKey), "Private key must exist" + params.privateKey);
        //  assert(fs.existsSync(params.configFile), "config file must exist " + params.configFile);
        (0, assert_1.default)(fs_1.default.existsSync(params.rootDir), "RootDir key must exist");
        (0, assert_1.default)(typeof certificateSigningRequestFilename === "string");
        const subject = params.subject ? new node_opcua_crypto_1.Subject(params.subject).toString() : undefined;
        (0, display_1.displaySubtitle)("- Creating a Certificate Signing Request with subtile");
        const privateKeyPem = yield fs_1.default.promises.readFile(params.privateKey, "utf-8");
        const privateKey = yield (0, node_opcua_crypto_1.pemToPrivateKey)(privateKeyPem);
        const { csr } = yield (0, node_opcua_crypto_2.createCertificateSigningRequest)({
            privateKey,
            dns: params.dns,
            ip: params.ip,
            subject,
            applicationUri: params.applicationUri,
            purpose: params.purpose,
        });
        yield fs_1.default.promises.writeFile(certificateSigningRequestFilename, csr, "utf-8");
        (0, display_1.display)("- privateKey " + params.privateKey);
        (0, display_1.display)("- certificateSigningRequestFilename " + certificateSigningRequestFilename);
        // to verify that the CSR is correct:
        // openssl  req -in ./tmp/without_openssl.csr -noout -verify
    });
}
//# sourceMappingURL=create_certificate_signing_request.js.map