import { BinaryStream } from "node-opcua-binary-stream";
import { PrivateKey } from "node-opcua-crypto/web";
import { BaseUAObject } from "node-opcua-factory";
import { ExpandedNodeId } from "node-opcua-nodeid";
import { MessageSecurityMode } from "node-opcua-service-secure-channel";
import { StatusCode } from "node-opcua-status-code";
import { MessageBuilderBase, MessageBuilderBaseOptions } from "node-opcua-transport";
import { SecurityHeader } from "./secure_message_chunk_manager";
import { SecurityPolicy } from "./security_policy";
import { IDerivedKeyProvider } from "./token_stack";
export interface ObjectFactory {
    constructObject: (binaryEncodingNodeId: ExpandedNodeId) => BaseUAObject;
    hasConstructor: (binaryEncodingNodeId: ExpandedNodeId) => boolean;
}
export interface MessageBuilderOptions extends MessageBuilderBaseOptions {
    securityMode?: MessageSecurityMode;
    privateKey?: PrivateKey;
    objectFactory?: ObjectFactory;
    signatureLength?: number;
    name: string;
}
export declare const invalidPrivateKey: PrivateKey;
type PacketInfo = any;
export interface MessageBuilder extends MessageBuilderBase {
    on(eventName: "startChunk", eventHandler: (info: PacketInfo, data: Buffer) => void): this;
    on(eventName: "chunk", eventHandler: (chunk: Buffer) => void): this;
    on(eventName: "error", eventHandler: (err: Error, statusCode: StatusCode, requestId: number | null) => void): this;
    on(eventName: "full_message_body", eventHandler: (fullMessageBody: Buffer) => void): this;
    on(eventName: "message", eventHandler: (obj: BaseUAObject, msgType: string, securityHeader: SecurityHeader, requestId: number, channelId: number) => void): this;
    on(eventName: "abandon", eventHandler: (requestId: number) => void): this;
    on(eventName: "invalid_message", eventHandler: (obj: BaseUAObject) => void): this;
    on(eventName: "invalid_sequence_number", eventHandler: (expectedSequenceNumber: number, sequenceNumber: number) => void): this;
    on(eventName: "new_token", eventHandler: (tokenId: number) => void): this;
    once(eventName: "startChunk", eventHandler: (info: PacketInfo, data: Buffer) => void): this;
    once(eventName: "chunk", eventHandler: (chunk: Buffer) => void): this;
    once(eventName: "error", eventHandler: (err: Error, statusCode: StatusCode, requestId: number | null) => void): this;
    once(eventName: "full_message_body", eventHandler: (fullMessageBody: Buffer) => void): this;
    once(eventName: "message", eventHandler: (obj: BaseUAObject, msgType: string, securityHeader: SecurityHeader, requestId: number, channelId: number) => void): this;
    once(eventName: "abandon", eventHandler: (requestId: number) => void): this;
    once(eventName: "invalid_message", eventHandler: (obj: BaseUAObject) => void): this;
    once(eventName: "invalid_sequence_number", eventHandler: (expectedSequenceNumber: number, sequenceNumber: number) => void): this;
    once(eventName: "new_token", eventHandler: (tokenId: number) => void): this;
    prependListener(eventName: "startChunk", eventHandler: (info: PacketInfo, data: Buffer) => void): this;
    prependListener(eventName: "chunk", eventHandler: (chunk: Buffer) => void): this;
    prependListener(eventName: "error", eventHandler: (err: Error, statusCode: StatusCode, requestId: number | null) => void): this;
    prependListener(eventName: "full_message_body", eventHandler: (fullMessageBody: Buffer) => void): this;
    prependListener(eventName: "message", eventHandler: (obj: BaseUAObject, msgType: string, securityHeader: SecurityHeader, requestId: number, channelId: number) => void): this;
    prependListener(eventName: "abandon", eventHandler: (requestId: number) => void): this;
    prependListener(eventName: "invalid_message", eventHandler: (obj: BaseUAObject) => void): this;
    prependListener(eventName: "invalid_sequence_number", eventHandler: (expectedSequenceNumber: number, sequenceNumber: number) => void): this;
    prependListener(eventName: "new_token", eventHandler: (tokenId: number) => void): this;
    prependOnceListener(eventName: "startChunk", eventHandler: (info: PacketInfo, data: Buffer) => void): this;
    prependOnceListener(eventName: "chunk", eventHandler: (chunk: Buffer) => void): this;
    prependOnceListener(eventName: "error", eventHandler: (err: Error, statusCode: StatusCode, requestId: number | null) => void): this;
    prependOnceListener(eventName: "full_message_body", eventHandler: (fullMessageBody: Buffer) => void): this;
    prependOnceListener(eventName: "message", eventHandler: (obj: BaseUAObject, msgType: string, securityHeader: SecurityHeader, requestId: number, channelId: number) => void): this;
    prependOnceListener(eventName: "abandon", eventHandler: (requestId: number) => void): this;
    prependOnceListener(eventName: "invalid_message", eventHandler: (obj: BaseUAObject) => void): this;
    prependOnceListener(eventName: "invalid_sequence_number", eventHandler: (expectedSequenceNumber: number, sequenceNumber: number) => void): this;
    prependOnceListener(eventName: "new_token", eventHandler: (tokenId: number) => void): this;
    emit(eventName: "startChunk", info: PacketInfo, data: Buffer): boolean;
    emit(eventName: "chunk", chunk: Buffer): boolean;
    emit(eventName: "error", err: Error, statusCode: StatusCode, requestId: number | null): boolean;
    emit(eventName: "full_message_body", fullMessageBody: Buffer): boolean;
    emit(eventName: "message", obj: BaseUAObject, msgType: string, securityHeader: SecurityHeader, requestId: number, channelId: number): boolean;
    emit(eventName: "invalid_message", object: BaseUAObject): boolean;
    emit(eventName: "invalid_sequence_number", expectedSequenceNumber: number, sequenceNumber: number): boolean;
    emit(eventName: "new_token", tokenId: number): boolean;
    emit(eventName: "abandon"): boolean;
}
/**
 */
export declare class MessageBuilder extends MessageBuilderBase {
    #private;
    securityPolicy: SecurityPolicy;
    securityMode: MessageSecurityMode;
    securityHeader?: SecurityHeader;
    protected id: string;
    /**
     *
     * @param derivedKeyProvider the key for client signing verification
     * @param options
     */
    constructor(derivedKeyProvider: IDerivedKeyProvider, options: MessageBuilderOptions);
    setSecurity(securityMode: MessageSecurityMode, securityPolicy: SecurityPolicy): void;
    dispose(): void;
    protected _read_headers(binaryStream: BinaryStream): boolean;
    protected _decodeMessageBody(fullMessageBody: Buffer): boolean;
}
export {};
