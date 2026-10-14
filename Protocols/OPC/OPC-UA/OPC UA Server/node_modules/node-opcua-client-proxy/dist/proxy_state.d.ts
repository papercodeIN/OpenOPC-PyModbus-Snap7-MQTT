/**
 * @module node-opcua-client-proxy
 */
import { NodeId } from "node-opcua-nodeid";
import { ProxyNode } from "./proxy_transition";
export declare class ProxyState {
    private _node;
    constructor(proxyNode: ProxyNode);
    get browseName(): string;
    get stateNumber(): string;
    get nodeId(): NodeId;
    toString(): string;
}
export declare function makeProxyState(node: ProxyNode): ProxyState;
