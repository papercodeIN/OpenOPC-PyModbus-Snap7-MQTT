import { ErrorCallback } from "node-opcua-status-code";
import { ISocketLike, TCP_transport } from "./tcp_transport";
import { IHelloAckLimits } from "./i_hello_ack_limits";
export interface ITransportParameters {
    minBufferSize: number;
    maxBufferSize: number;
    minMaxMessageSize: number;
    defaultMaxMessageSize: number;
    maxMaxMessageSize: number;
    minMaxChunkCount: number;
    defaultMaxChunkCount: number;
    maxMaxChunkCount: number;
}
export declare function adjustLimitsWithParameters(helloMessage: IHelloAckLimits, params: ITransportParameters): IHelloAckLimits;
interface ServerTCP_transportOptions {
    adjustLimits?: (hello: IHelloAckLimits) => IHelloAckLimits;
}
/**
 * @private
 */
export declare class ServerTCP_transport extends TCP_transport {
    static throttleTime: number;
    private _aborted;
    private _helloReceived;
    private adjustLimits;
    constructor(options?: ServerTCP_transportOptions);
    toString(): string;
    protected _write_chunk(messageChunk: Buffer): void;
    /**
     * Initialize the server transport.
     *
     *
     *  The ServerTCP_transport initialization process starts by waiting for the client to send a "HEL" message.
     *
     *  The  ServerTCP_transport replies with a "ACK" message and then start waiting for further messages of any size.
     *
     *  The callback function received an error:
     *   - if no message from the client is received within the ```self.timeout``` period,
     *   - or, if the connection has dropped within the same interval.
     *   - if the protocol version specified within the HEL message is invalid or is greater
     *     than ```self.protocolVersion```
     *
     *
     */
    init(socket: ISocketLike, callback: ErrorCallback): void;
    private _abortWithError;
    private _send_ACK_response;
    private _install_HEL_message_receiver;
    private _on_HEL_message;
}
export {};
