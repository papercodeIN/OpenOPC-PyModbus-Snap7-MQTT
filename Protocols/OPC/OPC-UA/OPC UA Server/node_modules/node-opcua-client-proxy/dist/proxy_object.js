"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyObject = void 0;
/**
 * @module node-opcua-client-proxy
 */
const node_opcua_data_model_1 = require("node-opcua-data-model");
const proxy_base_node_1 = require("./proxy_base_node");
class ProxyObject extends proxy_base_node_1.ProxyBaseNode {
    constructor(proxyManager, nodeId) {
        super(proxyManager, nodeId, node_opcua_data_model_1.NodeClass.Object);
    }
}
exports.ProxyObject = ProxyObject;
//# sourceMappingURL=proxy_object.js.map