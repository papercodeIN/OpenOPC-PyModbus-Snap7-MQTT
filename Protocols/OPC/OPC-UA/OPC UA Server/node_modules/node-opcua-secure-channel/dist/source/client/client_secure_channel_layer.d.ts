import { EventEmitter } from "events";
import { Certificate, PrivateKey } from "node-opcua-crypto/web";
import { ChannelSecurityToken, MessageSecurityMode } from "node-opcua-service-secure-channel";
import { CallbackT } from "node-opcua-status-code";
import { ClientTCP_transport, TransportSettingsOptions } from "node-opcua-transport";
import { ErrorCallback } from "node-opcua-status-code";
import { BaseUAObject } from "node-opcua-factory";
import { MessageBuilder } from "../message_builder";
import { SecurityPolicy } from "../security_policy";
import { ICertificateKeyPairProvider, Request, Response } from "../common";
import { ClientTransactionStatistics } from "../utils";
import { SecurityHeader } from "../secure_message_chunk_manager";
export declare const requestHandleNotSetValue = 3735928559;
type PerformTransactionCallback = CallbackT<Response>;
export interface ConnectionStrategyOptions {
    maxRetry?: number;
    initialDelay?: number;
    maxDelay?: number;
    randomisationFactor?: number;
}
export interface ConnectionStrategy {
    maxRetry: number;
    initialDelay: number;
    maxDelay: number;
    randomisationFactor: number;
}
export declare function coerceConnectionStrategy(options?: ConnectionStrategyOptions | null): ConnectionStrategy;
export interface ClientSecureChannelParent extends ICertificateKeyPairProvider {
    applicationName?: string;
    clientName?: string;
    getCertificate(): Certificate;
    getCertificateChain(): Certificate;
    getPrivateKey(): PrivateKey;
}
/***
 * @param [options.factory] an factory that provides a method createObjectId(id) for the message builder
 */
