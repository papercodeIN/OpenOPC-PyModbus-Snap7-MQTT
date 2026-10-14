"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayChapter = displayChapter;
exports.displayTitle = displayTitle;
exports.displaySubtitle = displaySubtitle;
exports.display = display;
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
const chalk_1 = __importDefault(require("chalk"));
const config_1 = require("./config");
const debug_1 = require("./debug");
// istanbul ignore next
function displayChapter(str) {
    const l = "                                                                                               ";
    (0, debug_1.warningLog)(chalk_1.default.bgWhite(l) + " ");
    str = ("        " + str + l).substring(0, l.length);
    (0, debug_1.warningLog)(chalk_1.default.bgWhite.cyan(str));
    (0, debug_1.warningLog)(chalk_1.default.bgWhite(l) + " ");
}
function displayTitle(str) {
    // istanbul ignore next
    if (!config_1.g_config.silent) {
        (0, debug_1.warningLog)("");
        (0, debug_1.warningLog)(chalk_1.default.yellowBright(str));
        (0, debug_1.warningLog)(chalk_1.default.yellow(new Array(str.length + 1).join("=")), "\n");
    }
}
function displaySubtitle(str) {
    // istanbul ignore next
    if (!config_1.g_config.silent) {
        (0, debug_1.warningLog)("");
        (0, debug_1.warningLog)("    " + chalk_1.default.yellowBright(str));
        (0, debug_1.warningLog)("    " + chalk_1.default.white(new Array(str.length + 1).join("-")), "\n");
    }
}
function display(str) {
    // istanbul ignore next
    if (!config_1.g_config.silent) {
        (0, debug_1.warningLog)("       " + str);
    }
}
//# sourceMappingURL=display.js.map