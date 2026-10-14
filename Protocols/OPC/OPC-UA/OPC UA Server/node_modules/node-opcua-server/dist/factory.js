"use strict";
/**
 * @module node-opcua-server
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Factory = void 0;
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_extension_object_1 = require("node-opcua-extension-object");
const node_opcua_factory_1 = require("node-opcua-factory");
class Factory {
    constructor(engine) {
        (0, node_opcua_assert_1.assert)(engine !== null && typeof engine === "object");
        this.engine = engine;
    }
    constructObject(id) {
        const obj = (0, node_opcua_factory_1.getStandardDataTypeFactory)().constructObject(id);
        if (!(obj instanceof node_opcua_extension_object_1.ExtensionObject)) {
            throw new Error("Internal Error constructObject");
        }
        return obj;
    }
}
exports.Factory = Factory;
//# sourceMappingURL=factory.js.map