"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataValueT = exports.DataValue = void 0;
exports.encodeDataValue = encodeDataValue;
exports.decodeDataValue = decodeDataValue;
exports.apply_timestamps = apply_timestamps;
exports.apply_timestamps_no_copy = apply_timestamps_no_copy;
exports.extractRange = extractRange;
exports.sourceTimestampHasChanged = sourceTimestampHasChanged;
exports.serverTimestampHasChanged = serverTimestampHasChanged;
exports.timestampHasChanged = timestampHasChanged;
exports.sameStatusCode = sameStatusCode;
exports.sameDataValue = sameDataValue;
/**
 * @module node-opcua-data-value
 */
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_date_time_1 = require("node-opcua-date-time");
const node_opcua_factory_1 = require("node-opcua-factory");
const node_opcua_status_code_1 = require("node-opcua-status-code");
const node_opcua_variant_1 = require("node-opcua-variant");
const node_opcua_basic_types_1 = require("node-opcua-basic-types");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_data_model_1 = require("node-opcua-data-model");
const DataValueEncodingByte_enum_1 = require("./DataValueEncodingByte_enum");
const TimestampsToReturn_enum_1 = require("./TimestampsToReturn_enum");
const errorLog = (0, node_opcua_debug_1.make_errorLog)(__filename);
// tslint:disable:no-bitwise
function getDataValue_EncodingByte(dataValue) {
    let encodingMask = 0;
    if (dataValue.value && dataValue.value.dataType !== node_opcua_variant_1.DataType.Null) {
        encodingMask |= DataValueEncodingByte_enum_1.DataValueEncodingByte.Value;
    }
    //  if (dataValue.statusCode !== null ) {
    if (dataValue.statusCode !== null && typeof dataValue.statusCode === "object" && dataValue.statusCode.value !== 0) {
        encodingMask |= DataValueEncodingByte_enum_1.DataValueEncodingByte.StatusCode;
    }
    if (dataValue.sourceTimestamp && dataValue.sourceTimestamp !== "null") {
        encodingMask |= DataValueEncodingByte_enum_1.DataValueEncodingByte.SourceTimestamp;
    }
    // the number of picoseconds that can be encoded are
    // 100 nano * 10000;
    // above this the value contains the excess in pico second to make the sourceTimestamp more accurate
    if (dataValue.sourcePicoseconds ? dataValue.sourcePicoseconds % 100000 : false) {
        encodingMask |= DataValueEncodingByte_enum_1.DataValueEncodingByte.SourcePicoseconds;
    }
    if (dataValue.serverTimestamp && dataValue.serverTimestamp !== "null") {
        encodingMask |= DataValueEncodingByte_enum_1.DataValueEncodingByte.ServerTimestamp;
    }
    if (dataValue.serverPicoseconds ? dataValue.serverPicoseconds % 100000 : false) {
        encodingMask |= DataValueEncodingByte_enum_1.DataValueEncodingByte.ServerPicoseconds;
    }
    return encodingMask;
}
/**
 * @internal
 * @param dataValue
 * @param stream
 */
