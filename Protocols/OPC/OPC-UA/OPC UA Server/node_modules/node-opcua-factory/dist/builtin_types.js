"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBuiltInType = exports.BasicTypeSchema = exports.TypeSchemaBase = void 0;
exports.registerType = registerType;
exports.unregisterType = unregisterType;
exports.getBuiltInType = getBuiltInType;
exports.hasBuiltInType = hasBuiltInType;
exports.findBuiltInType = findBuiltInType;
/**
 * @module node-opcua-factory
 */
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_basic_types_1 = require("node-opcua-basic-types");
const node_opcua_constants_1 = require("node-opcua-constants");
const node_opcua_guid_1 = require("node-opcua-guid");
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
const node_opcua_status_code_1 = require("node-opcua-status-code");
const encode_decode_1 = require("./encode_decode");
const types_1 = require("./types");
/**
 * a type Schema for a OPCUA object
 */
class TypeSchemaBase {
    constructor(options) {
        (0, node_opcua_assert_1.assert)(options.category !== null);
        this.encode = options.encode || undefined;
        this.decode = options.decode || undefined;
        this.coerce = options.coerce;
        this.category = options.category || types_1.FieldCategory.basic;
        this.name = options.name;
        for (const prop in options) {
            if (Object.prototype.hasOwnProperty.call(options, prop)) {
                this[prop] = options[prop];
            }
        }
        this.subType = options.subType || "";
        this.isAbstract = options.isAbstract || false;
    }
    /**

     * @param defaultValue {*} the default value
     * @return {*}
     */
    computer_default_value(defaultValue) {
        if (defaultValue === undefined) {
            defaultValue = this.defaultValue;
        }
        if (typeof defaultValue === "function") {
            // be careful not to cache this value , it must be call each time to make sure
            // we do not end up with the same value/instance twice.
            defaultValue = defaultValue();
        }
        return defaultValue;
    }
    getBaseType() {
        if (!this.subType)
            return null;
        return getBuiltInType(this.subType);
    }
    isSubTypeOf(type) {
        if (this.name === type.name) {
            return true;
        }
        const baseType = this.getBaseType();
        if (!baseType) {
            return false;
        }
        return baseType.isSubTypeOf(type);
    }
}
exports.TypeSchemaBase = TypeSchemaBase;
class BasicTypeSchema extends TypeSchemaBase {
    constructor(options) {
        super(options);
        this.subType = options.subType;
        this.isAbstract = options.isAbstract || false;
        this.encode = options.encode || encode_decode_1.defaultEncode;
        this.decode = options.decode || encode_decode_1.defaultDecode;
    }
}
exports.BasicTypeSchema = BasicTypeSchema;
// there are 4 types of DataTypes in opcua:
//   Built-In DataType
//   Simple DataType
//   Complex DataType
//   Enumeration
const defaultXmlElement = "";
// Built-In Type
const _defaultType = [
    // Built-in DataTypes ( see OPCUA Part III v1.02 - $5.8.2 )
    {
        name: "Null",
        decode: encode_decode_1.decodeNull,
        encode: encode_decode_1.encodeNull,
        defaultValue: null
    },
    {
        // special case
        name: "Any",
        decode: encode_decode_1.decodeAny,
        encode: encode_decode_1.encodeAny
    },
    {
        name: "Boolean",
        decode: node_opcua_basic_types_1.decodeBoolean,
        encode: node_opcua_basic_types_1.encodeBoolean,
        coerce: node_opcua_basic_types_1.coerceBoolean,
        defaultValue: false
    },
    { name: "Number", isAbstract: true },
    { name: "Integer", subType: "Number", isAbstract: true },
    { name: "UInteger", subType: "Number", isAbstract: true },
    { name: "SByte", subType: "Integer", encode: node_opcua_basic_types_1.encodeSByte, decode: node_opcua_basic_types_1.decodeSByte, defaultValue: 0, coerce: node_opcua_basic_types_1.coerceSByte },
    { name: "Byte", subType: "UInteger", encode: node_opcua_basic_types_1.encodeByte, decode: node_opcua_basic_types_1.decodeByte, defaultValue: 0, coerce: node_opcua_basic_types_1.coerceByte },
    { name: "Int16", subType: "Integer", encode: node_opcua_basic_types_1.encodeInt16, decode: node_opcua_basic_types_1.decodeInt16, defaultValue: 0, coerce: node_opcua_basic_types_1.coerceInt16 },
    { name: "UInt16", subType: "UInteger", encode: node_opcua_basic_types_1.encodeUInt16, decode: node_opcua_basic_types_1.decodeUInt16, defaultValue: 0, coerce: node_opcua_basic_types_1.coerceUInt16 },
    { name: "Int32", subType: "Integer", encode: node_opcua_basic_types_1.encodeInt32, decode: node_opcua_basic_types_1.decodeInt32, defaultValue: 0, coerce: node_opcua_basic_types_1.coerceInt32 },
    { name: "UInt32", subType: "UInteger", encode: node_opcua_basic_types_1.encodeUInt32, decode: node_opcua_basic_types_1.decodeUInt32, defaultValue: 0, coerce: node_opcua_basic_types_1.coerceUInt32 },
    {
        name: "Int64",
        subType: "Integer",
        decode: node_opcua_basic_types_1.decodeInt64,
        encode: node_opcua_basic_types_1.encodeInt64,
        coerce: node_opcua_basic_types_1.coerceInt64,
        defaultValue: (0, node_opcua_basic_types_1.coerceInt64)(0)
    },
    {
        name: "UInt64",
        subType: "UInteger",
        decode: node_opcua_basic_types_1.decodeUInt64,
        encode: node_opcua_basic_types_1.encodeUInt64,
        coerce: node_opcua_basic_types_1.coerceUInt64,
        defaultValue: (0, node_opcua_basic_types_1.coerceUInt64)(0)
    },
    {
        name: "Float",
        subType: "Number",
        decode: node_opcua_basic_types_1.decodeFloat,
        encode: node_opcua_basic_types_1.encodeFloat,
        coerce: node_opcua_basic_types_1.coerceFloat,
        defaultValue: 0.0
    },
    {
        name: "Double",
        subType: "Number",
        decode: node_opcua_basic_types_1.decodeDouble,
        encode: node_opcua_basic_types_1.encodeDouble,
        coerce: node_opcua_basic_types_1.coerceDouble,
        defaultValue: 0.0
    },
    {
        name: "String",
        decode: node_opcua_basic_types_1.decodeString,
        encode: node_opcua_basic_types_1.encodeString,
        defaultValue: ""
    },
    // OPC Unified Architecture, part 3.0 $8.26 page 67
    {
        name: "DateTime",
        decode: node_opcua_basic_types_1.decodeDateTime,
        encode: node_opcua_basic_types_1.encodeDateTime,
        coerce: node_opcua_basic_types_1.coerceDateTime,
        defaultValue: () => (0, node_opcua_basic_types_1.getMinOPCUADate)()
    },
    {
        name: "Guid",
        decode: node_opcua_basic_types_1.decodeGuid,
        encode: node_opcua_basic_types_1.encodeGuid,
        defaultValue: node_opcua_guid_1.emptyGuid
    },
    {
        name: "ByteString",
        decode: node_opcua_basic_types_1.decodeByteString,
        encode: node_opcua_basic_types_1.encodeByteString,
        coerce: node_opcua_basic_types_1.coerceByteString,
        defaultValue: null,
        toJSON: encode_decode_1.toJSONGuid
    },
    {
        name: "XmlElement",
        decode: node_opcua_basic_types_1.decodeString,
        encode: node_opcua_basic_types_1.encodeString,
        defaultValue: defaultXmlElement
    },
    // see OPCUA Part 3 - V1.02 $8.2.1
    {
        name: "NodeId",
        decode: node_opcua_basic_types_1.decodeNodeId,
        encode: node_opcua_basic_types_1.encodeNodeId,
        coerce: node_opcua_basic_types_1.coerceNodeId,
        defaultValue: node_opcua_nodeid_1.makeNodeId
    },
    {
        name: "ExpandedNodeId",
        decode: node_opcua_basic_types_1.decodeExpandedNodeId,
        encode: node_opcua_basic_types_1.encodeExpandedNodeId,
        coerce: node_opcua_basic_types_1.coerceExpandedNodeId,
        defaultValue: node_opcua_nodeid_1.makeExpandedNodeId
    },
    // ----------------------------------------------------------------------------------------
    // Simple  DataTypes
    // ( see OPCUA Part III v1.02 - $5.8.2 )
    // Simple DataTypes are subtypes of the Built-in DataTypes. They are handled on the wire like the
    // Built-in   DataType, i.e. they cannot be distinguished on the wire from their  Built-in super types.
    // Since they are handled like  Built-in   DataTypes  regarding the encoding they cannot have encodings
    // defined  in the  AddressSpace.  Clients  can read the  DataType  Attribute  of a  Variable  or  VariableType  to
    // identify the  Simple  DataType  of the  Value  Attribute. An example of a  Simple  DataType  is  Duration. It
    // is handled on the wire as a  Double   but the Client can read the  DataType  Attribute  and thus interpret
    // the value as defined by  Duration
    //
    // OPC Unified Architecture, part 4.0 $7.13
    // IntegerID: This primitive data type is an UInt32 that is used as an identifier, such as a handle. All values,
    // except for 0, are valid.
    {
        name: "IntegerId",
        decode: node_opcua_basic_types_1.decodeUInt32,
        encode: node_opcua_basic_types_1.encodeUInt32,
        defaultValue: 0xffffffff
    },
    // The StatusCode is a 32-bit unsigned integer. The top 16 bits represent the numeric value of the
    // code that shall be used for detecting specific errors or conditions. The bottom 16 bits are bit flags
    // that contain additional information but do not affect the meaning of the StatusCode.
    // 7.33 Part 4 - P 143
    {
        name: "StatusCode",
        decode: node_opcua_status_code_1.decodeStatusCode,
        encode: node_opcua_status_code_1.encodeStatusCode,
        coerce: node_opcua_status_code_1.coerceStatusCode,
        defaultValue: node_opcua_status_code_1.StatusCodes.Good
    }
];
// populate the default type map
const _defaultTypeMap = new Map();
_defaultType.forEach(registerType);
/**

 * @param schema {TypeSchemaBase}
 */
