"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VARIANT_TYPE_MASK = exports.VARIANT_ARRAY_DIMENSIONS_MASK = exports.VARIANT_ARRAY_MASK = exports.Variant = void 0;
exports.encodeVariant = encodeVariant;
exports.decodeVariant = decodeVariant;
exports.coerceVariantType = coerceVariantType;
exports.isValidVariant = isValidVariant;
exports.buildVariantArray = buildVariantArray;
exports.sameVariant = sameVariant;
/**
 * @module node-opcua-variant
 */
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
const node_opcua_basic_types_1 = require("node-opcua-basic-types");
const node_opcua_data_model_1 = require("node-opcua-data-model");
const node_opcua_factory_1 = require("node-opcua-factory");
const node_opcua_utils_1 = require("node-opcua-utils");
const node_opcua_debug_1 = require("node-opcua-debug");
const DataType_enum_1 = require("./DataType_enum");
const VariantArrayType_enum_1 = require("./VariantArrayType_enum");
// tslint:disable:no-bitwise
const warningLog = (0, node_opcua_debug_1.make_warningLog)(__filename);
const schemaVariant = (0, node_opcua_factory_1.buildStructuredType)({
    baseType: "BaseUAObject",
    category: node_opcua_factory_1.FieldCategory.basic,
    fields: [
        {
            defaultValue: DataType_enum_1.DataType.Null,
            documentation: "the variant type.",
            fieldType: "DataType",
            name: "dataType"
        },
        {
            defaultValue: VariantArrayType_enum_1.VariantArrayType.Scalar,
            fieldType: "VariantArrayType",
            name: "arrayType"
        },
        {
            defaultValue: null,
            fieldType: "Any",
            name: "value"
        },
        {
            defaultValue: null,
            documentation: "the matrix dimensions",
            fieldType: "UInt32",
            isArray: true,
            name: "dimensions"
        }
    ],
    name: "Variant"
});
function _coerceVariant(variantLike) {
    const value = variantLike instanceof Variant ? variantLike : new Variant(variantLike);
    return value;
}
class Variant extends node_opcua_factory_1.BaseUAObject {
    constructor(options) {
        super();
        if (options === null) {
            this.dataType = DataType_enum_1.DataType.Null;
            this.arrayType = VariantArrayType_enum_1.VariantArrayType.Scalar;
            this.value = null;
            this.dimensions = null;
            return;
        }
        const options2 = constructHook(options || {});
        this.dataType = DataType_enum_1.DataType.Null;
        this.arrayType = VariantArrayType_enum_1.VariantArrayType.Scalar;
        const schema = schemaVariant;
        this.dataType = options2.dataType;
        this.arrayType = options2.arrayType;
        this.value = (0, node_opcua_factory_1.initialize_field)(schema.fields[2], options2.value);
        this.dimensions = options2.dimensions || null;
        if (this.dataType === DataType_enum_1.DataType.ExtensionObject) {
            if (this.arrayType === VariantArrayType_enum_1.VariantArrayType.Scalar) {
                /* istanbul ignore next */
                if (this.value && !(this.value instanceof node_opcua_factory_1.BaseUAObject)) {
                    throw new Error(`A variant with DataType.ExtensionObject must have a ExtensionObject value.\nMake sure that you specify a valid ExtensionObject to the value options in the Variant Constructor`);
                }
            }
            else {
                if (this.value) {
                    for (const e of this.value) {
                        /* istanbul ignore next */
                        if (e && !(e instanceof node_opcua_factory_1.BaseUAObject)) {
                            throw new Error("A variant with DataType.ExtensionObject must have a ExtensionObject value\nMake sure that you specify a valid ExtensionObject for all element of the value array passed to the  Variant Constructor`");
                        }
                    }
                }
            }
        }
    }
    encode(stream) {
        encodeVariant(this, stream);
    }
    decode(stream) {
        internalDecodeVariant(this, stream);
    }
    decodeDebug(stream, options) {
        decodeDebugVariant(this, stream, options);
    }
    toString() {
        return variantToString(this);
    }
    isValid() {
        return isValidVariant(this.arrayType, this.dataType, this.value, this.dimensions);
    }
    clone() {
        return new Variant(this);
    }
}
exports.Variant = Variant;
Variant.maxTypedArrayLength = 16 * 1024 * 1024;
Variant.maxArrayLength = 1 * 1024 * 1024;
Variant.schema = schemaVariant;
Variant.coerce = _coerceVariant;
Variant.computer_default_value = () => new Variant({ dataType: DataType_enum_1.DataType.Null });
Variant.prototype.schema = schemaVariant;
function variantToString(self, options) {
    function toString(value) {
        switch (self.dataType) {
            case DataType_enum_1.DataType.ByteString:
                return value ? "0x" + value.toString("hex") : "<null>";
            case DataType_enum_1.DataType.NodeId:
                return value instanceof node_opcua_nodeid_1.NodeId ? value.displayText() : value ? value.toString(options) : "";
            case DataType_enum_1.DataType.Boolean:
                return value.toString();
            case DataType_enum_1.DataType.DateTime:
                return value ? (value.toISOString ? value.toISOString() : value.toString()) : "<null>";
            default:
                return value ? value.toString(options) : "0";
        }
    }
    function f(value) {
        if (value === undefined || (value === null && typeof value === "object")) {
            return "<null>";
        }
        return toString(value);
    }
    let data = VariantArrayType_enum_1.VariantArrayType[self.arrayType];
    if (self.dimensions && self.dimensions.length >= 0) {
        data += "[ " + self.dimensions.join(",") + " ]";
    }
    data += "<" + DataType_enum_1.DataType[self.dataType] + ">";
    if (self.arrayType === VariantArrayType_enum_1.VariantArrayType.Scalar) {
        data += ", value: " + f(self.value);
    }
    else if (self.arrayType === VariantArrayType_enum_1.VariantArrayType.Array || self.arrayType === VariantArrayType_enum_1.VariantArrayType.Matrix) {
        if (!self.value) {
            data += ", null";
        }
        else {
            const a = [];
            (0, node_opcua_assert_1.assert)(Array.isArray(self.value) || self.value.buffer instanceof ArrayBuffer);
            for (let i = 0; i < Math.min(10, self.value.length); i++) {
                a[i] = self.value[i];
            }
            if (self.value.length > 10) {
                a.push("...");
            }
            data += ", l= " + self.value.length + ", value=[" + a.map(f).join(",") + "]";
        }
    }
    return "Variant(" + data + ")";
}
/***
 * @private
 */
