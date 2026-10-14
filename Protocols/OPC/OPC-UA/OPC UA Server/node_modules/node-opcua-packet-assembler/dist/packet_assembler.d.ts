import { EventEmitter } from "events";
export interface MessageHeader {
    msgType: string;
    isFinal: string;
    length: number;
}
export interface PacketInfo {
    length: number;
    messageHeader: MessageHeader;
    extra: string;
}
export type ReadChunkFuncType = (data: Buffer) => PacketInfo;
export interface PacketAssemblerOptions {
    readChunkFunc: ReadChunkFuncType;
    minimumSizeInBytes: number;
    maxChunkSize: number;
}
export declare enum PacketAssemblerErrorCode {
    ChunkSizeExceeded = 1,
    ChunkTooSmall = 2
}
export interface PacketAssembler {
    on(eventName: "startChunk", eventHandler: (packetInfo: PacketInfo, partial: Buffer) => void): this;
    on(eventName: "chunk", eventHandler: (chunk: Buffer) => void): this;
    on(eventName: "error", eventHandler: (err: Error, errCode: PacketAssemblerErrorCode) => void): this;
}
/**
 * this class is used to assemble partial data from the transport layer
 * into message chunks
 */
export declare class PacketAssembler extends EventEmitter {
    static defaultMaxChunkCount: number;
    static defaultMaxMessageSize: number;
    private readonly _stack;
    private expectedLength;
    private currentLength;
    private maxChunkSize;
    private readonly readChunkFunc;
    private readonly minimumSizeInBytes;
    private packetInfo?;
    constructor(options: PacketAssemblerOptions);
    feed(data: Buffer): void;
    private _readPacketInfo;
    private _buildData;
}
