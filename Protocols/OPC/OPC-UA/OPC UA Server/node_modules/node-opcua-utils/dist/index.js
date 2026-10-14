"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hrtime = exports.replaceBufferWithHexDump = exports.setDeprecated = exports.getFunctionParameterNames = exports.compare_buffers = exports.get_clock_tick = exports.getObjectClassName = exports.lowerFirstLetter = exports.capitalizeFirstLetter = exports.buffer_ellipsis = void 0;
exports.set_flag = set_flag;
exports.check_flag = check_flag;
exports.isNullOrUndefined = isNullOrUndefined;
/**
 * @module node-opcua-utils
 */
// tslint:disable:no-bitwise
const node_opcua_assert_1 = require("node-opcua-assert");
/**
 * set a flag

 */
function set_flag(value, mask) {
    if (mask.value) {
        mask = mask.value;
    }
    (0, node_opcua_assert_1.assert)(!Object.prototype.hasOwnProperty.call(mask, "value"));
    (0, node_opcua_assert_1.assert)(mask !== undefined);
    return value | mask;
}
/**
 * check if a set of bits are set in the values

 */
function check_flag(value, mask) {
    if (mask.value) {
        mask = mask.value;
    }
    (0, node_opcua_assert_1.assert)(!Object.prototype.hasOwnProperty.call(mask, "value"));
    return (value & mask) === mask;
}
function isNullOrUndefined(value) {
    return value === undefined || value === null;
}
var buffer_ellipsis_1 = require("./buffer_ellipsis");
Object.defineProperty(exports, "buffer_ellipsis", { enumerable: true, get: function () { return buffer_ellipsis_1.buffer_ellipsis; } });
var string_utils_1 = require("./string_utils");
Object.defineProperty(exports, "capitalizeFirstLetter", { enumerable: true, get: function () { return string_utils_1.capitalizeFirstLetter; } });
Object.defineProperty(exports, "lowerFirstLetter", { enumerable: true, get: function () { return string_utils_1.lowerFirstLetter; } });
var object_classname_1 = require("./object_classname");
Object.defineProperty(exports, "getObjectClassName", { enumerable: true, get: function () { return object_classname_1.getObjectClassName; } });
var get_clock_tick_1 = require("./get_clock_tick");
Object.defineProperty(exports, "get_clock_tick", { enumerable: true, get: function () { return get_clock_tick_1.get_clock_tick; } });
var compare_buffers_1 = require("./compare_buffers");
Object.defineProperty(exports, "compare_buffers", { enumerable: true, get: function () { return compare_buffers_1.compare_buffers; } });
var get_function_parameters_name_1 = require("./get_function_parameters_name");
Object.defineProperty(exports, "getFunctionParameterNames", { enumerable: true, get: function () { return get_function_parameters_name_1.getFunctionParameterNames; } });
__exportStar(require("./watchdog"), exports);
var set_deprecated_1 = require("./set_deprecated");
Object.defineProperty(exports, "setDeprecated", { enumerable: true, get: function () { return set_deprecated_1.setDeprecated; } });
var replace_buffer_with_hex_dump_1 = require("./replace_buffer_with_hex_dump");
Object.defineProperty(exports, "replaceBufferWithHexDump", { enumerable: true, get: function () { return replace_buffer_with_hex_dump_1.replaceBufferWithHexDump; } });
__exportStar(require("./timestamp"), exports);
__exportStar(require("./line_file"), exports);
__exportStar(require("./match_uri"), exports);
var hrtime_1 = require("./hrtime");
Object.defineProperty(exports, "hrtime", { enumerable: true, get: function () { return hrtime_1.hrtime; } });
//# sourceMappingURL=index.js.map