export interface ClientSecureChannelLayerOptions {
    /**
     * default secure token life time , if not specified  30 seconds will be used as default value
     */
    defaultSecureTokenLifetime?: number;
    /**
     * defaultTransactionTimeout the default transaction timeout in unit of ms. Default value is 15 seconds.
     * If not specified, the default Transaction timeout will be taken from the global static variable ClientSecureChannelLayer.defaultTransactionTimeout
     */
    defaultTransactionTimeout?: number;
    /**
     * delay SecureTokenLifetime at which token renewal will be attempted.
     *
     * if 0 or not specify, the security token renewal will happen at 75% of defaultSecureTokenLifetime
     */
    tokenRenewalInterval?: number;
    /**
     *  message security mode
     *  default value =MessageSecurityMode.None
     */
    securityMode?: MessageSecurityMode;
    /**
     * security policy
     * default value = SecurityPolicy.None
     */
    securityPolicy?: SecurityPolicy;
    /**
     * the serverCertificate (required if securityMode!=None)
     */
    serverCertificate?: Certificate;
    parent?: ClientSecureChannelParent;
    /**
     *   the transport timeout in ms ( default = 60  seconds) sue for the Net.Socket timeout detection
     *   if 0 or not specify, the transport timeout will default  to ClientSecureChannelLayer.defaultTransportTimeout
     */
    transportTimeout?: number;
    /**
     * the connection strategy options
     * @param [options.connectionStrategy.maxRetry      = 10]
     * @param [options.connectionStrategy.initialDelay  = 10]
     * @param [options.connectionStrategy.maxDelay      = 10000]
     */
    connectionStrategy?: ConnectionStrategyOptions;
    transportSettings?: TransportSettingsOptions;
}
export interface ClientSecureChannelLayer extends EventEmitter {
    on(event: "end_transaction", eventHandler: (transactionStatistics: ClientTransactionStatistics) => void): this;
    on(event: "close", eventHandler: (err?: Error | null) => void): this;
    on(event: "lifetime_75", eventHandler: (securityToken: ChannelSecurityToken) => void): this;
    on(event: "receive_chunk", eventHandler: (chunk: Buffer) => void): this;
    on(event: "send_chunk", eventHandler: (chunk: Buffer) => void): this;
    on(event: "backoff", eventHandler: (retryCount: number, delay: number) => void): this;
    on(event: "security_token_created", eventHandler: (token: ChannelSecurityToken) => void): this;
    on(event: "security_token_renewed", eventHandler: (token: ChannelSecurityToken) => void): this;
    on(event: "send_request", eventHandler: (request: Request, msgType: string, securityHeader: SecurityHeader) => void): this;
    on(event: "receive_response", eventHandler: (response: Response) => void): this;
    on(event: "timed_out_request", eventHandler: (request: Request) => void): this;
    on(event: "abort", eventHandler: () => void): this;
    on(event: "beforePerformTransaction", eventHandler: (msgType: string, request: Request) => void): boolean;
    on(event: "message", eventHandler: (response: BaseUAObject, msgType: string, securityHeader: SecurityHeader, requestId: number, channelId: number) => void): this;
    emit(event: "end_transaction", transactionStatistics: ClientTransactionStatistics): boolean;
    /**
     * notify the observers that the transport connection has ended.
     * The error object is null or undefined if the disconnection was initiated by the ClientSecureChannelLayer.
     * A Error object is provided if the disconnection has been initiated by an external cause.
     *
     * @event close
     */
    emit(event: "close", err?: Error | null): boolean;
    /**
     * notify the observer that the secure channel has now reach 75% of its allowed live time and
     * that a new token is going to be requested.
     * @event  lifetime_75
     * @param  securityToken {Object} : the security token that is about to expire.
     *
     */
    emit(event: "lifetime_75", securityToken: ChannelSecurityToken): boolean;
    /**
     * notify the observers that ClientSecureChannelLayer has received a message chunk
     * @event receive_chunk
     */
    emit(event: "receive_chunk", chunk: Buffer): boolean;
    /**
     * notify the observer that a message chunk is about to be sent to the server
     * @event send_chunk
     */
    emit(event: "send_chunk", chunk: Buffer): boolean;
    emit(event: "backoff", retryCount: number, delay: number): boolean;
    /**
     * notify the observers that the security has been renewed
     * @event security_token_renewed
     */
    emit(event: "security_token_renewed", token: ChannelSecurityToken): boolean;
    emit(event: "security_token_created", token: ChannelSecurityToken): boolean;
    /**
     * notify the observer that a client request is being sent the server
     * @event send_request
     */
    emit(event: "send_request", request: Request, msgType: string, securityHeader: SecurityHeader): boolean;
    /**
     * notify the observers that a server response has been received on the channel
     * @event receive_response
     */
    emit(event: "receive_response", response: Response): boolean;
    /**
     * notify the observer that the response from the request has not been
     * received within the timeoutHint specified
     * @event timed_out_request
     */
    emit(event: "timed_out_request", request: Request): boolean;
    emit(event: "abort"): boolean;
    emit(event: "beforePerformTransaction", msgType: string, request: Request): boolean;
    /**
     * emitting when a message is received from the server
     */
    emit(event: "message", response: BaseUAObject, msgType: string, securityHeader: SecurityHeader, requestId: number, channelId: number): boolean;
}
/**
 * a ClientSecureChannelLayer represents the client side of the OPCUA secure channel.
 */
