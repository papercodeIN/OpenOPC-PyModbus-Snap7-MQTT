/***
 * @module node-opcua-chunkmanager
 */
import { EventEmitter } from "events";
export declare function verify_message_chunk(messageChunk: Buffer): void;
export type WriteHeaderFunc = (this: ChunkManager, chunk: Buffer, isLast: boolean, expectedLength: number) => void;
export type WriteSequenceHeaderFunc = (this: ChunkManager, chunk: Buffer) => void;
export type SignBufferFunc = (this: ChunkManager, buffer: Buffer) => Buffer;
export type EncryptBufferFunc = (this: ChunkManager, buffer: Buffer) => Buffer;
export interface IChunkManagerOptions {
    chunkSize: number;
    signatureLength: number;
    sequenceHeaderSize: number;
    cipherBlockSize: number;
    plainBlockSize: number;
    signBufferFunc?: SignBufferFunc;
    encryptBufferFunc?: EncryptBufferFunc;
    writeSequenceHeaderFunc?: WriteSequenceHeaderFunc;
    headerSize: number;
    writeHeaderFunc?: WriteHeaderFunc;
}
export declare enum Mode {
    None = 1,
    Sign = 2,
    SignAndEncrypt = 3
}
export declare class ChunkManager extends EventEmitter {
    #private;
    readonly chunkSize: number;
    readonly headerSize: number;
    readonly maxBodySize: number;
    readonly signatureLength: number;
    readonly sequenceHeaderSize: number;
    readonly cipherBlockSize: number;
    readonly plainBlockSize: number;
    readonly securityMode: Mode;
    constructor(securityMode: Mode, options: IChunkManagerOptions);
    evaluateTotalLengthAndChunks(bodySize: number): {
        totalLength: number;
        chunkCount: number;
    };
    write(buffer: Buffer, length?: number): void;
    end(): void;
}
