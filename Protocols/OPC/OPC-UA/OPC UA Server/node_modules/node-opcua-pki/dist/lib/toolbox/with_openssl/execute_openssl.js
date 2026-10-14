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
exports.execute = execute;
exports.find_openssl = find_openssl;
exports.ensure_openssl_installed = ensure_openssl_installed;
exports.executeOpensslAsync = executeOpensslAsync;
exports.execute_openssl_no_failure = execute_openssl_no_failure;
exports.execute_openssl = execute_openssl;
const assert_1 = __importDefault(require("assert"));
const byline_1 = __importDefault(require("byline"));
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const install_prerequisite_1 = require("./install_prerequisite");
const common_1 = require("../common");
const config_1 = require("../config");
const debug_1 = require("../debug");
const _env_1 = require("./_env");
const common2_1 = require("../common2");
// tslint:disable-next-line:variable-name
let opensslPath; // not initialized
const n = common2_1.makePath;
function execute(cmd, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const from = new Error();
        options.cwd = options.cwd || process.cwd();
        // istanbul ignore next
        if (!config_1.g_config.silent) {
            (0, debug_1.warningLog)(chalk_1.default.cyan("                  CWD         "), options.cwd);
        }
        const outputs = [];
        return yield new Promise((resolve, reject) => {
            const child = child_process_1.default.exec(cmd, {
                cwd: options.cwd,
                windowsHide: true,
            }, (err) => {
                // istanbul ignore next
                if (err) {
                    if (!options.hideErrorMessage) {
                        const fence = "###########################################";
                        console.error(chalk_1.default.bgWhiteBright.redBright(`${fence} OPENSSL ERROR ${fence}`));
                        console.error(chalk_1.default.bgWhiteBright.redBright("CWD = " + options.cwd));
                        console.error(chalk_1.default.bgWhiteBright.redBright(err.message));
                        console.error(chalk_1.default.bgWhiteBright.redBright(`${fence} OPENSSL ERROR ${fence}`));
                        console.error(from.stack);
                    }
                    reject(new Error(err.message));
                    return;
                }
                resolve(outputs.join(""));
            });
            if (child.stdout) {
                const stream2 = (0, byline_1.default)(child.stdout);
                stream2.on("data", (line) => {
                    outputs.push(line + "\n");
                });
                if (!config_1.g_config.silent) {
                    stream2.on("data", (line) => {
                        line = line.toString();
                        if (debug_1.doDebug) {
                            process.stdout.write(chalk_1.default.white("        stdout ") + chalk_1.default.whiteBright(line) + "\n");
                        }
                    });
                }
            }
            // istanbul ignore next
            if (!config_1.g_config.silent) {
                if (child.stderr) {
                    const stream1 = (0, byline_1.default)(child.stderr);
                    stream1.on("data", (line) => {
                        line = line.toString();
                        if (debug_1.displayError) {
                            process.stdout.write(chalk_1.default.white("        stderr ") + chalk_1.default.red(line) + "\n");
                        }
                    });
                }
            }
        });
    });
}
function find_openssl() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, install_prerequisite_1.get_openssl_exec_path)();
    });
}
function ensure_openssl_installed() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!opensslPath) {
            opensslPath = yield find_openssl();
            const outputs = yield execute_openssl("version", { cwd: "." });
            config_1.g_config.opensslVersion = outputs.trim();
            if (debug_1.doDebug) {
                (0, debug_1.warningLog)("OpenSSL version : ", config_1.g_config.opensslVersion);
            }
        }
    });
}
function executeOpensslAsync(cmd, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield execute_openssl(cmd, options);
    });
}
function execute_openssl_no_failure(cmd, options) {
    return __awaiter(this, void 0, void 0, function* () {
        options = options || {};
        options.hideErrorMessage = true;
        try {
            return yield execute_openssl(cmd, options);
        }
        catch (err) {
            (0, debug_1.debugLog)(" (ignored error =  ERROR : )", err.message);
        }
    });
}
function getTempFolder() {
    return os_1.default.tmpdir();
}
function execute_openssl(cmd, options) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, debug_1.debugLog)("execute_openssl", cmd, options);
        const empty_config_file = n(getTempFolder(), "empty_config.cnf");
        if (!fs_1.default.existsSync(empty_config_file)) {
            yield fs_1.default.promises.writeFile(empty_config_file, "# empty config file");
        }
        options = options || {};
        options.openssl_conf = options.openssl_conf || empty_config_file; // "!! OPEN SLL CONF NOT DEFINED BAD FILE !!";
        (0, assert_1.default)(options.openssl_conf);
        (0, _env_1.setEnv)("OPENSSL_CONF", options.openssl_conf);
        // istanbul ignore next
        if (!config_1.g_config.silent) {
            (0, debug_1.warningLog)(chalk_1.default.cyan("                  OPENSSL_CONF"), process.env.OPENSSL_CONF);
            (0, debug_1.warningLog)(chalk_1.default.cyan("                  RANDFILE    "), process.env.RANDFILE);
            (0, debug_1.warningLog)(chalk_1.default.cyan("                  CMD         openssl "), chalk_1.default.cyanBright(cmd));
        }
        yield ensure_openssl_installed();
        return yield execute((0, common_1.quote)(opensslPath) + " " + cmd, options);
    });
}
//# sourceMappingURL=execute_openssl.js.map