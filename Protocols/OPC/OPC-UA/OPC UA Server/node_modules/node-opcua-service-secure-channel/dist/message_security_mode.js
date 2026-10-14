"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coerceMessageSecurityMode = coerceMessageSecurityMode;
/**
 * @module node-opcua-service-secure-channel
 */
const node_opcua_types_1 = require("node-opcua-types");
function coerceMessageSecurityMode(value) {
    if (value === undefined) {
        return node_opcua_types_1.MessageSecurityMode.None;
    }
    if (typeof value === "string") {
        const e = node_opcua_types_1._enumerationMessageSecurityMode.get(value);
        if (!e) {
            return node_opcua_types_1.MessageSecurityMode.Invalid;
        }
        return e.value;
    }
    return value;
}
//# sourceMappingURL=message_security_mode.js.map