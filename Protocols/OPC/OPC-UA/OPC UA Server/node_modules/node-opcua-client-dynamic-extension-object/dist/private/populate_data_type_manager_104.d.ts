import { DataTypeFactory } from "node-opcua-factory";
import { NodeId } from "node-opcua-nodeid";
import { IBasicSessionAsync2 } from "node-opcua-pseudo-session";
import { ExtraDataTypeManager } from "../extra_data_type_manager";
import { ICache } from "../convert_data_type_definition_to_structuretype_schema";
type DependentNamespaces = Set<number>;
export declare function readDataTypeDefinitionAndBuildType(session: IBasicSessionAsync2, dataTypeNodeId: NodeId, name: string, dataTypeFactory: DataTypeFactory, cache: ICache): Promise<DependentNamespaces>;
export declare function populateDataTypeManager104(session: IBasicSessionAsync2, dataTypeManager: ExtraDataTypeManager): Promise<void>;
export {};