function encodeDataValue(dataValue, stream) {
    const encodingMask = getDataValue_EncodingByte(dataValue);
    (0, node_opcua_assert_1.assert)(isFinite(encodingMask) && encodingMask >= 0 && encodingMask <= 0x3f);
    // write encoding byte
    (0, node_opcua_basic_types_1.encodeUInt8)(encodingMask, stream);
    // write value as Variant
    if (encodingMask & DataValueEncodingByte_enum_1.DataValueEncodingByte.Value) {
        if (!dataValue.value) {
            dataValue.value = new node_opcua_variant_1.Variant();
        }
        // istanbul ignore next
        if (!dataValue.value.encode) {
            errorLog(" CANNOT FIND ENCODE METHOD ON VARIANT !!! HELP", JSON.stringify(dataValue, null, " "));
        }
        dataValue.value.encode(stream);
    }
    // write statusCode
    if (encodingMask & DataValueEncodingByte_enum_1.DataValueEncodingByte.StatusCode) {
        (0, node_opcua_basic_types_1.encodeStatusCode)(dataValue.statusCode, stream);
    }
    // write sourceTimestamp
    if (encodingMask & DataValueEncodingByte_enum_1.DataValueEncodingByte.SourceTimestamp && dataValue.sourceTimestamp !== null) {
        (0, node_opcua_basic_types_1.encodeHighAccuracyDateTime)(dataValue.sourceTimestamp, dataValue.sourcePicoseconds, stream);
    }
    // write sourcePicoseconds
    if (encodingMask & DataValueEncodingByte_enum_1.DataValueEncodingByte.SourcePicoseconds) {
        (0, node_opcua_assert_1.assert)(dataValue.sourcePicoseconds !== null);
        const sourcePicoseconds = Math.floor((dataValue.sourcePicoseconds % 100000) / 10);
        (0, node_opcua_basic_types_1.encodeUInt16)(sourcePicoseconds, stream);
    }
    // write serverTimestamp
    if (encodingMask & DataValueEncodingByte_enum_1.DataValueEncodingByte.ServerTimestamp && dataValue.serverTimestamp !== null) {
        (0, node_opcua_basic_types_1.encodeHighAccuracyDateTime)(dataValue.serverTimestamp, dataValue.serverPicoseconds, stream);
    }
    // write serverPicoseconds
    if (encodingMask & DataValueEncodingByte_enum_1.DataValueEncodingByte.ServerPicoseconds) {
        (0, node_opcua_assert_1.assert)(dataValue.serverPicoseconds !== null);
        const serverPicoseconds = Math.floor((dataValue.serverPicoseconds % 100000) / 10); // we encode 10-picoseconds
        (0, node_opcua_basic_types_1.encodeUInt16)(serverPicoseconds, stream);
    }
}
function decodeDebugDataValue(dataValue, stream, options) {
    const tracer = options.tracer;
    let cur = stream.length;
    const encodingMask = (0, node_opcua_basic_types_1.decodeUInt8)(stream);
    (0, node_opcua_assert_1.assert)(encodingMask <= 0x3f);
    tracer.trace("member", "encodingByte", "0x" + encodingMask.toString(16), cur, stream.length, "Mask");
    tracer.encoding_byte(encodingMask, DataValueEncodingByte_enum_1.DataValueEncodingByte, cur, stream.length);
    if (encodingMask & DataValueEncodingByte_enum_1.DataValueEncodingByte.Value) {
        dataValue.value = new node_opcua_variant_1.Variant();
        dataValue.value.decodeDebug(stream, options);
    }
    // read statusCode
    cur = stream.length;
    if (encodingMask & DataValueEncodingByte_enum_1.DataValueEncodingByte.StatusCode) {
        dataValue.statusCode = (0, node_opcua_basic_types_1.decodeStatusCode)(stream);
        tracer.trace("member", "statusCode", dataValue.statusCode, cur, stream.length, "StatusCode");
    }
    // read sourceTimestamp
    cur = stream.length;
    if (encodingMask & DataValueEncodingByte_enum_1.DataValueEncodingByte.SourceTimestamp) {
        const [d, picoseconds] = (0, node_opcua_basic_types_1.decodeHighAccuracyDateTime)(stream);
        dataValue.sourceTimestamp = d;
        dataValue.sourcePicoseconds = picoseconds | 0;
        tracer.trace("member", "sourceTimestamp", dataValue.sourceTimestamp, cur, stream.length, "DateTime");
    }
    // read sourcePicoseconds
    cur = stream.length;
    dataValue.sourcePicoseconds = 0;
    if (encodingMask & DataValueEncodingByte_enum_1.DataValueEncodingByte.SourcePicoseconds) {
        const tenPico = (0, node_opcua_basic_types_1.decodeUInt16)(stream);
        dataValue.sourcePicoseconds += tenPico * 10;
        tracer.trace("member", "sourcePicoseconds", dataValue.sourcePicoseconds, cur, stream.length, "UInt16");
    }
    // read serverTimestamp
    cur = stream.length;
    dataValue.serverPicoseconds = 0;
    if (encodingMask & DataValueEncodingByte_enum_1.DataValueEncodingByte.ServerTimestamp) {
        const [d, picoseconds] = (0, node_opcua_basic_types_1.decodeHighAccuracyDateTime)(stream);
        dataValue.serverTimestamp = d;
        dataValue.serverPicoseconds = picoseconds | 0;
        tracer.trace("member", "serverTimestamp", dataValue.serverTimestamp, cur, stream.length, "DateTime");
    }
    // read serverPicoseconds
    cur = stream.length;
    if (encodingMask & DataValueEncodingByte_enum_1.DataValueEncodingByte.ServerPicoseconds) {
        const tenPico = (0, node_opcua_basic_types_1.decodeUInt16)(stream);
        dataValue.serverPicoseconds += tenPico * 10;
        tracer.trace("member", "serverPicoseconds", dataValue.serverPicoseconds, cur, stream.length, "UInt16");
    }
}
function decodeDataValueInternal(dataValue, stream) {
    const encodingMask = (0, node_opcua_basic_types_1.decodeUInt8)(stream);
    if (encodingMask & DataValueEncodingByte_enum_1.DataValueEncodingByte.Value) {
        dataValue.value = new node_opcua_variant_1.Variant();
        dataValue.value.decode(stream);
    }
    // read statusCode
    if (encodingMask & DataValueEncodingByte_enum_1.DataValueEncodingByte.StatusCode) {
        dataValue.statusCode = (0, node_opcua_basic_types_1.decodeStatusCode)(stream);
    }
    else {
        dataValue.statusCode = node_opcua_status_code_1.StatusCodes.Good;
    }
    dataValue.sourcePicoseconds = 0;
    // read sourceTimestamp
    if (encodingMask & DataValueEncodingByte_enum_1.DataValueEncodingByte.SourceTimestamp) {
        const [d, picoseconds] = (0, node_opcua_basic_types_1.decodeHighAccuracyDateTime)(stream);
        dataValue.sourceTimestamp = d;
        dataValue.sourcePicoseconds += picoseconds | 0;
    }
    // read sourcePicoseconds
    if (encodingMask & DataValueEncodingByte_enum_1.DataValueEncodingByte.SourcePicoseconds) {
        dataValue.sourcePicoseconds += (0, node_opcua_basic_types_1.decodeUInt16)(stream) * 10;
    }
    // read serverTimestamp
    dataValue.serverPicoseconds = 0;
    if (encodingMask & DataValueEncodingByte_enum_1.DataValueEncodingByte.ServerTimestamp) {
        const [d, picoseconds] = (0, node_opcua_basic_types_1.decodeHighAccuracyDateTime)(stream);
        dataValue.serverTimestamp = d;
        dataValue.serverPicoseconds += picoseconds | 0;
    }
    // read serverPicoseconds
    if (encodingMask & DataValueEncodingByte_enum_1.DataValueEncodingByte.ServerPicoseconds) {
        dataValue.serverPicoseconds += (0, node_opcua_basic_types_1.decodeUInt16)(stream) * 10;
    }
}
function decodeDataValue(stream, dataValue) {
    dataValue = dataValue || new DataValue();
    decodeDataValueInternal(dataValue, stream);
    return dataValue;
}
function isValidDataValue(self) {
    if (self.value !== null && typeof self.value === "object") {
        (0, node_opcua_assert_1.assert)(self.value);
        return self.value.isValid();
    }
    else {
        (0, node_opcua_assert_1.assert)(!self.value);
        // in this case StatusCode shall not be Good
        (0, node_opcua_assert_1.assert)(self.statusCode.isNotGood());
    }
    return true;
}
// OPC-UA part 4 -  $7.7
const schemaDataValue = (0, node_opcua_factory_1.buildStructuredType)({
    baseType: "BaseUAObject",
    name: "DataValue",
    category: node_opcua_factory_1.FieldCategory.basic,
    fields: [
        { name: "Value", fieldType: "Variant", defaultValue: null },
        { name: "StatusCode", fieldType: "StatusCode", defaultValue: node_opcua_status_code_1.StatusCodes.Good },
        { name: "SourceTimestamp", fieldType: "DateTime", defaultValue: null },
        { name: "SourcePicoseconds", fieldType: "UInt16", defaultValue: 0 },
        { name: "ServerTimestamp", fieldType: "DateTime", defaultValue: null },
        { name: "ServerPicoseconds", fieldType: "UInt16", defaultValue: 0 }
    ]
});
function toMicroNanoPico(picoseconds) {
    return "" + w((picoseconds / 1000000) >> 0) + "." + w(((picoseconds % 1000000) / 1000) >> 0) + "." + w(picoseconds % 1000 >> 0);
    //    + " (" + picoseconds+ ")";
}
function d(timestamp, picoseconds) {
    return timestamp ? timestamp.toISOString() + " $ " + toMicroNanoPico(picoseconds) : "null"; // + "  " + (this.serverTimestamp ? this.serverTimestamp.getTime() :"-");
}
const emptyObject = {};
class DataValue extends node_opcua_factory_1.BaseUAObject {
    /**
     *
     */
    constructor(options) {
        super();
        if (options === null) {
            this.statusCode = node_opcua_status_code_1.StatusCodes.Bad;
            this.sourceTimestamp = null;
            this.sourcePicoseconds = 0;
            this.serverTimestamp = null;
            this.serverPicoseconds = 0;
            this.value = new node_opcua_variant_1.Variant(null);
            return;
        }
        options = options || emptyObject;
        /* istanbul ignore next */
        if (node_opcua_factory_1.parameters.debugSchemaHelper) {
            const schema = schemaDataValue;
            (0, node_opcua_factory_1.check_options_correctness_against_schema)(this, schema, options);
        }
        if (options.value === undefined || options.value === null) {
            this.value = new node_opcua_variant_1.Variant({ dataType: node_opcua_variant_1.DataType.Null });
        }
        else {
            this.value = options.value ? new node_opcua_variant_1.Variant(options.value) : new node_opcua_variant_1.Variant({ dataType: node_opcua_variant_1.DataType.Null });
        }
        this.statusCode = (0, node_opcua_status_code_1.coerceStatusCode)(options.statusCode || node_opcua_status_code_1.StatusCodes.Good);
        this.sourceTimestamp = options.sourceTimestamp ? (0, node_opcua_date_time_1.coerceDateTime)(options.sourceTimestamp) : null;
        this.sourcePicoseconds = options.sourcePicoseconds || 0;
        this.serverTimestamp = options.serverTimestamp ? (0, node_opcua_date_time_1.coerceDateTime)(options.serverTimestamp) : null;
        this.serverPicoseconds = options.serverPicoseconds || 0;
    }
    encode(stream) {
        encodeDataValue(this, stream);
    }
    decode(stream) {
        decodeDataValueInternal(this, stream);
    }
    decodeDebug(stream, options) {
        decodeDebugDataValue(this, stream, options);
    }
    isValid() {
        return isValidDataValue(this);
    }
    toString() {
        let str = "{ /* DataValue */";
        if (this.value) {
            str += "\n" + "   value: " + node_opcua_variant_1.Variant.prototype.toString.apply(this.value); // this.value.toString();
        }
        else {
            str += "\n" + "   value:            <null>";
        }
        str += "\n" + "   statusCode:      " + (this.statusCode ? this.statusCode.toString() : "null");
        str += "\n" + "   serverTimestamp: " + d(this.serverTimestamp, this.serverPicoseconds);
        str += "\n" + "   sourceTimestamp: " + d(this.sourceTimestamp, this.sourcePicoseconds);
        str += "\n" + "}";
        return str;
    }
    clone() {
        return new DataValue({
            serverPicoseconds: this.serverPicoseconds,
            serverTimestamp: this.serverTimestamp,
            sourcePicoseconds: this.sourcePicoseconds,
            sourceTimestamp: this.sourceTimestamp,
            statusCode: this.statusCode,
            value: this.value ? this.value.clone() : undefined
        });
    }
}
exports.DataValue = DataValue;
/**
 * @internal
 */
