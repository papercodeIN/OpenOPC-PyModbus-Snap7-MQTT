"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeId = exports.NodeIdType = void 0;
exports.coerceNodeId = coerceNodeId;
exports.makeNodeId = makeNodeId;
exports.resolveNodeId = resolveNodeId;
exports.sameNodeId = sameNodeId;
/* eslint-disable complexity */
/**
 * @module node-opcua-nodeid
 */
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_constants_1 = require("node-opcua-constants");
const node_opcua_guid_1 = require("node-opcua-guid");
/**
 * `NodeIdType` an enumeration that specifies the possible types of a `NodeId` value.
 */
var NodeIdType;
(function (NodeIdType) {
    NodeIdType[NodeIdType["NUMERIC"] = 1] = "NUMERIC";
    NodeIdType[NodeIdType["STRING"] = 2] = "STRING";
    NodeIdType[NodeIdType["GUID"] = 3] = "GUID";
    NodeIdType[NodeIdType["BYTESTRING"] = 4] = "BYTESTRING";
})(NodeIdType || (exports.NodeIdType = NodeIdType = {}));
// function defaultValue(identifierType: NodeIdType.BYTESTRING): null;
// function defaultValue(identifierType: NodeIdType.STRING): "";
// function defaultValue(identifierType: NodeIdType.NUMERIC): 0;
// function defaultValue(identifierType: NodeIdType.GUID): string;
function defaultValue(identifierType) {
    switch (identifierType) {
        case NodeIdType.GUID: return node_opcua_guid_1.emptyGuid;
        case NodeIdType.BYTESTRING: return null; // Buffer.alloc(0);
        case NodeIdType.STRING: return "";
        case NodeIdType.NUMERIC: return 0;
        default:
            throw new Error("invalid identifierType");
    }
}
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
class NodeId {
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
    constructor(identifierType, value, namespace) {
        if (identifierType === null || identifierType === undefined) {
            this.identifierType = NodeIdType.NUMERIC;
            this.value = 0;
            this.namespace = 0;
            return;
        }
        this.identifierType = identifierType;
        this.value = value || defaultValue(identifierType);
        this.namespace = namespace || 0;
        // namespace shall be a UInt16
        (0, node_opcua_assert_1.assert)(this.namespace >= 0 && this.namespace <= 0xffff, "NodeId: invalid namespace value");
        (0, node_opcua_assert_1.assert)(this.identifierType !== NodeIdType.NUMERIC ||
            (this.value !== null && this.value >= 0 && this.value <= 0xffffffff));
        (0, node_opcua_assert_1.assert)(this.identifierType !== NodeIdType.GUID || (0, node_opcua_guid_1.isValidGuid)(this.value), "NodeId: Guid is invalid");
        (0, node_opcua_assert_1.assert)(this.identifierType !== NodeIdType.STRING || typeof this.value === "string", "cannot  empty string");
        if (this.identifierType === NodeIdType.GUID) {
            this.value = (0, node_opcua_guid_1.normalizeGuid)(value);
        }
    }
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
    toString(options) {
        const addressSpace = options ? options.addressSpace : null;
        const namespacePart = options?.namespaceArray
            ? this.namespace == 0
                ? ""
                : `nsu=${options.namespaceArray[this.namespace] || `<unknown namespace with index ${this.namespace}>`};`
            : `ns=${this.namespace};`;
        let str;
        const _this = this;
        switch (_this.identifierType) {
            case NodeIdType.NUMERIC:
                str = `${namespacePart}i=${_this.value}`;
                break;
            case NodeIdType.STRING:
                str = `${namespacePart}s=${_this.value}`;
                break;
            case NodeIdType.GUID:
                str = `${namespacePart}g=${(0, node_opcua_guid_1.normalizeGuid)(_this.value)}`;
                break;
            default:
                (0, node_opcua_assert_1.assert)(this.identifierType === NodeIdType.BYTESTRING, "invalid identifierType in NodeId : " + this.identifierType);
                if (this.value) {
                    str = `${namespacePart}b=${this.value.toString("base64")}`;
                }
                else {
                    str = `${namespacePart}b=<null>`;
                }
                break;
        }
        if (addressSpace) {
            if (this.namespace === 0 && _this.identifierType === NodeIdType.NUMERIC) {
                // find standard browse name
                const name = reverse_map((this.value || 0).toString()) || "<undefined>";
                str += " " + name;
            }
            else if (addressSpace.findNode) {
                // let use the provided address space to figure out the browseNode of this node.
                // to make the message a little bit more useful.
                const n = addressSpace.findNode(this);
                str += " " + (n ? n.browseName.toString() : " (????)");
            }
        }
        return str;
    }
    /**
     * convert nodeId to a JSON string. same as {@link NodeId.toString }
     */
    toJSON(options) {
        return this.toString(options);
    }
    displayText() {
        if (this.namespace === 0 && this.identifierType === NodeIdType.NUMERIC) {
            const name = reverse_map(this.value.toString());
            if (name) {
                return name + " (" + this.toString() + ")";
            }
        }
        return this.toString();
    }
    /**
     * returns true if the NodeId is null or empty
     */
    isEmpty() {
        const _this = this;
        switch (_this.identifierType) {
            case NodeIdType.NUMERIC:
                return _this.value === 0;
            case NodeIdType.STRING:
                return !_this.value;
            case NodeIdType.GUID:
                return !_this.value || _this.value === node_opcua_guid_1.emptyGuid;
            default:
                return !_this.value || _this.value.length === 0;
        }
    }
}
exports.NodeId = NodeId;
NodeId.NodeIdType = NodeIdType;
/**
 * a fixed instance of a null NodeId
 */
