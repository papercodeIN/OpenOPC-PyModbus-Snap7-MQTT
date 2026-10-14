"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QualifiedName = exports.schemaQualifiedName = void 0;
exports.stringToQualifiedName = stringToQualifiedName;
exports.coerceQualifiedName = coerceQualifiedName;
exports.encodeQualifiedName = encodeQualifiedName;
exports.decodeQualifiedName = decodeQualifiedName;
/**
 * @module node-opcua-data-model
 */
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_factory_1 = require("node-opcua-factory");
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
const node_opcua_basic_types_1 = require("node-opcua-basic-types");
exports.schemaQualifiedName = (0, node_opcua_factory_1.buildStructuredType)({
    baseType: "BaseUAObject",
    name: "QualifiedName",
    category: node_opcua_factory_1.FieldCategory.basic,
    fields: [
        {
            name: "NamespaceIndex",
            fieldType: "UInt16"
        },
        {
            name: "Name",
            fieldType: "String",
            defaultValue: null
        }
    ]
});
exports.schemaQualifiedName.coerce = coerceQualifiedName;
class QualifiedName extends node_opcua_factory_1.BaseUAObject {
    constructor(options) {
        super();
        // for de-serialization
        if (options === null || options === undefined) {
            this.namespaceIndex = 0;
            this.name = null;
            return;
        }
        if (typeof options === "string") {
            options = { name: options };
        }
        /* istanbul ignore next */
        if (node_opcua_factory_1.parameters.debugSchemaHelper) {
            const schema = QualifiedName.schema;
            (0, node_opcua_factory_1.check_options_correctness_against_schema)(this, schema, options);
        }
        this.namespaceIndex = options.namespaceIndex || 0;
        this.name = options.name || null;
    }
    /**
     * encode the object into a binary stream
     */
    encode(stream) {
        super.encode(stream);
        (0, node_opcua_basic_types_1.encodeUInt16)(this.namespaceIndex, stream);
        (0, node_opcua_basic_types_1.encodeUAString)(this.name, stream);
    }
    /**
     * decode the object from a binary stream
     */
    decode(stream) {
        super.decode(stream);
        this.namespaceIndex = (0, node_opcua_basic_types_1.decodeUInt16)(stream);
        this.name = (0, node_opcua_basic_types_1.decodeUAString)(stream);
    }
    toString() {
        if (this.namespaceIndex) {
            return this.namespaceIndex + ":" + this.name;
        }
        return this.name || "<null>";
    }
    isEmpty() {
        return !this.name || this.name.length === 0;
    }
    equals(other) {
        return this.name === other.name && this.namespaceIndex === other.namespaceIndex;
    }
}
exports.QualifiedName = QualifiedName;
QualifiedName.schema = exports.schemaQualifiedName;
QualifiedName.possibleFields = ["namespaceIndex", "name"];
QualifiedName.encodingDefaultBinary = (0, node_opcua_nodeid_1.makeExpandedNodeId)(0, 0);
QualifiedName.encodingDefaultXml = (0, node_opcua_nodeid_1.makeExpandedNodeId)(0, 0);
QualifiedName.prototype.schema = QualifiedName.schema;
// xx QualifiedName.prototype.isEmpty = function (): boolean {
// xx    return !this.name || this.name.length === 0;
// xx}
function isInteger(value) {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
}
/**

 * @param value {String}
 * @return {{namespaceIndex: Number, name: String}}
 *
 * @example
 *
 *  stringToQualifiedName("Hello")   => {namespaceIndex: 0, name: "Hello"}
 *  stringToQualifiedName("3:Hello") => {namespaceIndex: 3, name: "Hello"}
 */
function stringToQualifiedName(value) {
    const splitArray = value.split(":");
    let namespaceIndex = 0;
    if (!isNaN(parseFloat(splitArray[0])) &&
        isFinite(parseInt(splitArray[0], 10)) &&
        isInteger(parseFloat(splitArray[0])) &&
        splitArray.length > 1) {
        namespaceIndex = parseInt(splitArray[0], 10);
        splitArray.shift();
        value = splitArray.join(":");
    }
    return new QualifiedName({ namespaceIndex, name: value });
}
function coerceQualifiedName(value) {
    if (!value) {
        return null;
    }
    else if (value instanceof QualifiedName) {
        return value;
    }
    else if (typeof value === "string") {
        return stringToQualifiedName(value);
    }
    else {
        (0, node_opcua_assert_1.assert)(Object.prototype.hasOwnProperty.call(value, "namespaceIndex"));
        (0, node_opcua_assert_1.assert)(Object.prototype.hasOwnProperty.call(value, "name"));
        return new QualifiedName(value);
    }
}
(0, node_opcua_factory_1.registerSpecialVariantEncoder)(QualifiedName);
function encodeQualifiedName(value, stream) {
    value.encode(stream);
}
function decodeQualifiedName(stream, value) {
    value = value || new QualifiedName(null);
    value.decode(stream);
    return value;
}
//# sourceMappingURL=qualified_name.js.map