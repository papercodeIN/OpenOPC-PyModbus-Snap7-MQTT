"use strict";
/**
 * @module node-opcua-service-discovery
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceToString = exports.announcementToServiceConfig = exports._announceServerOnMulticastSubnet = exports.sameService = exports.BonjourHolder = exports.serverCapabilities = exports.ServerOnNetwork = exports.FindServersOnNetworkResponse = exports.FindServersOnNetworkRequest = exports.FindServersResponse = exports.FindServersRequest = exports.RegisterServer2Response = exports.RegisterServer2Request = exports.MdnsDiscoveryConfiguration = exports.RegisterServerResponse = exports.RegisterServerRequest = exports.RegisteredServer = void 0;
var node_opcua_types_1 = require("node-opcua-types");
Object.defineProperty(exports, "RegisteredServer", { enumerable: true, get: function () { return node_opcua_types_1.RegisteredServer; } });
Object.defineProperty(exports, "RegisterServerRequest", { enumerable: true, get: function () { return node_opcua_types_1.RegisterServerRequest; } });
Object.defineProperty(exports, "RegisterServerResponse", { enumerable: true, get: function () { return node_opcua_types_1.RegisterServerResponse; } });
Object.defineProperty(exports, "MdnsDiscoveryConfiguration", { enumerable: true, get: function () { return node_opcua_types_1.MdnsDiscoveryConfiguration; } });
Object.defineProperty(exports, "RegisterServer2Request", { enumerable: true, get: function () { return node_opcua_types_1.RegisterServer2Request; } });
Object.defineProperty(exports, "RegisterServer2Response", { enumerable: true, get: function () { return node_opcua_types_1.RegisterServer2Response; } });
Object.defineProperty(exports, "FindServersRequest", { enumerable: true, get: function () { return node_opcua_types_1.FindServersRequest; } });
Object.defineProperty(exports, "FindServersResponse", { enumerable: true, get: function () { return node_opcua_types_1.FindServersResponse; } });
Object.defineProperty(exports, "FindServersOnNetworkRequest", { enumerable: true, get: function () { return node_opcua_types_1.FindServersOnNetworkRequest; } });
Object.defineProperty(exports, "FindServersOnNetworkResponse", { enumerable: true, get: function () { return node_opcua_types_1.FindServersOnNetworkResponse; } });
Object.defineProperty(exports, "ServerOnNetwork", { enumerable: true, get: function () { return node_opcua_types_1.ServerOnNetwork; } });
var server_capabilities_1 = require("./server_capabilities");
Object.defineProperty(exports, "serverCapabilities", { enumerable: true, get: function () { return server_capabilities_1.serverCapabilities; } });
var bonjour_1 = require("./bonjour");
Object.defineProperty(exports, "BonjourHolder", { enumerable: true, get: function () { return bonjour_1.BonjourHolder; } });
Object.defineProperty(exports, "sameService", { enumerable: true, get: function () { return bonjour_1.isSameService; } });
Object.defineProperty(exports, "_announceServerOnMulticastSubnet", { enumerable: true, get: function () { return bonjour_1._announceServerOnMulticastSubnet; } });
Object.defineProperty(exports, "announcementToServiceConfig", { enumerable: true, get: function () { return bonjour_1.announcementToServiceConfig; } });
Object.defineProperty(exports, "serviceToString", { enumerable: true, get: function () { return bonjour_1.serviceToString; } });
//# sourceMappingURL=index.js.map