NodeId.nullNodeId = new Proxy(new NodeId(NodeIdType.NUMERIC, 0, 0), {
    get: (target, prop) => {
        return target[prop];
    },
    set: () => {
        throw new Error("Cannot assign a value to constant NodeId.nullNodeId");
    }
});
/**
 * @private
 */
const regexNamespaceI = /ns=([0-9]+);i=([0-9]+)/;
const regexNamespaceS = /ns=([0-9]+);s=(.*)/;
const regexNamespaceB = /ns=([0-9]+);b=(.*)/;
const regexNamespaceG = /ns=([0-9]+);g=([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12})/;
const regexNSU = /nsu=(.*);(.*)/;
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
function coerceNodeId(value, namespaceOptions) {
    let matches;
    let twoFirst;
    if (value instanceof NodeId) {
        return value;
    }
    value = value || 0;
    let namespace = (typeof namespaceOptions === "number" ? namespaceOptions : namespaceOptions?.defaultNamespaceIndex) || 0;
    const namespaceArray = namespaceOptions?.namespaceArray || undefined;
    let identifierType = NodeIdType.NUMERIC;
    if (typeof value === "string") {
        identifierType = NodeIdType.STRING;
        twoFirst = value.substring(0, 2);
        if (twoFirst === "i=") {
            identifierType = NodeIdType.NUMERIC;
            value = parseInt(value.substring(2), 10);
        }
        else if (twoFirst === "s=") {
            identifierType = NodeIdType.STRING;
            value = value.substring(2);
        }
        else if (twoFirst === "b=") {
            identifierType = NodeIdType.BYTESTRING;
            value = Buffer.from(value.substring(2), "base64");
        }
        else if (twoFirst === "g=") {
            identifierType = NodeIdType.GUID;
            value = (0, node_opcua_guid_1.normalizeGuid)(value.substring(2));
            (0, node_opcua_assert_1.assert)((0, node_opcua_guid_1.isValidGuid)(value));
        }
        else if ((0, node_opcua_guid_1.isValidGuid)(value)) {
            identifierType = NodeIdType.GUID;
            value = (0, node_opcua_guid_1.normalizeGuid)(value);
        }
        else if ((matches = regexNamespaceI.exec(value)) !== null) {
            identifierType = NodeIdType.NUMERIC;
            namespace = parseInt(matches[1], 10);
            value = parseInt(matches[2], 10);
        }
        else if ((matches = regexNamespaceS.exec(value)) !== null) {
            identifierType = NodeIdType.STRING;
            namespace = parseInt(matches[1], 10);
            value = matches[2];
        }
        else if ((matches = regexNamespaceB.exec(value)) !== null) {
            identifierType = NodeIdType.BYTESTRING;
            namespace = parseInt(matches[1], 10);
            value = Buffer.from(matches[2], "base64");
        }
        else if ((matches = regexNamespaceG.exec(value)) !== null) {
            identifierType = NodeIdType.GUID;
            namespace = parseInt(matches[1], 10);
            value = (0, node_opcua_guid_1.normalizeGuid)(matches[2]);
        }
        else {
            // eslint-disable-next-line no-empty
            if (namespaceArray && (matches = regexNSU.exec(value)) !== null) {
                const namespaceIndex = namespaceArray.indexOf(matches[1]);
                if (namespaceIndex === -1) {
                    throw new Error("Cannot find namespace with index " + matches[1] + " in " + namespaceArray.join(","));
                }
                const nid = coerceNodeId(matches[2], namespace);
                nid.namespace = namespaceIndex;
                return nid;
            }
            else {
                throw new Error("String cannot be coerced to a nodeId : " + value);
            }
        }
    }
    else if (value instanceof Buffer) {
        identifierType = NodeIdType.BYTESTRING;
    }
    else if (value instanceof Object) {
        // it could be a Enum or a NodeId Like object
        const tmp = value;
        value = tmp.value;
        namespace = namespace || tmp.namespace;
        identifierType = tmp.identifierType || identifierType;
        return new NodeId(identifierType, value, namespace);
    }
    return new NodeId(identifierType, value, namespace);
}
const regEx1 = /^(s|g|b|i|ns)=/;
/**
 * construct a node Id from a value and a namespace.
 *
 * @param {String|Buffer} value
 * @param [namespace]=0 {Number} optional (default=0), the node id namespace
 * @return {NodeId}
 */