DataValue.possibleFields = [
    "value",
    "statusCode",
    "sourceTimestamp",
    "sourcePicoseconds",
    "serverTimestamp",
    "serverPicoseconds"
];
/**
 * @internal
 */
DataValue.schema = schemaDataValue;
DataValue.prototype.schema = DataValue.schema;
(0, node_opcua_factory_1.registerSpecialVariantEncoder)(DataValue);
function w(n) {
    return n.toString().padStart(3, "0");
}
function _partial_clone(dataValue) {
    const cloneDataValue = new DataValue({ value: undefined });
    cloneDataValue.value = dataValue.value;
    cloneDataValue.statusCode = dataValue.statusCode;
    return cloneDataValue;
}
/**
 * apply the provided timestampsToReturn flag to the dataValue and return a cloned dataValue
 * with the specified timestamps.
 * @param dataValue
 * @param timestampsToReturn
 * @param attributeId
 * @returns
 */
function apply_timestamps(dataValue, timestampsToReturn, attributeId) {
    let cloneDataValue = null;
    let now = null;
    // apply timestamps
    switch (timestampsToReturn) {
        case TimestampsToReturn_enum_1.TimestampsToReturn.Neither:
            cloneDataValue = cloneDataValue || _partial_clone(dataValue);
            break;
        case TimestampsToReturn_enum_1.TimestampsToReturn.Server:
            cloneDataValue = cloneDataValue || _partial_clone(dataValue);
            cloneDataValue.serverTimestamp = dataValue.serverTimestamp;
            cloneDataValue.serverPicoseconds = dataValue.serverPicoseconds;
            if (!cloneDataValue.serverTimestamp) {
                now = now || (0, node_opcua_date_time_1.getCurrentClock)();
                cloneDataValue.serverTimestamp = now.timestamp;
                cloneDataValue.serverPicoseconds = now.picoseconds;
            }
            break;
        case TimestampsToReturn_enum_1.TimestampsToReturn.Source:
            cloneDataValue = cloneDataValue || _partial_clone(dataValue);
            cloneDataValue.sourceTimestamp = dataValue.sourceTimestamp;
            cloneDataValue.sourcePicoseconds = dataValue.sourcePicoseconds;
            break;
        case TimestampsToReturn_enum_1.TimestampsToReturn.Both:
        default:
            (0, node_opcua_assert_1.assert)(timestampsToReturn === TimestampsToReturn_enum_1.TimestampsToReturn.Both);
            cloneDataValue = cloneDataValue || _partial_clone(dataValue);
            cloneDataValue.serverTimestamp = dataValue.serverTimestamp;
            cloneDataValue.serverPicoseconds = dataValue.serverPicoseconds;
            if (!dataValue.serverTimestamp) {
                now = now || (0, node_opcua_date_time_1.getCurrentClock)();
                cloneDataValue.serverTimestamp = now.timestamp;
                cloneDataValue.serverPicoseconds = now.picoseconds;
            }
            cloneDataValue.sourceTimestamp = dataValue.sourceTimestamp;
            cloneDataValue.sourcePicoseconds = dataValue.sourcePicoseconds;
            break;
    }
    // unset sourceTimestamp unless AttributeId is Value
    if (attributeId !== node_opcua_data_model_1.AttributeIds.Value) {
        cloneDataValue.sourceTimestamp = null;
    }
    return cloneDataValue;
}
/**
 *
 * @param dataValue a DataValue
 * @param timestampsToReturn  a TimestampsToReturn flag to determine which timestamp should be kept
 * @param attributeId if attributeId is not Value, sourceTimestamp will forcefully be set to null
 * @param now an optional current clock to be used to set the serverTimestamp
 * @returns
 */
