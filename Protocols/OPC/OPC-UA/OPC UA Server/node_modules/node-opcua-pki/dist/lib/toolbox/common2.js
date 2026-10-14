"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateFileExist = certificateFileExist;
exports.mkdirRecursiveSync = mkdirRecursiveSync;
exports.makePath = makePath;
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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const config_1 = require("./config");
const assert = require("assert");
const debug_1 = require("./debug");
function certificateFileExist(certificateFile) {
    // istanbul ignore next
    if (fs_1.default.existsSync(certificateFile) && !config_1.g_config.force) {
        (0, debug_1.warningLog)(chalk_1.default.yellow("        certificate ") +
            chalk_1.default.cyan(certificateFile) +
            chalk_1.default.yellow(" already exists => do not overwrite"));
        return false;
    }
    return true;
}
function mkdirRecursiveSync(folder) {
    if (!fs_1.default.existsSync(folder)) {
        // istanbul ignore next
        (0, debug_1.debugLog)(chalk_1.default.white(" .. constructing "), folder);
        fs_1.default.mkdirSync(folder, { recursive: true });
    }
}
function makePath(folderName, filename) {
    let s;
    if (filename) {
        s = path_1.default.join(path_1.default.normalize(folderName), filename);
    }
    else {
        assert(folderName);
        s = folderName;
    }
    s = s.replace(/\\/g, "/");
    return s;
}
//# sourceMappingURL=common2.js.map