import { IBasicSessionAsync2 } from "node-opcua-pseudo-session";
import { NodeId } from "node-opcua-nodeid";
import { ExtraDataTypeManager } from "./extra_data_type_manager";
import { DataTypeExtractStrategy } from "./populate_data_type_manager";
export interface IBasicSessionAsync2Private extends IBasicSessionAsync2 {
    $$namespaceArray?: string[];
    $$extraDataTypeManager?: ExtraDataTypeManager;
    $$extraDataTypeManagerToResolve?: [(a: ExtraDataTypeManager) => void, (err: Error) => void][];
    $$getSessionForDataTypeExtraction?: () => IBasicSessionAsync2;
    on?: (this: IBasicSessionAsync2Private, event: "session_restored", func: () => void) => void;
    sessionId?: NodeId;
}
export declare function invalidateExtraDataTypeManager(session: IBasicSessionAsync2): Promise<void>;
export declare function extractDataTypeManagerPrivate(session: IBasicSessionAsync2, strategy: DataTypeExtractStrategy): Promise<ExtraDataTypeManager>;
export declare function getExtraDataTypeManager(session: IBasicSessionAsync2, strategy?: DataTypeExtractStrategy): Promise<ExtraDataTypeManager>;
