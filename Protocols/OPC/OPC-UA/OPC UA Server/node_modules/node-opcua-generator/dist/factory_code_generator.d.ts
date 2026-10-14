/**
 * @module node-opcua-generator
 */
import { IStructuredTypeSchema } from "node-opcua-factory";
import { WriteFunc } from "./utils/write_func";
export declare function get_class_TScript_filename(schemaName: string, optionalFolder?: string): string;
export declare function get_class_JScript_filename(schemaName: string, optionalFolder?: string): string;
export declare function writeStructuredType(write: WriteFunc, schema: IStructuredTypeSchema): void;
export declare function produce_TScript_code(schema: IStructuredTypeSchema, localSchemaFile: string, generatedTypescriptFilename: string): void;
