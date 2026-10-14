import { OutputBinaryStream, BinaryStream } from "node-opcua-binary-stream";
export declare function defaultEncode(value: any, stream: OutputBinaryStream): void;
export declare function defaultDecode(stream: BinaryStream): any;
export declare function defaultGuidValue(): any;
export declare function toJSONGuid(value: any): any;
export declare function encodeAny(value: any, stream: OutputBinaryStream): void;
export declare function decodeAny(stream: BinaryStream): void;
export declare function encodeNull(value: any, stream: OutputBinaryStream): void;
export declare function decodeNull(stream: BinaryStream): any;
