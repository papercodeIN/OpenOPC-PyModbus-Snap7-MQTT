"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportedEnvVars = void 0;
exports.setEnv = setEnv;
exports.hasEnv = hasEnv;
exports.getEnv = getEnv;
exports.getEnvironmentVarNames = getEnvironmentVarNames;
exports.processAltNames = processAltNames;
const config_1 = require("../config");
const debug_1 = require("../debug");
exports.exportedEnvVars = {};
function setEnv(varName, value) {
    // istanbul ignore next
    if (!config_1.g_config.silent) {
        (0, debug_1.warningLog)("          set " + varName + "=" + value);
    }
    exports.exportedEnvVars[varName] = value;
    if (["OPENSSL_CONF"].indexOf(varName) >= 0) {
        process.env[varName] = value;
    }
    if (["RANDFILE"].indexOf(varName) >= 0) {
        process.env[varName] = value;
    }
}
function hasEnv(varName) {
    return Object.prototype.hasOwnProperty.call(exports.exportedEnvVars, varName);
}
function getEnv(varName) {
    return exports.exportedEnvVars[varName];
}
function getEnvironmentVarNames() {
    return Object.keys(exports.exportedEnvVars).map((varName) => {
        return { key: varName, pattern: "\\$ENV\\:\\:" + varName };
    });
}
function processAltNames(params) {
    params.dns = params.dns || [];
    params.ip = params.ip || [];
    // construct subjectAtlName
    let subjectAltName = [];
    subjectAltName.push("URI:" + params.applicationUri);
    subjectAltName = [].concat(subjectAltName, params.dns.map((d) => "DNS:" + d));
    subjectAltName = [].concat(subjectAltName, params.ip.map((d) => "IP:" + d));
    const subjectAltNameString = subjectAltName.join(", ");
    setEnv("ALTNAME", subjectAltNameString);
}
//# sourceMappingURL=_env.js.map