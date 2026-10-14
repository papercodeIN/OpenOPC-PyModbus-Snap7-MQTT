"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessLevelExFlag = void 0;
exports.makeAccessLevelExFlag = makeAccessLevelExFlag;
exports.randomAccessLevelEx = randomAccessLevelEx;
exports.accessLevelExFlagToString = accessLevelExFlagToString;
exports.encodeAccessLevelExFlag = encodeAccessLevelExFlag;
exports.decodeAccessLevelExFlag = decodeAccessLevelExFlag;
const access_level_1 = require("./access_level");
const _make_flag_1 = require("./_make_flag");
/**
 * from https://reference.opcfoundation.org/v104/Core/docs/Part3/8.58/:
 *
 * This is a subtype of the UInt32 DataType with the OptionSetValues Property defined.
 * It is used to indicate how the Value of a Variable can be accessed (read/write),
 * if it contains current and/or historic data and its atomicity.
 * The AccessLevelExType DataType is an extended version of the AccessLevelType DataType and
 * as such contains the 8 bits of the AccessLevelType as the first 8 bits.
 * The NonatomicRead, and NonatomicWrite Fields represent the atomicity of a Variable.
 *  In general Atomicity is expected of OPC UA read and write operations.
 * These Fields are used by systems, in particular hard-realtime controllers, which can not ensure atomicity.
 */
var AccessLevelExFlag;
(function (AccessLevelExFlag) {
    AccessLevelExFlag[AccessLevelExFlag["CurrentRead"] = 1] = "CurrentRead";
    AccessLevelExFlag[AccessLevelExFlag["CurrentWrite"] = 2] = "CurrentWrite";
    AccessLevelExFlag[AccessLevelExFlag["HistoryRead"] = 4] = "HistoryRead";
    AccessLevelExFlag[AccessLevelExFlag["HistoryWrite"] = 8] = "HistoryWrite";
    AccessLevelExFlag[AccessLevelExFlag["SemanticChange"] = 16] = "SemanticChange";
    AccessLevelExFlag[AccessLevelExFlag["StatusWrite"] = 32] = "StatusWrite";
    AccessLevelExFlag[AccessLevelExFlag["TimestampWrite"] = 64] = "TimestampWrite";
    // reserved bit 7
    AccessLevelExFlag[AccessLevelExFlag["NonatomicRead"] = 128] = "NonatomicRead";
    AccessLevelExFlag[AccessLevelExFlag["NonatomicWrite"] = 256] = "NonatomicWrite";
    AccessLevelExFlag[AccessLevelExFlag["WriteFullArrayOnly"] = 512] = "WriteFullArrayOnly";
    AccessLevelExFlag[AccessLevelExFlag["NoSubDataTypes"] = 1024] = "NoSubDataTypes";
    // new in 1.5.1
    AccessLevelExFlag[AccessLevelExFlag["NonVolatile"] = 2048] = "NonVolatile";
    AccessLevelExFlag[AccessLevelExFlag["Constant"] = 4096] = "Constant";
    // Reserved for future use. Shall always be zero.
    AccessLevelExFlag[AccessLevelExFlag["None"] = 2048] = "None";
})(AccessLevelExFlag || (exports.AccessLevelExFlag = AccessLevelExFlag = {}));
// @example
//      makeAccessLevelFlag("CurrentRead | CurrentWrite").should.eql(0x03);
function makeAccessLevelExFlag(str) {
    return (0, _make_flag_1._make_flag)(str, AccessLevelExFlag.None, AccessLevelExFlag);
}
function randomAccessLevelEx() {
    return Math.ceil(Math.random() * 0x200);
}
function accessLevelExFlagToString(accessLevelFlag) {
    const retVal = (0, access_level_1._accessLevelFlagToString)(accessLevelFlag);
    if (accessLevelFlag & AccessLevelExFlag.NonatomicRead) {
        retVal.push("NonatomicRead");
    }
    if (accessLevelFlag & AccessLevelExFlag.NonatomicWrite) {
        retVal.push("NonatomicWrite");
    }
    if (accessLevelFlag & AccessLevelExFlag.WriteFullArrayOnly) {
        retVal.push("WriteFullArrayOnly");
    }
    if (accessLevelFlag & AccessLevelExFlag.NoSubDataTypes) {
        retVal.push("NoSubDataTypes");
    }
    if (accessLevelFlag & AccessLevelExFlag.NonVolatile) {
        retVal.push("NonVolatile");
    }
    if (accessLevelFlag & AccessLevelExFlag.Constant) {
        retVal.push("Constant");
    }
    if (retVal.length === 0) {
        retVal.push("None");
    }
    return retVal.join(" | ");
}
function encodeAccessLevelExFlag(value, stream) {
    stream.writeUInt32(value & 0xfffff);
}
function decodeAccessLevelExFlag(stream) {
    const code = stream.readUInt32();
    return code;
}
//# sourceMappingURL=access_level_ex.js.map