"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPCUAClientBase = void 0;
const node_opcua_object_registry_1 = require("node-opcua-object-registry");
class OPCUAClientBase {
    static create(options) {
        /* istanbul ignore next*/
        options;
        throw new Error("Not Implemented");
    }
}
exports.OPCUAClientBase = OPCUAClientBase;
OPCUAClientBase.registry = new node_opcua_object_registry_1.ObjectRegistry();
OPCUAClientBase.retryDelay = 1000 * 5;
//# sourceMappingURL=client_base.js.map