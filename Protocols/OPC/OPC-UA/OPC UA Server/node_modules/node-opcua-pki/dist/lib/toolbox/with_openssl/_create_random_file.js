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
exports.createRandomFile = createRandomFile;
exports.createRandomFileIfNotExist = createRandomFileIfNotExist;
exports.useRandFile = useRandFile;
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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const config_1 = require("../config");
const execute_openssl_1 = require("./execute_openssl");
const common_1 = require("../common");
const q = common_1.quote;
function createRandomFile(randomFile, options) {
    return __awaiter(this, void 0, void 0, function* () {
        // istanbul ignore next
        if (!useRandFile()) {
            return;
        }
        yield (0, execute_openssl_1.execute_openssl)("rand " + " -out " + q(randomFile) + " -hex 256", options);
    });
}
function createRandomFileIfNotExist(randomFile, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const randomFilePath = options.cwd ? path_1.default.join(options.cwd, randomFile) : randomFile;
        if (fs_1.default.existsSync(randomFilePath)) {
            return;
        }
        else {
            yield createRandomFile(randomFile, options);
        }
    });
}
function useRandFile() {
    // istanbul ignore next
    if (config_1.g_config.opensslVersion && config_1.g_config.opensslVersion.toLowerCase().indexOf("libressl") > -1) {
        return false;
    }
    return true;
}
//# sourceMappingURL=_create_random_file.js.map