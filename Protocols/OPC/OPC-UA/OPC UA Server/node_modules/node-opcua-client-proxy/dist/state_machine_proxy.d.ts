import { ProxyState } from "./proxy_state";
import { ProxyNode, ProxyTransition } from "./proxy_transition";
export declare class ProxyStateMachineType {
    initialState: ProxyState | undefined;
    states: ProxyState[];
    transitions: ProxyTransition[];
    constructor(obj: ProxyNode);
}
