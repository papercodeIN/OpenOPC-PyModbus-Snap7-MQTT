"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessRestrictionsFlag = void 0;
exports.makeAccessRestrictionsFlag = makeAccessRestrictionsFlag;
exports.accessRestrictionsFlagToString = accessRestrictionsFlagToString;
const _make_flag_1 = require("./_make_flag");
var AccessRestrictionsFlag;
(function (AccessRestrictionsFlag) {
    AccessRestrictionsFlag[AccessRestrictionsFlag["SigningRequired"] = 1] = "SigningRequired";
    AccessRestrictionsFlag[AccessRestrictionsFlag["EncryptionRequired"] = 2] = "EncryptionRequired";
    AccessRestrictionsFlag[AccessRestrictionsFlag["SessionRequired"] = 4] = "SessionRequired";
    AccessRestrictionsFlag[AccessRestrictionsFlag["ApplyRestrictionsToBrowse"] = 8] = "ApplyRestrictionsToBrowse";
    AccessRestrictionsFlag[AccessRestrictionsFlag["None"] = 0] = "None";
})(AccessRestrictionsFlag || (exports.AccessRestrictionsFlag = AccessRestrictionsFlag = {}));
function makeAccessRestrictionsFlag(str) {
    return (0, _make_flag_1._make_flag)(str, AccessRestrictionsFlag.None, AccessRestrictionsFlag);
}
function accessRestrictionsFlagToString(flags) {
    const retVal = [];
    if (flags & AccessRestrictionsFlag.SigningRequired) {
        retVal.push("SigningRequired");
    }
    if (flags & AccessRestrictionsFlag.EncryptionRequired) {
        retVal.push("EncryptionRequired");
    }
    if (flags & AccessRestrictionsFlag.SessionRequired) {
        retVal.push("SessionRequired");
    }
    if (flags & AccessRestrictionsFlag.ApplyRestrictionsToBrowse) {
        retVal.push("ApplyRestrictionsToBrowse");
    }
    if (retVal.length === 0) {
        retVal.push("None");
    }
    return retVal.join(" | ");
}
//# sourceMappingURL=access_restrictions.js.map