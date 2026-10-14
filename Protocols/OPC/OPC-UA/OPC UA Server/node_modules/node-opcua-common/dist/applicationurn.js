"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeApplicationUrn = makeApplicationUrn;
/**
 * @module node-opcua-common
 */
const crypto_1 = require("crypto");
const node_opcua_assert_1 = require("node-opcua-assert");
function makeApplicationUrn(hostname, suffix) {
    (0, node_opcua_assert_1.assert)(!suffix.match(/urn:/), "already a application URN ?");
    // beware : Openssl doesn't support urn with length greater than 64 !!
    //          sometimes hostname length could be too long ...
    // application urn length must not exceed 64 car. to comply with openssl
    // see cryptoCA
    let hostnameHash = hostname;
    if (hostnameHash.length + 7 + suffix.length >= 64) {
        // we need to reduce the applicationUrn side => let's take
        // a portion of the hostname hash.
        hostnameHash = (0, crypto_1.createHash)("md5").update(hostname).digest("hex").substring(0, 16);
    }
    const applicationUrn = "urn:" + hostnameHash + ":" + suffix;
    (0, node_opcua_assert_1.assert)(applicationUrn.length <= 64);
    return applicationUrn;
}
//# sourceMappingURL=applicationurn.js.map