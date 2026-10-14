"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateMachineProxy = void 0;
/**
 * @module node-opcua-client-proxy
 */
const events_1 = require("events");
const node_opcua_assert_1 = require("node-opcua-assert");
class StateMachineProxy extends events_1.EventEmitter {
    constructor(proxyManager, nodeId) {
        super();
        this.nodeId = nodeId;
        this.proxyManager = proxyManager;
        (0, node_opcua_assert_1.assert)(this.proxyManager.session, "expecting valid session");
        Object.defineProperty(this, "proxyManager", {
            enumerable: false,
            writable: true
        });
    }
}
exports.StateMachineProxy = StateMachineProxy;
//# sourceMappingURL=proxy_state_machine.js.map