"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumerationDefinitionSchema = void 0;
exports.registerEnumeration = registerEnumeration;
exports.hasBuiltInEnumeration = hasBuiltInEnumeration;
exports.getBuiltInEnumeration = getBuiltInEnumeration;
/**
 * @module node-opcua-factory
 */
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_constants_1 = require("node-opcua-constants");
const node_opcua_enum_1 = require("node-opcua-enum");
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
const builtin_types_1 = require("./builtin_types");
function _encode_enumeration(typedEnum, value, stream) {
    (0, node_opcua_assert_1.assert)(typeof value === "number", "Expecting a number here");
    (0, node_opcua_assert_1.assert)(typedEnum.get(value) !== undefined, "expecting a valid value");
    stream.writeInteger(value);
}
function _decode_enumeration(typedEnum, stream) {
    const value = stream.readInteger();
    const e = typedEnum.get(value);
    // istanbul ignore next
    if (!e) {
        throw new Error("cannot  coerce value=" + value + " to " + typedEnum.constructor.name);
    }
    return value;
}
class EnumerationDefinitionSchema extends builtin_types_1.TypeSchemaBase {
    // xx encode: (value: EnumItem, stream: OutputBinaryStream) => void;
    // xx decode: (stream: BinaryStream) => EnumItem;
    constructor(dataTypeNodeId, options) {
        super(options);
        this.dataTypeNodeId = dataTypeNodeId;
        // create a new Enum
        this.enumValues = (0, node_opcua_enum_1.adaptTypescriptEnum)(options.enumValues);
        const typedEnum = new node_opcua_enum_1.Enum(options.enumValues);
        options.typedEnum = typedEnum;
        (0, node_opcua_assert_1.assert)(!options.encode || typeof options.encode === "function");
        (0, node_opcua_assert_1.assert)(!options.decode || typeof options.decode === "function");
        this.encode = options.encode || _encode_enumeration.bind(null, typedEnum);
        this.decode = options.decode || _decode_enumeration.bind(null, typedEnum);
        this.typedEnum = options.typedEnum;
        this.defaultValue = this.typedEnum.getDefaultValue().value;
        this.lengthInBits = options.lengthInBits || 32;
    }
}
exports.EnumerationDefinitionSchema = EnumerationDefinitionSchema;
const _enumerations = new Map();
/**

 * @param options
 * @param options.name {string}
 * @param options.enumValues [{key:Name, value:values}]
 * @param options.encode
 * @param options.decode
 * @param options.typedEnum
 * @param options.defaultValue
 * @return {Enum}
 */
function registerEnumeration(options) {
    const dataTypeNodeId = (0, node_opcua_nodeid_1.resolveNodeId)(node_opcua_constants_1.DataTypeIds[options.name]);
    (0, node_opcua_assert_1.assert)(Object.prototype.hasOwnProperty.call(options, "name"));
    (0, node_opcua_assert_1.assert)(Object.prototype.hasOwnProperty.call(options, "enumValues"));
    const name = options.name;
    if (Object.prototype.hasOwnProperty.call(_enumerations, name)) {
        throw new Error("factories.registerEnumeration : Enumeration " + options.name + " has been already inserted");
    }
    const enumerationDefinition = new EnumerationDefinitionSchema(dataTypeNodeId, options);
    _enumerations.set(name, enumerationDefinition);
    return enumerationDefinition.typedEnum;
}
function hasBuiltInEnumeration(enumerationName) {
    return _enumerations.has(enumerationName);
}
function getBuiltInEnumeration(enumerationName) {
    if (!hasBuiltInEnumeration(enumerationName)) {
        throw new Error("Cannot find enumeration with type " + enumerationName);
    }
    return _enumerations.get(enumerationName);
}
//# sourceMappingURL=enumerations.js.map