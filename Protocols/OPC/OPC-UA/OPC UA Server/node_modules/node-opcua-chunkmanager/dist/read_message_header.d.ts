/***
 * @module node-opcua-chunkmanager
 */
import { BinaryStream } from "node-opcua-binary-stream";
import { MessageHeader } from "node-opcua-packet-assembler";
export declare function readMessageHeader(stream: BinaryStream): MessageHeader;
