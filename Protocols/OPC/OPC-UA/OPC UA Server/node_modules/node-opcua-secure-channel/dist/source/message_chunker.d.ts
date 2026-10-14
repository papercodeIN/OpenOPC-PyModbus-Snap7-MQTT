/**
 * @module node-opcua-secure-channel
 */
import { StatusCode } from "node-opcua-basic-types";
import { BaseUAObject } from "node-opcua-factory";
import { MessageSecurityMode } from "node-opcua-service-secure-channel";
import { SecureMessageChunkManager, SecureMessageChunkManagerOptions, SecurityHeader } from "./secure_message_chunk_manager";
export interface MessageChunkerOptions {
    securityHeader?: SecurityHeader;
    securityMode: MessageSecurityMode;
    maxMessageSize?: number;
    maxChunkCount?: number;
}
export type MessageCallbackFunc = (chunk: Buffer | null) => void;
export interface ChunkMessageParameters {
    channelId: number;
    securityHeader: SecurityHeader;
    securityOptions: SecureMessageChunkManagerOptions;
}
export declare class MessageChunker {
    #private;
    static defaultMaxMessageSize: number;
    static readonly defaultChunkCount: number;
    maxMessageSize: number;
    maxChunkCount: number;
    securityMode: MessageSecurityMode;
    constructor(options?: MessageChunkerOptions);
    dispose(): void;
    prepareChunk(msgType: string, params: ChunkMessageParameters, messageLength: number): {
        statusCode: StatusCode;
        chunkManager: SecureMessageChunkManager | null;
    };
    chunkSecureMessage(msgType: string, params: ChunkMessageParameters, message: BaseUAObject, messageChunkCallback: MessageCallbackFunc): StatusCode;
}
