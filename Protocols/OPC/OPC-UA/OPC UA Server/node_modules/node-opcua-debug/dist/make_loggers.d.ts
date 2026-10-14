/**
 * @module node-opcua-debug
 */
import { EventEmitter } from "events";
export declare enum LogLevel {
    Emergency = 0,
    Alert = 1,
    Critic = 2,
    Error = 3,
    Warning = 4,
    Notice = 5,
    Info = 6,
    Debug = 7
}
export declare function setLogLevel(level: LogLevel): void;
type PrintFunc = (data?: any, ...argN: any[]) => void;
export declare function setDebugLogger(log: PrintFunc): void;
export declare function setWarningLogger(log: PrintFunc): void;
export declare function setErrorLogger(log: PrintFunc): void;
export declare function setTraceLogger(log: PrintFunc): void;
export declare function setDebugFlag(scriptFullPath: string, flag: boolean): void;
export declare function checkDebugFlag(scriptFullPath: string): boolean;
export declare class MessageLogger extends EventEmitter {
    constructor();
    on(eventName: "warningMessage" | "errorMessage", eventHandler: () => void): this;
}
export declare const messageLogger: MessageLogger;
/**

 * @param scriptFullPath:string
 * @return returns a  debugLog function that will write message to the console
 * if the DEBUG environment variable indicates that the provided source file shall display debug trace
 *
 */
export declare function make_debugLog(scriptFullPath: string): (...arg: any[]) => void;
export declare function make_errorLog(context: string): PrintFunc;
export declare function make_warningLog(context: string): PrintFunc;
export declare function make_traceLog(context: string): PrintFunc;
export {};
