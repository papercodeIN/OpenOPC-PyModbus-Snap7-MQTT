"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageLogger = exports.MessageLogger = exports.LogLevel = void 0;
exports.setLogLevel = setLogLevel;
exports.setDebugLogger = setDebugLogger;
exports.setWarningLogger = setWarningLogger;
exports.setErrorLogger = setErrorLogger;
exports.setTraceLogger = setTraceLogger;
exports.setDebugFlag = setDebugFlag;
exports.checkDebugFlag = checkDebugFlag;
exports.make_debugLog = make_debugLog;
exports.make_errorLog = make_errorLog;
exports.make_warningLog = make_warningLog;
exports.make_traceLog = make_traceLog;
/**
 * @module node-opcua-debug
 */
// tslint:disable:no-console
const events_1 = require("events");
const util_1 = require("util");
const chalk_1 = __importDefault(require("chalk"));
const debugFlags = {};
const _process = typeof process === "object" ? process : { env: {} };
const sTraceFlag = _process.env && _process.env.DEBUG;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Emergency"] = 0] = "Emergency";
    LogLevel[LogLevel["Alert"] = 1] = "Alert";
    LogLevel[LogLevel["Critic"] = 2] = "Critic";
    LogLevel[LogLevel["Error"] = 3] = "Error";
    LogLevel[LogLevel["Warning"] = 4] = "Warning";
    LogLevel[LogLevel["Notice"] = 5] = "Notice";
    LogLevel[LogLevel["Info"] = 6] = "Info";
    LogLevel[LogLevel["Debug"] = 7] = "Debug";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
// istanbul ignore next
if (_process.env && false) {
    // this code can be activated to help detecting
    // when a external module overwrite one of the
    // environment variable that we may be using as well.
    const old = { ..._process.env };
    const handler = {
        get: function (obj, prop) {
            return old[prop];
        },
        set: function (obj, prop, value) {
            console.log("setting process.env = prop " + prop);
            old[prop] = value;
            return true;
        }
    };
    _process.env = new Proxy(old, handler);
}
const maxLines = _process.env && _process.env.NODEOPCUA_DEBUG_MAXLINE_PER_MESSAGE
    ? parseInt(_process.env.NODEOPCUA_DEBUG_MAXLINE_PER_MESSAGE, 10)
    : 25;
let g_logLevel = process.env.NODEOPCUA_LOG_LEVEL
    ? parseInt(process.env.NODEOPCUA_LOG_LEVEL)
    : LogLevel.Warning;
function setLogLevel(level) {
    g_logLevel = level;
}
function extractBasename(name) {
    if (!name) {
        return "";
    }
    // return basename(name).replace(/\.(js|ts)$/, "");
    return name.replace(/(.*[\\|/])?/g, "").replace(/\.(js|ts)$/, "");
}
function w(str, l) {
    return str.padEnd(l, " ").substring(0, l);
}
const contextCounter = {};
const increaseCounter = (context) => {
    const { filename, callerline } = context;
    const key = `${filename}:${callerline}};`;
    const bucket = contextCounter[key];
    if (!bucket) {
        contextCounter[key] = 1;
        return 1;
    }
    contextCounter[key] = contextCounter[key] + 1;
    return contextCounter[key];
};
const threshold = 100;
const loggers = {
    errorLogger: (context, ...args) => {
        const occurrenceCount = increaseCounter(context);
        if (occurrenceCount > threshold) {
            return;
        }
        const output = dump(context, "E", args);
        exports.messageLogger.emit("errorMessage", output);
        if (occurrenceCount === threshold) {
            dump(context, "E", [`This error occurred more than ${threshold} times, no more error will be logged for this context`]);
            return;
        }
    },
    warningLogger: (context, ...args) => {
        const occurrenceCount = increaseCounter(context);
        if (occurrenceCount > threshold) {
            return;
        }
        const output = dump(context, "W", args);
        exports.messageLogger.emit("warningMessage", output);
        if (occurrenceCount === threshold) {
            dump(context, "W", [
                `This warning occurred more than ${threshold} times, no more warning will be logged for this context`
            ]);
            return;
        }
    },
    traceLogger: (context, ...args) => {
        dump(context, "T", args);
    },
    debugLogger: (context, ...args) => {
        dump(context, "D", args);
    }
};
function setDebugLogger(log) {
    loggers.debugLogger = log;
}
function setWarningLogger(log) {
    loggers.warningLogger = log;
}
function setErrorLogger(log) {
    loggers.errorLogger = log;
}
function setTraceLogger(log) {
    loggers.traceLogger = log;
}
function setDebugFlag(scriptFullPath, flag) {
    const filename = extractBasename(scriptFullPath);
    if (sTraceFlag && sTraceFlag.length > 1 && flag) {
        const decoratedFilename = chalk_1.default.yellow(w(filename, 60));
        loggers.debugLogger({
            filename: __filename,
            callerline: -1
        }, " Setting debug for ", decoratedFilename, " to ", (flag ? chalk_1.default.cyan : chalk_1.default.red)(flag.toString(), sTraceFlag));
        g_logLevel = LogLevel.Debug;
    }
    debugFlags[filename] = flag;
}
function checkDebugFlag(scriptFullPath) {
    const filename = extractBasename(scriptFullPath);
    let doDebug = debugFlags[filename];
    if (sTraceFlag && !Object.prototype.hasOwnProperty.call(debugFlags, filename)) {
        doDebug = sTraceFlag.indexOf(filename) >= 0 || sTraceFlag.indexOf("ALL") >= 0;
        setDebugFlag(filename, doDebug);
    }
    return doDebug;
}
/**
 * file_line return a 51 character string
 * @param filename
 * @param callerLine
 */