exports.VARIANT_ARRAY_MASK = 0x80;
/***
 * @private
 */
exports.VARIANT_ARRAY_DIMENSIONS_MASK = 0x40;
/***
 * @private
 */
exports.VARIANT_TYPE_MASK = 0x3f;
const nullVariant = new Variant({ dataType: DataType_enum_1.DataType.Null });
/***
 * @private
 */
function encodeVariant(variant, stream) {
    if (!variant) {
        variant = nullVariant;
    }
    let encodingByte = variant.dataType;
    if (variant.arrayType === VariantArrayType_enum_1.VariantArrayType.Array || variant.arrayType === VariantArrayType_enum_1.VariantArrayType.Matrix) {
        encodingByte |= exports.VARIANT_ARRAY_MASK;
    }
    if (variant.dimensions && variant.arrayType === VariantArrayType_enum_1.VariantArrayType.Matrix) {
        (0, node_opcua_assert_1.assert)(variant.dimensions.length >= 0);
        encodingByte |= exports.VARIANT_ARRAY_DIMENSIONS_MASK;
    }
    (0, node_opcua_basic_types_1.encodeUInt8)(encodingByte, stream);
    if (variant.arrayType === VariantArrayType_enum_1.VariantArrayType.Array || variant.arrayType === VariantArrayType_enum_1.VariantArrayType.Matrix) {
        encodeVariantArray(variant.dataType, stream, variant.value);
    }
    else {
        const encode = get_encoder(variant.dataType || DataType_enum_1.DataType.Null);
        encode(variant.value, stream);
    }
    if ((encodingByte & exports.VARIANT_ARRAY_DIMENSIONS_MASK) === exports.VARIANT_ARRAY_DIMENSIONS_MASK && variant.dimensions) {
        encodeDimension(variant.dimensions, stream);
    }
}
/***
 * @private
 *
 * istanbul ignore function
 */
