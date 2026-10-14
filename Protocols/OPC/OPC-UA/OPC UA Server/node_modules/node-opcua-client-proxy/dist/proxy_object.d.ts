import { NodeId } from "node-opcua-nodeid";
import { ProxyBaseNode } from "./proxy_base_node";
import { UAProxyManager } from "./proxy_manager";
export declare class ProxyObject extends ProxyBaseNode {
    constructor(proxyManager: UAProxyManager, nodeId: NodeId);
}
