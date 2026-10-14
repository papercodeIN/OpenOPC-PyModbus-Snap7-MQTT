"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coerceAccessLevelFlag = exports.AccessLevelFlag = void 0;
exports.convertAccessLevelFlagToByte = convertAccessLevelFlagToByte;
exports.makeAccessLevelFlag = makeAccessLevelFlag;
exports.randomAccessLevel = randomAccessLevel;
exports._accessLevelFlagToString = _accessLevelFlagToString;
exports.accessLevelFlagToString = accessLevelFlagToString;
exports.decodeAccessLevelFlag = decodeAccessLevelFlag;
exports.encodeAccessLevelFlag = encodeAccessLevelFlag;
const _make_flag_1 = require("./_make_flag");
var AccessLevelFlag;
(function (AccessLevelFlag) {
    AccessLevelFlag[AccessLevelFlag["CurrentRead"] = 1] = "CurrentRead";
    AccessLevelFlag[AccessLevelFlag["CurrentWrite"] = 2] = "CurrentWrite";
    AccessLevelFlag[AccessLevelFlag["HistoryRead"] = 4] = "HistoryRead";
    AccessLevelFlag[AccessLevelFlag["HistoryWrite"] = 8] = "HistoryWrite";
    AccessLevelFlag[AccessLevelFlag["SemanticChange"] = 16] = "SemanticChange";
    AccessLevelFlag[AccessLevelFlag["StatusWrite"] = 32] = "StatusWrite";
    AccessLevelFlag[AccessLevelFlag["TimestampWrite"] = 64] = "TimestampWrite";
    // reserved bit 7
    AccessLevelFlag[AccessLevelFlag["NONE"] = 2048] = "NONE";
    AccessLevelFlag[AccessLevelFlag["None"] = 2048] = "None";
})(AccessLevelFlag || (exports.AccessLevelFlag = AccessLevelFlag = {}));
function convertAccessLevelFlagToByte(accessLevel) {
    return accessLevel & 0x7f;
}
// @example
//      makeAccessLevelFlag("CurrentRead | CurrentWrite").should.eql(0x03);
function makeAccessLevelFlag(str) {
    return (0, _make_flag_1._make_flag)(str, AccessLevelFlag.None, AccessLevelFlag);
}
exports.coerceAccessLevelFlag = makeAccessLevelFlag;
function randomAccessLevel() {
    return AccessLevelFlag.CurrentRead;
}
function _accessLevelFlagToString(accessLevelFlag) {
    const retVal = [];
    if (accessLevelFlag & AccessLevelFlag.CurrentRead) {
        retVal.push("CurrentRead");
    }
    if (accessLevelFlag & AccessLevelFlag.CurrentWrite) {
        retVal.push("CurrentWrite");
    }
    if (accessLevelFlag & AccessLevelFlag.StatusWrite) {
        retVal.push("StatusWrite");
    }
    if (accessLevelFlag & AccessLevelFlag.TimestampWrite) {
        retVal.push("TimestampWrite");
    }
    if (accessLevelFlag & AccessLevelFlag.HistoryRead) {
        retVal.push("HistoryRead");
    }
    if (accessLevelFlag & AccessLevelFlag.HistoryWrite) {
        retVal.push("HistoryWrite");
    }
    if (accessLevelFlag & AccessLevelFlag.SemanticChange) {
        retVal.push("SemanticChange");
    }
    return retVal;
}
// tslint:disable:no-bitwise
function accessLevelFlagToString(accessLevelFlag) {
    const retVal = _accessLevelFlagToString(accessLevelFlag);
    if (retVal.length === 0) {
        retVal.push("None");
    }
    return retVal.join(" | ");
}
function decodeAccessLevelFlag(stream) {
    const code = stream.readUInt8();
    return code;
}
function encodeAccessLevelFlag(value, stream) {
    stream.writeUInt8(value & 0xff);
}
// registerBasicType({
//     name: "AccessLevelFlag",
//     subType: "Byte",
//     defaultValue: AccessLevelFlag.CurrentRead | AccessLevelFlag.CurrentWrite,
//     coerce: makeAccessLevelFlag,
//     decode: decodeAccessLevelFlag,
//     encode: encodeAccessLevelFlag,
//     random: randomAccessLevel
// });
//# sourceMappingURL=access_level.js.map