function file_line(mode, filename, callerLine) {
    const d = new Date().toISOString().substring(11);
    if (mode === "T") {
        return chalk_1.default.bgGreenBright.white(w(d, 14) + ":" + w(filename, 30) + ":" + w(callerLine.toString(), 5));
    }
    else if (mode === "W") {
        return chalk_1.default.bgCyan.white(w(d, 14) + ":" + w(filename, 30) + ":" + w(callerLine.toString(), 5));
    }
    else if (mode === "D") {
        return chalk_1.default.bgWhite.cyan(w(d, 14) + ":" + w(filename, 30) + ":" + w(callerLine.toString(), 5));
    }
    else {
        return chalk_1.default.bgRed.white(w(d, 14) + ":" + w(filename, 30) + ":" + w(callerLine.toString(), 5));
    }
}
const continuation = w(" ...                                                            ", 51);
function getCallerContext(level) {
    const stack = new Error("").stack || "";
    // caller line number
    const l = stack.split("\n")[level].split(":");
    const callerline = parseInt(l[l.length - 2], 10);
    const filename = extractBasename(l[l.length - 3]);
    return { filename, callerline };
}
function dump(ctx, mode, args1) {
    const a2 = Object.values(args1);
    const output = (0, util_1.format)(...a2);
    const { filename, callerline } = ctx;
    let a1 = [file_line(mode, filename, callerline)];
    let i = 0;
    for (const line of output.split("\n")) {
        const lineArguments = [].concat(a1, [line]);
        // eslint-disable-next-line prefer-spread
        console.log(...lineArguments);
        a1 = [continuation];
        i = i + 1;
        if (i > maxLines) {
            const a3 = a1.concat([` .... TRUNCATED ..... (NODEOPCUA_DEBUG_MAXLINE_PER_MESSAGE=${maxLines}`]);
            // eslint-disable-next-line prefer-spread
            console.log(...a3);
            break;
        }
    }
    return output;
}
class MessageLogger extends events_1.EventEmitter {
    constructor() {
        super();
    }
    on(eventName, eventHandler) {
        return super.on(eventName, eventHandler);
    }
}
exports.MessageLogger = MessageLogger;
exports.messageLogger = new MessageLogger();
/**

 * @param scriptFullPath:string
 * @return returns a  debugLog function that will write message to the console
 * if the DEBUG environment variable indicates that the provided source file shall display debug trace
 *
 */
function make_debugLog(scriptFullPath) {
    const filename = extractBasename(scriptFullPath);
    function debugLogFunc(...args) {
        if (debugFlags[filename] && g_logLevel >= LogLevel.Debug) {
            const ctxt = getCallerContext(3);
            loggers.debugLogger(ctxt, ...args);
        }
    }
    return debugLogFunc;
}
function errorLogFunc(...args) {
    if (g_logLevel >= LogLevel.Error) {
        const ctxt = getCallerContext(3);
        loggers.errorLogger(ctxt, ...args);
    }
}
function make_errorLog(context) {
    return errorLogFunc;
}
function warningLogFunc(...args) {
    if (g_logLevel >= LogLevel.Warning) {
        const ctxt = getCallerContext(3);
        loggers.warningLogger(ctxt, ...args);
    }
}
function make_warningLog(context) {
    return warningLogFunc;
}
function traceLogFunc(...args) {
    const ctxt = getCallerContext(3);
    loggers.traceLogger(ctxt, ...args);
}
function make_traceLog(context) {
    return traceLogFunc;
}
//# sourceMappingURL=make_loggers.js.map