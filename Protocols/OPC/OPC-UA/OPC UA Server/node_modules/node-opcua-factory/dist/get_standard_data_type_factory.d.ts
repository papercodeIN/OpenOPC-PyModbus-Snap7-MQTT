import { DataTypeFactory } from "./datatype_factory";
import { ConstructorFuncWithSchema } from "./types";
export declare function getStandardDataTypeFactory(): DataTypeFactory;
export declare function getStructureTypeConstructor(typeName: string): ConstructorFuncWithSchema;
export declare function dump(): void;
