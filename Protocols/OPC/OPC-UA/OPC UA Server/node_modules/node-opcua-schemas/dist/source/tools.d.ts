import { DataTypeFactory, IStructuredTypeSchema } from "node-opcua-factory";
import { InternalTypeDictionary, MapDataTypeAndEncodingIdProvider } from "./parse_binary_xsd";
export declare function getOrCreateStructuredTypeSchema(name: string, typeDictionary: InternalTypeDictionary, dataTypeFactory: DataTypeFactory, idProvider: MapDataTypeAndEncodingIdProvider): IStructuredTypeSchema;
