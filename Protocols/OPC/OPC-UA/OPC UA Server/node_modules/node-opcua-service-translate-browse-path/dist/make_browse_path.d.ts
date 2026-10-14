/**
 * @module node-opcua-service-translate-browse-path
 */
import { NodeId, NodeIdLike } from "node-opcua-nodeid";
import { BrowsePath } from "node-opcua-types";
export declare type NodeIdLikeOrWithNodeId = NodeIdLike | {
    nodeId: NodeId;
};
export declare function makeBrowsePath(rootNode: NodeIdLikeOrWithNodeId, relativePathBNF: string): BrowsePath;
