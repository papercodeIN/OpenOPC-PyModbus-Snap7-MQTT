import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
import { Enum, EnumItem, _TypescriptEnum } from "node-opcua-enum";
import { NodeId } from "node-opcua-nodeid";
import { TypeSchemaBase } from "./builtin_types";
import { EnumerationDefinition, TypeSchemaConstructorOptions } from "./types";
export interface EnumerationDefinitionOptions extends TypeSchemaConstructorOptions {
    enumValues: _TypescriptEnum | string[];
    typedEnum?: Enum;
    lengthInBits?: number;
    defaultValue?: EnumItem;
    encode?: (value: EnumItem, stream: OutputBinaryStream) => void;
    decode?: (stream: BinaryStream) => EnumItem;
}
export declare class EnumerationDefinitionSchema extends TypeSchemaBase implements EnumerationDefinition {
    enumValues: _TypescriptEnum;
    typedEnum: Enum;
    lengthInBits: number;
    dataTypeNodeId: NodeId;
    constructor(dataTypeNodeId: NodeId, options: EnumerationDefinitionOptions);
}
/**

 * @param options
 * @param options.name {string}
 * @param options.enumValues [{key:Name, value:values}]
 * @param options.encode
 * @param options.decode
 * @param options.typedEnum
 * @param options.defaultValue
 * @return {Enum}
 */
export declare function registerEnumeration(options: EnumerationDefinitionOptions): Enum;
export declare function hasBuiltInEnumeration(enumerationName: string): boolean;
export declare function getBuiltInEnumeration(enumerationName: string): EnumerationDefinitionSchema;
