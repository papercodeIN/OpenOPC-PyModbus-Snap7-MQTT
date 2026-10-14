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
exports.createCertificateSigningRequestWithOpenSSL = createCertificateSigningRequestWithOpenSSL;
const assert_1 = __importDefault(require("assert"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const subject_1 = require("../../misc/subject");
const common_1 = require("../common");
const common2_1 = require("../common2");
const display_1 = require("../display");
const execute_openssl_1 = require("./execute_openssl");
const _env_1 = require("./_env");
const toolbox_1 = require("./toolbox");
const q = common_1.quote;
const n = common2_1.makePath;
/**
 * create a certificate signing request
 */
function createCertificateSigningRequestWithOpenSSL(certificateSigningRequestFilename, params) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, assert_1.default)(params);
        (0, assert_1.default)(params.rootDir);
        (0, assert_1.default)(params.configFile);
        (0, assert_1.default)(params.privateKey);
        (0, assert_1.default)(typeof params.privateKey === "string");
        (0, assert_1.default)(fs_1.default.existsSync(params.configFile), "config file must exist " + params.configFile);
        (0, assert_1.default)(fs_1.default.existsSync(params.privateKey), "Private key must exist" + params.privateKey);
        (0, assert_1.default)(fs_1.default.existsSync(params.rootDir), "RootDir key must exist");
        (0, assert_1.default)(typeof certificateSigningRequestFilename === "string");
        // note : this openssl command requires a config file
        (0, _env_1.processAltNames)(params);
        const configFile = (0, toolbox_1.generateStaticConfig)(params.configFile, { cwd: params.rootDir });
        const options = { cwd: params.rootDir, openssl_conf: path_1.default.relative(params.rootDir, configFile) };
        const configOption = " -config " + q(n(configFile));
        const subject = params.subject ? new subject_1.Subject(params.subject).toString() : undefined;
        // process.env.OPENSSL_CONF  ="";
        const subjectOptions = subject ? ' -subj "' + subject + '"' : "";
        (0, display_1.displaySubtitle)("- Creating a Certificate Signing Request with openssl");
        yield (0, execute_openssl_1.execute_openssl)("req -new" +
            "  -sha256 " +
            " -batch " +
            " -text " +
            configOption +
            " -key " +
            q(n(params.privateKey)) +
            subjectOptions +
            " -out " +
            q(n(certificateSigningRequestFilename)), options);
    });
}
//# sourceMappingURL=create_certificate_signing_request.js.map