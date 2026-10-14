"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coerceExpandedNodeId = exports.coerceNodeId = void 0;
exports.isValidNodeId = isValidNodeId;
exports.randomNodeId = randomNodeId;
exports.encodeNodeId = encodeNodeId;
exports.encodeExpandedNodeId = encodeExpandedNodeId;
exports.decodeNodeId = decodeNodeId;
exports.decodeExpandedNodeId = decodeExpandedNodeId;
/***
 * @module node-opcua-basic-types
 */
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
const byte_string_1 = require("./byte_string");
const guid_1 = require("./guid");
const integers_1 = require("./integers");
const string_1 = require("./string");
const utils_1 = require("./utils");
function isUInt8(value) {
    return value >= 0 && value <= 0xff;
}
function isUInt16(value) {
    return value >= 0 && value <= 0xffff;
}
function nodeID_encodingByte(nodeId) {
    let encodingByte = 0;
    if (nodeId.identifierType === node_opcua_nodeid_1.NodeIdType.NUMERIC) {
        if (isUInt8(nodeId.value) &&
            !nodeId.namespace &&
            !nodeId.namespaceUri &&
            !nodeId.serverIndex) {
            encodingByte = encodingByte | 0 /* EnumNodeIdEncoding.TwoBytes */;
        }
        else if (isUInt16(nodeId.value) &&
            isUInt8(nodeId.namespace) &&
            !nodeId.namespaceUri &&
            !nodeId.serverIndex) {
            encodingByte = encodingByte | 1 /* EnumNodeIdEncoding.FourBytes */;
        }
        else {
            encodingByte = encodingByte | 2 /* EnumNodeIdEncoding.Numeric */;
        }
    }
    else if (nodeId.identifierType === node_opcua_nodeid_1.NodeIdType.STRING) {
        encodingByte = encodingByte | 3 /* EnumNodeIdEncoding.String */;
    }
    else if (nodeId.identifierType === node_opcua_nodeid_1.NodeIdType.BYTESTRING) {
        encodingByte = encodingByte | 5 /* EnumNodeIdEncoding.ByteString */;
    }
    else if (nodeId.identifierType === node_opcua_nodeid_1.NodeIdType.GUID) {
        encodingByte = encodingByte | 4 /* EnumNodeIdEncoding.Guid */;
    }
    if (Object.prototype.hasOwnProperty.call(nodeId, "namespaceUri") && nodeId.namespaceUri) {
        encodingByte = encodingByte | 128 /* EnumNodeIdEncoding.NamespaceUriFlag */;
    }
    if (Object.prototype.hasOwnProperty.call(nodeId, "serverIndex") && nodeId.serverIndex) {
        encodingByte = encodingByte | 64 /* EnumNodeIdEncoding.ServerIndexFlag */;
    }
    return encodingByte;
}
function isValidNodeId(nodeId) {
    return nodeId instanceof node_opcua_nodeid_1.NodeId;
}
function randomNodeId() {
    const value = (0, utils_1.getRandomInt)(0, 0xfffff);
    const namespace = (0, utils_1.getRandomInt)(0, 3);
    return (0, node_opcua_nodeid_1.makeNodeId)(value, namespace);
}
function _encodeNodeId(encodingByte, nodeId, stream) {
    stream.writeUInt8(encodingByte); // encoding byte
    /*jslint bitwise: true */
    encodingByte &= 0x3f;
    switch (encodingByte) {
        case 0 /* EnumNodeIdEncoding.TwoBytes */:
            stream.writeUInt8(nodeId ? nodeId.value : 0);
            break;
        case 1 /* EnumNodeIdEncoding.FourBytes */:
            stream.writeUInt8(nodeId.namespace);
            stream.writeUInt16(nodeId.value);
            break;
        case 2 /* EnumNodeIdEncoding.Numeric */:
            stream.writeUInt16(nodeId.namespace);
            stream.writeUInt32(nodeId.value);
            break;
        case 3 /* EnumNodeIdEncoding.String */:
            stream.writeUInt16(nodeId.namespace);
            (0, string_1.encodeString)(nodeId.value, stream);
            break;
        case 5 /* EnumNodeIdEncoding.ByteString */:
            stream.writeUInt16(nodeId.namespace);
            (0, byte_string_1.encodeByteString)(nodeId.value, stream);
            break;
        default:
            (0, node_opcua_assert_1.assert)(encodingByte === 4 /* EnumNodeIdEncoding.Guid */);
            stream.writeUInt16(nodeId.namespace);
            (0, guid_1.encodeGuid)(nodeId.value, stream);
            break;
    }
}
function encodeNodeId(nodeId, stream) {
    let encodingByte = nodeID_encodingByte(nodeId);
    /*jslint bitwise: true */
    encodingByte &= 0x3f;
    _encodeNodeId(encodingByte, nodeId, stream);
}
function encodeExpandedNodeId(expandedNodeId, stream) {
    (0, node_opcua_assert_1.assert)(expandedNodeId, "encodeExpandedNodeId: must provide a valid expandedNodeId");
    const encodingByte = nodeID_encodingByte(expandedNodeId);
    _encodeNodeId(encodingByte, expandedNodeId, stream);
    if (encodingByte & 128 /* EnumNodeIdEncoding.NamespaceUriFlag */) {
        (0, string_1.encodeString)(expandedNodeId.namespaceUri, stream);
    }
    if (encodingByte & 64 /* EnumNodeIdEncoding.ServerIndexFlag */) {
        (0, integers_1.encodeUInt32)(expandedNodeId.serverIndex, stream);
    }
}
function _decodeNodeId(encodingByte, stream, _nodeId) {
    let value;
    let namespace;
    let identifierType;
    /*jslint bitwise: true */
    encodingByte &= 0x3f; // 1 to 5
    switch (encodingByte) {
        case 0 /* EnumNodeIdEncoding.TwoBytes */:
            value = stream.readUInt8();
            identifierType = node_opcua_nodeid_1.NodeIdType.NUMERIC;
            break;
        case 1 /* EnumNodeIdEncoding.FourBytes */:
            namespace = stream.readUInt8();
            value = stream.readUInt16();
            identifierType = node_opcua_nodeid_1.NodeIdType.NUMERIC;
            break;
        case 2 /* EnumNodeIdEncoding.Numeric */:
            namespace = stream.readUInt16();
            value = stream.readUInt32();
            identifierType = node_opcua_nodeid_1.NodeIdType.NUMERIC;
            break;
        case 3 /* EnumNodeIdEncoding.String */:
            namespace = stream.readUInt16();
            value = (0, string_1.decodeString)(stream) || "";
            identifierType = node_opcua_nodeid_1.NodeIdType.STRING;
            break;
        case 5 /* EnumNodeIdEncoding.ByteString */:
            namespace = stream.readUInt16();
            value = (0, byte_string_1.decodeByteString)(stream);
            identifierType = node_opcua_nodeid_1.NodeIdType.BYTESTRING;
            break;
        default:
            // istanbul ignore next
            if (encodingByte !== 4 /* EnumNodeIdEncoding.Guid */) {
                throw new Error("decodeNodeId: unknown encoding_byte = 0x" + encodingByte.toString(16));
            }
            namespace = stream.readUInt16();
            value = (0, guid_1.decodeGuid)(stream);
            identifierType = node_opcua_nodeid_1.NodeIdType.GUID;
            (0, node_opcua_assert_1.assert)((0, guid_1.isValidGuid)(value));
            break;
    }
    if (_nodeId === undefined) {
        return new node_opcua_nodeid_1.NodeId(identifierType, value, namespace);
    }
    _nodeId.value = value;
    _nodeId.identifierType = identifierType;
    _nodeId.namespace = namespace || 0;
    return _nodeId;
}
function decodeNodeId(stream, _nodeId) {
    const encodingByte = stream.readUInt8();
    return _decodeNodeId(encodingByte, stream, _nodeId);
}
function decodeExpandedNodeId(stream, _nodeId) {
    const encodingByte = stream.readUInt8();
    const expandedNodeId = _decodeNodeId(encodingByte, stream, _nodeId);
    expandedNodeId.namespaceUri = null;
    expandedNodeId.serverIndex = 0;
    if (encodingByte & 128 /* EnumNodeIdEncoding.NamespaceUriFlag */) {
        expandedNodeId.namespaceUri = (0, string_1.decodeString)(stream);
    }
    if (encodingByte & 64 /* EnumNodeIdEncoding.ServerIndexFlag */) {
        expandedNodeId.serverIndex = (0, integers_1.decodeUInt32)(stream);
    }
    const e = expandedNodeId;
    return new node_opcua_nodeid_1.ExpandedNodeId(e.identifierType, e.value, e.namespace, e.namespaceUri, e.serverIndex);
}
var node_opcua_nodeid_2 = require("node-opcua-nodeid");
Object.defineProperty(exports, "coerceNodeId", { enumerable: true, get: function () { return node_opcua_nodeid_2.coerceNodeId; } });
Object.defineProperty(exports, "coerceExpandedNodeId", { enumerable: true, get: function () { return node_opcua_nodeid_2.coerceExpandedNodeId; } });
//# sourceMappingURL=node_id.js.map