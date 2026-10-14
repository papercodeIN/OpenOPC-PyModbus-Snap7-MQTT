"use strict";
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
exports.check_system_openssl_version = check_system_openssl_version;
exports.install_prerequisite = install_prerequisite;
exports.get_openssl_exec_path = get_openssl_exec_path;
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const url_1 = __importDefault(require("url"));
const byline_1 = __importDefault(require("byline"));
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = __importDefault(require("child_process"));
const progress_1 = __importDefault(require("progress"));
const yauzl_1 = __importDefault(require("yauzl"));
const debug_1 = require("../debug");
const doDebug = process.env.NODEOPCUAPKIDEBUG || false;
// tslint:disable-next-line:no-var-requires
// eslint-disable-next-line @typescript-eslint/no-var-requires
const wget = require("wget-improved-2");
function makeOptions() {
    var _a;
    const proxy = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy || undefined;
    if (proxy) {
        const a = new url_1.default.URL(proxy);
        const auth = a.username ? a.username + ":" + a.password : undefined;
        const options = {
            proxy: {
                port: a.port ? parseInt(a.port, 10) : 80,
                protocol: a.protocol.replace(":", ""),
                host: (_a = a.hostname) !== null && _a !== void 0 ? _a : "",
                proxyAuth: auth,
            },
        };
        (0, debug_1.warningLog)(chalk_1.default.green("- using proxy "), proxy);
        (0, debug_1.warningLog)(options);
        return options;
    }
    return {};
}
function execute(cmd, cwd) {
    return __awaiter(this, void 0, void 0, function* () {
        let output = "";
        // xx cwd = cwd ? {cwd: cwd} : {};
        const options = {
            cwd,
            windowsHide: true,
        };
        return yield new Promise((resolve, reject) => {
            const child = child_process_1.default.exec(cmd, options, (err /*, stdout: string, stderr: string*/) => {
                const exitCode = err === null ? 0 : err.code;
                if (err)
                    reject(err);
                else {
                    resolve({ exitCode, output });
                }
            });
            const stream1 = (0, byline_1.default)(child.stdout);
            stream1.on("data", (line) => {
                output += line + "\n";
                // istanbul ignore next
                if (doDebug) {
                    process.stdout.write("        stdout " + chalk_1.default.yellow(line) + "\n");
                }
            });
        });
    });
}
function quote(str) {
    return '"' + str.replace(/\\/g, "/") + '"';
}
function is_expected_openssl_version(strVersion) {
    return !!strVersion.match(/OpenSSL 1|3/);
}
function getopensslExecPath() {
    return __awaiter(this, void 0, void 0, function* () {
        let result1;
        try {
            result1 = yield execute("which openssl");
        }
        catch (err) {
            (0, debug_1.warningLog)("warning: ", err.message);
            throw new Error("Cannot find openssl");
        }
        const exitCode = result1.exitCode;
        const output = result1.output;
        if (exitCode !== 0) {
            (0, debug_1.warningLog)(chalk_1.default.yellow(" it seems that ") + chalk_1.default.cyan("openssl") + chalk_1.default.yellow(" is not installed on your computer "));
            (0, debug_1.warningLog)(chalk_1.default.yellow("Please install it before running this programs"));
            throw new Error("Cannot find openssl");
        }
        const opensslExecPath = output.replace(/\n\r/g, "").trim();
        return opensslExecPath;
    });
}
function check_system_openssl_version() {
    return __awaiter(this, void 0, void 0, function* () {
        const opensslExecPath = yield getopensslExecPath();
        // tslint:disable-next-line:variable-name
        const q_opensslExecPath = quote(opensslExecPath);
        // istanbul ignore next
        if (doDebug) {
            (0, debug_1.warningLog)("              OpenSSL found in : " + chalk_1.default.yellow(opensslExecPath));
        }
        // ------------------------ now verify that openssl version is the correct one
        const result = yield execute(q_opensslExecPath + " version");
        const exitCode = result.exitCode;
        const output = result.output;
        const version = output.trim();
        const versionOK = exitCode === 0 && is_expected_openssl_version(version);
        if (!versionOK) {
            let message = chalk_1.default.whiteBright("Warning !!!!!!!!!!!! ") +
                "\nyour version of openssl is " +
                version +
                ". It doesn't match the expected version";
            if (process.platform === "darwin") {
                message +=
                    chalk_1.default.cyan("\nplease refer to :") +
                        chalk_1.default.yellow(" https://github.com/node-opcua/node-opcua/" + "wiki/installing-node-opcua-or-node-red-on-MacOS");
            }
            console.log(message);
        }
        return output;
    });
}
function install_and_check_win32_openssl_version() {
    return __awaiter(this, void 0, void 0, function* () {
        const downloadFolder = path_1.default.join(os_1.default.tmpdir(), ".");
        function get_openssl_folder_win32() {
            if (process.env.LOCALAPPDATA) {
                const userProgramFolder = path_1.default.join(process.env.LOCALAPPDATA, "Programs");
                if (fs_1.default.existsSync(userProgramFolder)) {
                    return path_1.default.join(userProgramFolder, "openssl");
                }
            }
            return path_1.default.join(process.cwd(), "openssl");
        }
        function get_openssl_exec_path_win32() {
            const opensslFolder = get_openssl_folder_win32();
            return path_1.default.join(opensslFolder, "openssl.exe");
        }
        function check_openssl_win32() {
            return __awaiter(this, void 0, void 0, function* () {
                const opensslExecPath = get_openssl_exec_path_win32();
                const exists = fs_1.default.existsSync(opensslExecPath);
                if (!exists) {
                    (0, debug_1.warningLog)("checking presence of ", opensslExecPath);
                    (0, debug_1.warningLog)(chalk_1.default.red(" cannot find file ") + opensslExecPath);
                    return {
                        opensslOk: false,
                        version: "cannot find file " + opensslExecPath,
                    };
                }
                else {
                    // tslint:disable-next-line:variable-name
                    const q_openssl_exe_path = quote(opensslExecPath);
                    const cwd = ".";
                    const { exitCode, output } = yield execute(q_openssl_exe_path + " version", cwd);
                    const version = output.trim();
                    // istanbul ignore next
                    if (doDebug) {
                        (0, debug_1.warningLog)(" Version = ", version);
                    }
                    return {
                        opensslOk: exitCode === 0 && is_expected_openssl_version(version),
                        version,
                    };
                }
            });
        }
        /**
         * detect whether windows OS is a 64 bits or 32 bits
         * http://ss64.com/nt/syntax-64bit.html
         * http://blogs.msdn.com/b/david.wang/archive/2006/03/26/howto-detect-process-bitness.aspx
         * @return {number}
         */
        function win32or64() {
            if (process.env.PROCESSOR_ARCHITECTURE === "x86" && process.env.PROCESSOR_ARCHITEW6432) {
                return 64;
            }
            if (process.env.PROCESSOR_ARCHITECTURE === "AMD64") {
                return 64;
            }
            // check if we are running node  x32 on a x64 arch
            if (process.env.CURRENT_CPU === "x64") {
                return 64;
            }
            return 32;
        }
        function download_openssl() {
            return __awaiter(this, void 0, void 0, function* () {
                // const url = (win32or64() === 64 )
                //         ? "http://indy.fulgan.com/SSL/openssl-1.0.2o-x64_86-win64.zip"
                //         : "http://indy.fulgan.com/SSL/openssl-1.0.2o-i386-win32.zip"
                //     ;
                const url = win32or64() === 64
                    ? "https://github.com/node-opcua/node-opcua-pki/releases/download/2.14.2/openssl-1.0.2u-x64_86-win64.zip"
                    : "https://github.com/node-opcua/node-opcua-pki/releases/download/2.14.2/openssl-1.0.2u-i386-win32.zip";
                // the zip file
                const outputFilename = path_1.default.join(downloadFolder, path_1.default.basename(url));
                (0, debug_1.warningLog)("downloading " + chalk_1.default.yellow(url) + " to " + outputFilename);
                if (fs_1.default.existsSync(outputFilename)) {
                    return { downloadedFile: outputFilename };
                }
                const options = makeOptions();
                const bar = new progress_1.default(chalk_1.default.cyan("[:bar]") + chalk_1.default.cyan(" :percent ") + chalk_1.default.white(":etas"), {
                    complete: "=",
                    incomplete: " ",
                    total: 100,
                    width: 100,
                });
                return yield new Promise((resolve, reject) => {
                    const download = wget.download(url, outputFilename, options);
                    download.on("error", (err) => {
                        (0, debug_1.warningLog)(err);
                        setImmediate(() => {
                            reject(err);
                        });
                    });
                    download.on("end", (output) => {
                        // istanbul ignore next
                        if (doDebug) {
                            (0, debug_1.warningLog)(output);
                        }
                        // warningLog("done ...");
                        resolve({ downloadedFile: outputFilename });
                    });
                    download.on("progress", (progress) => {
                        bar.update(progress);
                    });
                });
            });
        }
        function unzip_openssl(zipFilename) {
            return __awaiter(this, void 0, void 0, function* () {
                const opensslFolder = get_openssl_folder_win32();
                const zipFile = yield new Promise((resolve, reject) => {
                    yauzl_1.default.open(zipFilename, { lazyEntries: true }, (err, zipfile) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(zipfile);
                        }
                    });
                });
                zipFile.readEntry();
                yield new Promise((resolve, reject) => {
                    zipFile.on("end", (err) => {
                        setImmediate(() => {
                            // istanbul ignore next
                            if (doDebug) {
                                (0, debug_1.warningLog)("unzip done");
                            }
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve();
                            }
                        });
                    });
                    zipFile.on("entry", (entry) => {
                        zipFile.openReadStream(entry, (err, readStream) => {
                            if (err) {
                                return reject(err);
                            }
                            const file = path_1.default.join(opensslFolder, entry.fileName);
                            // istanbul ignore next
                            if (doDebug) {
                                (0, debug_1.warningLog)(" unzipping :", file);
                            }
                            const writeStream = fs_1.default.createWriteStream(file, "binary");
                            // ensure parent directory exists
                            readStream.pipe(writeStream);
                            writeStream.on("close", () => {
                                zipFile.readEntry();
                            });
                        });
                    });
                });
            });
        }
        const opensslFolder = get_openssl_folder_win32();
        const opensslExecPath = get_openssl_exec_path_win32();
        if (!fs_1.default.existsSync(opensslFolder)) {
            // istanbul ignore next
            if (doDebug) {
                (0, debug_1.warningLog)("creating openssl_folder", opensslFolder);
            }
            fs_1.default.mkdirSync(opensslFolder);
        }
        const { opensslOk, version } = yield check_openssl_win32();
        if (!opensslOk) {
            (0, debug_1.warningLog)(chalk_1.default.yellow("openssl seems to be missing and need to be installed"));
            const { downloadedFile } = yield download_openssl();
            // istanbul ignore next
            if (doDebug) {
                (0, debug_1.warningLog)("deflating ", chalk_1.default.yellow(downloadedFile));
            }
            yield unzip_openssl(downloadedFile);
            const opensslExists = !!fs_1.default.existsSync(opensslExecPath);
            // istanbul ignore next
            if (doDebug) {
                (0, debug_1.warningLog)("verifying ", opensslExists, opensslExists ? chalk_1.default.green("OK ") : chalk_1.default.red(" Error"), opensslExecPath);
            }
            const opensslExecPath2 = yield check_openssl_win32();
            return opensslExecPath;
        }
        else {
            // istanbul ignore next
            if (doDebug) {
                (0, debug_1.warningLog)(chalk_1.default.green("openssl is already installed and have the expected version."));
            }
            return opensslExecPath;
        }
    });
}
/**
 *
 * return path to the openssl executable
 */
function install_prerequisite() {
    return __awaiter(this, void 0, void 0, function* () {
        // istanbul ignore else
        if (process.platform !== "win32") {
            return yield check_system_openssl_version();
        }
        else {
            return yield install_and_check_win32_openssl_version();
        }
    });
}
function get_openssl_exec_path() {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.platform === "win32") {
            const opensslExecPath = yield install_prerequisite();
            if (!fs_1.default.existsSync(opensslExecPath)) {
                throw new Error("internal error cannot find " + opensslExecPath);
            }
            return opensslExecPath;
        }
        else {
            return "openssl";
        }
    });
}
//# sourceMappingURL=install_prerequisite.js.map