"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseUAObject = void 0;
/* eslint-disable prefer-rest-params */
/* eslint-disable complexity */
/**
 * @module node-opcua-factory
 */
// tslint:disable:no-shadowed-variable
const chalk_1 = __importDefault(require("chalk"));
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_basic_types_1 = require("node-opcua-basic-types");
const node_opcua_binary_stream_1 = require("node-opcua-binary-stream");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
const node_opcua_utils_1 = require("node-opcua-utils");
const enumerations_1 = require("./enumerations");
const get_standard_data_type_factory_1 = require("./get_standard_data_type_factory");
const types_1 = require("./types");
const errorLog = (0, node_opcua_debug_1.make_errorLog)(__filename);
function r(str, length = 30) {
    return (str + "                                ").substring(0, length);
}
function _findFieldSchema(typeDictionary, field, value) {
    const fieldType = field.fieldType;
    if (field.allowSubType && field.category === "complex") {
        const fieldTypeConstructor = value ? value.constructor : field.fieldTypeConstructor;
        const _newFieldSchema = fieldTypeConstructor.schema;
        return _newFieldSchema;
    }
    const fieldTypeConstructor = field.fieldTypeConstructor;
    if (fieldTypeConstructor) {
        return fieldTypeConstructor.prototype.schema;
    }
    const strucutreInfo = typeDictionary.getStructureInfoByTypeName(fieldType);
    return strucutreInfo.schema;
}
function _decode_member_(value, field, stream, options) {
    const tracer = options.tracer;
    const cursorBefore = stream.length;
    const fieldType = field.fieldType;
    switch (field.category) {
        case types_1.FieldCategory.basic:
            if (field.schema.decode) {
                value = field.schema.decode(stream);
            }
            tracer.trace("member", options.name, value, cursorBefore, stream.length, fieldType);
            break;
        case types_1.FieldCategory.enumeration:
            if (field.schema.decode) {
                value = field.schema.decode(stream);
            }
            tracer.trace("member", options.name, value, cursorBefore, stream.length, fieldType);
            break;
        case types_1.FieldCategory.complex: {
            (0, node_opcua_assert_1.assert)(field.category === types_1.FieldCategory.complex);
            if (!field.fieldTypeConstructor) {
                field.fieldTypeConstructor = (0, get_standard_data_type_factory_1.getStructureTypeConstructor)(field.fieldType);
            }
            if (typeof field.fieldTypeConstructor !== "function") {
                throw new Error("Cannot find constructor for  " + field.name + "of type " + field.fieldType);
            }
            // assert(typeof field.fieldTypeConstructor === "function");
            const constructor = field.fieldTypeConstructor;
            value = new constructor();
            value.decodeDebug(stream, options);
        }
    }
    return value;
}
function _applyOnAllSchemaFields(self, schema, data, functor, args) {
    const baseSchema = schema.getBaseSchema();
    if (baseSchema) {
        _applyOnAllSchemaFields(self, baseSchema, data, functor, args);
    }
    for (const field of schema.fields) {
        functor(self, field, data, args);
    }
}
const _nbElements = typeof process === "object" ? (process.env.ARRAYLENGTH ? parseInt(process.env.ARRAYLENGTH, 10) : 10) : 10;
const fullBuffer = typeof process === "object" ? !!process.env?.FULLBUFFER : false;
function _arrayEllipsis(value, data) {
    if (!value) {
        return "null []";
    }
    else {
        if (value.length === 0) {
            return "[ /* empty*/ ]";
        }
        (0, node_opcua_assert_1.assert)(Array.isArray(value));
        const v = [];
        const m = Math.min(_nbElements, value.length);
        const ellipsis = value.length > _nbElements ? " ... " : "";
        const pad = data.padding + "  ";
        let isMultiLine = true;
        for (let i = 0; i < m; i++) {
            let element = value[i];
            if (element instanceof Buffer) {
                element = (0, node_opcua_debug_1.hexDump)(element, 32, 16);
            }
            else if ((0, node_opcua_utils_1.isNullOrUndefined)(element)) {
                element = "null";
            }
            else {
                element = element.toString();
                const s = element.split("\n");
                if (s.length > 1) {
                    element = "\n" + pad + s.join("\n" + pad);
                    isMultiLine = true;
                }
            }
            if (element.length > 80) {
                isMultiLine = true;
            }
            v.push(element);
        }
        const length = "/* length =" + value.length + "*/";
        if (isMultiLine) {
            return "[ " + length + "\n" + pad + v.join(",\n" + pad + "    ") + ellipsis + "\n" + data.padding + "]";
        }
        else {
            return "[ " + length + v.join(",") + ellipsis + "]";
        }
    }
}
// eslint-disable-next-line complexity
// eslint-disable-next-line max-statements
function _exploreObject(self, field, data, args) {
    if (!self) {
        return;
    }
    const fieldType = field.fieldType;
    const fieldName = field.name;
    const category = field.category;
    const padding = data.padding;
    let value = self[fieldName];
    let str;
    // decorate the field name with ?# if the field is optional
    let opt = "    ";
    if (field.switchBit !== undefined) {
        opt = " ?" + field.switchBit + " ";
    }
    if (field.switchValue !== undefined) {
        opt = " !" + field.switchValue + " ";
    }
    const allowSubTypeSymbol = field.allowSubType ? "~" : " ";
    const arraySymbol = field.isArray ? "[]" : "  ";
    const fieldNameF = chalk_1.default.yellow(r(padding + fieldName, 30));
    const fieldTypeF = chalk_1.default.cyan(`/* ${allowSubTypeSymbol}${r(fieldType + opt, 38)}${arraySymbol}  */`);
    // detected when optional field is not specified in value
    if (field.switchBit !== undefined && value === undefined) {
        str = fieldNameF + " " + fieldTypeF + ": " + chalk_1.default.italic.grey("undefined") + " /* optional field not specified */";
        data.lines.push(str);
        return;
    }
    // detected when union field is not specified in value
    if (field.switchValue !== undefined && value === undefined) {
        str = fieldNameF + " " + fieldTypeF + ": " + chalk_1.default.italic.grey("undefined") + " /* union field not specified */";
        data.lines.push(str);
        return;
    }
    // compact version of very usual objects
    if (fieldType === "QualifiedName" && !field.isArray && value) {
        value = value.toString() || "<null>";
        str = fieldNameF + " " + fieldTypeF + ": " + chalk_1.default.green(value.toString());
        data.lines.push(str);
        return;
    }
    if (fieldType === "LocalizedText" && !field.isArray && value) {
        value = value.toString() || "<null>";
        str = fieldNameF + " " + fieldTypeF + ": " + chalk_1.default.green(value.toString());
        data.lines.push(str);
        return;
    }
    if (fieldType === "DataValue" && !field.isArray && value) {
        value = value.toString(data);
        str = fieldNameF + " " + fieldTypeF + ": " + chalk_1.default.green(value.toString(data));
        data.lines.push(str);
        return;
    }
    if (fieldType === "DiagnosticInfo" && !field.isArray && value) {
        value = value.toString(data);
        str = fieldNameF + " " + fieldTypeF + ": " + chalk_1.default.green(value.toString(data));
        data.lines.push(str);
        return;
    }
    function _dump_enumeration_value(self, field, data, value, fieldType) {
        const s = field.schema;
        // istanbul ignore next
        if (!s.typedEnum) {
            // tslint:disable:no-console
            errorLog("xxxx cannot find typeEnum", s);
        }
        const convert = (value) => {
            // istanbul ignore next
            if (!s.typedEnum.get(value)) {
                return [value, s.typedEnum.get(value)];
            }
            else {
                return [value, s.typedEnum.get(value).key];
            }
        };
        const toS = ([n, s]) => `${n} /*(${s})*/`;
        if (field.isArray) {
            str =
                fieldNameF +
                    " " +
                    fieldTypeF +
                    ": [" +
                    value
                        .map((c) => convert(c))
                        .map(toS)
                        .join(", ") +
                    "]";
            data.lines.push(str);
        }
        else {
            const c = convert(value);
            str = `${fieldNameF} ${fieldTypeF}: ${toS(c)}`;
            data.lines.push(str);
        }
    }
    function _dump_simple_value(self, field, data, value, fieldType) {
        let str = "";
        if (value instanceof Buffer) {
            data.lines.push(fieldNameF + " " + fieldTypeF);
            if (fullBuffer || value.length <= 32) {
                const _hexDump = value.length <= 32 ? "Ox" + value.toString("hex") : "\n" + (0, node_opcua_debug_1.hexDump)(value);
                data.lines.push("Buffer: " + _hexDump);
            }
            else {
                const _hexDump1 = value.subarray(0, 16).toString("hex");
                const _hexDump2 = value.subarray(-16).toString("hex");
                data.lines.push("Buffer: ", _hexDump1 + "..." + _hexDump2);
            }
        }
        else {
            if (field.isArray) {
                str = fieldNameF + " " + fieldTypeF + ": " + _arrayEllipsis(value, data);
            }
            else {
                if (field.fieldType === "NodeId" && value instanceof node_opcua_nodeid_1.NodeId) {
                    value = value.displayText();
                }
                else if (fieldType === "IntegerId" || fieldType === "UInt32") {
                    if (field.name === "attributeId") {
                        value = "AttributeIds." + node_opcua_basic_types_1.AttributeIds[value] + "/* " + value + " */";
                    }
                    else {
                        const extra = value !== undefined ? "0x" + value.toString(16) : "undefined";
                        value = "" + value + "               " + extra;
                    }
                }
                else if (fieldType === "DateTime" || fieldType === "UtcTime") {
                    try {
                        value = value && value.toISOString ? value.toISOString() : value;
                    }
                    catch {
                        value = chalk_1.default.red(value?.toString() + " *** ERROR ***");
                    }
                }
                else if (typeof value === "object" && value !== null && value !== undefined) {
                    // eslint-disable-next-line prefer-spread
                    value = value.toString.apply(value, args);
                }
                str =
                    fieldNameF +
                        " " +
                        fieldTypeF +
                        ": " +
                        (value === null || value === undefined ? chalk_1.default.blue("null") : value.toString());
            }
            data.lines.push(str);
        }
    }
    function _dump_complex_value(self, field, data, value, fieldType) {
        if (field.subType) {
            // this is a synonymous
            fieldType = field.subType;
            _dump_simple_value(self, field, data, value, fieldType);
        }
        else {
            const typeDictionary = self.schema.getDataTypeFactory();
            // istanbul ignore next
            if (!typeDictionary) {
                errorLog("Internal Error: No typeDictionary for ", self.schema);
                return;
            }
            if (field.isArray) {
                if (value === null) {
                    data.lines.push(fieldNameF + " " + fieldTypeF + ": null []");
                }
                else if (value.length === 0) {
                    data.lines.push(fieldNameF + " " + fieldTypeF + ": [ /* empty */ ]");
                }
                else {
                    data.lines.push(fieldNameF + " " + fieldTypeF + ": [");
                    const m = Math.min(_nbElements, value.length);
                    for (let i = 0; i < m; i++) {
                        const element = value[i];
                        const _newFieldSchema = _findFieldSchema(typeDictionary, field, element);
                        data.lines.push(padding + `  { ` + chalk_1.default.cyan(`/* ${i} - ${_newFieldSchema?.name}*/`));
                        const data1 = {
                            lines: [],
                            padding: padding + "    "
                        };
                        _applyOnAllSchemaFields(element, _newFieldSchema, data1, _exploreObject, args);
                        data.lines = data.lines.concat(data1.lines);
                        data.lines.push(padding + "  }" + (i === value.length - 1 ? "" : ","));
                    }
                    if (m < value.length) {
                        data.lines.push(padding + " ..... ( " + value.length + " elements )");
                    }
                    data.lines.push(padding + "]");
                }
            }
            else {
                const _newFieldSchema = _findFieldSchema(typeDictionary, field, value);
                data.lines.push(fieldNameF + " " + fieldTypeF + ": {");
                const data1 = { padding: padding + "  ", lines: [] };
                _applyOnAllSchemaFields(value, _newFieldSchema, data1, _exploreObject, args);
                data.lines = data.lines.concat(data1.lines);
                data.lines.push(padding + "}");
            }
        }
    }
    switch (category) {
        case types_1.FieldCategory.enumeration:
            _dump_enumeration_value(self, field, data, value, fieldType);
            break;
        case types_1.FieldCategory.basic:
            _dump_simple_value(self, field, data, value, fieldType);
            break;
        case types_1.FieldCategory.complex:
            _dump_complex_value(self, field, data, value, fieldType);
            break;
        default:
            throw new Error("internal error: unknown kind_of_field " + category);
    }
}
function json_ify(t, value, fieldType) {
    if (value instanceof Array) {
        return value.map((e) => (e && e.toJSON ? e.toJSON() : e));
    }
    /*
    if (typeof fieldType.toJSON === "function") {
        return fieldType.toJSON(value);
    } else
    */
    if (t && t.toJSON) {
        return t.toJSON(value);
    }
    else if (value.toJSON) {
        return value.toJSON();
    }
    else {
        return value;
    }
}
function _JSONify(self, schema, pojo) {
    /* jshint validthis: true */
    for (const field of schema.fields) {
        const fieldValue = self[field.name];
        if (fieldValue === null || fieldValue === undefined) {
            continue;
        }
        if ((0, enumerations_1.hasBuiltInEnumeration)(field.fieldType)) {
            const enumeration = (0, enumerations_1.getBuiltInEnumeration)(field.fieldType);
            (0, node_opcua_assert_1.assert)(enumeration !== null);
            if (field.isArray) {
                pojo[field.name] = fieldValue.map((value) => enumeration.enumValues[value.toString()]);
            }
            else {
                pojo[field.name] = enumeration.enumValues[fieldValue.toString()];
            }
            continue;
        }
        const t = field.schema; // getBuiltInType(field.fieldType);
        if (field.isArray) {
            pojo[field.name] = fieldValue.map((value) => json_ify(t, value, field));
        }
        else {
            pojo[field.name] = json_ify(t, fieldValue, field);
        }
    }
}
/**
 * base class for all OPCUA objects
 */
