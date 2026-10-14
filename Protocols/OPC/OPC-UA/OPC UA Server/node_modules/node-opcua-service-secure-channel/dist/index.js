"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymmetricAlgorithmSecurityHeader = exports.AsymmetricAlgorithmSecurityHeader = exports.UserTokenPolicy = exports._enumerationMessageSecurityMode = exports.MessageSecurityMode = exports.SignatureData = exports.RequestHeader = exports.ResponseHeader = exports.SecurityTokenRequestType = exports.ServiceFault = exports.CloseSecureChannelResponse = exports.CloseSecureChannelRequest = exports.OpenSecureChannelResponse = exports.OpenSecureChannelRequest = exports.ChannelSecurityToken = void 0;
exports.hasTokenExpired = hasTokenExpired;
/**
 * @module node-opcua-service-secure-channel
 */
// tslint:disable:max-line-length
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_types_1 = require("node-opcua-types");
var node_opcua_types_2 = require("node-opcua-types");
Object.defineProperty(exports, "ChannelSecurityToken", { enumerable: true, get: function () { return node_opcua_types_2.ChannelSecurityToken; } });
Object.defineProperty(exports, "OpenSecureChannelRequest", { enumerable: true, get: function () { return node_opcua_types_2.OpenSecureChannelRequest; } });
Object.defineProperty(exports, "OpenSecureChannelResponse", { enumerable: true, get: function () { return node_opcua_types_2.OpenSecureChannelResponse; } });
Object.defineProperty(exports, "CloseSecureChannelRequest", { enumerable: true, get: function () { return node_opcua_types_2.CloseSecureChannelRequest; } });
Object.defineProperty(exports, "CloseSecureChannelResponse", { enumerable: true, get: function () { return node_opcua_types_2.CloseSecureChannelResponse; } });
Object.defineProperty(exports, "ServiceFault", { enumerable: true, get: function () { return node_opcua_types_2.ServiceFault; } });
Object.defineProperty(exports, "SecurityTokenRequestType", { enumerable: true, get: function () { return node_opcua_types_2.SecurityTokenRequestType; } });
Object.defineProperty(exports, "ResponseHeader", { enumerable: true, get: function () { return node_opcua_types_2.ResponseHeader; } });
Object.defineProperty(exports, "RequestHeader", { enumerable: true, get: function () { return node_opcua_types_2.RequestHeader; } });
Object.defineProperty(exports, "SignatureData", { enumerable: true, get: function () { return node_opcua_types_2.SignatureData; } });
Object.defineProperty(exports, "MessageSecurityMode", { enumerable: true, get: function () { return node_opcua_types_2.MessageSecurityMode; } });
Object.defineProperty(exports, "_enumerationMessageSecurityMode", { enumerable: true, get: function () { return node_opcua_types_2._enumerationMessageSecurityMode; } });
Object.defineProperty(exports, "UserTokenPolicy", { enumerable: true, get: function () { return node_opcua_types_2.UserTokenPolicy; } });
var AsymmetricAlgorithmSecurityHeader_1 = require("./AsymmetricAlgorithmSecurityHeader");
Object.defineProperty(exports, "AsymmetricAlgorithmSecurityHeader", { enumerable: true, get: function () { return AsymmetricAlgorithmSecurityHeader_1.AsymmetricAlgorithmSecurityHeader; } });
var SymmetricAlgorithmSecurityHeader_1 = require("./SymmetricAlgorithmSecurityHeader");
Object.defineProperty(exports, "SymmetricAlgorithmSecurityHeader", { enumerable: true, get: function () { return SymmetricAlgorithmSecurityHeader_1.SymmetricAlgorithmSecurityHeader; } });
__exportStar(require("./message_security_mode"), exports);
// createdAt
node_opcua_types_1.ChannelSecurityToken.schema.fields[2].defaultValue = () => new Date();
// revisedLifetime
node_opcua_types_1.ChannelSecurityToken.schema.fields[3].defaultValue = () => 30000;
function hasTokenExpired(token) {
    return (token.createdAt !== null)
        && (token.createdAt.getTime() + token.revisedLifetime) < Date.now();
}
Object.defineProperty(node_opcua_types_1.ChannelSecurityToken.prototype, "expired", {
    get() { return hasTokenExpired(this); },
    configurable: true,
    enumerable: true,
});
// ErrorMessage
// "Error",  "UInt32","The numeric code for the error. This shall be one of the values listed in Table 40."
// "Reason","String", "A more verbose description of the error.This string shall not be more than 4096 characters."
// OPC Unified Architecture, Part 4  $7.27 page 139
// RequestHeader",
// 0.  authenticationToken         NodeId         The secret Session identifier used to verify that the request is associated with
//                                                the Session. The SessionAuthenticationToken type is defined in 7.29.
// 1. timestamp                   UtcTime         The time the Client sent the request.
(0, node_opcua_assert_1.assert)(node_opcua_types_1.RequestHeader.schema.fields[1].name === "timestamp");
node_opcua_types_1.RequestHeader.schema.fields[1].defaultValue = () => new Date();
// 2. requestHandle               IntegerId "     A requestHandle associated with the request. This client defined handle can
//                                                be used to cancel the request. It is also returned in the response.
(0, node_opcua_assert_1.assert)(node_opcua_types_1.RequestHeader.schema.fields[2].name === "requestHandle");
node_opcua_types_1.RequestHeader.schema.fields[2].defaultValue = 0xDEADBEEF;
// 3. returnDiagnostics           UInt32          A bit mask that identifies the types of vendor-specific diagnostics to be
//                                                returned in diagnosticInfo response parameters.
// 4. auditEntryId                UAString        An identifier that identifies the Client's security audit log entry associated with
//                                                this request.
// 5. timeoutHint                UInt32
// 6.  additionalHeader          ExtensionObject
(0, node_opcua_assert_1.assert)(node_opcua_types_1.RequestHeader.schema.fields[6].name === "additionalHeader");
node_opcua_types_1.RequestHeader.schema.fields[6].defaultValue = () => null;
// OPC Unified Architecture, Part 4  $7.27 page 139
// Response Header,
// 0. timestamp                 UtcTime           The time the Server sent the response.
(0, node_opcua_assert_1.assert)(node_opcua_types_1.ResponseHeader.schema.fields[0].name === "timestamp");
node_opcua_types_1.ResponseHeader.schema.fields[0].defaultValue = () => new Date();
// 1. requestHandle             IntegerId          The requestHandle given by the Client to the request.
// 2. serviceResult             StatusCode         OPC UA-defined result of the Service invocation.
// 3. serviceDiagnostics        DiagnosticInfo     The diagnostics associated with the ServiceResult.
// 4. stringTable               String[]           There is one string in this list for each unique namespace, symbolic identifier,
//                                                 and localized text string contained in all of the diagnostics information
//                                                 parameters contained in the response (see 7.8). Each is identified within this
//                                                 table by its zero-based index.
// 5. additionalHeader          ExtensionObject    Reserved for future use.
// OpenSecureChannelResponse
// documentation excerpt:
// SecurityTokens have a finite lifetime negotiated with this Service. However, differences between the
// system clocks on different machines and network latencies mean that valid Messages could arrive after the token has
// expired. To prevent valid Messages from being discarded, the applications should do the following:
// 1.  Clients should request a new SecurityTokens after 75% of its lifetime has elapsed. This should ensure that Clients
//     will receive the new SecurityToken before the old one actually expires.
// 2.  Servers should use the existing SecurityToken to secure outgoing  Messages until the SecurityToken expires or the
//     Server receives a Message secured with a new SecurityToken.
//     This should ensure that Clients do not reject Messages secured with the new SecurityToken that arrive before
//     the Client receives the new SecurityToken.
// 3.  Clients should accept Messages secured by an expired SecurityToken for up to 25% of the token lifetime.
//     This should ensure that  Messages sent by the Server before the token expired are not rejected because of
//     network delays.
// Node-opcua raised a issue in mantis => issue 2895
// BUG: the specification 1.02 says in part 4 $7.30
//   SignatureData  is "signature" + "algorithm"
//   however the schema file specifies:   "algorithm" + "signature" , Schema file is correct
// SignatureData
//   algorithm          String      The cryptography algorithm used to create the signature.
(0, node_opcua_assert_1.assert)(node_opcua_types_1.SignatureData.schema.fields[0].name === "algorithm");
node_opcua_types_1.SignatureData.schema.fields[0].defaultValue = () => null;
//  signature           ByteString   The digital signature.
(0, node_opcua_assert_1.assert)(node_opcua_types_1.SignatureData.schema.fields[1].name === "signature");
node_opcua_types_1.SignatureData.schema.fields[1].defaultValue = () => null;
//# sourceMappingURL=index.js.map