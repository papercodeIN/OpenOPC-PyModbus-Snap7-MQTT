import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
import { BasicTypeDefinition, BasicTypeDefinitionOptions, BasicTypeDefinitionOptionsBase, CommonInterface, FieldCategory, TypeSchemaConstructorOptions } from "./types";
/**
 * a type Schema for a OPCUA object
 */
export declare class TypeSchemaBase implements CommonInterface {
    name: string;
    defaultValue: any;
    encode?: (value: any, stream: OutputBinaryStream) => void;
    decode?: (stream: BinaryStream) => any;
    coerce?: (value: any) => any;
    toJSON?: () => string;
    category: FieldCategory;
    subType: string;
    isAbstract: boolean;
    constructor(options: TypeSchemaConstructorOptions);
    /**

     * @param defaultValue {*} the default value
     * @return {*}
     */
    computer_default_value(defaultValue: unknown): any;
    getBaseType(): CommonInterface | null;
    isSubTypeOf(type: CommonInterface): boolean;
}
export declare class BasicTypeSchema extends TypeSchemaBase implements BasicTypeDefinition {
    subType: string;
    isAbstract: boolean;
    encode: (value: any, stream: OutputBinaryStream) => void;
    decode: (stream: BinaryStream) => any;
    constructor(options: BasicTypeDefinitionOptions);
}
/**

 * @param schema {TypeSchemaBase}
 */
export declare function registerType(schema: BasicTypeDefinitionOptionsBase): void;
export declare const registerBuiltInType: typeof registerType;
export declare function unregisterType(typeName: string): void;
export declare function getBuiltInType(name: string): TypeSchemaBase;
export declare function hasBuiltInType(name: string): boolean;
/** */
export declare function findBuiltInType(dataTypeName: string): BasicTypeDefinition;