class BaseUAObject {
    constructor() {
        /**  */
    }
    /**
     * Encode the object to the binary stream.
     */
    encode(stream) {
        /** */
    }
    /**
     * Decode the object from the binary stream.
     */
    decode(stream) {
        /** */
    }
    /**
     * Calculate the required size to store this object in a binary stream.
     */
    binaryStoreSize() {
        const stream = new node_opcua_binary_stream_1.BinaryStreamSizeCalculator();
        this.encode(stream);
        return stream.length;
    }
    /**
     */
    toString(...args) {
        if (this.schema && Object.prototype.hasOwnProperty.call(this.schema, "toString")) {
            return this.schema.toString.apply(this, arguments);
        }
        else {
            if (!this.explore) {
                return Object.prototype.toString.apply(this, arguments);
            }
            return this.explore();
        }
    }
    /**
     *
     * verify that all object attributes values are valid according to schema
     */
    isValid() {
        (0, node_opcua_assert_1.assert)(this.schema);
        if (this.schema.isValid) {
            return this.schema.isValid(this);
        }
        else {
            return true;
        }
    }
    /**
     *
     */
    decodeDebug(stream, options) {
        const tracer = options.tracer;
        const schema = this.schema;
        tracer.trace("start", options.name + "(" + schema.name + ")", stream.length, stream.length);
        const self = this;
        for (const field of schema.fields) {
            const value = self[field.name];
            if (typeof field.switchValue === "number") {
                // skip
                if (self["switchField"] !== field.switchValue) {
                    continue;
                }
            }
            if (field.isArray) {
                const cursorBefore = stream.length;
                let nb = stream.readUInt32();
                if (nb === 0xffffffff) {
                    nb = 0;
                }
                options.name = field.name + [];
                tracer.trace("start_array", field.name, nb, cursorBefore, stream.length);
                for (let i = 0; i < nb; i++) {
                    tracer.trace("start_element", field.name, i);
                    options.name = "element #" + i;
                    _decode_member_(value, field, stream, options);
                    tracer.trace("end_element", field.name, i);
                }
                tracer.trace("end_array", field.name, stream.length - 4);
            }
            else {
                options.name = field.name;
                _decode_member_(value, field, stream, options);
            }
        }
        tracer.trace("end", schema.name, stream.length, stream.length);
    }
    explore() {
        const data = {
            lines: [],
            padding: " "
        };
        data.lines.push("{" + chalk_1.default.cyan(" /*" + (this.schema ? this.schema.name : "") + "*/"));
        if (this.schema) {
            this.applyOnAllFields(_exploreObject, data);
        }
        data.lines.push("};");
        return data.lines.join("\n");
    }
    applyOnAllFields(func, data) {
        _applyOnAllSchemaFields(this, this.schema, data, func, null);
    }
    toJSON() {
        (0, node_opcua_assert_1.assert)(this.schema);
        if (this.schema.toJSON) {
            return this.schema.toJSON.apply(this, arguments);
        }
        else {
            (0, node_opcua_assert_1.assert)(this.schema);
            const schema = this.schema;
            const pojo = {};
            _visitSchemaChain(this, schema, pojo, _JSONify, null);
            return pojo;
        }
    }
    clone( /*options,optionalFilter,extraInfo*/) {
        const self = this;
        const params = {};
        function construct_param(schema, options) {
            for (const field of schema.fields) {
                const f = self[field.name];
                if (f === null || f === undefined) {
                    continue;
                }
                if (field.isArray) {
                    options[field.name] = [...self[field.name]];
                }
                else {
                    options[field.name] = self[field.name];
                }
            }
        }
        construct_param.call(this, self.schema, params);
        return new self.constructor(params);
    }
}
exports.BaseUAObject = BaseUAObject;
function _visitSchemaChain(self, schema, pojo, func, extraData) {
    (0, node_opcua_assert_1.assert)(typeof func === "function");
    // apply also construct to baseType schema first
    const baseSchema = schema.getBaseSchema ? schema.getBaseSchema() : null;
    if (baseSchema) {
        _visitSchemaChain(self, baseSchema, pojo, func, extraData);
    }
    func.call(null, self, schema, pojo);
}
//# sourceMappingURL=base_ua_object.js.map