export declare class ClientSecureChannelLayer extends EventEmitter {
    #private;
    private static g_counter;
    static minTransactionTimeout: number;
    static defaultTransactionTimeout: number;
    static defaultTransportTimeout: number;
    /**
     *
     * maxClockSkew: The amount of clock skew that can be tolerated between server and client clocks
     *
     * from https://reference.opcfoundation.org/Core/Part6/v104/docs/6.3
     *
     *  The amount of clock skew that can be tolerated depends on the system security requirements
     *  and applications shall allow administrators to configure the acceptable clock skew when
     *  verifying times. A suitable default value is 5 minutes.
     */
    static maxClockSkew: number;
    defaultTransactionTimeout: number;
    /**
     * true if the secure channel is trying to establish the connection with the server. In this case, the client
     * may be in the middle of the backoff connection process.
     *
     */
    get isConnecting(): boolean;
    get bytesRead(): number;
    get bytesWritten(): number;
    get timeDrift(): number;
    get transactionsPerformed(): number;
    get timedOutRequestCount(): number;
    protocolVersion: number;
    readonly securityMode: MessageSecurityMode;
    readonly securityPolicy: SecurityPolicy;
    endpointUrl: string;
    channelId: number;
    activeSecurityToken: ChannelSecurityToken | null;
    last_transaction_stats: any | ClientTransactionStatistics;
    private __call;
    constructor(options: ClientSecureChannelLayerOptions);
    getTransportSettings(): {
        maxMessageSize: number;
    };
    get transportTimeout(): number;
    getPrivateKey(): PrivateKey | null;
    getCertificateChain(): Certificate | null;
    getCertificate(): Certificate | null;
    toString(): string;
    isTransactionInProgress(): boolean;
    /**
     * establish a secure channel with the provided server end point.
     *
     * @example
     *
     *    ```javascript
     *
     *    const secureChannel  = new ClientSecureChannelLayer({});
     *
     *    secureChannel.on("end", function(err) {
     *         console.log("secure channel has ended",err);
     *         if(err) {
     *            console.log(" the connection was closed by an external cause such as server shutdown");
     *        }
     *    });
     *    secureChannel.create("opc.tcp://localhost:1234/UA/Sample", (err) => {
     *         if(err) {
     *              console.log(" cannot establish secure channel" , err);
     *         } else {
     *              console.log("secure channel has been established");
     *         }
     *    });
     *
     *    ```
     */
    create(endpointUrl: string, callback: ErrorCallback): void;
    dispose(): void;
    sabotageConnection(): void;
    /**
     * forceConnectionBreak is a private api method that
     * can be used to simulate a connection break or
     * terminate the channel in case of a socket timeout that
     * do not produce a socket close event
     * @private
     */
    forceConnectionBreak(): void;
    abortConnection(callback: ErrorCallback): void;
    /**
     * perform a OPC-UA message transaction, asynchronously.
     * During a transaction, the client sends a request to the server. The provided callback will be invoked
     * at a later stage with the reply from the server, or the error.
     *
     * preconditions:
     *   - the channel must be opened
     *
     * @example
     *
     *    ```javascript
     *    let secure_channel ; // get a  ClientSecureChannelLayer somehow
     *
     *    const request = new BrowseRequest({...});
     *    secure_channel.performMessageTransaction(request, (err,response) => {
     *       if (err) {
     *         // an error has occurred
     *       } else {
     *          assert(response instanceof BrowseResponse);
     *         // do something with response.
     *       }
     *    });
     *    ```
     *
     */
    performMessageTransaction(request: Request, callback: PerformTransactionCallback): void;
    isValid(): boolean;
    isOpened(): boolean;
    getDisplayName(): string;
    cancelPendingTransactions(callback: ErrorCallback): void;
    /**
     * Close a client SecureChannel ,by sending a CloseSecureChannelRequest to the server.
     *
     * After this call, the connection is closed and no further transaction can be made.
     */
    close(callback: ErrorCallback): void;
    /**
     * @private internal use only : (used for test)
     */
    getTransport(): ClientTCP_transport | undefined;
    /**
     * @private internal use only : (use for testing purpose)
     */
    _getMessageBuilder(): MessageBuilder | undefined;
    /**
     * @private internal function
     */
    beforeSecurityRenew: () => Promise<void>;
}
export {};
