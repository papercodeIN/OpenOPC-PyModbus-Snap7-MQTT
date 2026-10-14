import { IBasicSessionAsync2 } from "node-opcua-pseudo-session";
import { ExtraDataTypeManager } from "./extra_data_type_manager";
/**
 * @private
 */
export declare function serverImplementsDataTypeDefinition(session: IBasicSessionAsync2): Promise<boolean>;
export declare enum DataTypeExtractStrategy {
    Auto = 0,
    Force103 = 1,
    Force104 = 2,
    Both = 3
}
export declare function populateDataTypeManager(session: IBasicSessionAsync2, dataTypeManager: ExtraDataTypeManager, strategy: DataTypeExtractStrategy): Promise<void>;
