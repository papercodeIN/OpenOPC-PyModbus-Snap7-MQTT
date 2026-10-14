import { BaseNode } from "node-opcua-address-space";
import { ExtensionObject } from "node-opcua-extension-object";
import { StatusCode } from "node-opcua-status-code";
import { ReadValueIdOptions } from "node-opcua-types";
export declare function validateFilter(filter: ExtensionObject | null, itemToMonitor: ReadValueIdOptions, node: BaseNode): StatusCode;
