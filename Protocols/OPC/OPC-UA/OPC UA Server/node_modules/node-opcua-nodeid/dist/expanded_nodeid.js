"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpandedNodeId = void 0;
exports.coerceExpandedNodeId = coerceExpandedNodeId;
exports.makeExpandedNodeId = makeExpandedNodeId;
const nodeid_1 = require("./nodeid");
/**
 * An ExpandedNodeId extends the NodeId structure.
 *
 * An ExpandedNodeId extends the NodeId structure by allowing the NamespaceUri to be
 * explicitly specified instead of using the NamespaceIndex. The NamespaceUri is optional. If it
 * is specified then the NamespaceIndex inside the NodeId shall be ignored.
 *
 * The ExpandedNodeId is encoded by first encoding a NodeId as described in Clause 5 .2.2.9
 * and then encoding NamespaceUri as a String.
 *
 * An instance of an ExpandedNodeId may still use the NamespaceIndex instead of the
 * NamespaceUri. In this case, the NamespaceUri is not encoded in the stream. The presence of
 * the NamespaceUri in the stream is indicated by setting the NamespaceUri flag in the encoding
 * format byte for the NodeId.
 *
 * If the NamespaceUri is present then the encoder shall encode the NamespaceIndex as 0 in
 * the stream when the NodeId portion is encoded. The unused NamespaceIndex is included in
 * the stream for consistency,
 *
 * An ExpandedNodeId may also have a ServerIndex which is encoded as a UInt32 after the
 * NamespaceUri. The ServerIndex flag in the NodeId encoding byte indicates whether the
 * ServerIndex is present in the stream. The ServerIndex is omitted if it is equal to zero.
 *
 *
 *
 */
class ExpandedNodeId extends nodeid_1.NodeId {
    static fromNodeId(nodeId, namespaceUri, serverIndex) {
        return new ExpandedNodeId(nodeId.identifierType, nodeId.value, nodeId.namespace, namespaceUri, serverIndex);
    }
    constructor(identifierType, value, namespace, namespaceUri, serverIndex) {
        super(identifierType, value, namespace);
        this.namespaceUri = namespaceUri || null;
        this.serverIndex = serverIndex || 0;
    }
    toString() {
        let str = nodeid_1.NodeId.prototype.toString.call(this);
        if (this.namespaceUri) {
            str += ";namespaceUri:" + this.namespaceUri;
        }
        if (this.serverIndex) {
            str += ";serverIndex:" + this.serverIndex;
        }
        return str;
    }
    /**
     * convert nodeId to a JSON string. same as {@link toString }
     */
    toJSON() {
        return this.toString();
    }
}
exports.ExpandedNodeId = ExpandedNodeId;
ExpandedNodeId.nullExpandedNodeId = new ExpandedNodeId(nodeid_1.NodeIdType.NUMERIC, 0, 0);
function coerceExpandedNodeId(value) {
    const n = (0, nodeid_1.coerceNodeId)(value);
    return new ExpandedNodeId(n.identifierType, n.value, n.namespace, /*namespaceUri*/ null, /*serverIndex*/ 0);
}
/**
 * create an expanded nodeId
 */
function makeExpandedNodeId(value, namespace) {
    if (value === undefined && namespace === undefined) {
        return new ExpandedNodeId(nodeid_1.NodeIdType.NUMERIC, 0, 0, null, 0);
    }
    const serverIndex = 0;
    let n;
    const namespaceUri = null;
    if (value instanceof ExpandedNodeId) {
        // construct from a ExpandedNodeId => copy
        n = value;
        return new ExpandedNodeId(n.identifierType, n.value, n.namespace, n.namespaceUri, n.serverIndex);
    }
    if (value instanceof nodeid_1.NodeId) {
        // construct from a nodeId
        n = value;
        return new ExpandedNodeId(n.identifierType, n.value, n.namespace, namespaceUri, serverIndex);
    }
    const valueInt = parseInt(value, 10);
    if (!isFinite(valueInt)) {
        throw new Error(" cannot makeExpandedNodeId out of " + value);
    }
    namespace = namespace || 0;
    return new ExpandedNodeId(nodeid_1.NodeIdType.NUMERIC, valueInt, namespace, namespaceUri, serverIndex);
}
//# sourceMappingURL=expanded_nodeid.js.map