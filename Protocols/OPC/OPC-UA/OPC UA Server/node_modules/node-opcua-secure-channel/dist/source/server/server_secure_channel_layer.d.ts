import { EventEmitter } from "events";
import { Certificate, PublicKeyLength, PrivateKey } from "node-opcua-crypto/web";
import { MessageSecurityMode } from "node-opcua-service-secure-channel";
import { StatusCode } from "node-opcua-status-code";
import { IHelloAckLimits, ISocketLike } from "node-opcua-transport";
import { ErrorCallback } from "node-opcua-status-code";
import { EndpointDescription } from "node-opcua-service-endpoints";
import { ICertificateManager } from "node-opcua-certificate-manager";
import { ObjectRegistry } from "node-opcua-object-registry";
import { SecurityHeader } from "../secure_message_chunk_manager";
import { ICertificateKeyPairProvider, Request, Response } from "../common";
import { ObjectFactory } from "../message_builder";
import { SecurityPolicy } from "../security_policy";
export interface ServerSecureChannelParent extends ICertificateKeyPairProvider {
    certificateManager: ICertificateManager;
    getCertificate(): Certificate;
    getCertificateChain(): Certificate;
    getPrivateKey(): PrivateKey;
    getEndpointDescription(securityMode: MessageSecurityMode, securityPolicy: SecurityPolicy, endpointUri: string | null): EndpointDescription | null;
}
export interface ServerSecureChannelLayerOptions {
    parent: ServerSecureChannelParent;
    /**
     * timeout in milliseconds [default = 30000]
     */
    timeout?: number;
    /**
     * default secure token life time in milliseconds [default = 300000]
     */
    defaultSecureTokenLifetime?: number;
    objectFactory?: ObjectFactory;
    adjustTransportLimits?: (hello: IHelloAckLimits) => IHelloAckLimits;
}
export interface IServerSession {
    keepAlive?: () => void;
    status: string;
    incrementTotalRequestCount(): void;
    incrementRequestErrorCounter(counterName: string): void;
    incrementRequestTotalCounter(counterName: string): void;
}
export interface Message {
    request: Request;
    requestId: number;
    securityHeader: SecurityHeader;
    channel?: ServerSecureChannelLayer;
    session?: IServerSession;
    session_statusCode?: StatusCode;
}
export type Nonce = Buffer;
/**
 * returns true if the nonce is null or zero (all bytes set to 0)
 */
export declare function isEmptyNonce(nonce: Nonce): boolean;
export declare function nonceAlreadyBeenUsed(nonce?: Nonce): boolean;
export interface IServerSessionBase {
    sessionTimeout: number;
    sessionName: string;
    clientLastContactTime: number;
    status: string;
}
/**
 */
export declare class ServerSecureChannelLayer extends EventEmitter {
    #private;
    static throttleTime: number;
    private static g_MinimumSecureTokenLifetime;
    private static g_counter;
    beforeHandleOpenSecureChannelRequest: () => Promise<void>;
    get securityTokenCount(): number;
    get remoteAddress(): string;
    get remotePort(): number;
    /**
     *
     */
    get aborted(): boolean;
    /**
     * the number of bytes read so far by this channel
     */
    get bytesRead(): number;
    /**
     * the number of bytes written so far by this channel
     */
    get bytesWritten(): number;
    get transactionsCount(): number;
    /**
     * true when the secure channel has been opened successfully
     *
     */
    get isOpened(): boolean;
    /**
     * true when the secure channel is assigned to a active session
     */
    get hasSession(): boolean;
    get certificateManager(): ICertificateManager;
    /**
     * The unique hash key to identify this secure channel
     * @property hashKey
     */
    get hashKey(): number;
    static registry: ObjectRegistry;
    _on_response: ((msgType: string, response: Response, message: Message) => void) | null;
    sessionTokens: {
        [key: string]: IServerSessionBase;
    };
    channelId: number;
    timeout: number;
    get clientCertificate(): Certificate | null;
    /**
     * the channel message security mode
     */
    securityMode: MessageSecurityMode;
    /**
     * the channel message security policy
     */
    securityPolicy: SecurityPolicy;
    get status(): "new" | "connecting" | "open" | "closing" | "closed";
    constructor(options: ServerSecureChannelLayerOptions);
    getTransportSettings(): {
        maxMessageSize: number;
    };
    dispose(): void;
    abruptlyInterrupt(): void;
    /**
     * the endpoint associated with this secure channel
     *
     */
    getEndpointDescription(securityMode: MessageSecurityMode, securityPolicy: SecurityPolicy, endpointUri: string | null): EndpointDescription | null;
    setSecurity(securityMode: MessageSecurityMode, securityPolicy: SecurityPolicy): void;
    /**

     * @return the X509 DER form certificate
     */
    getCertificateChain(): Certificate;
    /**

     * @return  the X509 DER form certificate
     */
    getCertificate(): Certificate;
    getSignatureLength(): PublicKeyLength;
    /**

     * @return the privateKey
     */
    getPrivateKey(): PrivateKey;
    /**
     *
     */
    init(socket: ISocketLike, callback: ErrorCallback): void;
    /**
     * @internal
     */
    send_response(msgType: string, response: Response, message: Message, callback?: ErrorCallback): void;
    getRemoteIPAddress(): string;
    getRemotePort(): number;
    getRemoteFamily(): string;
    /**
     * Abruptly close a Server SecureChannel ,by terminating the underlying transport.
     *
     */
    close(callback?: ErrorCallback): void;
    protected checkCertificate(certificate: Certificate | null): Promise<StatusCode>;
    write(messageChunk: Buffer): void;
}
