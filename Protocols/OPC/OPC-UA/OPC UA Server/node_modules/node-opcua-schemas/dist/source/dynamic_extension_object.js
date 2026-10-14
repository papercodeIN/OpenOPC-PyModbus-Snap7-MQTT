"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicExtensionObject = void 0;
exports.getOrCreateConstructor = getOrCreateConstructor;
exports.createDynamicObjectConstructor = createDynamicObjectConstructor;
/**
 * @module node-opcua-schemas
 */
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
const node_opcua_extension_object_1 = require("node-opcua-extension-object");
const node_opcua_variant_1 = require("node-opcua-variant");
const node_opcua_factory_1 = require("node-opcua-factory");
const node_opcua_nodeid_2 = require("node-opcua-nodeid");
const debugLog = (0, node_opcua_debug_1.make_debugLog)(__filename);
const errorLog = (0, node_opcua_debug_1.make_errorLog)(__filename);
const doDebug = (0, node_opcua_debug_1.checkDebugFlag)(__filename);
function associateEncoding(dataTypeFactory, constructor, { encodingDefaultBinary, encodingDefaultXml }) {
    const schema = constructor.schema;
    const dataTypeName = schema.name;
    if (encodingDefaultBinary && encodingDefaultBinary.value !== 0) {
        schema.encodingDefaultBinary = encodingDefaultBinary;
        schema.encodingDefaultXml = encodingDefaultXml;
        constructor.encodingDefaultBinary = encodingDefaultBinary;
        constructor.encodingDefaultXml = encodingDefaultXml;
        dataTypeFactory.associateWithBinaryEncoding(dataTypeName, encodingDefaultBinary);
    }
}
function getOrCreateConstructor(dataTypeName, dataTypeFactory, encodingDefaultBinary, encodingDefaultXml) {
    if (dataTypeFactory.hasStructureByTypeName(dataTypeName)) {
        const structureInfo = dataTypeFactory.getStructureInfoByTypeName(dataTypeName);
        return (structureInfo.constructor || node_opcua_extension_object_1.ExtensionObject);
    }
    const schema = dataTypeFactory.getStructuredTypeSchema(dataTypeName);
    // istanbul ignore next
    if (!schema) {
        throw new Error("Unknown type in dictionary " + dataTypeName);
    }
    const constructor = createDynamicObjectConstructor(schema, dataTypeFactory);
    if (!constructor) {
        return node_opcua_extension_object_1.ExtensionObject;
    }
    // istanbul ignore next
    if (!dataTypeFactory.hasStructureByTypeName(dataTypeName)) {
        dataTypeFactory.registerClassDefinition(schema.dataTypeNodeId, dataTypeName, constructor);
        return constructor;
        // how new Error("constructor should now be registered - " + fieldType);
    }
    associateEncoding(dataTypeFactory, constructor, { encodingDefaultBinary });
    return constructor;
}
function encodeElement(field, element, stream, encodeFunc) {
    if (encodeFunc) {
        encodeFunc(element, stream);
    }
    else {
        // istanbul ignore next
        if (!element.encode) {
            throw new Error("encodeArrayOrElement: object field " + field.name + " has no encode method and encodeFunc is missing");
        }
        if (field.allowSubType) {
            (0, node_opcua_extension_object_1.encodeExtensionObject)(element, stream);
            // new Variant({ dataType: DataType.ExtensionObject, value: element }).encode(stream);
        }
        else {
            element.encode(stream);
        }
    }
}
function encodeArrayOrElement(field, obj, stream, encodeFunc) {
    if (field.isArray) {
        const array = obj[field.name];
        if (!array) {
            stream.writeUInt32(0xffffffff);
        }
        else {
            stream.writeUInt32(array.length);
            for (const e of array) {
                encodeElement(field, e, stream, encodeFunc);
            }
        }
    }
    else {
        encodeElement(field, obj[field.name], stream, encodeFunc);
    }
}
function decodeElement(dataTypeFactory, field, stream, decodeFunc) {
    if (decodeFunc) {
        return decodeFunc(stream);
    }
    else {
        if (field.allowSubType) {
            const element = (0, node_opcua_extension_object_1.decodeExtensionObject)(stream);
            return element;
        }
        else {
            // construct an instance
            const structureInfo = dataTypeFactory.getStructureInfoByTypeName(field.fieldType);
            if (!structureInfo.constructor) {
                throw new Error("Cannot instantiate an abstract dataStructure: " + field.fieldType);
            }
            const element = new structureInfo.constructor({});
            element.decode(stream);
            return element;
        }
    }
}
function decodeArrayOrElement(dataTypeFactory, field, obj, stream, decodeFunc) {
    if (field.isArray) {
        const array = [];
        const nbElements = stream.readUInt32();
        if (nbElements === 0xffffffff) {
            obj[field.name] = null;
        }
        else {
            for (let i = 0; i < nbElements; i++) {
                const element = decodeElement(dataTypeFactory, field, stream, decodeFunc);
                array.push(element);
            }
            obj[field.name] = array;
        }
    }
    else {
        obj[field.name] = decodeElement(dataTypeFactory, field, stream, decodeFunc);
    }
}
function isSubtype(dataTypeFactory, dataTypeNodeId, schema) {
    if ((0, node_opcua_nodeid_1.sameNodeId)(dataTypeNodeId, schema.dataTypeNodeId)) {
        return true;
    }
    const baseSchema = schema.getBaseSchema();
    if (!baseSchema || !baseSchema?.dataTypeNodeId)
        return false;
    const structureInfo = dataTypeFactory.getStructureInfoForDataType(baseSchema.dataTypeNodeId);
    if (!structureInfo) {
        return false;
    }
    return isSubtype(dataTypeFactory, dataTypeNodeId, structureInfo.schema);
}
function _validateSubType(dataTypeFactory, field, value) {
    (0, node_opcua_assert_1.assert)(field.allowSubType);
    if (!value) {
        value = { dataType: node_opcua_variant_1.DataType.Null, value: null };
        // const msg = "initializeField: field { dataType,value} is required here";
        // errorLog(msg);
        // throw new Error(msg);
        return;
    }
    if (field.category === "basic") {
        if (!Object.prototype.hasOwnProperty.call(value, "dataType")) {
            const msg = "initializeField: field that allow subtype must be a Variant like and have a dataType property";
            errorLog(msg);
            throw new Error(msg);
        }
        const c = dataTypeFactory.getBuiltInTypeByDataType((0, node_opcua_nodeid_2.coerceNodeId)(`i=${value.dataType}`, 0));
        const d = dataTypeFactory.getBuiltInType(field.fieldType);
        if (c && c.isSubTypeOf(d)) {
            return;
        }
        const msg = "initializeField: invalid subtype for field " +
            field.name +
            " expecting " +
            field.fieldType +
            " but got " +
            node_opcua_variant_1.DataType[value.dataType];
        errorLog(msg);
        throw new Error(msg);
    }
    else {
        if (value !== null && !(value instanceof node_opcua_extension_object_1.ExtensionObject)) {
            errorLog("initializeField: array element is not an ExtensionObject");
            throw new Error(`${field.name}: array element must be an ExtensionObject`);
        }
        const e = value;
        if (!isSubtype(dataTypeFactory, field.dataType, e.schema)) {
            const msg = "initializeField: invalid subtype for field " +
                field.name +
                " expecting " +
                field.fieldType +
                " but got " +
                e.schema.dataTypeNodeId.toString() +
                " " +
                e.schema.name;
            errorLog(msg);
            throw new Error(msg);
        }
    }
}
function validateSubTypeA(dataTypeFactory, field, value) {
    if (field.isArray) {
        const arr = value || [];
        for (const e of arr) {
            // now check that element is of the correct type
            _validateSubType(dataTypeFactory, field, e);
        }
    }
    else {
        _validateSubType(dataTypeFactory, field, value);
    }
}
function initializeField(field, thisAny, options, schema, dataTypeFactory) {
    const name = field.name;
    const value = getFieldValue(field, options);
    switch (field.category) {
        case node_opcua_factory_1.FieldCategory.complex: {
            if (field.allowSubType) {
                validateSubTypeA(dataTypeFactory, field, value);
                if (field.isArray) {
                    const arr = value || [];
                    thisAny[name] = arr.map((x) => x.clone());
                }
                else {
                    const e = value;
                    if (e !== null && !(e instanceof node_opcua_extension_object_1.ExtensionObject)) {
                        errorLog("initializeField: array element is not an ExtensionObject");
                    }
                    // now check that element is of the correct type
                    thisAny[name] = e.clone();
                }
            }
            else {
                const hasStructure = dataTypeFactory.hasStructureByTypeName(field.fieldType);
                // We could have a structure or a enumeration
                if (!hasStructure) {
                    const enumeration = dataTypeFactory.getEnumeration(field.fieldType);
                    if (!enumeration) {
                        throw new Error("Cannot find" + field.fieldType + " as a structure or enumeration");
                    }
                    else {
                        if (field.isArray) {
                            const arr = value || [];
                            thisAny[name] = arr.map((x) => enumeration.typedEnum.get(x));
                        }
                        else {
                            thisAny[name] = enumeration.typedEnum.get(value);
                        }
                    }
                }
                else {
                    const constructor = dataTypeFactory.getStructureInfoByTypeName(field.fieldType).constructor;
                    if (field.isArray) {
                        const arr = value || [];
                        if (!Array.isArray(arr)) {
                            throw new Error("Expecting an array here for field " + field.name + "but got " + arr);
                        }
                        thisAny[name] = arr.map((x) => (constructor ? new constructor(x) : null));
                    }
                    else {
                        thisAny[name] = constructor ? new constructor(value) : null;
                    }
                }
            }
            // getOrCreateConstructor(field.fieldType, factory) || BaseUAObject;
            // xx processStructuredType(fieldSchema);
            break;
        }
        case node_opcua_factory_1.FieldCategory.enumeration:
        case node_opcua_factory_1.FieldCategory.basic:
            if (field.allowSubType) {
                validateSubTypeA(dataTypeFactory, field, value);
            }
            if (field.isArray) {
                thisAny[name] = (0, node_opcua_factory_1.initialize_field_array)(field, value, dataTypeFactory);
            }
            else {
                thisAny[name] = (0, node_opcua_factory_1.initialize_field)(field, value, dataTypeFactory);
            }
            break;
    }
}
function getFieldValue(field, options) {
    return options[field.name] !== undefined ? options[field.name] : options[field.originalName];
}
function initializeFields(thisAny, options, schema, dataTypeFactory, params) {
    const baseSchema = schema.getBaseSchema();
    // initialize base class first
    if (baseSchema && baseSchema.fields.length) {
        initializeFields(thisAny, options, baseSchema, dataTypeFactory, params);
    }
    // finding fields that are in options but not in schema!
    for (const field of schema.fields) {
        const name = field.name;
        const value = getFieldValue(field, options);
        // dealing with optional fields
        if (field.switchBit !== undefined && value === undefined) {
            thisAny[name] = undefined;
            continue;
        }
        initializeField(field, thisAny, options, schema, dataTypeFactory);
    }
}
function hasOptionalFieldsF(schema) {
    if (schema.bitFields && schema.bitFields.length > 0) {
        return true;
    }
    const baseSchema = schema.getBaseSchema();
    return baseSchema ? hasOptionalFieldsF(baseSchema) : false;
}
function _internal_encodeFields(thisAny, schema, stream) {
    const baseSchema = schema.getBaseSchema();
    // encodeFields base class first
    if (baseSchema && baseSchema.fields.length) {
        _internal_encodeFields(thisAny, baseSchema, stream);
    }
    for (const field of schema.fields) {
        // ignore
        if (field.switchBit !== undefined && thisAny[field.name] === undefined) {
            continue;
        }
        switch (field.category) {
            case node_opcua_factory_1.FieldCategory.complex:
                encodeArrayOrElement(field, thisAny, stream);
                break;
            case node_opcua_factory_1.FieldCategory.enumeration:
            case node_opcua_factory_1.FieldCategory.basic:
                encodeArrayOrElement(field, thisAny, stream, field.schema.encode);
                break;
            default:
                /* istanbul ignore next*/
                throw new Error("Invalid category " + field.category + " " + node_opcua_factory_1.FieldCategory[field.category]);
        }
    }
}
function makeBitField(thisAny, schema, bo) {
    const baseSchema = schema.getBaseSchema();
    const data = baseSchema ? makeBitField(thisAny, baseSchema, bo) : bo;
    let { bitField, allOptional } = data;
    const { offset } = data;
    let nbOptionalFields = 0;
    for (const field of schema.fields) {
        if (field.switchBit === undefined) {
            allOptional = false;
            continue;
        }
        nbOptionalFields += 1;
        if (thisAny[field.name] === undefined) {
            continue;
        }
        // tslint:disable-next-line:no-bitwise
        bitField |= 1 << (field.switchBit + offset);
    }
    return { bitField, offset: nbOptionalFields + offset, allOptional };
}
function encodeFields(thisAny, schema, stream) {
    const hasOptionalFields = hasOptionalFieldsF(schema);
    // ============ Deal with switchBits
    if (hasOptionalFields) {
        const { bitField, allOptional } = makeBitField(thisAny, schema, { bitField: 0, offset: 0, allOptional: true });
        if (!(bitField === 0 && allOptional)) {
            stream.writeUInt32(bitField);
        }
    }
    _internal_encodeFields(thisAny, schema, stream);
}
function internal_decodeFields(thisAny, bitField, hasOptionalFields, schema, stream, dataTypeFactory) {
    const baseSchema = schema.getBaseSchema();
    // encodeFields base class first
    if (baseSchema && baseSchema.fields.length) {
        internal_decodeFields(thisAny, bitField, hasOptionalFields, baseSchema, stream, dataTypeFactory);
    }
    for (const field of schema.fields) {
        // ignore fields that have a switch bit when bit is not set
        if (hasOptionalFields && field.switchBit !== undefined) {
            // tslint:disable-next-line:no-bitwise
            if ((bitField & (1 << field.switchBit)) === 0) {
                thisAny[field.name] = undefined;
                continue;
            }
            else {
                if (field.category === node_opcua_factory_1.FieldCategory.complex && thisAny[field.name] === undefined) {
                    // need to create empty structure for deserialisation
                    initializeField(field, thisAny, {}, schema, dataTypeFactory);
                }
            }
        }
        switch (field.category) {
            case node_opcua_factory_1.FieldCategory.complex:
                decodeArrayOrElement(dataTypeFactory, field, thisAny, stream);
                break;
            case node_opcua_factory_1.FieldCategory.enumeration:
            case node_opcua_factory_1.FieldCategory.basic:
                decodeArrayOrElement(dataTypeFactory, field, thisAny, stream, field.schema.decode);
                break;
            default:
                /* istanbul ignore next*/
                throw new Error("Invalid category " + field.category + " " + node_opcua_factory_1.FieldCategory[field.category]);
        }
    }
}
function decodeFields(thisAny, schema, stream, dataTypeFactory) {
    // ============ Deal with switchBits
    const hasOptionalFields = hasOptionalFieldsF(schema);
    let bitField = 0;
    if (hasOptionalFields && stream.buffer.length - stream.length > 0) {
        bitField = stream.readUInt32();
    }
    internal_decodeFields(thisAny, bitField, hasOptionalFields, schema, stream, dataTypeFactory);
}
function ___fieldToJson(field, value) {
    switch (field.category) {
        case node_opcua_factory_1.FieldCategory.complex:
            return value ? value?.toJSON() : null;
        case node_opcua_factory_1.FieldCategory.enumeration:
        case node_opcua_factory_1.FieldCategory.basic:
            return value instanceof Date ? new Date(value.getTime()) : value?.toJSON ? value?.toJSON() : value;
        default:
            /* istanbul ignore next*/
            throw new Error("Invalid category " + field.category + " " + node_opcua_factory_1.FieldCategory[field.category]);
    }
}
function fieldToJSON(field, value) {
    if (field.isArray) {
        if (value) {
            return value.map(___fieldToJson.bind(null, field));
        }
    }
    else {
        return ___fieldToJson(field, value);
    }
}
function encodeToJson(thisAny, schema, pojo) {
    const baseSchema = schema.getBaseSchema();
    if (baseSchema && baseSchema.fields.length) {
        encodeToJson(thisAny, baseSchema, pojo);
    }
    for (const field of schema.fields) {
        const value = thisAny[field.name];
        if (value === undefined) {
            continue;
        }
        pojo[field.name] = fieldToJSON(field, value);
    }
}
const _private = new WeakMap();
class DynamicExtensionObject extends node_opcua_extension_object_1.ExtensionObject {
    constructor(options, schema, dataTypeFactory) {
        (0, node_opcua_assert_1.assert)(schema, "expecting a schema here ");
        (0, node_opcua_assert_1.assert)(dataTypeFactory, "expecting a DataTypeFactory");
        super(options);
        options = options || {};
        _private.set(this, { schema, factory: dataTypeFactory });
        (0, node_opcua_factory_1.check_options_correctness_against_schema)(this, this.schema, options);
        initializeFields(this, options, this.schema, dataTypeFactory, { caseInsensitive: true });
    }
    encode(stream) {
        super.encode(stream);
        encodeFields(this, this.schema, stream);
    }
    decode(stream) {
        super.decode(stream);
        decodeFields(this, this.schema, stream, _private.get(this).factory);
    }
    get schema() {
        const r = _private.get(this);
        return r.schema;
    }
    toJSON() {
        const pojo = {};
        encodeToJson(this, this.schema, pojo);
        return pojo;
    }
}
exports.DynamicExtensionObject = DynamicExtensionObject;
DynamicExtensionObject.schema = node_opcua_extension_object_1.ExtensionObject.schema;
DynamicExtensionObject.possibleFields = [];
// tslint:disable-next-line:max-classes-per-file
class UnionBaseClass extends node_opcua_factory_1.BaseUAObject {
    // eslint-disable-next-line max-statements
    constructor(options, schema, dataTypeFactory) {
        super();
        (0, node_opcua_assert_1.assert)(schema, "expecting a schema here ");
        (0, node_opcua_assert_1.assert)(dataTypeFactory, "expecting a typeDic");
        options = options || {};
        _private.set(this, { schema });
        (0, node_opcua_factory_1.check_options_correctness_against_schema)(this, this.schema, options);
        let uniqueFieldHasBeenFound = false;
        let switchFieldName = "";
        // finding fields that are in options but not in schema!
        for (const field of this.schema.fields) {
            const name = field.name;
            if (field.switchValue === undefined) {
                // this is the switch value field
                switchFieldName = field.name;
                continue;
            }
            (0, node_opcua_assert_1.assert)(switchFieldName.length > 0, "It seems that there is no switch field in union schema");
            (0, node_opcua_assert_1.assert)(field.switchValue !== undefined, "union schema must only have one switched value field");
            // dealing with optional fields
            const value = getFieldValue(field, options);
            /* istanbul ignore next */
            if (uniqueFieldHasBeenFound && value !== undefined) {
                // let try to be helpful for the developper by providing some hint
                debugLog(this.schema);
                throw new Error("union must have only one choice in " +
                    JSON.stringify(options) +
                    "\n found while investigating " +
                    field.name +
                    "\n switchFieldName = " +
                    switchFieldName);
            }
            if (options[switchFieldName] !== undefined) {
                // then options[switchFieldName] must equal
                if (options[switchFieldName] !== field.switchValue) {
                    continue;
                }
            }
            else {
                // the is no switchFieldName , in this case the i
                if (value === undefined) {
                    continue;
                }
            }
            uniqueFieldHasBeenFound = true;
            this[switchFieldName] = field.switchValue;
            switch (field.category) {
                case node_opcua_factory_1.FieldCategory.complex: {
                    const Constructor = dataTypeFactory.getStructureInfoByTypeName(field.fieldType).constructor;
                    if (!Constructor) {
                        throw new Error("Cannot instantiate an abstract dataType" + field.fieldType);
                    }
                    // getOrCreateConstructor(field.fieldType, factory) || BaseUAObject;
                    if (field.isArray) {
                        this[name] = (value || []).map((x) => (Constructor ? new Constructor(x) : null));
                    }
                    else {
                        this[name] = Constructor ? new Constructor(value) : null;
                    }
                    // xx processStructuredType(fieldSchema);
                    break;
                }
                case node_opcua_factory_1.FieldCategory.enumeration:
                case node_opcua_factory_1.FieldCategory.basic:
                    if (field.isArray) {
                        this[name] = (0, node_opcua_factory_1.initialize_field_array)(field, value);
                    }
                    else {
                        this[name] = (0, node_opcua_factory_1.initialize_field)(field, value);
                    }
                    break;
            }
        }
        if (!uniqueFieldHasBeenFound) {
            if (Object.keys(options).length === 0) {
                this[switchFieldName] = 0x00;
                return;
            }
            const r = schema.fields
                .filter((f) => f.switchValue !== undefined)
                .map((f) => f.name)
                .join(" , ");
            // it is possible also that the switchfield value do not correspond to a valid field
            const foundFieldForSwitchValue = schema.fields.findIndex((f) => f.switchValue !== undefined && f.switchValue === options[switchFieldName]);
            if (foundFieldForSwitchValue) {
                // throw new Error(this.schema.name + ": cannot find field with value "
                // +  options[switchFieldName]);
            }
            else {
                debugLog(this.schema);
                throw new Error(this.schema.name + ": At least one of [ " + r + " ] must be specified in " + JSON.stringify(options));
            }
        }
    }
    encode(stream) {
        const switchFieldName = this.schema.fields[0].name;
        const switchValue = this[switchFieldName];
        if (typeof switchValue !== "number") {
            throw new Error("Invalid switchValue  " + switchFieldName + " value = " + switchValue);
        }
        stream.writeUInt32(switchValue);
        for (const field of this.schema.fields) {
            if (field.switchValue === undefined || field.switchValue !== switchValue) {
                continue;
            }
            switch (field.category) {
                case node_opcua_factory_1.FieldCategory.complex:
                    encodeArrayOrElement(field, this, stream);
                    break;
                case node_opcua_factory_1.FieldCategory.enumeration:
                case node_opcua_factory_1.FieldCategory.basic:
                    encodeArrayOrElement(field, this, stream, field.schema.encode);
                    break;
                default:
                    /* istanbul ignore next*/
                    throw new Error("Invalid category " + field.category + " " + node_opcua_factory_1.FieldCategory[field.category]);
            }
            break;
        }
    }
    decode(stream) {
        const factory = this.schema.getDataTypeFactory();
        const switchValue = stream.readUInt32();
        const switchFieldName = this.schema.fields[0].name;
        this[switchFieldName] = switchValue;
        for (const field of this.schema.fields) {
            if (field.switchValue === undefined || field.switchValue !== switchValue) {
                continue;
            }
            switch (field.category) {
                case node_opcua_factory_1.FieldCategory.complex:
                    decodeArrayOrElement(factory, field, this, stream);
                    break;
                case node_opcua_factory_1.FieldCategory.enumeration:
                case node_opcua_factory_1.FieldCategory.basic:
                    decodeArrayOrElement(factory, field, this, stream, field.schema.decode);
                    break;
                default:
                    /* istanbul ignore next*/
                    throw new Error("Invalid category " + field.category + " " + node_opcua_factory_1.FieldCategory[field.category]);
            }
            break;
        }
    }
    get schema() {
        return _private.get(this).schema;
    }
    toString() {
        return super.toString();
    }
    toJSON() {
        const pojo = Object.create(null);
        const switchFieldName = this.schema.fields[0].name;
        const switchValue = this[switchFieldName];
        if (typeof switchValue !== "number") {
            throw new Error("Invalid switchValue  " + switchValue);
        }
        pojo[switchFieldName] = switchValue;
        for (const field of this.schema.fields) {
            if (field.switchValue === undefined || field.switchValue !== switchValue) {
                continue;
            }
            const value = this[field.name];
            if (value === undefined) {
                continue;
            }
            pojo[field.originalName] = fieldToJSON(field, value);
            break;
        }
        return pojo;
    }
}
function _createDynamicUnionConstructor(schema, dataTypeFactory) {
    const possibleFields = schema.fields.map((x) => x.name);
    // tslint:disable-next-line:max-classes-per-file
    class UNION extends UnionBaseClass {
        constructor(options) {
            super(options, schema, dataTypeFactory);
            (0, node_opcua_assert_1.assert)(this.schema === schema);
        }
    }
    UNION.possibleFields = possibleFields;
    UNION.schema = schema;
    // to do : may be remove DataType suffix here ?
    Object.defineProperty(UNION, "name", { value: schema.name });
    const schemaPriv = schema;
    (0, node_opcua_assert_1.assert)(!schemaPriv.$Constructor);
    schemaPriv.$Constructor = UNION;
    UNION.encodingDefaultBinary = schema.encodingDefaultBinary;
    return UNION;
}
function createDynamicObjectConstructor(schema, dataTypeFactory) {
    const schemaPriv = schema;
    if (schemaPriv.$Constructor) {
        return schemaPriv.$Constructor;
    }
    const dataTypeNodeId = schemaPriv.dataTypeNodeId;
    if (schema.baseType === "Union") {
        const UNIONConstructor = _createDynamicUnionConstructor(schema, dataTypeFactory);
        dataTypeFactory.registerClassDefinition(dataTypeNodeId, schema.name, UNIONConstructor);
        return UNIONConstructor;
    }
    let possibleFields = schema.fields.map((x) => x.name);
    let BaseClass = DynamicExtensionObject;
    if (schema.baseType !== "ExtensionObject" &&
        schema.baseType !== "OptionSet" &&
        schema.baseType !== "DataTypeDescription" &&
        schema.baseType !== "DataTypeDefinition" &&
        schema.baseType !== "EnumValueType" &&
        schema.baseType !== "Structure") {
        try {
            const baseSchema = schema.getBaseSchema(); // dataTypeFactory.getStructuredTypeSchema(schema.baseType);
            if (!baseSchema || baseSchema.encodingDefaultBinary?.value === 0) {
                // is abstract
            }
            else {
                if (!baseSchema.isAbstract) {
                    // to do : check this
                    BaseClass = getOrCreateConstructor(schema.baseType, dataTypeFactory);
                    if (!BaseClass) {
                        throw new Error("Cannot find base class : " + schema.baseType);
                    }
                    if (BaseClass.possibleFields) {
                        possibleFields = BaseClass.possibleFields.concat(possibleFields);
                    }
                }
            }
        }
        catch (err) {
            warningLog("createDynamicObjectConstructor err= ", err.message);
        }
    }
    // tslint:disable-next-line:max-classes-per-file
    class EXTENSION extends BaseClass {
        static get schema() {
            return schema;
        }
        constructor(options, schema2, factory2) {
            super(options, schema2 ? schema2 : EXTENSION.schema, factory2 ? factory2 : dataTypeFactory);
        }
        toString() {
            return super.toString();
        }
        toJSON() {
            const pojo = {};
            encodeToJson(this, this.schema, pojo);
            return pojo;
        }
        encode(stream) {
            super.encode(stream);
        }
        decode(stream) {
            super.decode(stream);
        }
    }
    EXTENSION.encodingDefaultXml = new node_opcua_nodeid_2.ExpandedNodeId(node_opcua_nodeid_2.NodeIdType.NUMERIC, 0, 0);
    EXTENSION.encodingDefaultBinary = new node_opcua_nodeid_2.ExpandedNodeId(node_opcua_nodeid_2.NodeIdType.NUMERIC, 0, 0);
    EXTENSION.possibleFields = possibleFields;
    // to do : may be remove DataType suffix here ?
    Object.defineProperty(EXTENSION, "name", { value: schema.name });
    schemaPriv.$Constructor = EXTENSION;
    EXTENSION.encodingDefaultBinary = schema.encodingDefaultBinary;
    dataTypeFactory.registerClassDefinition(dataTypeNodeId, schema.name, EXTENSION);
    return EXTENSION;
}
function warningLog(arg0, message) {
    throw new Error("Function not implemented.");
}
//# sourceMappingURL=dynamic_extension_object.js.map