function decodeDebugVariant(self, stream, options) {
    const tracer = options.tracer;
    const encodingByte = (0, node_opcua_basic_types_1.decodeUInt8)(stream);
    const isArray = (encodingByte & exports.VARIANT_ARRAY_MASK) === exports.VARIANT_ARRAY_MASK;
    const hasDimension = (encodingByte & exports.VARIANT_ARRAY_DIMENSIONS_MASK) === exports.VARIANT_ARRAY_DIMENSIONS_MASK;
    self.dataType = (encodingByte & exports.VARIANT_TYPE_MASK);
    tracer.dump("dataType:  ", self.dataType);
    tracer.dump("isArray:   ", isArray ? "true" : "false");
    tracer.dump("dimension: ", hasDimension);
    const decode = (0, node_opcua_factory_1.findBuiltInType)(DataType_enum_1.DataType[self.dataType]).decode;
    /* istanbul ignore next */
    if (!decode) {
        throw new Error("Variant.decode : cannot find decoder for type " + DataType_enum_1.DataType[self.dataType]);
    }
    const cursorBefore = stream.length;
    if (isArray) {
        self.arrayType = hasDimension ? VariantArrayType_enum_1.VariantArrayType.Matrix : VariantArrayType_enum_1.VariantArrayType.Array;
        _decodeVariantArrayDebug(stream, decode, tracer, self.dataType);
    }
    else {
        self.arrayType = VariantArrayType_enum_1.VariantArrayType.Scalar;
        self.value = decode(stream);
        tracer.trace("member", "Variant", self.value, cursorBefore, stream.length, DataType_enum_1.DataType[self.dataType]);
    }
    // ArrayDimensions
    // Int32[]
    //  The length of each dimension.
    //    This field is only present if the array dimensions flag is set in the encoding mask.
    //    The lower rank dimensions appear first in the array.
    //    All dimensions shall be specified and shall be greater than zero.
    //    If ArrayDimensions are inconsistent with the ArrayLength then the decoder shall
    //   stop and raise a BadDecodingError.
    if (hasDimension) {
        self.dimensions = decodeDimension(stream);
        const verification = calculate_product(self.dimensions);
    }
}
function internalDecodeVariant(self, stream) {
    const encodingByte = (0, node_opcua_basic_types_1.decodeUInt8)(stream);
    const isArray = (encodingByte & exports.VARIANT_ARRAY_MASK) === exports.VARIANT_ARRAY_MASK;
    const hasDimension = (encodingByte & exports.VARIANT_ARRAY_DIMENSIONS_MASK) === exports.VARIANT_ARRAY_DIMENSIONS_MASK;
    self.dataType = (encodingByte & exports.VARIANT_TYPE_MASK);
    if (isArray) {
        self.arrayType = hasDimension ? VariantArrayType_enum_1.VariantArrayType.Matrix : VariantArrayType_enum_1.VariantArrayType.Array;
        self.value = decodeVariantArray(self.dataType, stream);
    }
    else {
        self.arrayType = VariantArrayType_enum_1.VariantArrayType.Scalar;
        const decode = get_decoder(self.dataType);
        self.value = decode(stream);
    }
    if (hasDimension) {
        self.dimensions = decodeDimension(stream);
        const verification = calculate_product(self.dimensions);
        /* istanbul ignore next */
        if (verification !== self.value.length) {
            throw new Error("internalDecodeVariant: BadDecodingError: inconsistent matrix ");
        }
    }
}
/***
 * @private
 */
