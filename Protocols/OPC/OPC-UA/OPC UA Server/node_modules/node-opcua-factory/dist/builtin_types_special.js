"use strict";
/**
 * @module node-opcua-factory
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSpecialVariantEncoder = registerSpecialVariantEncoder;
const node_opcua_assert_1 = require("node-opcua-assert");
const builtin_types_1 = require("./builtin_types");
function _self_encode(constructor) {
    (0, node_opcua_assert_1.assert)(typeof constructor === "function");
    return (value, stream) => {
        if (!value || !value.encode) {
            value = new constructor(value);
        }
        value.encode(stream);
    };
}
function _self_decode(constructor) {
    (0, node_opcua_assert_1.assert)(typeof constructor === "function");
    return (stream) => {
        const value = new constructor();
        value.decode(stream);
        return value;
    };
}
function _self_coerce(constructor) {
    (0, node_opcua_assert_1.assert)(typeof constructor === "function");
    return (value) => {
        const obj = new constructor(value);
        return obj;
    };
}
function registerSpecialVariantEncoder(constructor) {
    (0, node_opcua_assert_1.assert)(typeof constructor === "function");
    const name = constructor.prototype.schema.name;
    (0, builtin_types_1.registerType)({
        name,
        subType: name,
        encode: _self_encode(constructor),
        decode: _self_decode(constructor),
        coerce: _self_coerce(constructor),
        defaultValue: () => new constructor()
    });
}
//# sourceMappingURL=builtin_types_special.js.map