"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._enumerationTimestampsToReturn = exports.schemaTimestampsToReturn = exports.TimestampsToReturn = void 0;
exports.encodeTimestampsToReturn = encodeTimestampsToReturn;
exports.decodeTimestampsToReturn = decodeTimestampsToReturn;
exports.coerceTimestampsToReturn = coerceTimestampsToReturn;
const node_opcua_factory_1 = require("node-opcua-factory");
/**
 * a enumeration that specifies how the source timestamp should be returned.
 */
var TimestampsToReturn;
(function (TimestampsToReturn) {
    TimestampsToReturn[TimestampsToReturn["Source"] = 0] = "Source";
    TimestampsToReturn[TimestampsToReturn["Server"] = 1] = "Server";
    TimestampsToReturn[TimestampsToReturn["Both"] = 2] = "Both";
    TimestampsToReturn[TimestampsToReturn["Neither"] = 3] = "Neither";
    TimestampsToReturn[TimestampsToReturn["Invalid"] = 4] = "Invalid";
})(TimestampsToReturn || (exports.TimestampsToReturn = TimestampsToReturn = {}));
/**
 * @private
 */
exports.schemaTimestampsToReturn = {
    name: "TimestampsToReturn",
    enumValues: TimestampsToReturn
};
/**
 * @private
 */
function encodeTimestampsToReturn(value, stream) {
    stream.writeUInt32(value);
}
function clamp(min, a, max) {
    return Math.max(Math.min(a, max), min);
}
/**
 * @private
 */
function decodeTimestampsToReturn(stream, value) {
    return clamp(TimestampsToReturn.Source, stream.readUInt32(), TimestampsToReturn.Invalid);
}
/**
 * @private
 */
exports._enumerationTimestampsToReturn = (0, node_opcua_factory_1.registerEnumeration)(exports.schemaTimestampsToReturn);
function coerceTimestampsToReturn(value) {
    return typeof value === "number" ? +value : TimestampsToReturn.Neither;
}
//# sourceMappingURL=TimestampsToReturn_enum.js.map