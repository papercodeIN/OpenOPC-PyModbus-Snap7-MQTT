import { Guid } from "node-opcua-guid";
/**
 * `NodeIdType` an enumeration that specifies the possible types of a `NodeId` value.
 */
export declare enum NodeIdType {
    NUMERIC = 1,
    STRING = 2,
    GUID = 3,
    BYTESTRING = 4
}
/**
 * `NodeId` specialization for numeric nodeIds.
 */
export interface INodeIdNumeric extends NodeId {
    identifierType: NodeIdType.NUMERIC;
    value: number;
}
/**
 * `NodeId` specialization for GUID  nodeIds.
 */
export interface INodeIdGuid extends NodeId {
    identifierType: NodeIdType.GUID;
    value: string;
}
/**
 * `NodeId` specialization for ByteString  nodeIds (opaque).
 */
export interface INodeIdByteString extends NodeId {
    identifierType: NodeIdType.BYTESTRING;
    value: Buffer;
}
/**
 * `NodeId` specialization for String  nodeId.
 */
export interface INodeIdString extends NodeId {
    identifierType: NodeIdType.STRING;
    value: string;
}
/**
 * `NodeId` specialization for all possible types of NodeIds.
 */
export type INodeId = INodeIdNumeric | INodeIdGuid | INodeIdString | INodeIdByteString;
/**
 *
 * This class holds a OPC-UA node identifier.
 *
 * Nodes are unambiguously identified using a constructed
 * identifier called the NodeId. Some Servers may accept
 * alternative NodeIds in addition to the canonical NodeId
 * represented in this Attribute.
 *
 * A Server shall persist the NodeId of a Node, that is,
 * it shall not generate new
 * NodeIds when rebooting.
 *
 */
export declare class NodeId {
    static NodeIdType: typeof NodeIdType;
    static nullNodeId: NodeId;
    static resolveNodeId: (a: string | NodeId) => NodeId;
    /**
     */
    static sameNodeId: (n1: NodeId, n2: NodeId) => boolean;
    identifierType: NodeIdType;
    value: number | string | Buffer | Guid;
    namespace: number;
    /**
     * construct a node Id from a type, a value and a namespace index.
     *
     * @param identifierType   - the nodeID type
     * @param value            - the node id value. The type of Value depends on identifierType.
     * @param namespace        - the index of the related namespace (optional , default value = 0 )
     *
     * @example
     *
     * ```javascript
     * const nodeId = new NodeId(NodeIdType.NUMERIC,123,1);
     * ```
     */
    constructor(identifierType?: NodeIdType | null, value?: number | string | Buffer | Guid, namespace?: number);
    /**
     * get the string representation of the nodeID.
     *
     * @example
     *
     * by default, toString will return the "ns=" representation
     *
     * ```javascript
     * const nodeid = new NodeId(NodeIdType.NUMERIC, 123,1);
     * console.log(nodeid.toString());
     * ```
     *
     *  ```
     *  >"ns=1;i=123"
     *  ```
     * @example
     *
     *  toString can also be used to make the nsu= version of the nodeid.
     *
     *  ```javascript
     *  const namespaceArray = ["http://opcfoundation.com/UA/","http://mynamespace2"];
     *  const nodeid = new NodeId(NodeIdType.STRING, "Hello",1);
     *  console.log(nodeid.toString({namespaceArray}));
     *  ```
     *  ```
     *  >"nsu=http://mynamespace;i=123"
     *  ```
     * @example
     *
     *  passing an addressSpace to the toString options will decorate the nodeId
     *  with the BrowseName of the node.
     *
     *  ```javascript
     * const addressSpace = getAddressSpace();
     * const nodeid = new NodeId(NodeIdType.NUMERIC, 123,1);
     * console.log(nodeid.toString({addressSpace}));
     * ```
     * ```
     * >"nsu=http://mynamespace;i=123 (MyBrowseName)"
     * ```
     *
     *
     * @param [options.addressSpace] {AddressSpace}
     * @return {String}
     */
    toString(options?: {
        addressSpace?: any;
        namespaceArray?: string[];
    }): string;
    /**
     * convert nodeId to a JSON string. same as {@link NodeId.toString }
     */
    toJSON(options?: {
        namespaceArray?: string[];
    }): string;
    displayText(): string;
    /**
     * returns true if the NodeId is null or empty
     */
    isEmpty(): boolean;
}
/**
 * anything that could be turned into a nodeId
 */
export type NodeIdLike = string | NodeId | number;
/**
 *
 */
export interface ResolveNodeIdOptions {
    namespaceArray?: string[];
    defaultNamespaceIndex?: number;
}
/**
 * Convert a value into a nodeId:
 *
 * @description:
 *    - if nodeId is a string of form : "i=1234"  => nodeId({value=1234, identifierType: NodeIdType.NUMERIC})
 *    - if nodeId is a string of form : "s=foo"   => nodeId({value="foo", identifierType: NodeIdType.STRING})
 *    - if nodeId is a string of form : "b=ABCD=" => nodeId({value=decodeBase64("ABCD="), identifierType: NodeIdType.BYTESTRING})
 *    - if nodeId is a {@link NodeId} :  coerceNodeId returns value
 *
 */
export declare function coerceNodeId(value: unknown, namespaceOptions?: number | ResolveNodeIdOptions): NodeId;
/**
 * construct a node Id from a value and a namespace.
 *
 * @param {String|Buffer} value
 * @param [namespace]=0 {Number} optional (default=0), the node id namespace
 * @return {NodeId}
 */
export declare function makeNodeId(value: string | Buffer | number, namespace?: number): NodeId;
/**
 * resolveNodeId can be helpful to convert a wellknown Node Name to a nodeid
 * if a wellknown node name cannot be detected, the function falls back to
 * calling coerceNodeId {@link coerceNodeId}.
 *
 * @example
 * ```javascript
 * const nodeId = resolveNodeId("ObjectsFolder");
 * console.log(nodeId.toString());
 * ```
 * ```text
 * >ns=0;i=85
 * ```
 *
 * ```javascript
 * const nodeId = resolveNodeId("HasComponent");
 * console.log(nodeId.toString());
 * ```
 * ```text
 * >ns=0;i=33
 * ```
 *
 * ```javascript
 * const nodeId = resolveNodeId("ns=1;i=4444");
 * console.log(nodeId.toString());
 * ```
 * ```text
 * >ns=1;i=4444
 * ```
 *
 */
export declare function resolveNodeId(nodeIdOrString: NodeIdLike, options?: ResolveNodeIdOptions): NodeId;
/**
 *
 * The sameNodeId function is used to compare two NodeId objects to
 * determine if they are identical. This comparison is based on the
 * identifier type, namespace, and value of the NodeId objects.
 *

 *
 * @return {boolean} Returns true if the two NodeId objects are
 * identical, otherwise returns false.
 *
 * @example
 * ```javascript
 * const nodeId1: NodeId = new NodeId(NodeIdType.STRING, "example", 1);
 * const nodeId2: NodeId = coerceNodeId("ns=1;s=example");
 * const areSame = sameNodeId(nodeId1, nodeId2); // returns true
 * ```
 */
export declare function sameNodeId(n1: NodeId, n2: NodeId): boolean;
