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
exports.CertificateAuthority = exports.configurationFileTemplate = exports.defaultSubject = void 0;
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
const assert_1 = __importDefault(require("assert"));
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const node_opcua_crypto_1 = require("node-opcua-crypto");
const toolbox_1 = require("../toolbox");
const with_openssl_1 = require("../toolbox/with_openssl");
exports.defaultSubject = "/C=FR/ST=IDF/L=Paris/O=Local NODE-OPCUA Certificate Authority/CN=NodeOPCUA-CA";
const ca_config_template_cnf_1 = __importDefault(require("./templates/ca_config_template.cnf"));
// tslint:disable-next-line:variable-name
exports.configurationFileTemplate = ca_config_template_cnf_1.default;
const config = {
    certificateDir: "INVALID",
    forceCA: false,
    pkiDir: "INVALID",
};
const n = toolbox_1.makePath;
const q = toolbox_1.quote;
// convert 'c07b9179'  to    "192.123.145.121"
function octetStringToIpAddress(a) {
    return (parseInt(a.substring(0, 2), 16).toString() +
        "." +
        parseInt(a.substring(2, 4), 16).toString() +
        "." +
        parseInt(a.substring(4, 6), 16).toString() +
        "." +
        parseInt(a.substring(6, 8), 16).toString());
}
(0, assert_1.default)(octetStringToIpAddress("c07b9179") === "192.123.145.121");
function construct_CertificateAuthority(certificateAuthority) {
    return __awaiter(this, void 0, void 0, function* () {
        // create the CA directory store
        // create the CA directory store
        //
        // PKI/CA
        //     |
        //     +-+> private
        //     |
        //     +-+> public
        //     |
        //     +-+> certs
        //     |
        //     +-+> crl
        //     |
        //     +-+> conf
        //     |
        //     +-f: serial
        //     +-f: crlNumber
        //     +-f: index.txt
        //
        const subject = certificateAuthority.subject;
        const caRootDir = path_1.default.resolve(certificateAuthority.rootDir);
        function make_folders() {
            return __awaiter(this, void 0, void 0, function* () {
                (0, toolbox_1.mkdirRecursiveSync)(caRootDir);
                (0, toolbox_1.mkdirRecursiveSync)(path_1.default.join(caRootDir, "private"));
                (0, toolbox_1.mkdirRecursiveSync)(path_1.default.join(caRootDir, "public"));
                // xx execute("chmod 700 private");
                (0, toolbox_1.mkdirRecursiveSync)(path_1.default.join(caRootDir, "certs"));
                (0, toolbox_1.mkdirRecursiveSync)(path_1.default.join(caRootDir, "crl"));
                (0, toolbox_1.mkdirRecursiveSync)(path_1.default.join(caRootDir, "conf"));
            });
        }
        yield make_folders();
        function construct_default_files() {
            return __awaiter(this, void 0, void 0, function* () {
                const serial = path_1.default.join(caRootDir, "serial");
                if (!fs_1.default.existsSync(serial)) {
                    yield fs_1.default.promises.writeFile(serial, "1000");
                }
                const crlNumber = path_1.default.join(caRootDir, "crlnumber");
                if (!fs_1.default.existsSync(crlNumber)) {
                    yield fs_1.default.promises.writeFile(crlNumber, "1000");
                }
                const indexFile = path_1.default.join(caRootDir, "index.txt");
                if (!fs_1.default.existsSync(indexFile)) {
                    yield fs_1.default.promises.writeFile(indexFile, "");
                }
            });
        }
        yield construct_default_files();
        if (fs_1.default.existsSync(path_1.default.join(caRootDir, "private/cakey.pem")) && !config.forceCA) {
            // certificate already exists => do not overwrite
            (0, toolbox_1.debugLog)("CA private key already exists ... skipping");
            return;
        }
        // tslint:disable:no-empty
        (0, toolbox_1.displayTitle)("Create Certificate Authority (CA)");
        const indexFileAttr = path_1.default.join(caRootDir, "index.txt.attr");
        if (!fs_1.default.existsSync(indexFileAttr)) {
            yield fs_1.default.promises.writeFile(indexFileAttr, "unique_subject = no");
        }
        const caConfigFile = certificateAuthority.configFile;
        // eslint-disable-next-line no-constant-condition
        if (1 || !fs_1.default.existsSync(caConfigFile)) {
            let data = exports.configurationFileTemplate; // inlineText(configurationFile);
            data = (0, toolbox_1.makePath)(data.replace(/%%ROOT_FOLDER%%/, caRootDir));
            yield fs_1.default.promises.writeFile(caConfigFile, data);
        }
        // http://www.akadia.com/services/ssh_test_certificate.html
        const subjectOpt = ' -subj "' + subject.toString() + '" ';
        (0, with_openssl_1.processAltNames)({});
        const options = { cwd: caRootDir };
        const configFile = (0, with_openssl_1.generateStaticConfig)("conf/caconfig.cnf", options);
        const configOption = " -config " + q(n(configFile));
        const keySize = certificateAuthority.keySize;
        const privateKeyFilename = path_1.default.join(caRootDir, "private/cakey.pem");
        const csrFilename = path_1.default.join(caRootDir, "private/cakey.csr");
        (0, toolbox_1.displayTitle)("Generate the CA private Key - " + keySize);
        // The first step is to create your RSA Private Key.
        // This key is a 1025,2048,3072 or 2038 bit RSA key which is encrypted using
        // Triple-DES and stored in a PEM format so that it is readable as ASCII text.
        yield (0, node_opcua_crypto_1.generatePrivateKeyFile)(privateKeyFilename, keySize);
        (0, toolbox_1.displayTitle)("Generate a certificate request for the CA key");
        // Once the private key is generated a Certificate Signing Request can be generated.
        // The CSR is then used in one of two ways. Ideally, the CSR will be sent to a Certificate Authority, such as
        // Thawte or Verisign who will verify the identity of the requestor and issue a signed certificate.
        // The second option is to self-sign the CSR, which will be demonstrated in the next section
        yield (0, with_openssl_1.execute_openssl)("req -new" +
            " -sha256 " +
            " -text " +
            " -extensions v3_ca" +
            configOption +
            " -key " +
            q(n(privateKeyFilename)) +
            " -out " +
            q(n(csrFilename)) +
            " " +
            subjectOpt, options);
        // xx // Step 3: Remove Passphrase from Key
        // xx execute("cp private/cakey.pem private/cakey.pem.org");
        // xx execute(openssl_path + " rsa -in private/cakey.pem.org -out private/cakey.pem -passin pass:"+paraphrase);
        (0, toolbox_1.displayTitle)("Generate CA Certificate (self-signed)");
        yield (0, with_openssl_1.execute_openssl)(" x509 -sha256 -req -days 3650 " +
            " -text " +
            " -extensions v3_ca" +
            " -extfile " +
            q(n(configFile)) +
            " -in private/cakey.csr " +
            " -signkey " +
            q(n(privateKeyFilename)) +
            " -out public/cacert.pem", options);
        (0, toolbox_1.displaySubtitle)("generate initial CRL (Certificate Revocation List)");
        yield regenerateCrl(certificateAuthority.revocationList, configOption, options),
            (0, toolbox_1.displayTitle)("Create Certificate Authority (CA) ---> DONE");
    });
}
function regenerateCrl(revocationList, configOption, options) {
    return __awaiter(this, void 0, void 0, function* () {
        // produce a CRL in PEM format
        (0, toolbox_1.displaySubtitle)("regenerate CRL (Certificate Revocation List)");
        yield (0, with_openssl_1.execute_openssl)("ca -gencrl " + configOption + " -out crl/revocation_list.crl", options);
        yield (0, with_openssl_1.execute_openssl)("crl " + " -in  crl/revocation_list.crl -out  crl/revocation_list.der " + " -outform der", options);
        (0, toolbox_1.displaySubtitle)("Display (Certificate Revocation List)");
        yield (0, with_openssl_1.execute_openssl)("crl " + " -in " + q(n(revocationList)) + " -text " + " -noout", options);
    });
}
class CertificateAuthority {
    constructor(options) {
        (0, assert_1.default)(Object.prototype.hasOwnProperty.call(options, "location"));
        (0, assert_1.default)(Object.prototype.hasOwnProperty.call(options, "keySize"));
        this.location = options.location;
        this.keySize = options.keySize || 2048;
        this.subject = new node_opcua_crypto_1.Subject(options.subject || exports.defaultSubject);
    }
    get rootDir() {
        return this.location;
    }
    get configFile() {
        return path_1.default.normalize(path_1.default.join(this.rootDir, "./conf/caconfig.cnf"));
    }
    get caCertificate() {
        // the Certificate Authority Certificate
        return (0, toolbox_1.makePath)(this.rootDir, "./public/cacert.pem");
    }
    /**
     * the file name where  the current Certificate Revocation List is stored (in DER format)
     */
    get revocationListDER() {
        return (0, toolbox_1.makePath)(this.rootDir, "./crl/revocation_list.der");
    }
    /**
     * the file name where  the current Certificate Revocation List is stored (in PEM format)
     */
    get revocationList() {
        return (0, toolbox_1.makePath)(this.rootDir, "./crl/revocation_list.crl");
    }
    get caCertificateWithCrl() {
        return (0, toolbox_1.makePath)(this.rootDir, "./public/cacertificate_with_crl.pem");
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield construct_CertificateAuthority(this);
        });
    }
    constructCACertificateWithCRL() {
        return __awaiter(this, void 0, void 0, function* () {
            const cacertWithCRL = this.caCertificateWithCrl;
            // note : in order to check if the certificate is revoked,
            // you need to specify -crl_check and have both the CA cert and the (applicable) CRL in your trust store.
            // There are two ways to do that:
            // 1. concatenate cacert.pem and crl.pem into one file and use that for -CAfile.
            // 2. use some linked
            // ( from http://security.stackexchange.com/a/58305/59982)
            if (fs_1.default.existsSync(this.revocationList)) {
                yield fs_1.default.promises.writeFile(cacertWithCRL, fs_1.default.readFileSync(this.caCertificate, "utf8") + fs_1.default.readFileSync(this.revocationList, "utf8"));
            }
            else {
                // there is no revocation list yet
                yield fs_1.default.promises.writeFile(cacertWithCRL, fs_1.default.readFileSync(this.caCertificate));
            }
        });
    }
    constructCertificateChain(certificate) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, assert_1.default)(fs_1.default.existsSync(certificate));
            (0, assert_1.default)(fs_1.default.existsSync(this.caCertificate));
            (0, toolbox_1.debugLog)(chalk_1.default.yellow("        certificate file :"), chalk_1.default.cyan(certificate));
            // append
            yield fs_1.default.promises.writeFile(certificate, (yield fs_1.default.promises.readFile(certificate, "utf8")) + (yield fs_1.default.promises.readFile(this.caCertificate, "utf8")));
        });
    }
    createSelfSignedCertificate(certificateFile, privateKey, params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, assert_1.default)(typeof privateKey === "string");
            (0, assert_1.default)(fs_1.default.existsSync(privateKey));
            if (!(0, toolbox_1.certificateFileExist)(certificateFile)) {
                return;
            }
            (0, toolbox_1.adjustDate)(params);
            (0, toolbox_1.adjustApplicationUri)(params);
            (0, with_openssl_1.processAltNames)(params);
            const csrFile = certificateFile + "_csr";
            (0, assert_1.default)(csrFile);
            const configFile = (0, with_openssl_1.generateStaticConfig)(this.configFile, { cwd: this.rootDir });
            const options = {
                cwd: this.rootDir,
                openssl_conf: (0, toolbox_1.makePath)(configFile),
            };
            const configOption = "";
            const subject = params.subject ? new node_opcua_crypto_1.Subject(params.subject).toString() : "";
            const subjectOptions = subject && subject.length > 1 ? " -subj " + subject + " " : "";
            (0, toolbox_1.displaySubtitle)("- the certificate signing request");
            yield (0, with_openssl_1.execute_openssl)("req " +
                " -new -sha256 -text " +
                configOption +
                subjectOptions +
                " -batch -key " +
                q(n(privateKey)) +
                " -out " +
                q(n(csrFile)), options);
            (0, toolbox_1.displaySubtitle)("- creating the self-signed certificate");
            yield (0, with_openssl_1.execute_openssl)("ca " +
                " -selfsign " +
                " -keyfile " +
                q(n(privateKey)) +
                " -startdate " +
                (0, with_openssl_1.x509Date)(params.startDate) +
                " -enddate " +
                (0, with_openssl_1.x509Date)(params.endDate) +
                " -batch -out " +
                q(n(certificateFile)) +
                " -in " +
                q(n(csrFile)), options);
            (0, toolbox_1.displaySubtitle)("- dump the certificate for a check");
            yield (0, with_openssl_1.execute_openssl)("x509 -in " + q(n(certificateFile)) + "  -dates -fingerprint -purpose -noout", {});
            (0, toolbox_1.displaySubtitle)("- verify self-signed certificate");
            yield (0, with_openssl_1.execute_openssl_no_failure)("verify -verbose -CAfile " + q(n(certificateFile)) + " " + q(n(certificateFile)), options);
            yield fs_1.default.promises.unlink(csrFile);
        });
    }
    /**
     * revoke a certificate and update the CRL
     *
     * @method revokeCertificate
     * @param certificate -  the certificate to revoke
     * @param params
     * @param [params.reason = "keyCompromise" {String}]
     * @async
     */
    revokeCertificate(certificate, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const crlReasons = [
                "unspecified",
                "keyCompromise",
                "CACompromise",
                "affiliationChanged",
                "superseded",
                "cessationOfOperation",
                "certificateHold",
                "removeFromCRL",
            ];
            const configFile = (0, with_openssl_1.generateStaticConfig)("conf/caconfig.cnf", { cwd: this.rootDir });
            const options = {
                cwd: this.rootDir,
                openssl_conf: (0, toolbox_1.makePath)(configFile),
            };
            (0, with_openssl_1.setEnv)("ALTNAME", "");
            const randomFile = path_1.default.join(this.rootDir, "random.rnd");
            (0, with_openssl_1.setEnv)("RANDFILE", randomFile);
            // // tslint:disable-next-line:no-string-literal
            // if (!fs.existsSync((process.env as any)["OPENSSL_CONF"])) {
            //     throw new Error("Cannot find OPENSSL_CONF");
            // }
            const configOption = " -config " + q(n(configFile));
            const reason = params.reason || "keyCompromise";
            (0, assert_1.default)(crlReasons.indexOf(reason) >= 0);
            (0, toolbox_1.displayTitle)("Revoking certificate  " + certificate);
            (0, toolbox_1.displaySubtitle)("Revoke certificate");
            yield (0, with_openssl_1.execute_openssl_no_failure)("ca -verbose " + configOption + " -revoke " + q(certificate) + " -crl_reason " + reason, options);
            // regenerate CRL (Certificate Revocation List)
            yield regenerateCrl(this.revocationList, configOption, options);
            (0, toolbox_1.displaySubtitle)("Verify that certificate is revoked");
            yield (0, with_openssl_1.execute_openssl_no_failure)("verify -verbose" +
                // configOption +
                " -CRLfile " +
                q(n(this.revocationList)) +
                " -CAfile " +
                q(n(this.caCertificate)) +
                " -crl_check " +
                q(n(certificate)), options);
            // produce CRL in DER format
            (0, toolbox_1.displaySubtitle)("Produce CRL in DER form ");
            yield (0, with_openssl_1.execute_openssl)("crl " + " -in " + q(n(this.revocationList)) + " -out " + "crl/revocation_list.der " + " -outform der", options);
            // produce CRL in PEM format with text
            (0, toolbox_1.displaySubtitle)("Produce CRL in PEM form ");
            yield (0, with_openssl_1.execute_openssl)("crl " + " -in " + q(n(this.revocationList)) + " -out " + "crl/revocation_list.pem " + " -outform pem" + " -text ", options);
        });
    }
    /**
     *
     * @param certificate            - the certificate filename to generate
     * @param certificateSigningRequestFilename   - the certificate signing request
     * @param params                 - parameters
     * @param params.applicationUri  - the applicationUri
     * @param params.startDate       - startDate of the certificate
     * @param params.validity        - number of day of validity of the certificate
     */
    signCertificateRequest(certificate, certificateSigningRequestFilename, params1) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, with_openssl_1.ensure_openssl_installed)();
            (0, assert_1.default)(fs_1.default.existsSync(certificateSigningRequestFilename));
            if (!(0, toolbox_1.certificateFileExist)(certificate)) {
                return "";
            }
            (0, toolbox_1.adjustDate)(params1);
            (0, toolbox_1.adjustApplicationUri)(params1);
            (0, with_openssl_1.processAltNames)(params1);
            const options = { cwd: this.rootDir };
            let configFile;
            // note :
            // subjectAltName is not copied across
            //  see https://github.com/openssl/openssl/issues/10458
            const csr = yield (0, node_opcua_crypto_1.readCertificateSigningRequest)(certificateSigningRequestFilename);
            const csrInfo = (0, node_opcua_crypto_1.exploreCertificateSigningRequest)(csr);
            const applicationUri = csrInfo.extensionRequest.subjectAltName.uniformResourceIdentifier ? csrInfo.extensionRequest.subjectAltName.uniformResourceIdentifier[0] : undefined;
            if (typeof applicationUri !== "string") {
                throw new Error("Cannot find applicationUri in CSR");
            }
            const dns = csrInfo.extensionRequest.subjectAltName.dNSName || [];
            let ip = csrInfo.extensionRequest.subjectAltName.iPAddress || [];
            ip = ip.map(octetStringToIpAddress);
            const params = {
                applicationUri,
                dns,
                ip,
            };
            (0, with_openssl_1.processAltNames)(params);
            configFile = (0, with_openssl_1.generateStaticConfig)("conf/caconfig.cnf", options);
            (0, toolbox_1.displaySubtitle)("- then we ask the authority to sign the certificate signing request");
            const configOption = " -config " + configFile;
            yield (0, with_openssl_1.execute_openssl)("ca " +
                configOption +
                " -startdate " +
                (0, with_openssl_1.x509Date)(params1.startDate) +
                " -enddate " +
                (0, with_openssl_1.x509Date)(params1.endDate) +
                " -batch -out " +
                q(n(certificate)) +
                " -in " +
                q(n(certificateSigningRequestFilename)), options);
            (0, toolbox_1.displaySubtitle)("- dump the certificate for a check");
            yield (0, with_openssl_1.execute_openssl)("x509 -in " + q(n(certificate)) + "  -dates -fingerprint -purpose -noout", options);
            (0, toolbox_1.displaySubtitle)("- construct CA certificate with CRL");
            yield this.constructCACertificateWithCRL();
            // construct certificate chain
            //   concatenate certificate with CA Certificate and revocation list
            (0, toolbox_1.displaySubtitle)("- construct certificate chain");
            yield this.constructCertificateChain(certificate);
            // todo
            (0, toolbox_1.displaySubtitle)("- verify certificate against the root CA");
            yield this.verifyCertificate(certificate);
            return certificate;
        });
    }
    verifyCertificate(certificate) {
        return __awaiter(this, void 0, void 0, function* () {
            // openssl verify crashes on windows! we cannot use it reliably
            // istanbul ignore next
            const isImplemented = false;
            // istanbul ignore next
            if (isImplemented) {
                const options = { cwd: this.rootDir };
                const configFile = (0, with_openssl_1.generateStaticConfig)("conf/caconfig.cnf", options);
                (0, with_openssl_1.setEnv)("OPENSSL_CONF", (0, toolbox_1.makePath)(configFile));
                const configOption = " -config " + configFile;
                configOption;
                yield (0, with_openssl_1.execute_openssl_no_failure)("verify -verbose " + " -CAfile " + q(n(this.caCertificateWithCrl)) + " " + q(n(certificate)), options);
            }
        });
    }
}
exports.CertificateAuthority = CertificateAuthority;
//# sourceMappingURL=certificate_authority.js.map