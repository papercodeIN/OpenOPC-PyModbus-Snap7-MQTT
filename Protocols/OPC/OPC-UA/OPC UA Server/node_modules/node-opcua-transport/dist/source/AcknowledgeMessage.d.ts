/**
 * @module node-opcua-transport
 */
import { UInt32 } from "node-opcua-basic-types";
import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
import { BaseUAObject, IStructuredTypeSchema } from "node-opcua-factory";
import { IHelloAckLimits } from "./i_hello_ack_limits";
interface AcknowledgeMessageOptions extends Partial<IHelloAckLimits> {
    protocolVersion?: UInt32;
}
export declare class AcknowledgeMessage extends BaseUAObject implements IHelloAckLimits {
    static possibleFields: string[];
    static schema: IStructuredTypeSchema;
    protocolVersion: UInt32;
    receiveBufferSize: UInt32;
    sendBufferSize: UInt32;
    maxMessageSize: UInt32;
    maxChunkCount: UInt32;
    constructor(options?: AcknowledgeMessageOptions);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    toString(): string;
}
export {};
