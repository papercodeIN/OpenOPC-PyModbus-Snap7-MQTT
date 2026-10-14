"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTraceLogger = exports.setErrorLogger = exports.setWarningLogger = exports.setDebugLogger = exports.setLogLevel = exports.LogLevel = exports.dumpIf = exports.dump = exports.hexDump = exports.inlineText = exports.makeBufferFromTrace = exports.messageLogger = exports.make_traceLog = exports.make_warningLog = exports.make_errorLog = exports.make_debugLog = exports.setDebugFlag = exports.checkDebugFlag = exports.displayTraceFromThisProjectOnly = exports.traceFromThisProjectOnly = exports.removeDecoration = void 0;
/**
 * @module node-opcua-debug
 */
var remove_decoration_1 = require("./remove_decoration");
Object.defineProperty(exports, "removeDecoration", { enumerable: true, get: function () { return remove_decoration_1.removeDecoration; } });
var display_trace_1 = require("./display_trace");
Object.defineProperty(exports, "traceFromThisProjectOnly", { enumerable: true, get: function () { return display_trace_1.traceFromThisProjectOnly; } });
Object.defineProperty(exports, "displayTraceFromThisProjectOnly", { enumerable: true, get: function () { return display_trace_1.displayTraceFromThisProjectOnly; } });
var make_loggers_1 = require("./make_loggers");
Object.defineProperty(exports, "checkDebugFlag", { enumerable: true, get: function () { return make_loggers_1.checkDebugFlag; } });
Object.defineProperty(exports, "setDebugFlag", { enumerable: true, get: function () { return make_loggers_1.setDebugFlag; } });
Object.defineProperty(exports, "make_debugLog", { enumerable: true, get: function () { return make_loggers_1.make_debugLog; } });
Object.defineProperty(exports, "make_errorLog", { enumerable: true, get: function () { return make_loggers_1.make_errorLog; } });
Object.defineProperty(exports, "make_warningLog", { enumerable: true, get: function () { return make_loggers_1.make_warningLog; } });
Object.defineProperty(exports, "make_traceLog", { enumerable: true, get: function () { return make_loggers_1.make_traceLog; } });
Object.defineProperty(exports, "messageLogger", { enumerable: true, get: function () { return make_loggers_1.messageLogger; } });
var make_buffer_from_trace_1 = require("./make_buffer_from_trace");
Object.defineProperty(exports, "makeBufferFromTrace", { enumerable: true, get: function () { return make_buffer_from_trace_1.makeBufferFromTrace; } });
Object.defineProperty(exports, "inlineText", { enumerable: true, get: function () { return make_buffer_from_trace_1.inlineText; } });
var hexDump_1 = require("./hexDump");
Object.defineProperty(exports, "hexDump", { enumerable: true, get: function () { return hexDump_1.hexDump; } });
var dump_if_1 = require("./dump_if");
Object.defineProperty(exports, "dump", { enumerable: true, get: function () { return dump_if_1.dump; } });
Object.defineProperty(exports, "dumpIf", { enumerable: true, get: function () { return dump_if_1.dumpIf; } });
var make_loggers_2 = require("./make_loggers");
Object.defineProperty(exports, "LogLevel", { enumerable: true, get: function () { return make_loggers_2.LogLevel; } });
Object.defineProperty(exports, "setLogLevel", { enumerable: true, get: function () { return make_loggers_2.setLogLevel; } });
Object.defineProperty(exports, "setDebugLogger", { enumerable: true, get: function () { return make_loggers_2.setDebugLogger; } });
Object.defineProperty(exports, "setWarningLogger", { enumerable: true, get: function () { return make_loggers_2.setWarningLogger; } });
Object.defineProperty(exports, "setErrorLogger", { enumerable: true, get: function () { return make_loggers_2.setErrorLogger; } });
Object.defineProperty(exports, "setTraceLogger", { enumerable: true, get: function () { return make_loggers_2.setTraceLogger; } });
//# sourceMappingURL=index.js.map