function registerType(schema) {
    if (!schema.isAbstract) {
        (0, node_opcua_assert_1.assert)(schema.encode);
        (0, node_opcua_assert_1.assert)(schema.decode);
    }
    schema.category = types_1.FieldCategory.basic;
    schema.subType = schema.subType || "";
    if (schema.name !== "Null" && schema.name !== "Any" && schema.name !== "Variant" && schema.name !== "ExtensionObject") {
        const dataType = node_opcua_constants_1.DataTypeIds[schema.name];
        if (!dataType) {
            throw new Error("registerType : dataType " + schema.name + " is not defined");
        }
    }
    const definition = new BasicTypeSchema(schema);
    _defaultTypeMap.set(schema.name, definition);
}
exports.registerBuiltInType = registerType;
function unregisterType(typeName) {
    _defaultTypeMap.delete(typeName);
}
function getBuiltInType(name) {
    const typeSchema = _defaultTypeMap.get(name);
    if (!typeSchema) {
        throw new Error("Cannot find schema for simple type " + name);
    }
    return typeSchema;
}
function hasBuiltInType(name) {
    return _defaultTypeMap.has(name);
}
/** */
function findBuiltInType(dataTypeName) {
    (0, node_opcua_assert_1.assert)(typeof dataTypeName === "string", "findBuiltInType : expecting a string " + dataTypeName);
    const t = getBuiltInType(dataTypeName);
    if (t.subType && t.subType !== t.name /* avoid infinite recursion */) {
        const st = getBuiltInType(t.subType);
        if (!st.isAbstract) {
            return findBuiltInType(t.subType);
        }
    }
    return t;
}
//# sourceMappingURL=builtin_types.js.map