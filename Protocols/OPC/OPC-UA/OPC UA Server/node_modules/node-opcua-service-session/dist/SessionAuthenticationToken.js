"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaSessionAuthenticationToken = void 0;
/**
 * @module node-opcua-service-session
 */
const node_opcua_factory_1 = require("node-opcua-factory");
// OPC Unified Architecture, Part 4  $7.29 page 139
exports.schemaSessionAuthenticationToken = {
    name: "SessionAuthenticationToken",
    subType: "NodeId"
};
(0, node_opcua_factory_1.registerBasicType)(exports.schemaSessionAuthenticationToken);
//# sourceMappingURL=SessionAuthenticationToken.js.map