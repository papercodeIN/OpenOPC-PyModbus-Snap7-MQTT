/**
 * @module node-opcua-service-secure-channel
 */
import { UInt32 } from "node-opcua-basic-types";
import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
import { BaseUAObject, IStructuredTypeSchema } from "node-opcua-factory";
export declare class SymmetricAlgorithmSecurityHeader extends BaseUAObject {
    static possibleFields: string[];
    static schema: IStructuredTypeSchema;
    tokenId: UInt32;
    constructor(options?: any);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
}
