import { IAddressSpace } from "node-opcua-address-space-base";
import { ExtraDataTypeManager } from "node-opcua-client-dynamic-extension-object";
import { CallbackT } from "node-opcua-status-code";
export declare function ensureDatatypeExtracted(addressSpace: IAddressSpace): Promise<ExtraDataTypeManager>;
export declare function ensureDatatypeExtractedWithCallback(addressSpace: IAddressSpace, callback: CallbackT<ExtraDataTypeManager>): void;