function makeNodeId(value, namespace) {
    value = value || 0;
    namespace = namespace || 0;
    let identifierType = NodeIdType.NUMERIC;
    if (typeof value === "string") {
        if (value.match(regEx1)) {
            throw new Error("please use coerce NodeId instead");
        }
        //            1         2         3
        //  012345678901234567890123456789012345
        // "72962B91-FA75-4AE6-8D28-B404DC7DAF63"
        if ((0, node_opcua_guid_1.isValidGuid)(value)) {
            identifierType = NodeIdType.GUID;
            value = (0, node_opcua_guid_1.normalizeGuid)(value);
        }
        else {
            identifierType = NodeIdType.STRING;
        }
    }
    else if (value instanceof Buffer) {
        identifierType = NodeIdType.BYTESTRING;
    }
    const nodeId = new NodeId(identifierType, value, namespace);
    return nodeId;
}
// reverse maps
let _nodeIdToNameIndex = {};
let _nameToNodeIdIndex = {};
const regName = /[a-zA-Z_].*/;
(function build_standard_nodeid_indexes() {
    function expand_map(directIndex) {
        for (const name in directIndex) {
            if (Object.prototype.hasOwnProperty.call(directIndex, name) && regName.exec(name) !== null) {
                const value = directIndex[name];
                _nodeIdToNameIndex[value] = name;
                _nameToNodeIdIndex[name] = new NodeId(NodeIdType.NUMERIC, value, 0);
            }
        }
    }
    _nodeIdToNameIndex = {};
    _nameToNodeIdIndex = {};
    expand_map(node_opcua_constants_1.ObjectIds);
    expand_map(node_opcua_constants_1.ObjectTypeIds);
    expand_map(node_opcua_constants_1.VariableIds);
    expand_map(node_opcua_constants_1.VariableTypeIds);
    expand_map(node_opcua_constants_1.MethodIds);
    expand_map(node_opcua_constants_1.ReferenceTypeIds);
    expand_map(node_opcua_constants_1.DataTypeIds);
})();
function reverse_map(nodeId) {
    return _nodeIdToNameIndex[nodeId];
}
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
function resolveNodeId(nodeIdOrString, options) {
    let nodeId;
    const rawId = typeof nodeIdOrString === "string" ? _nameToNodeIdIndex[nodeIdOrString] : undefined;
    if (rawId !== undefined) {
        return rawId;
    }
    else {
        nodeId = coerceNodeId(nodeIdOrString, options);
    }
    return nodeId;
}
NodeId.resolveNodeId = resolveNodeId;
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
function sameNodeId(n1, n2) {
    if (n1.identifierType !== n2.identifierType) {
        return false;
    }
    if (n1.namespace !== n2.namespace) {
        return false;
    }
    switch (n1.identifierType) {
        case NodeIdType.NUMERIC:
        case NodeIdType.STRING:
        case NodeIdType.GUID:
            return n1.value === n2.value;
        case NodeIdType.BYTESTRING:
            return n1.value.toString("hex") === n2.value.toString("hex");
        default:
            throw new Error("Invalid identifier type");
    }
}
NodeId.sameNodeId = sameNodeId;
//# sourceMappingURL=nodeid.js.map