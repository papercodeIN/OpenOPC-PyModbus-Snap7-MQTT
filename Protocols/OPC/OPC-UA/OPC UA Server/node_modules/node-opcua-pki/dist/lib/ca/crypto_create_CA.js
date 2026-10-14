"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
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
// Error.stackTraceLimit = Infinity;
// tslint:disable:variable-name
// tslint:disable:no-console
// tslint:disable:object-literal-sort-keys
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
exports.main = main;
const assert_1 = __importDefault(require("assert"));
const chalk_1 = __importDefault(require("chalk"));
const rimraf_1 = __importDefault(require("rimraf"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const node_opcua_crypto_1 = require("node-opcua-crypto");
// see https://github.com/yargs/yargs/issues/781
const yargs_1 = __importDefault(require("yargs"));
const applicationurn_1 = require("../misc/applicationurn");
const hostname_1 = require("../misc/hostname");
const certificate_authority_1 = require("./certificate_authority");
const certificate_manager_1 = require("../pki/certificate_manager");
const toolbox_1 = require("../toolbox");
const with_openssl_1 = require("../toolbox/with_openssl");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { hideBin } = require("yargs/helpers");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const argv = require("yargs/yargs")(hideBin(process.argv));
const epilog = "Copyright (c) sterfive - node-opcua - 2017-2025";
// ------------------------------------------------- some useful dates
function get_offset_date(date, nbDays) {
    const d = new Date(date.getTime());
    d.setDate(d.getDate() + nbDays);
    return d;
}
const today = new Date();
const yesterday = get_offset_date(today, -1);
const two_years_ago = get_offset_date(today, -2 * 365);
const next_year = get_offset_date(today, 365);
let gLocalConfig = {};
let g_certificateAuthority; // the Certificate Authority
/***
 *
 *
 * prerequisites :
 *   g_config.CAFolder : the folder of the CA
 */
function construct_CertificateAuthority(subject) {
    return __awaiter(this, void 0, void 0, function* () {
        // verify that g_config file has been loaded
        (0, assert_1.default)(typeof gLocalConfig.CAFolder === "string", "expecting a CAFolder in config");
        (0, assert_1.default)(typeof gLocalConfig.keySize === "number", "expecting a keySize in config");
        if (!g_certificateAuthority) {
            g_certificateAuthority = new certificate_authority_1.CertificateAuthority({
                keySize: gLocalConfig.keySize,
                location: gLocalConfig.CAFolder,
                subject,
            });
            yield g_certificateAuthority.initialize();
        }
    });
}
let certificateManager; // the Certificate Manager
/***
 *
 *
 * prerequisites :
 *   g_config.PKIFolder : the folder of the PKI
 */
function construct_CertificateManager() {
    return __awaiter(this, void 0, void 0, function* () {
        (0, assert_1.default)(typeof gLocalConfig.PKIFolder === "string", "expecting a PKIFolder in config");
        if (!certificateManager) {
            certificateManager = new certificate_manager_1.CertificateManager({
                keySize: gLocalConfig.keySize,
                location: gLocalConfig.PKIFolder,
            });
            yield certificateManager.initialize();
        }
    });
}
function displayConfig(config) {
    function w(str, l) {
        return (str + "                            ").substring(0, l);
    }
    (0, toolbox_1.warningLog)(chalk_1.default.yellow(" configuration = "));
    for (const [key, value] of Object.entries(config)) {
        (0, toolbox_1.warningLog)("   " + chalk_1.default.yellow(w(key, 30)) + " : " + chalk_1.default.cyan(value.toString()));
    }
}
function default_template_content() {
    // istanbul ignore next
    if (process.pkg && process.pkg.entrypoint) {
        // we are using PKG compiled package !
        // warningLog("___filename", __filename);
        // warningLog("__dirname", __dirname);
        // warningLog("process.pkg.entrypoint", (process as any).pkg.entrypoint);
        const a = fs_1.default.readFileSync(path_1.default.join(__dirname, "../../bin/crypto_create_CA_config.example.js"), "utf8");
        return a;
    }
    function find_default_config_template() {
        const rootFolder = find_module_root_folder();
        let default_config_template = path_1.default.join(rootFolder, "bin", path_1.default.basename(__filename, ".js") + "_config.example.js");
        if (!fs_1.default.existsSync(default_config_template)) {
            default_config_template = path_1.default.join(__dirname, "..", path_1.default.basename(__filename, ".js") + "_config.example.js");
            if (!fs_1.default.existsSync(default_config_template)) {
                default_config_template = path_1.default.join(__dirname, "../bin/" + path_1.default.basename(__filename, ".js") + "_config.example.js");
            }
        }
        return default_config_template;
    }
    const default_config_template = find_default_config_template();
    (0, assert_1.default)(fs_1.default.existsSync(default_config_template));
    const default_config_template_content = fs_1.default.readFileSync(default_config_template, "utf8");
    return default_config_template_content;
}
/**
 *
 */
function find_module_root_folder() {
    let rootFolder = path_1.default.join(__dirname);
    for (let i = 0; i < 4; i++) {
        if (fs_1.default.existsSync(path_1.default.join(rootFolder, "package.json"))) {
            return rootFolder;
        }
        rootFolder = path_1.default.join(rootFolder, "..");
    }
    (0, assert_1.default)(fs_1.default.existsSync(path_1.default.join(rootFolder, "package.json")), "root folder must have a package.json file");
    return rootFolder;
}
/* eslint complexity:off, max-statements:off */
function readConfiguration(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        if (argv.silent) {
            toolbox_1.g_config.silent = true;
        }
        else {
            toolbox_1.g_config.silent = false;
        }
        const fqdn = yield (0, hostname_1.extractFullyQualifiedDomainName)();
        const hostname = os_1.default.hostname();
        let certificateDir;
        function performSubstitution(str) {
            str = str.replace("{CWD}", process.cwd());
            if (certificateDir) {
                str = str.replace("{root}", certificateDir);
            }
            if (gLocalConfig && gLocalConfig.PKIFolder) {
                str = str.replace("{PKIFolder}", gLocalConfig.PKIFolder);
            }
            str = str.replace("{hostname}", hostname);
            str = str.replace("%FQDN%", fqdn);
            return str;
        }
        function prepare(file) {
            const tmp = path_1.default.resolve(performSubstitution(file));
            return (0, toolbox_1.makePath)(tmp);
        }
        // ------------------------------------------------------------------------------------------------------------
        certificateDir = argv.root;
        (0, assert_1.default)(typeof certificateDir === "string");
        certificateDir = prepare(certificateDir);
        (0, toolbox_1.mkdirRecursiveSync)(certificateDir);
        (0, assert_1.default)(fs_1.default.existsSync(certificateDir));
        // ------------------------------------------------------------------------------------------------------------
        const default_config = path_1.default.join(certificateDir, "config.js");
        if (!fs_1.default.existsSync(default_config)) {
            // copy
            (0, toolbox_1.debugLog)(chalk_1.default.yellow(" Creating default g_config file "), chalk_1.default.cyan(default_config));
            const default_config_template_content = default_template_content();
            fs_1.default.writeFileSync(default_config, default_config_template_content);
        }
        else {
            (0, toolbox_1.debugLog)(chalk_1.default.yellow(" using  g_config file "), chalk_1.default.cyan(default_config));
        }
        if (!fs_1.default.existsSync(default_config)) {
            (0, toolbox_1.debugLog)(chalk_1.default.redBright(" cannot find config file ", default_config));
        }
        // see http://stackoverflow.com/questions/94445/using-openssl-what-does-unable-to-write-random-state-mean
        // set random file to be random.rnd in the same folder as the g_config file
        const defaultRandomFile = path_1.default.join(path_1.default.dirname(default_config), "random.rnd");
        (0, with_openssl_1.setEnv)("RANDFILE", defaultRandomFile);
        /* eslint global-require: 0*/
        gLocalConfig = require(default_config);
        gLocalConfig.subject = new node_opcua_crypto_1.Subject(gLocalConfig.subject || "");
        // if subject is provided on the command line , it has hight priority
        if (argv.subject) {
            gLocalConfig.subject = new node_opcua_crypto_1.Subject(argv.subject);
        }
        // istanbul ignore next
        if (!gLocalConfig.subject.commonName) {
            throw new Error("subject must have a Common Name");
        }
        gLocalConfig.certificateDir = certificateDir;
        // ------------------------------------------------------------------------------------------------------------
        let CAFolder = argv.CAFolder || path_1.default.join(certificateDir, "CA");
        CAFolder = prepare(CAFolder);
        gLocalConfig.CAFolder = CAFolder;
        // ------------------------------------------------------------------------------------------------------------
        gLocalConfig.PKIFolder = path_1.default.join(gLocalConfig.certificateDir, "PKI");
        if (argv.PKIFolder) {
            gLocalConfig.PKIFolder = prepare(argv.PKIFolder);
        }
        gLocalConfig.PKIFolder = prepare(gLocalConfig.PKIFolder);
        if (argv.privateKey) {
            gLocalConfig.privateKey = prepare(argv.privateKey);
        }
        if (argv.applicationUri) {
            gLocalConfig.applicationUri = performSubstitution(argv.applicationUri);
        }
        if (argv.output) {
            gLocalConfig.outputFile = argv.output;
        }
        gLocalConfig.altNames = [];
        if (argv.altNames) {
            gLocalConfig.altNames = argv.altNames.split(";");
        }
        gLocalConfig.dns = [(0, hostname_1.getFullyQualifiedDomainName)()];
        if (argv.dns) {
            gLocalConfig.dns = argv.dns.split(",").map(performSubstitution);
        }
        gLocalConfig.ip = [];
        if (argv.ip) {
            gLocalConfig.ip = argv.ip.split(",");
        }
        if (argv.keySize) {
            const v = argv.keySize;
            if (v !== 1024 && v !== 2048 && v !== 3072 && v !== 4096) {
                throw new Error("invalid keysize specified " + v + " should be 1024,2048,3072 or 4096");
            }
            gLocalConfig.keySize = argv.keySize;
        }
        if (argv.validity) {
            gLocalConfig.validity = argv.validity;
        }
        // xx displayConfig(g_config);
        // ------------------------------------------------------------------------------------------------------------
    });
}
function add_standard_option(options, optionName) {
    switch (optionName) {
        case "root":
            options.root = {
                alias: "r",
                type: "string",
                default: "{CWD}/certificates",
                describe: "the location of the Certificate folder",
            };
            break;
        case "CAFolder":
            options.CAFolder = {
                alias: "c",
                type: "string",
                default: "{root}/CA",
                describe: "the location of the Certificate Authority folder",
            };
            break;
        case "PKIFolder":
            options.PKIFolder = {
                type: "string",
                default: "{root}/PKI",
                describe: "the location of the Public Key Infrastructure",
            };
            break;
        case "silent":
            options.silent = {
                alias: "s",
                type: "boolean",
                default: false,
                describe: "minimize output",
            };
            break;
        case "privateKey":
            options.privateKey = {
                alias: "p",
                type: "string",
                default: "{PKIFolder}/own/private_key.pem",
                describe: "the private key to use to generate certificate",
            };
            break;
        case "keySize":
            options.keySize = {
                alias: ["k", "keyLength"],
                type: "number",
                default: 2048,
                describe: "the private key size in bits (1024|2048|3072|4096)",
            };
            break;
        default:
            throw Error("Unknown option  " + optionName);
    }
}
function createDefaultCertificate(base_name, prefix, key_length, applicationUri, dev) {
    return __awaiter(this, void 0, void 0, function* () {
        // possible key length in bits
        (0, assert_1.default)(key_length === 1024 || key_length === 2048 || key_length === 3072 || key_length === 4096);
        const private_key_file = (0, toolbox_1.makePath)(base_name, prefix + "key_" + key_length + ".pem");
        const public_key_file = (0, toolbox_1.makePath)(base_name, prefix + "public_key_" + key_length + ".pub");
        const certificate_file = (0, toolbox_1.makePath)(base_name, prefix + "cert_" + key_length + ".pem");
        const certificate_file_outofdate = (0, toolbox_1.makePath)(base_name, prefix + "cert_" + key_length + "_outofdate.pem");
        const certificate_file_not_active_yet = (0, toolbox_1.makePath)(base_name, prefix + "cert_" + key_length + "_not_active_yet.pem");
        const certificate_revoked = (0, toolbox_1.makePath)(base_name, prefix + "cert_" + key_length + "_revoked.pem");
        const self_signed_certificate_file = (0, toolbox_1.makePath)(base_name, prefix + "selfsigned_cert_" + key_length + ".pem");
        const fqdn = (0, hostname_1.getFullyQualifiedDomainName)();
        const hostname = os_1.default.hostname();
        const dns = [
            // for conformance reason, localhost shall not be present in the DNS field of COP
            // ***FORBIDEN** "localhost",
            (0, hostname_1.getFullyQualifiedDomainName)(),
        ];
        if (hostname !== fqdn) {
            dns.push(hostname);
        }
        const ip = [];
        function createCertificateIfNotExist(certificate, private_key, applicationUri, startDate, validity) {
            return __awaiter(this, void 0, void 0, function* () {
                // istanbul ignore next
                if (fs_1.default.existsSync(certificate)) {
                    (0, toolbox_1.warningLog)(chalk_1.default.yellow("         certificate"), chalk_1.default.cyan(certificate), chalk_1.default.yellow(" already exists => skipping"));
                    return "";
                }
                else {
                    return yield createCertificate(certificate, private_key, applicationUri, startDate, validity);
                }
            });
        }
        function createCertificate(certificate, privateKey, applicationUri, startDate, validity) {
            return __awaiter(this, void 0, void 0, function* () {
                const certificateSigningRequestFile = certificate + ".csr";
                const configFile = (0, toolbox_1.makePath)(base_name, "../certificates/PKI/own/openssl.cnf");
                const dns = [os_1.default.hostname()];
                const ip = ["127.0.0.1"];
                const params = {
                    applicationUri,
                    privateKey,
                    rootDir: ".",
                    configFile,
                    dns,
                    ip,
                    purpose: node_opcua_crypto_1.CertificatePurpose.ForApplication,
                };
                // create CSR
                yield (0, with_openssl_1.createCertificateSigningRequestWithOpenSSL)(certificateSigningRequestFile, params);
                return yield g_certificateAuthority.signCertificateRequest(certificate, certificateSigningRequestFile, {
                    applicationUri,
                    dns,
                    ip,
                    startDate,
                    validity,
                });
            });
        }
        function createSelfSignedCertificate(certificate, private_key, applicationUri, startDate, validity) {
            return __awaiter(this, void 0, void 0, function* () {
                yield g_certificateAuthority.createSelfSignedCertificate(certificate, private_key, {
                    applicationUri,
                    dns,
                    ip,
                    startDate,
                    validity,
                });
            });
        }
        function revoke_certificate(certificate) {
            return __awaiter(this, void 0, void 0, function* () {
                yield g_certificateAuthority.revokeCertificate(certificate, {});
            });
        }
        function createPrivateKeyIfNotExist(privateKey, keyLength) {
            return __awaiter(this, void 0, void 0, function* () {
                if (fs_1.default.existsSync(privateKey)) {
                    (0, toolbox_1.warningLog)(chalk_1.default.yellow("         privateKey"), chalk_1.default.cyan(privateKey), chalk_1.default.yellow(" already exists => skipping"));
                    return;
                }
                else {
                    yield (0, node_opcua_crypto_1.generatePrivateKeyFile)(privateKey, keyLength);
                }
            });
        }
        (0, toolbox_1.displaySubtitle)(" create private key :" + private_key_file);
        yield createPrivateKeyIfNotExist(private_key_file, key_length);
        (0, toolbox_1.displaySubtitle)(" extract public key " + public_key_file + " from private key ");
        yield (0, with_openssl_1.getPublicKeyFromPrivateKey)(private_key_file, public_key_file);
        (0, toolbox_1.displaySubtitle)(" create Certificate " + certificate_file);
        yield createCertificateIfNotExist(certificate_file, private_key_file, applicationUri, yesterday, 365);
        (0, toolbox_1.displaySubtitle)(" create self signed Certificate " + self_signed_certificate_file);
        if (fs_1.default.existsSync(self_signed_certificate_file)) {
            // self_signed certificate already exists
            return;
        }
        yield createSelfSignedCertificate(self_signed_certificate_file, private_key_file, applicationUri, yesterday, 365);
        if (dev) {
            yield createCertificateIfNotExist(certificate_file_outofdate, private_key_file, applicationUri, two_years_ago, 365);
            yield createCertificateIfNotExist(certificate_file_not_active_yet, private_key_file, applicationUri, next_year, 365);
            if (!fs_1.default.existsSync(certificate_revoked)) {
                // self_signed certificate already exists
                const certificate = yield createCertificateIfNotExist(certificate_revoked, private_key_file, applicationUri + "Revoked", // make sure we used a uniq URI here
                yesterday, 365);
                (0, toolbox_1.warningLog)(" certificate to revoke => ", certificate);
                revoke_certificate(certificate_revoked);
            }
        }
    });
}
function wrap(func) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield func();
        }
        catch (err) {
            console.log(err.message);
        }
    });
}
function create_default_certificates(dev) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, assert_1.default)(gLocalConfig);
        const base_name = gLocalConfig.certificateDir || "";
        (0, assert_1.default)(fs_1.default.existsSync(base_name));
        let clientURN;
        let serverURN;
        let discoveryServerURN;
        wrap(() => __awaiter(this, void 0, void 0, function* () {
            yield (0, hostname_1.extractFullyQualifiedDomainName)();
            const hostname = os_1.default.hostname();
            const fqdn = (0, hostname_1.getFullyQualifiedDomainName)();
            (0, toolbox_1.warningLog)(chalk_1.default.yellow("     hostname = "), chalk_1.default.cyan(hostname));
            (0, toolbox_1.warningLog)(chalk_1.default.yellow("     fqdn     = "), chalk_1.default.cyan(fqdn));
            clientURN = (0, applicationurn_1.makeApplicationUrn)(hostname, "NodeOPCUA-Client");
            serverURN = (0, applicationurn_1.makeApplicationUrn)(hostname, "NodeOPCUA-Server");
            discoveryServerURN = (0, applicationurn_1.makeApplicationUrn)(hostname, "NodeOPCUA-DiscoveryServer");
            (0, toolbox_1.displayTitle)("Create  Application Certificate for Server & its private key");
            yield createDefaultCertificate(base_name, "client_", 1024, clientURN, dev);
            yield createDefaultCertificate(base_name, "client_", 2048, clientURN, dev);
            yield createDefaultCertificate(base_name, "client_", 3072, clientURN, dev);
            yield createDefaultCertificate(base_name, "client_", 4096, clientURN, dev);
            (0, toolbox_1.displayTitle)("Create  Application Certificate for Client & its private key");
            yield createDefaultCertificate(base_name, "server_", 1024, serverURN, dev);
            yield createDefaultCertificate(base_name, "server_", 2048, serverURN, dev);
            yield createDefaultCertificate(base_name, "server_", 3072, serverURN, dev);
            yield createDefaultCertificate(base_name, "server_", 4096, serverURN, dev);
            (0, toolbox_1.displayTitle)("Create  Application Certificate for DiscoveryServer & its private key");
            yield createDefaultCertificate(base_name, "discoveryServer_", 1024, discoveryServerURN, dev);
            yield createDefaultCertificate(base_name, "discoveryServer_", 2048, discoveryServerURN, dev);
            yield createDefaultCertificate(base_name, "discoveryServer_", 3072, discoveryServerURN, dev);
            yield createDefaultCertificate(base_name, "discoveryServer_", 4096, discoveryServerURN, dev);
        }));
    });
}
function createDefaultCertificates(dev) {
    return __awaiter(this, void 0, void 0, function* () {
        yield construct_CertificateAuthority("");
        yield construct_CertificateManager();
        yield create_default_certificates(dev);
    });
}
argv
    .strict()
    .wrap(132)
    .command("demo", "create default certificate for node-opcua demos", (yargs) => {
    const options = {};
    options.dev = {
        type: "boolean",
        describe: "create all sort of fancy certificates for dev testing purposes",
    };
    options.clean = {
        type: "boolean",
        describe: "Purge existing directory [use with care!]",
    };
    add_standard_option(options, "silent");
    add_standard_option(options, "root");
    const local_argv = yargs
        .strict()
        .wrap(132)
        .options(options)
        .usage("$0  demo [--dev] [--silent] [--clean]")
        .example("$0  demo --dev", "create a set of demo certificates")
        .help("help").argv;
    return local_argv;
}, (local_argv) => {
    wrap(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, with_openssl_1.ensure_openssl_installed)();
        (0, toolbox_1.displayChapter)("Create Demo certificates");
        (0, toolbox_1.displayTitle)("reading configuration");
        yield readConfiguration(local_argv);
        if (local_argv.clean) {
            (0, toolbox_1.displayTitle)("Cleaning old certificates");
            (0, assert_1.default)(gLocalConfig);
            const certificateDir = gLocalConfig.certificateDir || "";
            yield (0, rimraf_1.default)(certificateDir + "/*.pem*");
            yield (0, rimraf_1.default)(certificateDir + "/*.pub*");
            (0, toolbox_1.mkdirRecursiveSync)(certificateDir);
        }
        (0, toolbox_1.displayTitle)("create certificates");
        yield createDefaultCertificates(local_argv.dev);
        (0, toolbox_1.displayChapter)("Demo certificates  CREATED");
    }));
})
    .command("createCA", "create a Certificate Authority", 
/* builder*/ (yargs) => {
    const options = {
        subject: {
            default: certificate_authority_1.defaultSubject,
            type: "string",
            describe: "the CA certificate subject",
        },
    };
    add_standard_option(options, "root");
    add_standard_option(options, "CAFolder");
    add_standard_option(options, "keySize");
    add_standard_option(options, "silent");
    const local_argv = yargs.strict().wrap(132).options(options).help("help").epilog(epilog).argv;
    return local_argv;
}, 
/*handler*/ (local_argv) => {
    wrap(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, with_openssl_1.ensure_openssl_installed)();
        yield readConfiguration(local_argv);
        yield construct_CertificateAuthority(local_argv.subject);
    }));
})
    .command("createPKI", "create a Public Key Infrastructure", (yargs) => {
    const options = {};
    add_standard_option(options, "root");
    add_standard_option(options, "PKIFolder");
    add_standard_option(options, "keySize");
    add_standard_option(options, "silent");
    return yargs.strict().wrap(132).options(options).help("help").epilog(epilog).argv;
}, (local_argv) => {
    wrap(() => __awaiter(void 0, void 0, void 0, function* () {
        yield readConfiguration(local_argv);
        yield construct_CertificateManager();
    }));
})
    // ----------------------------------------------- certificate
    .command("certificate", "create a new certificate", (yargs) => {
    const options = {
        applicationUri: {
            alias: "a",
            demand: true,
            describe: "the application URI",
            default: "urn:{hostname}:Node-OPCUA-Server",
            type: "string",
        },
        output: {
            default: "my_certificate.pem",
            alias: "o",
            demand: true,
            describe: "the name of the generated certificate =>",
            type: "string",
        },
        selfSigned: {
            alias: "s",
            default: false,
            type: "boolean",
            describe: "if true, certificate will be self-signed",
        },
        validity: {
            alias: "v",
            default: null,
            type: "number",
            describe: "the certificate validity in days",
        },
        dns: {
            default: "{hostname}",
            type: "string",
            describe: "the list of valid domain name (comma separated)",
        },
        ip: {
            default: "",
            type: "string",
            describe: "the list of valid IPs (comma separated)",
        },
        subject: {
            default: "",
            type: "string",
            describe: "the certificate subject ( for instance C=FR/ST=Centre/L=Orleans/O=SomeOrganization/CN=Hello )",
        },
    };
    add_standard_option(options, "silent");
    add_standard_option(options, "root");
    add_standard_option(options, "CAFolder");
    add_standard_option(options, "PKIFolder");
    add_standard_option(options, "privateKey");
    return yargs.strict().wrap(132).options(options).help("help").epilog(epilog).argv;
}, (local_argv) => {
    function command_certificate(local_argv) {
        return __awaiter(this, void 0, void 0, function* () {
            const selfSigned = !!local_argv.selfSigned;
            if (!selfSigned) {
                yield command_full_certificate(local_argv);
            }
            else {
                yield command_selfsigned_certificate(local_argv);
            }
        });
    }
    function command_selfsigned_certificate(local_argv) {
        return __awaiter(this, void 0, void 0, function* () {
            const fqdn = yield (0, hostname_1.extractFullyQualifiedDomainName)();
            yield readConfiguration(local_argv);
            yield construct_CertificateManager();
            (0, toolbox_1.displaySubtitle)(" create self signed Certificate " + gLocalConfig.outputFile);
            let subject = local_argv.subject && local_argv.subject.length > 1
                ? new node_opcua_crypto_1.Subject(local_argv.subject)
                : gLocalConfig.subject || "";
            subject = JSON.parse(JSON.stringify(subject));
            const params = {
                applicationUri: gLocalConfig.applicationUri || "",
                dns: gLocalConfig.dns || [],
                ip: gLocalConfig.ip || [],
                outputFile: gLocalConfig.outputFile || "self_signed_certificate.pem",
                startDate: gLocalConfig.startDate || new Date(),
                subject,
                validity: gLocalConfig.validity || 365,
            };
            yield certificateManager.createSelfSignedCertificate(params);
        });
    }
    function command_full_certificate(local_argv) {
        return __awaiter(this, void 0, void 0, function* () {
            yield readConfiguration(local_argv);
            yield construct_CertificateManager();
            yield construct_CertificateAuthority("");
            (0, assert_1.default)(fs_1.default.existsSync(gLocalConfig.CAFolder || ""), " CA folder must exist");
            gLocalConfig.privateKey = undefined; // use PKI private key
            // create a Certificate Request from the certificate Manager
            gLocalConfig.subject =
                local_argv.subject && local_argv.subject.length > 1 ? local_argv.subject : gLocalConfig.subject;
            const csr_file = yield certificateManager.createCertificateRequest(gLocalConfig);
            if (!csr_file) {
                return;
            }
            (0, toolbox_1.warningLog)(" csr_file = ", csr_file);
            const certificate = csr_file.replace(".csr", ".pem");
            if (fs_1.default.existsSync(certificate)) {
                throw new Error(" File " + certificate + " already exist");
            }
            yield g_certificateAuthority.signCertificateRequest(certificate, csr_file, gLocalConfig);
            (0, assert_1.default)(typeof gLocalConfig.outputFile === "string");
            fs_1.default.writeFileSync(gLocalConfig.outputFile || "", fs_1.default.readFileSync(certificate, "ascii"));
        });
    }
    wrap(() => __awaiter(void 0, void 0, void 0, function* () { return yield command_certificate(local_argv); }));
})
    // ----------------------------------------------- revoke
    .command("revoke <certificateFile>", "revoke a existing certificate", (yargs) => {
    const options = {};
    add_standard_option(options, "root");
    add_standard_option(options, "CAFolder");
    yargs.strict().wrap(132).help("help").usage("$0 revoke  my_certificate.pem").options(options).epilog(epilog);
    return yargs;
}, (local_argv) => {
    function revoke_certificate(certificate) {
        return __awaiter(this, void 0, void 0, function* () {
            yield g_certificateAuthority.revokeCertificate(certificate, {});
        });
    }
    wrap(() => __awaiter(void 0, void 0, void 0, function* () {
        // example : node bin\crypto_create_CA.js revoke my_certificate.pem
        const certificate = path_1.default.resolve(local_argv.certificateFile);
        (0, toolbox_1.warningLog)(chalk_1.default.yellow(" Certificate to revoke : "), chalk_1.default.cyan(certificate));
        if (!fs_1.default.existsSync(certificate)) {
            throw new Error("cannot find certificate to revoke " + certificate);
        }
        yield readConfiguration(local_argv);
        yield construct_CertificateAuthority("");
        yield revoke_certificate(certificate);
        (0, toolbox_1.warningLog)("done ... ");
        (0, toolbox_1.warningLog)("  crl = ", g_certificateAuthority.revocationList);
        (0, toolbox_1.warningLog)("\nyou should now publish the new Certificate Revocation List");
    }));
})
    .command("csr", "create a certificate signing request", (yargs) => {
    const options = {
        applicationUri: {
            alias: "a",
            // demand: true,
            describe: "the application URI",
            default: "urn:{hostname}:Node-OPCUA-Server",
            type: "string",
        },
        output: {
            default: "my_certificate_signing_request.csr",
            alias: "o",
            // demand: true,
            describe: "the name of the generated signing_request",
            type: "string",
        },
        dns: {
            default: "{hostname}",
            type: "string",
            describe: "the list of valid domain name (comma separated)",
        },
        ip: {
            default: "",
            type: "string",
            describe: "the list of valid IPs (comma separated)",
        },
        subject: {
            default: "/CN=Certificate",
            type: "string",
            describe: "the certificate subject ( for instance /C=FR/ST=Centre/L=Orleans/O=SomeOrganization/CN=Hello )",
        },
    };
    add_standard_option(options, "silent");
    add_standard_option(options, "root");
    add_standard_option(options, "PKIFolder");
    add_standard_option(options, "privateKey");
    return yargs.strict().wrap(132).options(options).help("help").epilog(epilog).argv;
}, (local_argv) => {
    wrap(() => __awaiter(void 0, void 0, void 0, function* () {
        yield readConfiguration(local_argv);
        if (!fs_1.default.existsSync(gLocalConfig.PKIFolder || "")) {
            (0, toolbox_1.warningLog)("PKI folder must exist");
        }
        yield construct_CertificateManager();
        if (!gLocalConfig.outputFile || fs_1.default.existsSync(gLocalConfig.outputFile)) {
            throw new Error(" File " + gLocalConfig.outputFile + " already exist");
        }
        gLocalConfig.privateKey = undefined; // use PKI private key
        // create a Certificate Request from the certificate Manager
        gLocalConfig.subject =
            local_argv.subject && local_argv.subject.length > 1 ? local_argv.subject : gLocalConfig.subject;
        const internal_csr_file = yield certificateManager.createCertificateRequest(gLocalConfig);
        if (!internal_csr_file) {
            return;
        }
        if (!gLocalConfig.outputFile) {
            (0, toolbox_1.warningLog)("please specify a output file");
            return;
        }
        const csr = yield fs_1.default.promises.readFile(internal_csr_file, "utf-8");
        fs_1.default.writeFileSync(gLocalConfig.outputFile || "", csr, "utf-8");
        (0, toolbox_1.warningLog)("Subject        = ", gLocalConfig.subject);
        (0, toolbox_1.warningLog)("applicationUri = ", gLocalConfig.applicationUri);
        (0, toolbox_1.warningLog)("altNames       = ", gLocalConfig.altNames);
        (0, toolbox_1.warningLog)("dns            = ", gLocalConfig.dns);
        (0, toolbox_1.warningLog)("ip             = ", gLocalConfig.ip);
        (0, toolbox_1.warningLog)("CSR file = ", gLocalConfig.outputFile);
    }));
})
    .command("sign", "validate a certificate signing request and generate a certificate", (yargs) => {
    const options = {
        csr: {
            alias: "i",
            default: "my_certificate_signing_request.csr",
            type: "string",
            demandOption: true,
            description: "the csr",
        },
        output: {
            default: "my_certificate.pem",
            alias: "o",
            demand: true,
            describe: "the name of the generated certificate",
            type: "string",
        },
        validity: {
            alias: "v",
            default: 365,
            type: "number",
            describe: "the certificate validity in days",
        },
    };
    add_standard_option(options, "silent");
    add_standard_option(options, "root");
    add_standard_option(options, "CAFolder");
    return yargs.strict().wrap(132).options(options).help("help").epilog(epilog).argv;
}, (local_argv) => {
    wrap(() => __awaiter(void 0, void 0, void 0, function* () {
        /** */
        yield readConfiguration(local_argv);
        if (!fs_1.default.existsSync(gLocalConfig.CAFolder || "")) {
            throw new Error("CA folder must exist:" + gLocalConfig.CAFolder);
        }
        yield construct_CertificateAuthority("");
        const csr_file = path_1.default.resolve(local_argv.csr || "");
        if (!fs_1.default.existsSync(csr_file)) {
            throw new Error("Certificate signing request doesn't exist: " + csr_file);
        }
        const certificate = path_1.default.resolve(local_argv.output || csr_file.replace(".csr", ".pem"));
        if (fs_1.default.existsSync(certificate)) {
            throw new Error(" File " + certificate + " already exist");
        }
        yield g_certificateAuthority.signCertificateRequest(certificate, csr_file, gLocalConfig);
        (0, assert_1.default)(typeof gLocalConfig.outputFile === "string");
        fs_1.default.writeFileSync(gLocalConfig.outputFile || "", fs_1.default.readFileSync(certificate, "ascii"));
    }));
})
    .command("dump <certificateFile>", "display a certificate", () => {
    /** */
}, (yargs) => {
    wrap(() => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield (0, with_openssl_1.dumpCertificate)(yargs.certificateFile);
        (0, toolbox_1.warningLog)(data);
    }));
})
    .command("toder <pemCertificate>", "convert a certificate to a DER format with finger print", () => {
    /** */
}, (yargs) => {
    wrap(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, with_openssl_1.toDer)(argv.pemCertificate);
    }));
})
    .command("fingerprint <certificateFile>", "print the certificate fingerprint", () => {
    /** */
}, (local_argv) => {
    wrap(() => __awaiter(void 0, void 0, void 0, function* () {
        const certificate = local_argv.certificateFile;
        const data = yield (0, with_openssl_1.fingerprint)(certificate);
        if (!data)
            return;
        const s = data.split("=")[1].split(":").join("").trim();
        (0, toolbox_1.warningLog)(s);
    }));
})
    .command("$0", "help", (yargs) => {
    (0, toolbox_1.warningLog)("--help for help");
    return yargs;
})
    .epilog(epilog)
    .help("help")
    .strict().argv;
function main(argumentsList) {
    return __awaiter(this, void 0, void 0, function* () {
        const g_argv = yield yargs_1.default.parse(argumentsList);
        if (g_argv.help) {
            yargs_1.default.showHelp();
        }
    });
}
//# sourceMappingURL=crypto_create_CA.js.map