function decodeVariant(stream, value) {
    value = value || new Variant(null);
    value.decode(stream);
    return value;
}
function constructHook(options) {
    let isArrayTypeUnspecified = options.arrayType === undefined;
    if (options instanceof Variant) {
        const opts = {
            arrayType: options.arrayType,
            dataType: options.dataType,
            dimensions: options.dimensions,
            value: options.value
        };
        if (opts.dataType === DataType_enum_1.DataType.ExtensionObject) {
            if (opts.arrayType === VariantArrayType_enum_1.VariantArrayType.Scalar) {
                if (opts.value && opts.value.constructor) {
                    opts.value = new opts.value.constructor(opts.value);
                }
            }
            else {
                if (opts.value) {
                    opts.value = opts.value.map((e) => {
                        if (e && e.constructor) {
                            return new e.constructor(e);
                        }
                        return null;
                    });
                }
            }
        }
        else if (opts.arrayType !== VariantArrayType_enum_1.VariantArrayType.Scalar) {
            opts.value = coerceVariantArray(opts.dataType, options.value);
        }
        return opts;
    }
    options.dataType = options.dataType || DataType_enum_1.DataType.Null;
    // dataType could be a string
    if (typeof options.dataType === "string") {
        const d = (0, node_opcua_factory_1.findBuiltInType)(options.dataType);
        /* istanbul ignore next */
        if (!d) {
            throw new Error("Cannot find Built-In data type or any DataType resolving to " + options.dataType);
        }
        options.dataType = DataType_enum_1.DataType[d.name];
    }
    // array type could be a string
    if (typeof options.arrayType === "string") {
        const at = VariantArrayType_enum_1.VariantArrayType[options.arrayType];
        /* istanbul ignore next */
        if (at === undefined) {
            throw new Error("ArrayType: invalid " + options.arrayType);
        }
        options.arrayType = at;
    }
    if (isArrayTypeUnspecified && Array.isArray(options.value)) {
        // when using UInt64 ou Int64 arrayType must be specified , as automatic detection cannot be made
        /* istanbul ignore next */
        if (options.dataType === DataType_enum_1.DataType.UInt64 || options.dataType === DataType_enum_1.DataType.Int64) {
            // we do nothing here ....
            throw new Error("Variant#constructor : when using UInt64 ou Int64" +
                " arrayType must be specified , as automatic detection cannot be made");
        }
        else {
            options.arrayType = VariantArrayType_enum_1.VariantArrayType.Array;
            isArrayTypeUnspecified = false;
        }
    }
    if (options.arrayType !== VariantArrayType_enum_1.VariantArrayType.Scalar && !isArrayTypeUnspecified) {
        (0, node_opcua_assert_1.assert)(options.arrayType === VariantArrayType_enum_1.VariantArrayType.Array || options.arrayType === VariantArrayType_enum_1.VariantArrayType.Matrix);
        /* istanbul ignore else */
        if (options.arrayType === VariantArrayType_enum_1.VariantArrayType.Array) {
            const value1 = coerceVariantArray(options.dataType, options.value);
            (0, node_opcua_assert_1.assert)(value1 === null || value1 !== options.value);
            options.value = value1;
        }
        else {
            (0, node_opcua_assert_1.assert)(options.arrayType === VariantArrayType_enum_1.VariantArrayType.Matrix);
            options.value = options.value || [];
            options.value = coerceVariantArray(options.dataType, options.value);
            /* istanbul ignore next */
            if (!options.dimensions) {
                throw new Error("Matrix Variant : missing dimensions");
            }
            /* istanbul ignore next */
            if (options.value.length != 0 && options.value.length !== calculate_product(options.dimensions)) {
                throw new Error("Matrix Variant : invalid value size = options.value.length " +
                    options.value.length +
                    "!=" +
                    calculate_product(options.dimensions) +
                    " => " +
                    JSON.stringify(options.dimensions));
            }
        }
    }
    else {
        (0, node_opcua_assert_1.assert)(options.arrayType === VariantArrayType_enum_1.VariantArrayType.Scalar || options.arrayType === undefined);
        options.arrayType = VariantArrayType_enum_1.VariantArrayType.Scalar;
        const tmp = options.value;
        // scalar
        options.value = coerceVariantType(options.dataType, options.value);
        /* istanbul ignore next */
        if (!isValidVariant(options.arrayType, options.dataType, options.value, null)) {
            throw new Error("Invalid variant arrayType: " +
                VariantArrayType_enum_1.VariantArrayType[options.arrayType] +
                "  dataType: " +
                DataType_enum_1.DataType[options.dataType] +
                " value:" +
                options.value +
                " (javascript type = " +
                typeof options.value +
                " )");
        }
    }
    if (options.dimensions) {
        (0, node_opcua_assert_1.assert)(options.arrayType === VariantArrayType_enum_1.VariantArrayType.Matrix, "dimension can only provided if variant is a matrix");
    }
    return options;
}
function calculate_product(array) {
    /* istanbul ignore next */
    if (!array || array.length === 0) {
        return 0;
    }
    return array.reduce((n, p) => n * p, 1);
}
function get_encoder(dataType) {
    const dataTypeAsString = typeof dataType === "string" ? dataType : DataType_enum_1.DataType[dataType];
    /* istanbul ignore next */
    if (!dataTypeAsString) {
        throw new Error("invalid dataType " + dataType);
    }
    const encode = (0, node_opcua_factory_1.findBuiltInType)(dataTypeAsString).encode;
    /* istanbul ignore next */
    if (!encode) {
        throw new Error("Cannot find encode function for dataType " + dataTypeAsString);
    }
    return encode;
}
function get_decoder(dataType) {
    const dataTypeAsString = DataType_enum_1.DataType[dataType];
    const decode = (0, node_opcua_factory_1.findBuiltInType)(dataTypeAsString).decode;
    /* istanbul ignore next */
    if (!decode) {
        throw new Error("Variant.decode : cannot find decoder for type " + dataTypeAsString);
    }
    return decode;
}
const displayWarning = true;
function convertTo(dataType, arrayTypeConstructor, value) {
    // istanbul ignore next
    if (value === undefined || value === null) {
        return null;
    }
    if (arrayTypeConstructor && value instanceof arrayTypeConstructor) {
        const newArray = new value.constructor(value.length); // deep copy
        /* istanbul ignore if */
        if (newArray instanceof Buffer) {
            // required for nodejs 4.x
            value.copy(newArray);
        }
        else {
            newArray.set(value);
        }
        return newArray;
    }
    const coerceFunc = coerceVariantType.bind(null, dataType);
    const n = value.length;
    const newArr = arrayTypeConstructor ? new arrayTypeConstructor(n) : new Array(n);
    for (let i = 0; i < n; i++) {
        newArr[i] = coerceFunc(value[i]);
    }
    // istanbul ignore next
    if (arrayTypeConstructor && displayWarning && n > 10) {
        warningLog("Warning ! an array containing  " + DataType_enum_1.DataType[dataType] + " elements has been provided as a generic array. ");
        warningLog("          This is inefficient as every array value will " + "have to be coerced and verified against the expected type");
        warningLog("          It is highly recommended that you use a " + " typed array ", arrayTypeConstructor.constructor.name, " instead");
    }
    return newArr;
}
const typedArrayHelpers = {};
function _getHelper(dataType) {
    return typedArrayHelpers[DataType_enum_1.DataType[dataType]];
}
function coerceVariantArray(dataType, value) {
    const helper = _getHelper(dataType);
    if (helper) {
        return helper.coerce(value);
    }
    else {
        return convertTo(dataType, null, value);
    }
}
function encodeTypedArray(arrayTypeConstructor, stream, value) {
    (0, node_opcua_assert_1.assert)(value instanceof arrayTypeConstructor);
    (0, node_opcua_assert_1.assert)(value.buffer instanceof ArrayBuffer);
    (0, node_opcua_basic_types_1.encodeUInt32)(value.length, stream);
    stream.writeArrayBuffer(value.buffer, value.byteOffset, value.byteLength);
}
function encodeGeneralArray(dataType, stream, value) {
    if (!value) {
        (0, node_opcua_assert_1.assert)(value === null);
        (0, node_opcua_basic_types_1.encodeUInt32)(0xffffffff, stream);
        return;
    }
    (0, node_opcua_basic_types_1.encodeUInt32)(value.length, stream);
    const encode = get_encoder(dataType);
    for (const e of value) {
        encode(e, stream);
    }
}
function encodeVariantArray(dataType, stream, value) {
    if (value && value.buffer) {
        return _getHelper(dataType).encode(stream, value);
    }
    return encodeGeneralArray(dataType, stream, value);
}
function decodeTypedArray(arrayTypeConstructor, stream) {
    const length = (0, node_opcua_basic_types_1.decodeUInt32)(stream);
    /* istanbul ignore next */
    if (length === 0xffffffff) {
        return null;
    }
    if (length > Variant.maxTypedArrayLength) {
        throw new Error(`maxTypedArrayLength(${Variant.maxTypedArrayLength}) has been exceeded in Variant.decodeArray (typed Array) len=${length}`);
    }
    const byteLength = length * arrayTypeConstructor.BYTES_PER_ELEMENT;
    const arr = stream.readArrayBuffer(byteLength);
    const value = new arrayTypeConstructor(arr.buffer);
    (0, node_opcua_assert_1.assert)(value.length === length);
    return value;
}
function decodeGeneralArray(dataType, stream) {
    const length = (0, node_opcua_basic_types_1.decodeUInt32)(stream);
    /* istanbul ignore next */
    if (length === 0xffffffff) {
        return null;
    }
    if (length > Variant.maxArrayLength) {
        throw new Error(`maxArrayLength(${Variant.maxArrayLength}) has been exceeded in Variant.decodeArray len=${length}`);
    }
    const decode = get_decoder(dataType);
    const arr = [];
    for (let i = 0; i < length; i++) {
        arr.push(decode(stream));
    }
    return arr;
}
function decodeVariantArray(dataType, stream) {
    const helper = _getHelper(dataType);
    if (helper) {
        return helper.decode(stream);
    }
    else {
        return decodeGeneralArray(dataType, stream);
    }
}
function _declareTypeArrayHelper(dataType, typedArrayConstructor) {
    typedArrayHelpers[DataType_enum_1.DataType[dataType]] = {
        coerce: convertTo.bind(null, dataType, typedArrayConstructor),
        decode: decodeTypedArray.bind(null, typedArrayConstructor),
        encode: encodeTypedArray.bind(null, typedArrayConstructor)
    };
}
_declareTypeArrayHelper(DataType_enum_1.DataType.Float, Float32Array);
_declareTypeArrayHelper(DataType_enum_1.DataType.Double, Float64Array);
_declareTypeArrayHelper(DataType_enum_1.DataType.SByte, Int8Array);
_declareTypeArrayHelper(DataType_enum_1.DataType.Byte, Uint8Array);
_declareTypeArrayHelper(DataType_enum_1.DataType.Int16, Int16Array);
_declareTypeArrayHelper(DataType_enum_1.DataType.Int32, Int32Array);
_declareTypeArrayHelper(DataType_enum_1.DataType.UInt16, Uint16Array);
_declareTypeArrayHelper(DataType_enum_1.DataType.UInt32, Uint32Array);
function _decodeVariantArrayDebug(stream, decode, tracer, dataType) {
    let cursorBefore = stream.length;
    const length = (0, node_opcua_basic_types_1.decodeUInt32)(stream);
    let i;
    let element;
    tracer.trace("start_array", "Variant", -1, cursorBefore, stream.length);
    if (length === 0xffffffff) {
        // empty array
        tracer.trace("end_array", "Variant", stream.length);
        return;
    }
    const n1 = Math.min(10, length);
    // display a maximum of 10 elements
    for (i = 0; i < n1; i++) {
        tracer.trace("start_element", "", i);
        cursorBefore = stream.length;
        element = decode(stream);
        // arr.push(element);
        tracer.trace("member", "Variant", element, cursorBefore, stream.length, DataType_enum_1.DataType[dataType]);
        tracer.trace("end_element", "", i);
    }
    // keep reading
    if (length >= n1) {
        for (i = n1; i < length; i++) {
            decode(stream);
        }
        tracer.trace("start_element", "", n1);
        tracer.trace("member", "Variant", "...", cursorBefore, stream.length, DataType_enum_1.DataType[dataType]);
        tracer.trace("end_element", "", n1);
    }
    tracer.trace("end_array", "Variant", stream.length);
}
function decodeDimension(stream) {
    return decodeGeneralArray(DataType_enum_1.DataType.UInt32, stream);
}
function encodeDimension(dimensions, stream) {
    return encodeGeneralArray(DataType_enum_1.DataType.UInt32, stream, dimensions);
}
function isEnumerationItem(value) {
    return (value instanceof Object &&
        Object.prototype.hasOwnProperty.call(value, "value") &&
        Object.prototype.hasOwnProperty.call(value, "key") &&
        value.constructor.name === "EnumValueType");
}
function coerceVariantType(dataType, value) {
    /* eslint max-statements: ["error",1000], complexity: ["error",1000]*/
    if (value === undefined) {
        value = null;
    }
    if (isEnumerationItem(value)) {
        // OPCUA Specification 1.0.3 5.8.2 encoding rules for various dataType:
        // [...]Enumeration are always encoded as Int32 on the wire [...]
        /* istanbul ignore next */
        if (dataType !== DataType_enum_1.DataType.Int32 && dataType !== DataType_enum_1.DataType.ExtensionObject) {
            throw new Error("expecting DataType.Int32 for enumeration values ;" + " got DataType." + dataType.toString() + " instead");
        }
    }
    switch (dataType) {
        case DataType_enum_1.DataType.Null:
            value = null;
            break;
        case DataType_enum_1.DataType.LocalizedText:
            if (!value || !value.schema || value.schema !== node_opcua_data_model_1.LocalizedText.schema) {
                value = new node_opcua_data_model_1.LocalizedText(value);
            }
            break;
        case DataType_enum_1.DataType.QualifiedName:
            if (!value || !value.schema || value.schema !== node_opcua_data_model_1.QualifiedName.schema) {
                value = new node_opcua_data_model_1.QualifiedName(value);
            }
            break;
        case DataType_enum_1.DataType.Int32:
        case DataType_enum_1.DataType.Int16:
        case DataType_enum_1.DataType.UInt32:
        case DataType_enum_1.DataType.UInt16:
            (0, node_opcua_assert_1.assert)(value !== undefined);
            value = parseInt(value, 10);
            /* istanbul ignore next */
            if (!isFinite(value)) {
                throw new Error("expecting a number " + value);
            }
            break;
        case DataType_enum_1.DataType.UInt64:
            value = (0, node_opcua_basic_types_1.coerceUInt64)(value);
            break;
        case DataType_enum_1.DataType.Int64:
            value = (0, node_opcua_basic_types_1.coerceInt64)(value);
            break;
        case DataType_enum_1.DataType.ExtensionObject:
            break;
        case DataType_enum_1.DataType.DateTime:
            (0, node_opcua_assert_1.assert)(value === null || !!value.getTime);
            break;
        case DataType_enum_1.DataType.String:
            (0, node_opcua_assert_1.assert)(typeof value === "string" || value === null);
            break;
        case DataType_enum_1.DataType.ByteString:
            value = typeof value === "string" ? Buffer.from(value) : value;
            // istanbul ignore next
            if (!(value === null || value instanceof Buffer)) {
                throw new Error("ByteString should be null or a Buffer");
            }
            (0, node_opcua_assert_1.assert)(value === null || value instanceof Buffer);
            break;
        default:
            (0, node_opcua_assert_1.assert)(dataType !== undefined && dataType !== null, "Invalid DataType");
            break;
        case DataType_enum_1.DataType.NodeId:
            break;
    }
    return value;
}
function isValidScalarVariant(dataType, value) {
    (0, node_opcua_assert_1.assert)(value === null ||
        DataType_enum_1.DataType.Int64 === dataType ||
        DataType_enum_1.DataType.ByteString === dataType ||
        DataType_enum_1.DataType.UInt64 === dataType ||
        !(value instanceof Array));
    (0, node_opcua_assert_1.assert)(value === null || !(value instanceof Int32Array));
    (0, node_opcua_assert_1.assert)(value === null || !(value instanceof Uint32Array));
    switch (dataType) {
        case DataType_enum_1.DataType.NodeId:
            return (0, node_opcua_basic_types_1.isValidNodeId)(value);
        case DataType_enum_1.DataType.String:
            return typeof value === "string" || (0, node_opcua_utils_1.isNullOrUndefined)(value);
        case DataType_enum_1.DataType.Int64:
            return (0, node_opcua_basic_types_1.isValidInt64)(value);
        case DataType_enum_1.DataType.UInt64:
            return (0, node_opcua_basic_types_1.isValidUInt64)(value);
        case DataType_enum_1.DataType.UInt32:
            return (0, node_opcua_basic_types_1.isValidUInt32)(value);
        case DataType_enum_1.DataType.Int32:
            return (0, node_opcua_basic_types_1.isValidInt32)(value);
        case DataType_enum_1.DataType.UInt16:
            return (0, node_opcua_basic_types_1.isValidUInt16)(value);
        case DataType_enum_1.DataType.Int16:
            return (0, node_opcua_basic_types_1.isValidInt16)(value);
        case DataType_enum_1.DataType.Byte:
            return (0, node_opcua_basic_types_1.isValidUInt8)(value);
        case DataType_enum_1.DataType.SByte:
            return (0, node_opcua_basic_types_1.isValidInt8)(value);
        case DataType_enum_1.DataType.Boolean:
            return (0, node_opcua_basic_types_1.isValidBoolean)(value);
        case DataType_enum_1.DataType.ByteString:
            return (0, node_opcua_basic_types_1.isValidByteString)(value);
        default:
            return true;
    }
}
function isValidArrayVariant(dataType, value) {
    if (value === null) {
        return true;
    }
    if (dataType === DataType_enum_1.DataType.Float && value instanceof Float32Array) {
        return true;
    }
    else if (dataType === DataType_enum_1.DataType.Double && value instanceof Float64Array) {
        return true;
    }
    else if (dataType === DataType_enum_1.DataType.SByte && value instanceof Int8Array) {
        return true;
    }
    else if (dataType === DataType_enum_1.DataType.Byte && (value instanceof Buffer || value instanceof Uint8Array)) {
        return true;
    }
    else if (dataType === DataType_enum_1.DataType.Int16 && value instanceof Int16Array) {
        return true;
    }
    else if (dataType === DataType_enum_1.DataType.Int32 && value instanceof Int32Array) {
        return true;
    }
    else if (dataType === DataType_enum_1.DataType.UInt16 && value instanceof Uint16Array) {
        return true;
    }
    else if (dataType === DataType_enum_1.DataType.UInt32 && value instanceof Uint32Array) {
        return true;
    }
    // array values can be store in Buffer, Float32Array
    (0, node_opcua_assert_1.assert)(Array.isArray(value));
    for (const valueItem of value) {
        if (!isValidScalarVariant(dataType, valueItem)) {
            return false;
        }
    }
    return true;
}
/*istanbul ignore next*/
function isValidMatrixVariant(dataType, value, dimensions) {
    if (!dimensions) {
        return false;
    }
    if (!isValidArrayVariant(dataType, value)) {
        return false;
    }
    return true;
}
function isValidVariant(arrayType, dataType, value, dimensions) {
    switch (arrayType) {
        case VariantArrayType_enum_1.VariantArrayType.Scalar:
            return isValidScalarVariant(dataType, value);
        case VariantArrayType_enum_1.VariantArrayType.Array:
            return isValidArrayVariant(dataType, value);
        default:
            (0, node_opcua_assert_1.assert)(arrayType === VariantArrayType_enum_1.VariantArrayType.Matrix);
            return isValidMatrixVariant(dataType, value, dimensions);
    }
}
function buildVariantArray(dataType, nbElements, defaultValue) {
    let value;
    switch (dataType) {
        case DataType_enum_1.DataType.Float:
            value = new Float32Array(nbElements);
            break;
        case DataType_enum_1.DataType.Double:
            value = new Float64Array(nbElements);
            break;
        case DataType_enum_1.DataType.UInt32:
            value = new Uint32Array(nbElements);
            break;
        case DataType_enum_1.DataType.Int32:
            value = new Int32Array(nbElements);
            break;
        case DataType_enum_1.DataType.UInt16:
            value = new Uint16Array(nbElements);
            break;
        case DataType_enum_1.DataType.Int16:
            value = new Int16Array(nbElements);
            break;
        case DataType_enum_1.DataType.Byte:
            value = new Uint8Array(nbElements);
            break;
        case DataType_enum_1.DataType.SByte:
            value = new Int8Array(nbElements);
            break;
        default:
            value = new Array(nbElements);
    }
    if (defaultValue !== undefined) {
        for (let i = 0; i < nbElements; i++) {
            value[i] = defaultValue;
        }
    }
    return value;
}
// old version of nodejs do not provide a Buffer#equals test
const oldNodeVersion = typeof process === "object" && process.versions && process.versions.node && process.versions.node.substring(0, 1) === "0";
function __type(a) {
    return Object.prototype.toString.call(a);
}
function __check_same_object(o1, o2) {
    if (o1 === o2)
        return true;
    if ((!o1 && o2) || (!o2 && o1))
        return false;
    const t1 = __type(o1);
    const t2 = __type(o2);
    if (t1 !== t2)
        return false;
    switch (t1) {
        case "[object Array]":
            return __check_same_array(o1, o2);
        case "[object Object]": {
            if (o1.constructor?.name !== o2.constructor?.name) {
                return false;
            }
            const keys1 = Object.keys(o1);
            const keys2 = Object.keys(o2);
            // istanbul ignore next
            if (keys1.length !== keys2.length) {
                return false;
            }
            for (const k of Object.keys(o1)) {
                if (!__check_same_object(o1[k], o2[k])) {
                    return false;
                }
            }
            return true;
        }
        case "[object BigInt64Array]":
        case "[object BigUint64Array]":
        case "[object Uint8ClampedArray]":
        case "[object Float32Array]":
        case "[object Float64Array]":
        case "[object Int32Array]":
        case "[object Int16Array]":
        case "[object Int8Array]":
        case "[object Uint32Array]":
        case "[object Uint16Array]":
        case "[object Uint8Array]": {
            const b1 = Buffer.from(o1.buffer, o1.byteOffset, o1.byteLength);
            const b2 = Buffer.from(o2.buffer, o2.byteOffset, o2.byteLength);
            return b1.equals(b2);
        }
        case "[object BigInt]":
            return o1 === o2;
        case "[object Date]":
            return o1.getTime() == o2.getTime();
        default:
            return o1 === o2;
    }
}
function __check_same_array(arr1, arr2) {
    if (!arr1 || !arr2) {
        return !arr1 && !arr2;
    }
    if (arr1.length !== arr2.length) {
        return false;
    }
    if (arr1.length === 0 && 0 === arr2.length) {
        return true;
    }
    if (!oldNodeVersion && arr1.buffer) {
        // v1 and v2 are TypedArray (such as Int32Array...)
        // this is the most efficient way to compare 2 buffers but it doesn't work with node <= 0.12
        (0, node_opcua_assert_1.assert)(arr2.buffer && __type(arr2.buffer) === "[object ArrayBuffer]");
        // compare byte by byte
        const b1 = Buffer.from(arr1.buffer, arr1.byteOffset, arr1.byteLength);
        const b2 = Buffer.from(arr2.buffer, arr2.byteOffset, arr2.byteLength);
        return b1.equals(b2);
    }
    const n = arr1.length;
    for (let i = 0; i < n; i++) {
        if (!__check_same_object(arr1[i], arr2[i])) {
            return false;
        }
    }
    return true;
}
/***
 *  returns true if the two variant represent the same value
 * @param v1 the first variant to compare
 * @param v2  the variant to compare with
 */
