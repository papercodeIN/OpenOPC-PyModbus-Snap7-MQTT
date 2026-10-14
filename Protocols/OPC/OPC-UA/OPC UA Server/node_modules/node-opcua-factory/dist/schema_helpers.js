"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.check_schema_correctness = check_schema_correctness;
exports.initialize_field = initialize_field;
exports.initialize_field_array = initialize_field_array;
/**
 * @module node-opcua-factory
 */
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_constants_1 = require("node-opcua-constants");
const base_ua_object_1 = require("./base_ua_object");
const types_1 = require("./types");
const debugLog = (0, node_opcua_debug_1.make_debugLog)(__filename);
/**
 * ensure correctness of a schema object.
 *

 * @param schema
 *
 */
function check_schema_correctness(schema) {
    (0, node_opcua_assert_1.assert)(typeof schema.name === "string", " expecting schema to have a name");
    (0, node_opcua_assert_1.assert)(schema.fields instanceof Array, " expecting schema to provide a set of fields " + schema.name);
    (0, node_opcua_assert_1.assert)(schema.baseType === undefined || typeof schema.baseType === "string");
}
/**

 * @param value
 * @param defaultValue
 * @return {*}
 */
function initialize_field(field, value, factory) {
    const _t = field.schema;
    if (field.allowSubType && field.category === "complex") {
        if (value instanceof base_ua_object_1.BaseUAObject) {
            value = { dataType: node_opcua_constants_1.DataTypeIds.Structure, value };
        }
    }
    if (!(_t !== null && typeof _t === "object")) {
        throw new Error("initialize_field: expecting field.schema to be set field.name = '" + field.name + "' type = " + field.fieldType);
    }
    if (field.category === types_1.FieldCategory.complex) {
        if (field.fieldTypeConstructor) {
            return new field.fieldTypeConstructor(value);
        }
        else {
            debugLog("xxxx => missing constructor for field type", field.fieldType);
        }
    }
    if (value === undefined || value === null) {
        const defaultValue = _t.computer_default_value ? _t.computer_default_value(field.defaultValue) : field.defaultValue;
        if (value === undefined) {
            if (_t.coerce) {
                return _t.coerce(defaultValue);
            }
            return defaultValue;
        }
        if (defaultValue === null) {
            if (value === null) {
                return null;
            }
        }
    }
    if (_t.coerce) {
        value = _t.coerce(value);
    }
    if (field.validate) {
        if (!field.validate(value)) {
            throw Error(" invalid value " + value + " for field " + field.name + " of type " + field.fieldType);
        }
    }
    return value;
}
/**

 * @param field
 * @param valueArray
 * @return
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function initialize_field_array(field, valueArray, factory) {
    const _t = field.schema;
    let value;
    let i;
    (0, node_opcua_assert_1.assert)(field !== null && typeof field === "object");
    (0, node_opcua_assert_1.assert)(field.isArray);
    if (!valueArray && field.defaultValue === null) {
        return null;
    }
    valueArray = valueArray || [];
    const arr = [];
    for (i = 0; i < valueArray.length; i++) {
        value = initialize_field(field, valueArray[i], factory);
        arr.push(value);
    }
    return arr;
}
//# sourceMappingURL=schema_helpers.js.map