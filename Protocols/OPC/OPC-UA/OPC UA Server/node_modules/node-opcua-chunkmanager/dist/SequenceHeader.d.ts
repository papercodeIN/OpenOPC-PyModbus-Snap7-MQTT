/***
 * @module node-opcua-chunkmanager
 */
import { UInt32 } from "node-opcua-basic-types";
import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
import { BaseUAObject, IStructuredTypeSchema } from "node-opcua-factory";
export interface SequenceHeaderOptions {
    sequenceNumber?: UInt32;
    requestId?: UInt32;
}
export declare class SequenceHeader extends BaseUAObject {
    static possibleFields: string[];
    static schema: IStructuredTypeSchema;
    sequenceNumber: UInt32;
    requestId: UInt32;
    constructor(options?: SequenceHeaderOptions);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
}
