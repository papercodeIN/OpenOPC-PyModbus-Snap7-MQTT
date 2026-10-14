"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quote = quote;
exports.adjustDate = adjustDate;
exports.adjustApplicationUri = adjustApplicationUri;
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
const assert = require("assert");
function quote(str) {
    return '"' + (str || "") + '"';
}
function adjustDate(params) {
    assert(params instanceof Object);
    params.startDate = params.startDate || new Date();
    assert(params.startDate instanceof Date);
    params.validity = params.validity || 365; // one year
    params.endDate = new Date(params.startDate.getTime());
    params.endDate.setDate(params.startDate.getDate() + params.validity);
    // params.endDate = x509Date(endDate);
    // params.startDate = x509Date(startDate);
    assert(params.endDate instanceof Date);
    assert(params.startDate instanceof Date);
    // // istanbul ignore next
    // if (!g_config.silent) {
    //     warningLog(" start Date ", params.startDate.toUTCString(), x509Date(params.startDate));
    //     warningLog(" end   Date ", params.endDate.toUTCString(), x509Date(params.endDate));
    // }
}
function adjustApplicationUri(params) {
    const applicationUri = params.applicationUri || "";
    if (applicationUri.length > 200) {
        throw new Error("Openssl doesn't support urn with length greater than 200" + applicationUri);
    }
}
//# sourceMappingURL=common.js.map