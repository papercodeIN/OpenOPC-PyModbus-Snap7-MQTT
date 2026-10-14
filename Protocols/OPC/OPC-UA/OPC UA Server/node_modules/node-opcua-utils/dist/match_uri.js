"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchUri = matchUri;
/**
 * @module node-opcua-utils
 */
/**
 * returns true if two endpoint matches the same address:
 *
 * @see https://www.dnscheck.co/faq
 * @see https://tools.ietf.org/html/rfc4343 : Domain Name System (DNS) Case Insensitivity Clarification
 *
 */
function matchUri(endpointUri1, endpointUri2) {
    if (endpointUri1 === null) {
        return endpointUri2 === null;
    }
    if (endpointUri2 === null) {
        return endpointUri1 === null;
    }
    return endpointUri1.toLowerCase() === endpointUri2.toLowerCase();
}
//# sourceMappingURL=match_uri.js.map