import { NodeId, NodeIdLike } from "node-opcua-nodeid";
import { BrowsePath, NodeClass } from "node-opcua-types";
import { Variant } from "node-opcua-variant";
export interface FilterContext {
    readonly eventSource: NodeId;
    isSubtypeOf(nodeId: NodeId, baseType: NodeId): boolean;
    getTypeDefinition(nodeId: NodeId): NodeId | null;
    readNodeValue(nodeId: NodeIdLike): Variant;
    getNodeClass(nodeId: NodeId): NodeClass;
    browsePath(browsePath: BrowsePath): NodeId | null;
}