function apply_timestamps_no_copy(dataValue, timestampsToReturn, attributeId, now) {
    switch (timestampsToReturn) {
        case TimestampsToReturn_enum_1.TimestampsToReturn.Neither:
            dataValue.sourceTimestamp = null;
            dataValue.sourcePicoseconds = 0;
            dataValue.serverTimestamp = null;
            dataValue.serverPicoseconds = 0;
            break;
        case TimestampsToReturn_enum_1.TimestampsToReturn.Server:
            dataValue.sourceTimestamp = null;
            dataValue.sourcePicoseconds = 0;
            if (!dataValue.serverTimestamp) {
                now = now || (0, node_opcua_date_time_1.getCurrentClock)();
                dataValue.serverTimestamp = now.timestamp;
                dataValue.serverPicoseconds = now.picoseconds;
            }
            break;
        case TimestampsToReturn_enum_1.TimestampsToReturn.Source:
            break;
        case TimestampsToReturn_enum_1.TimestampsToReturn.Both:
        default:
            (0, node_opcua_assert_1.assert)(timestampsToReturn === TimestampsToReturn_enum_1.TimestampsToReturn.Both);
            if (!dataValue.serverTimestamp) {
                now = now || (0, node_opcua_date_time_1.getCurrentClock)();
                dataValue.serverTimestamp = now.timestamp;
                dataValue.serverPicoseconds = now.picoseconds;
            }
            break;
    }
    // unset sourceTimestamp unless AttributeId is Value
    if (attributeId !== node_opcua_data_model_1.AttributeIds.Value) {
        dataValue.sourceTimestamp = null;
    }
    return dataValue;
}
/**
 * @deprecated
 */
