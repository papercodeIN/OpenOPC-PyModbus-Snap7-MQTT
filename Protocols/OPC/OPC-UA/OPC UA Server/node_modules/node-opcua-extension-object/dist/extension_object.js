"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpaqueStructure = exports.ExtensionObject = void 0;
exports.encodeExtensionObject = encodeExtensionObject;
exports.decodeExtensionObject = decodeExtensionObject;
/**
 * @module node-opcua-extension-object
 */
const node_opcua_basic_types_1 = require("node-opcua-basic-types");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_factory_1 = require("node-opcua-factory");
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
const debugLog = (0, node_opcua_debug_1.make_debugLog)(__filename);
const warningLog = (0, node_opcua_debug_1.make_warningLog)(__filename);
const chalk_1 = __importDefault(require("chalk"));
/* tslint:disable:no-empty */
class ExtensionObject extends node_opcua_factory_1.BaseUAObject {
    constructor(options) {
        super();
    }
}
exports.ExtensionObject = ExtensionObject;
ExtensionObject.schema = new node_opcua_factory_1.StructuredTypeSchema({
    baseType: "",
    documentation: "",
    fields: [],
    name: "ExtensionObject",
    dataTypeFactory: (0, node_opcua_factory_1.getStandardDataTypeFactory)()
});
ExtensionObject.prototype.schema = ExtensionObject.schema;
// OPC-UA Part 6 - $5.2.2.15 ExtensionObject
// An ExtensionObject is encoded as sequence of bytes prefixed by the  NodeId of its
// DataTypeEncoding and the number of bytes encoded.
// what the specs say: OCC/UA part 6 $5.2.2.15  ExtensionObject
//
// TypeId |   NodeId  |  The identifier for the DataTypeEncoding node in the Server's AddressSpace.
//                    |  ExtensionObjects defined by the OPC UA specification have a numeric node
//                    |  identifier assigned to them with a NamespaceIndex of 0. The numeric
//                    |  identifiers are defined in A.1.
//
// Encoding | Byte    |  An enumeration that indicates how the body is encoded.
//                    |  The parameter may have the following values:
//                    |      0x00  No body is encoded.
//                    |      0x01  The body is encoded as a ByteString.
//                    |      0x02  The body is encoded as a XmlElement.
//
// Length   | Int32   |  The length of the object body.
//                    |  The length shall be specified if the body is encoded.     <<<<<<<( WTF ?)
//
// Body     | Byte[*] |  The object body
//                    |  This field contains the raw bytes for ByteString bodies.
//                    |  For XmlElement bodies this field contains the XML encoded as a UTF-8
//                    |  string without any null terminator.
//
function encodeExtensionObject(object, stream) {
    if (!object) {
        (0, node_opcua_basic_types_1.encodeNodeId)((0, node_opcua_nodeid_1.makeNodeId)(0), stream);
        stream.writeUInt8(0x00); // no body is encoded
        // note : Length shall not hbe specified, end of the job!
    }
    else {
        if (object instanceof OpaqueStructure) {
            // Writing raw Opaque buffer as Opaque Structure ...
            (0, node_opcua_basic_types_1.encodeNodeId)(object.nodeId, stream);
            stream.writeUInt8(0x01); // 0x01 The body is encoded as a ByteString.
            stream.writeByteStream(object.buffer);
            return;
        }
        /* istanbul ignore next */
        if (!(object instanceof node_opcua_factory_1.BaseUAObject)) {
            throw new Error("Expecting a extension object");
        }
        // ensure we have a valid encoding Default Binary ID !!!
        /* istanbul ignore next */
        if (!object.schema) {
            debugLog(" object = ", object);
            throw new Error("object has no schema " + object.constructor.name);
        }
        const encodingDefaultBinary = object.schema.encodingDefaultBinary;
        /* istanbul ignore next */
        if (!encodingDefaultBinary) {
            debugLog(chalk_1.default.yellow("encoding ExtObj "), object);
            throw new Error("Cannot find encodingDefaultBinary for this object : " + object.schema.name);
        }
        /* istanbul ignore next */
        if (encodingDefaultBinary.isEmpty()) {
            debugLog(chalk_1.default.yellow("encoding ExtObj "), object.constructor.encodingDefaultBinary.toString());
            throw new Error("Cannot find encodingDefaultBinary for this object : " + object.schema.name);
        }
        /* istanbul ignore next */
        if ((0, node_opcua_factory_1.is_internal_id)(encodingDefaultBinary.value)) {
            debugLog(chalk_1.default.yellow("encoding ExtObj "), object.constructor.encodingDefaultBinary.toString(), object.schema.name);
            throw new Error("Cannot find valid OPCUA encodingDefaultBinary for this object : " + object.schema.name);
        }
        (0, node_opcua_basic_types_1.encodeNodeId)(encodingDefaultBinary, stream);
        stream.writeUInt8(0x01); // 0x01 The body is encoded as a ByteString.
        stream.writeUInt32(object.binaryStoreSize());
        object.encode(stream);
    }
}
// tslint:disable:max-classes-per-file
class OpaqueStructure extends ExtensionObject {
    constructor(nodeId, buffer) {
        super();
        this.nodeId = nodeId;
        this.buffer = buffer;
    }
    toString() {
        const str = "/* OpaqueStructure */ { \n" +
            "nodeId " +
            this.nodeId.toString() +
            "\n" +
            "buffer = \n" +
            (0, node_opcua_debug_1.hexDump)(this.buffer) +
            "\n" +
            "}";
        return str;
    }
}
exports.OpaqueStructure = OpaqueStructure;
function decodeExtensionObject(stream, _value) {
    const nodeId = (0, node_opcua_basic_types_1.decodeNodeId)(stream);
    const encodingType = stream.readUInt8();
    if (encodingType === 0) {
        return null;
    }
    const length = stream.readUInt32();
    /* istanbul ignore next */
    if (nodeId.value === 0 || encodingType === 0) {
        return {};
    }
    // let verify that  decode will use the expected number of bytes
    const streamLengthBefore = stream.length;
    let object;
    if (nodeId.namespace !== 0) {
        // this is a extension object define in a other namespace
        // we can only threat it as an opaque object for the time being
        // the caller that may now more about the namespace Array and type
        // definition will be able to turn the opaque object into a meaningful
        // structure
        // lets rewind before the length
        stream.length -= 4;
        object = new OpaqueStructure(nodeId, stream.readByteStream());
    }
    else {
        try {
            object = (0, node_opcua_factory_1.getStandardDataTypeFactory)().constructObject(nodeId);
        }
        catch (err) {
            warningLog("cannot construct object with dataType nodeId", nodeId.toString());
        }
        /* istanbul ignore next */
        if (object === null) {
            // this object is unknown to us ..
            stream.length -= 4;
            object = new OpaqueStructure(nodeId, stream.readByteStream());
        }
        else {
            try {
                object.decode(stream);
            }
            catch (err) {
                debugLog("Cannot decode object ", err);
            }
        }
    }
    if (streamLengthBefore + length !== stream.length) {
        // this may happen if the server or client do have a different OPCUA version
        // for instance SubscriptionDiagnostics structure has been changed between OPCUA version 1.01 and 1.04
        // causing 2 extra member to be added.
        debugLog(chalk_1.default.bgWhiteBright.red("========================================="));
        warningLog("WARNING => decodeExtensionObject: Extension object decoding error on ", object?.constructor.name, " expected size was", length, "but only this amount of bytes have been read :", stream.length - streamLengthBefore, "\n           encoding nodeId = ", nodeId.toString(), "encodingType = ", encodingType);
        stream.length = streamLengthBefore + length;
    }
    return object;
}
(0, node_opcua_factory_1.registerBuiltInType)({
    name: "ExtensionObject",
    subType: "",
    encode: encodeExtensionObject,
    decode: decodeExtensionObject,
    defaultValue: () => null
});
//# sourceMappingURL=extension_object.js.map