import { BindExtensionObjectOptions, UAVariable } from "node-opcua-address-space-base";
import { PreciseClock } from "node-opcua-date-time";
import { ExtensionObject } from "node-opcua-extension-object";
import { UAVariableImpl } from "./ua_variable_impl";
export declare function getProxyTarget(ext: any): any;
/**
 * inconditionnaly change the time stamp of the variable
 * if the variable is being listened to, and if the minimumSamplingInterval is exactly zero,
 * then the change will be reported to the observer
 *
 */
export declare function _touchValue(property: UAVariableImpl, now: PreciseClock): void;
export declare function propagateTouchValueUpward(self: UAVariableImpl, now: PreciseClock, cache?: Set<UAVariable>): void;
export declare function propagateTouchValueDownward(self: UAVariableImpl, now: PreciseClock, cache?: Set<UAVariable>): void;
export declare function setExtensionObjectPartialValue(node: UAVariableImpl, partialObject: any, sourceTimestamp?: PreciseClock): void;
export declare function _installExtensionObjectBindingOnProperties(uaVariable: UAVariableImpl, options?: BindExtensionObjectOptions): void;
export declare function _bindExtensionObject(uaVariable: UAVariableImpl, optionalExtensionObject?: ExtensionObject, options?: BindExtensionObjectOptions): ExtensionObject | null;
export declare function _bindExtensionObjectArrayOrMatrix(uaVariable: UAVariableImpl, optionalExtensionObjectArray?: ExtensionObject[], options?: BindExtensionObjectOptions): ExtensionObject[];
export declare function getElement(path: string | string[], data: any): any;
export declare function setElement(path: string | string[], data: any, value: any): void;
export declare function incrementElement(path: string | string[], data: any): void;
export declare function extractPartialData(path: string | string[], extensionObject: ExtensionObject): any;
export declare function propagateTouchValueDownwardArray(uaVariable: UAVariableImpl, now: PreciseClock, cache: Set<UAVariable>): void;