function apply_timestamps2(dataValue, timestampsToReturn, attributeId) {
    (0, node_opcua_assert_1.assert)(attributeId > 0);
    (0, node_opcua_assert_1.assert)(Object.prototype.hasOwnProperty.call(dataValue, "serverTimestamp"));
    (0, node_opcua_assert_1.assert)(Object.prototype.hasOwnProperty.call(dataValue, "sourceTimestamp"));
    const cloneDataValue = new DataValue({});
    cloneDataValue.value = dataValue.value;
    cloneDataValue.statusCode = dataValue.statusCode;
    const now = (0, node_opcua_date_time_1.getCurrentClock)();
    // apply timestamps
    switch (timestampsToReturn) {
        case TimestampsToReturn_enum_1.TimestampsToReturn.Server:
            cloneDataValue.serverTimestamp = dataValue.serverTimestamp;
            cloneDataValue.serverPicoseconds = dataValue.serverPicoseconds;
            cloneDataValue.serverTimestamp = now.timestamp;
            cloneDataValue.serverPicoseconds = now.picoseconds;
            break;
        case TimestampsToReturn_enum_1.TimestampsToReturn.Source:
            cloneDataValue.sourceTimestamp = dataValue.sourceTimestamp;
            cloneDataValue.sourcePicoseconds = dataValue.sourcePicoseconds;
            break;
        case TimestampsToReturn_enum_1.TimestampsToReturn.Both:
            cloneDataValue.serverTimestamp = dataValue.serverTimestamp;
            cloneDataValue.serverPicoseconds = dataValue.serverPicoseconds;
            cloneDataValue.serverTimestamp = now.timestamp;
            cloneDataValue.serverPicoseconds = now.picoseconds;
            cloneDataValue.sourceTimestamp = dataValue.sourceTimestamp;
            cloneDataValue.sourcePicoseconds = dataValue.sourcePicoseconds;
            break;
    }
    // unset sourceTimestamp unless AttributeId is Value
    if (attributeId !== node_opcua_data_model_1.AttributeIds.Value) {
        cloneDataValue.sourceTimestamp = null;
    }
    return cloneDataValue;
}
/*

 * @param dataValue
 * @param result
 * @return {DataValue}
 * @private
 * @static
 */
