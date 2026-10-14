import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
export interface BasicTypeOptions {
    name: string;
    subType: string;
    encode?: (value: any, stream: OutputBinaryStream) => void;
    decode?: (stream: BinaryStream) => void;
    validate?: (value: any) => boolean;
    coerce?: (value: any) => any;
    toJSON?: (value: any) => any;
    random?: () => any;
    defaultValue?: any;
}
/**
 * register a Basic Type ,
 * A basic type is new entity type that resolved to  a SubType
 * @example:
 *
 *
 *   registerBasicType({name:"Duration"   ,subType:"Double"});
 *

 * @param schema
 * @param schema.name {String}
 * @param schema.subType {String} mandatory, the basic type from which the new type derives.
 *
 * @param [schema.encode] {Function} optional,a specific encoder function to encode an instance of this type.
 * @param schema.encode.value  {*}
 * @param schema.encode.stream {BinaryStream}
 *
 * @param [schema.decode] optional,a specific decoder function that returns  the decode value out of the stream.
 * @param [schema.decode.stream] {BinaryStream}
 *
 * @param [schema.coerce]  optional, a method to convert a value into the request type.
 * @param schema.coerce.value {*} the value to coerce.
 *
 * @param [schema.random] optional, a method to construct a random object of this type
 *
 * @param [schema.toJSON]optional, a method to convert a value into the request type.
 */
export declare function registerBasicType(schema: BasicTypeOptions): void;
