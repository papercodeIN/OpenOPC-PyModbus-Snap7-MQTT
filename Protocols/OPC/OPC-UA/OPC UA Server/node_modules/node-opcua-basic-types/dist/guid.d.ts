/***
 * @module node-opcua-basic-types
 */
import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
export { isValidGuid, emptyGuid } from "node-opcua-guid";
export type Guid = string;
export declare function randomGuid(): Guid;
export declare function encodeGuid(guid: Guid, stream: OutputBinaryStream): void;
export declare function decodeGuid(stream: BinaryStream, value?: Guid): Guid;
