"use strict";
/**
 * @module node-opcua-secure-channel
 */
// A SecureChannel is a long-running logical connection between a single Client and a single Server.
// This channel maintains a set of keys known only to the Client and Server, which are used to
// authenticate and encrypt Messages sent across the network. The ClientSecureChannelLayer Services allow
// the Client and Server to securely negotiate the keys to use.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageChunker = exports.ServiceFault = exports.CloseSecureChannelResponse = exports.CloseSecureChannelRequest = exports.OpenSecureChannelResponse = exports.OpenSecureChannelRequest = exports.HelloMessage = exports.AcknowledgeMessage = exports.SymmetricAlgorithmSecurityHeader = exports.AsymmetricAlgorithmSecurityHeader = void 0;
var node_opcua_service_secure_channel_1 = require("node-opcua-service-secure-channel");
Object.defineProperty(exports, "AsymmetricAlgorithmSecurityHeader", { enumerable: true, get: function () { return node_opcua_service_secure_channel_1.AsymmetricAlgorithmSecurityHeader; } });
Object.defineProperty(exports, "SymmetricAlgorithmSecurityHeader", { enumerable: true, get: function () { return node_opcua_service_secure_channel_1.SymmetricAlgorithmSecurityHeader; } });
var node_opcua_transport_1 = require("node-opcua-transport");
Object.defineProperty(exports, "AcknowledgeMessage", { enumerable: true, get: function () { return node_opcua_transport_1.AcknowledgeMessage; } });
Object.defineProperty(exports, "HelloMessage", { enumerable: true, get: function () { return node_opcua_transport_1.HelloMessage; } });
var node_opcua_service_secure_channel_2 = require("node-opcua-service-secure-channel");
Object.defineProperty(exports, "OpenSecureChannelRequest", { enumerable: true, get: function () { return node_opcua_service_secure_channel_2.OpenSecureChannelRequest; } });
Object.defineProperty(exports, "OpenSecureChannelResponse", { enumerable: true, get: function () { return node_opcua_service_secure_channel_2.OpenSecureChannelResponse; } });
Object.defineProperty(exports, "CloseSecureChannelRequest", { enumerable: true, get: function () { return node_opcua_service_secure_channel_2.CloseSecureChannelRequest; } });
Object.defineProperty(exports, "CloseSecureChannelResponse", { enumerable: true, get: function () { return node_opcua_service_secure_channel_2.CloseSecureChannelResponse; } });
Object.defineProperty(exports, "ServiceFault", { enumerable: true, get: function () { return node_opcua_service_secure_channel_2.ServiceFault; } });
var message_chunker_1 = require("./message_chunker");
Object.defineProperty(exports, "MessageChunker", { enumerable: true, get: function () { return message_chunker_1.MessageChunker; } });
//# sourceMappingURL=secure_channel_service.js.map