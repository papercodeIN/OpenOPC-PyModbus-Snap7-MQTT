import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
import { ExpandedNodeId, NodeId } from "node-opcua-nodeid";
export declare function isValidNodeId(nodeId: NodeId): boolean;
export declare function randomNodeId(): NodeId;
export declare function encodeNodeId(nodeId: NodeId, stream: OutputBinaryStream): void;
export declare function encodeExpandedNodeId(expandedNodeId: ExpandedNodeId, stream: OutputBinaryStream): void;
export declare function decodeNodeId(stream: BinaryStream, _nodeId?: NodeId): NodeId;
export declare function decodeExpandedNodeId(stream: BinaryStream, _nodeId?: ExpandedNodeId): ExpandedNodeId;
export { coerceNodeId, coerceExpandedNodeId } from "node-opcua-nodeid";
