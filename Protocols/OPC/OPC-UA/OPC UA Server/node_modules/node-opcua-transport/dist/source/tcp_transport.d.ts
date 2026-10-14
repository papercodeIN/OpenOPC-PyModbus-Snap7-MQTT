/**
 * @module node-opcua-transport
 */
import { EventEmitter } from "events";
import { ErrorCallback, CallbackWithData, StatusCode } from "node-opcua-status-code";
export interface ISocketLike extends EventEmitter {
    remoteAddress?: string;
    remotePort?: number;
    write(data: string | Buffer, callback?: (err?: Error) => void | undefined): void;
    end(): void;
    setKeepAlive(enable?: boolean, initialDelay?: number): this;
    setNoDelay(noDelay?: boolean): this;
    setTimeout(timeout: number, callback?: () => void): this;
    destroy(err?: Error): void;
    destroyed: boolean;
    on(event: "close", listener: (hadError: boolean) => void): this;
    on(event: "connect", listener: () => void): this;
    on(event: "data", listener: (data: Buffer) => void): this;
    on(event: "end", listener: () => void): this;
    on(event: "error", listener: (err: Error) => void): this;
    on(event: "timeout", listener: () => void): this;
    once(event: "close", listener: (hadError: boolean) => void): this;
    once(event: "connect", listener: () => void): this;
    once(event: "data", listener: (data: Buffer) => void): this;
    once(event: "end", listener: () => void): this;
    once(event: "error", listener: (err: Error) => void): this;
    once(event: "timeout", listener: () => void): this;
    prependListener(event: "close", listener: (hadError: boolean) => void): this;
    prependListener(event: "connect", listener: () => void): this;
    prependListener(event: "data", listener: (data: Buffer) => void): this;
    prependListener(event: "end", listener: () => void): this;
    prependListener(event: "error", listener: (err: Error) => void): this;
    prependListener(event: "timeout", listener: () => void): this;
}
export interface IMockSocket extends ISocketLike {
    invalid?: boolean;
    write(data: string | Buffer, callback?: (err?: Error) => void | undefined): void;
    destroy(): void;
    end(): void;
    setKeepAlive(enable?: boolean, initialDelay?: number): this;
    setNoDelay(noDelay?: boolean): this;
    setTimeout(timeout: number, callback?: () => void): this;
}
export declare function setFakeTransport(mockSocket: IMockSocket): void;
export declare function getFakeTransport(): ISocketLike;
export interface TCP_transport {
    /**
     * notify the observers that a message chunk has been received
     * @event chunk
     * @param message_chunk the message chunk
     */
    on(eventName: "chunk", eventHandler: (messageChunk: Buffer) => void): this;
    /**
     * notify the observers that the transport layer has been disconnected.
     * @event close
     */
    on(eventName: "close", eventHandler: (err: Error | null) => void): this;
    once(eventName: "chunk", eventHandler: (messageChunk: Buffer) => void): this;
    once(eventName: "close", eventHandler: (err: Error | null) => void): this;
    emit(eventName: "close", err?: Error | null): boolean;
    emit(eventName: "chunk", messageChunk: Buffer): boolean;
}
export declare class TCP_transport extends EventEmitter {
    #private;
    private static registry;
    /**
     * the size of the header in bytes
     * @default  8
     */
    static readonly headerSize = 8;
    /**
     * indicates the version number of the OPCUA protocol used
     * @default  0
     */
    protocolVersion: number;
    maxMessageSize: number;
    maxChunkCount: number;
    sendBufferSize: number;
    receiveBufferSize: number;
    bytesWritten: number;
    bytesRead: number;
    chunkWrittenCount: number;
    chunkReadCount: number;
    name: string;
    _socket: ISocketLike | null;
    protected _theCloseError: Error | null;
    constructor();
    toString(): string;
    setLimits({ receiveBufferSize, sendBufferSize, maxMessageSize, maxChunkCount }: {
        receiveBufferSize: number;
        sendBufferSize: number;
        maxMessageSize: number;
        maxChunkCount: number;
    }): void;
    get timeout(): number;
    set timeout(value: number);
    dispose(): void;
    /**
     * write the message_chunk on the socket.

     * @param messageChunk
     */
    write(messageChunk: Buffer, callback?: (err?: Error) => void | undefined): void;
    isDisconnecting(): boolean;
    /**
     * disconnect the TCP layer and close the underlying socket.
     * The ```"close"``` event will be emitted to the observers with err=null.
     *
     */
    disconnect(callback: ErrorCallback): void;
    isValid(): boolean;
    protected _write_chunk(messageChunk: Buffer, callback?: (err?: Error) => void | undefined): void;
    protected _install_socket(socket: ISocketLike): void;
    sendErrorMessage(statusCode: StatusCode, extraErrorDescription: string | null): void;
    prematureTerminate(err: Error, statusCode: StatusCode): void;
    forceConnectionBreak(): void;
    /**

     *
     * install a one time message receiver callback
     *
     * Rules:
     * * TCP_transport will not emit the ```message``` event, while the "one time message receiver" is in operation.
     * * the TCP_transport will wait for the next complete message chunk and call the provided callback func
     *   ```callback(null,messageChunk);```
     *
     * if a messageChunk is not received within ```TCP_transport.timeout``` or if the underlying socket reports
     * an error, the callback function will be called with an Error.
     *
     */
    protected _install_one_time_message_receiver(callback: CallbackWithData): void;
    private _fulfill_pending_promises;
    private _on_message_chunk_received;
    private _cleanup_timers;
    private _start_one_time_message_receiver;
    private _on_socket_data;
    private _on_socket_close;
    protected _emitClose(err?: Error | null): void;
    private _on_socket_end;
    private _on_socket_error;
    private _on_socket_timeout;
}
