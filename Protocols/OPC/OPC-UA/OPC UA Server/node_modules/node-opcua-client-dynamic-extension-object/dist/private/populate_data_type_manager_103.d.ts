import { QualifiedName } from "node-opcua-data-model";
import { NodeId } from "node-opcua-nodeid";
import { IBasicSessionAsync2 } from "node-opcua-pseudo-session";
import { DataTypeAndEncodingId } from "node-opcua-schemas";
import { ExtraDataTypeManager } from "../extra_data_type_manager";
export interface IDataTypeDescription {
    browseName: QualifiedName;
    nodeId: NodeId;
    encodings?: DataTypeAndEncodingId;
    symbolicName?: string;
    isAbstract?: boolean;
}
/**
 * Extract all custom dataType
 * @param session
 * @param dataTypeManager
 */
export declare function populateDataTypeManager103(session: IBasicSessionAsync2, dataTypeManager: ExtraDataTypeManager): Promise<void>;