function _clone_with_array_replacement(dataValue, result) {
    const statusCode = result.statusCode.isGood() ? dataValue.statusCode : result.statusCode;
    const clonedDataValue = new DataValue({
        statusCode,
        serverTimestamp: dataValue.serverTimestamp,
        serverPicoseconds: dataValue.serverPicoseconds,
        sourceTimestamp: dataValue.sourceTimestamp,
        sourcePicoseconds: dataValue.sourcePicoseconds,
        value: {
            dataType: node_opcua_variant_1.DataType.Null
        }
    });
    clonedDataValue.value.dataType = dataValue.value.dataType;
    clonedDataValue.value.arrayType = dataValue.value.arrayType;
    clonedDataValue.value.dimensions = result.dimensions;
    if (Array.isArray(result.array)) {
        clonedDataValue.value.value = [...result.array];
    }
    else {
        clonedDataValue.value.value = result.array;
    }
    return clonedDataValue;
}
function canRange(dataValue) {
    return (dataValue.value &&
        (dataValue.value.arrayType !== node_opcua_variant_1.VariantArrayType.Scalar ||
            (dataValue.value.arrayType === node_opcua_variant_1.VariantArrayType.Scalar && dataValue.value.dataType === node_opcua_variant_1.DataType.ByteString) ||
            (dataValue.value.arrayType === node_opcua_variant_1.VariantArrayType.Scalar && dataValue.value.dataType === node_opcua_variant_1.DataType.String)));
}
/**
 * return a deep copy of the dataValue by applying indexRange if necessary on  Array/Matrix
 * @param dataValue {DataValue}
 * @param indexRange {NumericalRange}
 * @return {DataValue}
 */
