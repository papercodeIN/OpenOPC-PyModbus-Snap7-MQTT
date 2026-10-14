/**
 * @module node-opcua-transport
 */
import { EventEmitter } from "events";
import { BinaryStream } from "node-opcua-binary-stream";
import { SequenceHeader } from "node-opcua-chunkmanager";
import { MessageHeader, PacketInfo } from "node-opcua-packet-assembler";
import { StatusCode } from "node-opcua-status-code";
export declare function readRawMessageHeader(data: Buffer): PacketInfo;
export interface MessageBuilderBaseOptions {
    signatureLength?: number;
    maxMessageSize?: number;
    maxChunkCount?: number;
    maxChunkSize?: number;
}
export interface MessageBuilderBase {
    /**
     *
     * notify the observers that a new message is being built
     * @event start_chunk
     * @param info
     * @param data
     */
    on(eventName: "startChunk", eventHandler: (info: PacketInfo, data: Buffer) => void): this;
    /**
     * notify the observers that new message chunk has been received
     * @event chunk
     * @param messageChunk the raw message chunk
     */
    on(eventName: "chunk", eventHandler: (chunk: Buffer) => void): this;
    /**
     * notify the observers that an error has occurred
     * @event error
     * @param error the error to raise
     */
    on(eventName: "error", eventHandler: (err: Error, statusCode: StatusCode, requestId: number | null) => void): this;
    /**
     * notify the observers that a full message has been received
     * @event full_message_body
     * @param full_message_body the full message body made of all concatenated chunks.
     */
    on(eventName: "full_message_body", eventHandler: (fullMessageBody: Buffer) => void): this;
    /**
     *
     * @param eventName "abandon"
     * @param info
     * @param data
     */
    on(eventName: "abandon", eventHandler: (requestId: number) => void): this;
    emit(eventName: "startChunk", info: PacketInfo, data: Buffer): boolean;
    emit(eventName: "chunk", chunk: Buffer): boolean;
    emit(eventName: "error", err: Error, statusCode: StatusCode, requestId: number | null): boolean;
    emit(eventName: "full_message_body", fullMessageBody: Buffer): boolean;
    emit(eventName: "abandon", requestId: number): boolean;
}
/**
 *
 */
export declare class MessageBuilderBase extends EventEmitter {
    #private;
    static defaultMaxChunkCount: number;
    static defaultMaxMessageSize: number;
    static defaultMaxChunkSize: number;
    readonly signatureLength: number;
    readonly maxMessageSize: number;
    readonly maxChunkCount: number;
    readonly maxChunkSize: number;
    readonly options: MessageBuilderBaseOptions;
    channelId: number;
    totalMessageSize: number;
    sequenceHeader: SequenceHeader | null;
    _tick0: number;
    _tick1: number;
    protected id: string;
    protected totalBodySize: number;
    protected messageChunks: Buffer[];
    protected messageHeader?: MessageHeader;
    constructor(options?: MessageBuilderBaseOptions);
    dispose(): void;
    /**
     * Feed message builder with some data

     * @param data
     */
    feed(data: Buffer): void;
    protected _decodeMessageBody(fullMessageBody: Buffer): boolean;
    protected _read_headers(binaryStream: BinaryStream): boolean;
    protected _report_abandon(channelId: number, tokenId: number, sequenceHeader: SequenceHeader): false;
    protected _report_error(statusCode: StatusCode, errorMessage: string): false;
}
