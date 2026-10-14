/**
 * @module node-opcua-secure-channel
 */
import { EventEmitter } from "events";
import { EncryptBufferFunc, Mode, SignBufferFunc } from "node-opcua-chunkmanager";
import { AsymmetricAlgorithmSecurityHeader, SymmetricAlgorithmSecurityHeader } from "node-opcua-service-secure-channel";
import { SequenceNumberGenerator } from "./sequence_number_generator";
export type SecurityHeader = AsymmetricAlgorithmSecurityHeader | SymmetricAlgorithmSecurityHeader;
export declare function chooseSecurityHeader(msgType: string): SecurityHeader;
export type VerifyBufferFunc = (chunk: Buffer) => boolean;
export interface SecureMessageChunkManagerOptions {
    chunkSize: number;
    channelId?: number;
    requestId: number;
    signatureLength: number;
    sequenceHeaderSize: number;
    plainBlockSize: number;
    cipherBlockSize: number;
    encryptBufferFunc?: EncryptBufferFunc;
    signBufferFunc?: SignBufferFunc;
    verifyBufferFunc?: VerifyBufferFunc;
}
export declare class SecureMessageChunkManager extends EventEmitter {
    #private;
    private readonly msgType;
    private readonly channelId;
    constructor(mode: Mode, msgType: string, channelId: number, options: SecureMessageChunkManagerOptions, securityHeader: SecurityHeader, sequenceNumberGenerator: SequenceNumberGenerator);
    evaluateTotalLengthAndChunks(bodySize: number): {
        totalLength: number;
        chunkCount: number;
    };
    write_header(finalC: string, buffer: Buffer, length: number): void;
    writeSequenceHeader(buffer: Buffer): void;
    write(buffer: Buffer, length?: number): void;
    abort(): void;
    end(): void;
}