function extractRange(dataValue, indexRange) {
    const variant = dataValue.value;
    if (indexRange && canRange(dataValue)) {
        if (!indexRange.isValid()) {
            return new DataValue({ statusCode: node_opcua_status_code_1.StatusCodes.BadIndexRangeInvalid });
        }
        // let's extract an array of elements corresponding to the indexRange
        const result = indexRange.extract_values(variant.value, variant.dimensions);
        dataValue = _clone_with_array_replacement(dataValue, result);
    }
    else {
        // clone the whole data Value
        dataValue = dataValue.clone();
    }
    return dataValue;
}
function sameDate(date1, date2) {
    if (date1 === date2) {
        return true;
    }
    if (date1 && date2 === null) {
        return false;
    }
    if (date1 === null && date2) {
        return false;
    }
    if (date1 === null || date2 === null) {
        return false;
    }
    return date1.getTime() === date2.getTime();
}
/**
 * returns true if the sourceTimestamp and sourcePicoseconds of the two dataValue are different
 * @param dataValue1
 * @param dataValue2
 * @returns
 */
function sourceTimestampHasChanged(dataValue1, dataValue2) {
    return (!sameDate(dataValue1.sourceTimestamp, dataValue2.sourceTimestamp) ||
        dataValue1.sourcePicoseconds !== dataValue2.sourcePicoseconds);
}
/**
 * returns true if the serverTimestamp and serverPicoseconds of the two dataValue are different
 * @param dataValue1
 * @param dataValue2
 * @returns
 */
function serverTimestampHasChanged(dataValue1, dataValue2) {
    return (!sameDate(dataValue1.serverTimestamp, dataValue2.serverTimestamp) ||
        dataValue1.serverPicoseconds !== dataValue2.serverPicoseconds);
}
/**
 * return if the timestamps of the two dataValue are different
 *
 * - if timestampsToReturn is not specified, both sourceTimestamp are compared
 * - if timestampsToReturn is **Neither**, the function returns false
 * - if timestampsToReturn is **Both**, both sourceTimestamp and serverTimestamp are compared
 * - if timestampsToReturn is **Source**, only sourceTimestamp are compared
 * - if timestampsToReturn is **Server**, only serverTimestamp are compared
 *
 * @param dataValue1
 * @param dataValue2
 * @param timestampsToReturn
 * @returns
 */
function timestampHasChanged(dataValue1, dataValue2, timestampsToReturn) {
    // TODO:    timestampsToReturn = timestampsToReturn || { key: "Neither"};
    if (timestampsToReturn === undefined) {
        return sourceTimestampHasChanged(dataValue1, dataValue2); // || serverTimestampHasChanged(dataValue1, dataValue2);
    }
    switch (timestampsToReturn) {
        case TimestampsToReturn_enum_1.TimestampsToReturn.Neither:
            return false;
        case TimestampsToReturn_enum_1.TimestampsToReturn.Both:
            return sourceTimestampHasChanged(dataValue1, dataValue2) || serverTimestampHasChanged(dataValue1, dataValue2);
        case TimestampsToReturn_enum_1.TimestampsToReturn.Source:
            return sourceTimestampHasChanged(dataValue1, dataValue2);
        default:
            (0, node_opcua_assert_1.assert)(timestampsToReturn === TimestampsToReturn_enum_1.TimestampsToReturn.Server);
            return serverTimestampHasChanged(dataValue1, dataValue2);
    }
}
/**
 * @param statusCode1
 * @param statusCode2
 * @returns true if the two statusCodes are identical, i.e have the same value
 */
function sameStatusCode(statusCode1, statusCode2) {
    return statusCode1.value === statusCode2.value;
}
/**
 * @return {boolean} true if data values are identical
 */
function sameDataValue(v1, v2, timestampsToReturn) {
    if (v1 === v2) {
        return true;
    }
    if (v1 && !v2) {
        return false;
    }
    if (v2 && !v1) {
        return false;
    }
    if (!sameStatusCode(v1.statusCode, v2.statusCode)) {
        return false;
    }
    if (timestampHasChanged(v1, v2, timestampsToReturn)) {
        return false;
    }
    return (0, node_opcua_variant_1.sameVariant)(v1.value, v2.value);
}
class DataValueT extends DataValue {
}
exports.DataValueT = DataValueT;
//# sourceMappingURL=datavalue.js.map