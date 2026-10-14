import { ReaderStateParserLike } from "./xml2json";
type UAString = string | null;
type NodeIdLike = string | null;
type Int32 = number;
type UInt32 = number;
type UABoolean = boolean;
type LocalizedTextLike = string | null;
export interface StructureFieldOptions {
    name?: UAString;
    description?: LocalizedTextLike | null;
    dataType?: NodeIdLike | null;
    valueRank?: Int32;
    arrayDimensions?: UInt32[] | null;
    maxStringLength?: UInt32;
    isOptional?: UABoolean;
}
export declare const _definitionParser: ReaderStateParserLike;
export declare const definitionReaderStateParser: ReaderStateParserLike;
export {};
