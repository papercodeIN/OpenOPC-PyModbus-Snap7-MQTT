/**
 * @module node-opcua-transport
 */
import url from "url";
import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
import { BaseUAObject } from "node-opcua-factory";
export type ConstructorFunc = new (...args: any[]) => BaseUAObject;
export declare function decodeMessage(stream: BinaryStream, classNameConstructor: ConstructorFunc): BaseUAObject;
export declare function packTcpMessage(msgType: string, encodableObject: BaseUAObject): Buffer;
export declare function parseEndpointUrl(endpointUrl: string): url.Url;
export declare function is_valid_endpointUrl(endpointUrl: string): boolean;
export declare function writeTCPMessageHeader(msgType: string, chunkType: string, totalLength: number, stream: OutputBinaryStream): void;
