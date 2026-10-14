import { ErrorCallback } from "node-opcua-status-code";
import { TCP_transport } from "./tcp_transport";
import { AcknowledgeMessage } from "./AcknowledgeMessage";
export interface ClientTCP_transport {
    on(eventName: "chunk", eventHandler: (messageChunk: Buffer) => void): this;
    on(eventName: "close", eventHandler: (err: Error | null) => void): this;
    on(eventName: "connection_break", eventHandler: () => void): this;
    on(eventName: "connect", eventHandler: () => void): this;
    once(eventName: "chunk", eventHandler: (messageChunk: Buffer) => void): this;
    once(eventName: "close", eventHandler: (err: Error | null) => void): this;
    once(eventName: "connection_break", eventHandler: () => void): this;
    once(eventName: "connect", eventHandler: () => void): this;
    emit(eventName: "chunk", messageChunk: Buffer): boolean;
    emit(eventName: "close", err?: Error | null): boolean;
    emit(eventName: "connection_break"): boolean;
    emit(eventName: "connect"): boolean;
}
export interface TransportSettingsOptions {
    maxChunkCount?: number;
    maxMessageSize?: number;
    receiveBufferSize?: number;
    sendBufferSize?: number;
}
/**
 * a ClientTCP_transport connects to a remote server socket and
 * initiates a communication with a HEL/ACK transaction.
 * It negotiates the communication parameters with the other end.

 * @example
 *
 *    ```javascript
 *    const transport = ClientTCP_transport(url);
 *
 *    transport.timeout = 10000;
 *
 *    transport.connect(function (err)) {
 *         if (err) {
 *            // cannot connect
 *         } else {
 *            // connected
 *
 *         }
 *    });
 *    ....
 *
 *    transport.write(message_chunk, 'F');
 *
 *    ....
 *
 *    transport.on("chunk", function (message_chunk) {
 *        // do something with chunk from server...
 *    });
 *
 *
 * ```
 *
 *
 */
export declare class ClientTCP_transport extends TCP_transport {
    static defaultMaxChunk: number;
    static defaultMaxMessageSize: number;
    static defaultReceiveBufferSize: number;
    static defaultSendBufferSize: number;
    endpointUrl: string;
    serverUri: string;
    numberOfRetry: number;
    parameters?: AcknowledgeMessage;
    private _counter;
    private _helloSettings;
    constructor(transportSettings?: TransportSettingsOptions);
    getTransportSettings(): TransportSettingsOptions;
    dispose(): void;
    connect(endpointUrl: string, callback: ErrorCallback): void;
    private _handle_ACK_response;
    private _send_HELLO_request;
    private _on_ACK_response;
    private _perform_HEL_ACK_transaction;
}
