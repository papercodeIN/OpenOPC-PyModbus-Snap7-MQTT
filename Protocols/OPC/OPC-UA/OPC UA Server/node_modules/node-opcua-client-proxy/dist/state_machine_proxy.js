"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyStateMachineType = void 0;
/**
 * @module node-opcua-client-proxy
 */
const node_opcua_assert_1 = require("node-opcua-assert");
const proxy_state_1 = require("./proxy_state");
const proxy_transition_1 = require("./proxy_transition");
class ProxyStateMachineType {
    constructor(obj) {
        const localInitialState = obj.$components.filter((component) => {
            if (!component.typeDefinition) {
                return false;
            }
            return component.typeDefinition.toString() === "InitialStateType";
        });
        if (localInitialState.length) {
            (0, node_opcua_assert_1.assert)(localInitialState.length === 1);
            this.initialState = new proxy_state_1.ProxyState(localInitialState[0]);
        }
        else {
            this.initialState = undefined;
        }
        this.states = obj.$components
            .filter((component) => {
            if (!component.typeDefinition) {
                return false;
            }
            return component.typeDefinition.toString() === "StateType";
        })
            .map(proxy_state_1.makeProxyState);
        this.transitions = obj.$components
            .filter((component) => {
            if (!component.typeDefinition) {
                return false;
            }
            return component.typeDefinition.toString() === "TransitionType";
        })
            .map(proxy_transition_1.makeProxyTransition);
    }
}
exports.ProxyStateMachineType = ProxyStateMachineType;
//# sourceMappingURL=state_machine_proxy.js.map