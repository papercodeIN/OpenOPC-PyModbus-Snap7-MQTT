import { ExtensionObject } from "node-opcua-extension-object";
import { Variant } from "node-opcua-variant";
import { IBasicSessionAsync2 } from "node-opcua-pseudo-session";
import { ExtraDataTypeManager } from "./extra_data_type_manager";
export declare function resolveOpaqueStructureInExtensionObject(session: IBasicSessionAsync2, dataTypeManager: ExtraDataTypeManager, object: ExtensionObject): Promise<void>;
export declare function resolveDynamicExtensionObject(session: IBasicSessionAsync2, variant: Variant, dataTypeManager: ExtraDataTypeManager): Promise<void>;