function sameVariant(v1, v2) {
    if (v1 === v2) {
        return true;
    }
    if ((!v1 && v2) || (v1 && !v2)) {
        return false;
    }
    if (v1.arrayType !== v2.arrayType) {
        return false;
    }
    if (v1.dataType !== v2.dataType) {
        return false;
    }
    if (v1.value === v2.value) {
        return true;
    }
    if (v1.arrayType === VariantArrayType_enum_1.VariantArrayType.Scalar) {
        if (v1.dataType === DataType_enum_1.DataType.ExtensionObject) {
            // compare two extension objects
            return __check_same_object(v1.value, v2.value);
        }
        if (Array.isArray(v1.value) && Array.isArray(v2.value)) {
            return __check_same_array(v1.value, v2.value);
        }
        if (Buffer.isBuffer(v1.value) && Buffer.isBuffer(v2.value)) {
            return v1.value.equals(v2.value);
        }
    }
    if (v1.arrayType === VariantArrayType_enum_1.VariantArrayType.Array) {
        return __check_same_array(v1.value, v2.value);
    }
    else if (v1.arrayType === VariantArrayType_enum_1.VariantArrayType.Matrix) {
        if (!__check_same_array(v1.dimensions, v2.dimensions)) {
            return false;
        }
        return __check_same_array(v1.value, v2.value);
    }
    return false;
}
// ---------------------------------------------------------------------------------------------------------
(0, node_opcua_factory_1.registerSpecialVariantEncoder)(Variant);
(0, node_opcua_factory_1.registerType)({
    name: "Variant",
    subType: "",
    coerce: _coerceVariant,
    encode: encodeVariant,
    decode: decodeVariant
});
//# sourceMappingURL=variant.js.map