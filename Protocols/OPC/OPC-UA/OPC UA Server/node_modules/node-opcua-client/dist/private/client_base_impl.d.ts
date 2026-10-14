import { OPCUASecureObject } from "node-opcua-common";
import { Certificate } from "node-opcua-crypto/web";
import { IBasicTransportSettings, ResponseCallback } from "node-opcua-pseudo-session";
import { ClientSecureChannelLayer, ConnectionStrategy, ConnectionStrategyOptions, SecurityPolicy } from "node-opcua-secure-channel";
import { ServerOnNetwork } from "node-opcua-service-discovery";
import { ApplicationDescription, EndpointDescription } from "node-opcua-service-endpoints";
import { MessageSecurityMode } from "node-opcua-service-secure-channel";
import { ErrorCallback } from "node-opcua-status-code";
import { OPCUACertificateManager } from "node-opcua-certificate-manager";
import { Request, Response } from "../common";
import { CreateSecureChannelCallbackFunc, FindServersOnNetworkRequestLike, FindServersRequestLike, GetEndpointsOptions, OPCUAClientBase, OPCUAClientBaseOptions } from "../client_base";
import { UserIdentityInfo } from "../user_identity_info";
import { ClientSessionImpl } from "./client_session_impl";
import { IClientBase } from "./i_private_client";
type InternalClientState = "uninitialized" | "disconnected" | "connecting" | "connected" | "panic" | "reconnecting" | "reconnecting_newchannel_connected" | "disconnecting";
/**
 * @internal
 */
export declare class ClientBaseImpl extends OPCUASecureObject implements OPCUAClientBase, IClientBase {
    #private;
    /**
     * total number of requests that been canceled due to timeout
     */
    get timedOutRequestCount(): number;
    /**
     * total number of transactions performed by the client
   x  */
    get transactionsPerformed(): number;
    /**
     * is true when the client has already requested the server end points.
     */
    get knowsServerEndpoint(): boolean;
    /**
     * true if the client is trying to reconnect to the server after a connection break.
     */
    get isReconnecting(): boolean;
    /**
     * true if the connection strategy is set to automatically try to reconnect in case of failure
     */
    get reconnectOnFailure(): boolean;
    /**
     * total number of bytes read by the client
     */
    get bytesRead(): number;
    /**
     * total number of bytes written by the client
     */
    get bytesWritten(): number;
    securityMode: MessageSecurityMode;
    securityPolicy: SecurityPolicy;
    serverCertificate?: Certificate;
    clientName: string;
    protocolVersion: 0;
    defaultSecureTokenLifetime: number;
    tokenRenewalInterval: number;
    connectionStrategy: ConnectionStrategy;
    keepPendingSessionsOnDisconnect: boolean;
    endpointUrl: string;
    discoveryUrl: string;
    readonly applicationName: string;
    private _applicationUri;
    defaultTransactionTimeout?: number;
    /**
     * true if session shall periodically probe the server to keep the session alive and prevent timeout
     */
    keepSessionAlive: boolean;
    readonly keepAliveInterval?: number;
    _sessions: ClientSessionImpl[];
    protected _serverEndpoints: EndpointDescription[];
    _secureChannel: ClientSecureChannelLayer | null;
    private _byteRead;
    private _byteWritten;
    private _timedOutRequestCount;
    private _transactionsPerformed;
    private _reconnectionIsCanceled;
    private _clockAdjuster?;
    protected _tmpClient?: OPCUAClientBase;
    private _instanceNumber;
    private _transportSettings;
    private _transportTimeout?;
    clientCertificateManager: OPCUACertificateManager;
    isUnusable(): boolean;
    protected _setInternalState(internalState: InternalClientState): void;
    emit(eventName: string | symbol, ...others: any[]): boolean;
    constructor(options?: OPCUAClientBaseOptions);
    private _cancel_reconnection;
    _recreate_secure_channel(callback: ErrorCallback): void;
    _internal_create_secure_channel(connectionStrategy: ConnectionStrategyOptions, callback: CreateSecureChannelCallbackFunc): void;
    static createCertificate(clientCertificateManager: OPCUACertificateManager, certificateFile: string, applicationName: string, applicationUri: string): Promise<void>;
    createDefaultCertificate(): Promise<void>;
    protected _getBuiltApplicationUri(): string;
    protected initializeCM(): Promise<void>;
    protected _internalState: InternalClientState;
    protected _handleUnrecoverableConnectionFailure(err: Error, callback: ErrorCallback): void;
    private _handleDisconnectionWhileConnecting;
    private _handleSuccessfulConnection;
    /**
     * connect the OPC-UA client to a server end point.
     */
    connect(endpointUrl: string): Promise<void>;
    connect(endpointUrl: string, callback: ErrorCallback): void;
    /**
     * @private
     */
    _connectStep2(endpointUrl: string, callback: ErrorCallback): void;
    performMessageTransaction(request: Request, callback: ResponseCallback<Response>): void;
    /**
     *
     * return the endpoint information matching  security mode and security policy.

     */
    findEndpointForSecurity(securityMode: MessageSecurityMode, securityPolicy: SecurityPolicy): EndpointDescription | undefined;
    /**
     *
     * return the endpoint information matching the specified url , security mode and security policy.

     */
    findEndpoint(endpointUrl: string, securityMode: MessageSecurityMode, securityPolicy: SecurityPolicy): EndpointDescription | undefined;
    getEndpoints(options?: GetEndpointsOptions): Promise<EndpointDescription[]>;
    getEndpoints(options: GetEndpointsOptions, callback: ResponseCallback<EndpointDescription[]>): void;
    getEndpoints(callback: ResponseCallback<EndpointDescription[]>): void;
    /**
     * @deprecated
     */
    getEndpointsRequest(options: GetEndpointsOptions, callback: ResponseCallback<EndpointDescription[]>): void;
    /**

     */
    findServers(options?: FindServersRequestLike): Promise<ApplicationDescription[]>;
    findServers(options: FindServersRequestLike, callback: ResponseCallback<ApplicationDescription[]>): void;
    findServers(callback: ResponseCallback<ApplicationDescription[]>): void;
    findServersOnNetwork(options?: FindServersOnNetworkRequestLike): Promise<ServerOnNetwork[]>;
    findServersOnNetwork(callback: ResponseCallback<ServerOnNetwork[]>): void;
    findServersOnNetwork(options: FindServersOnNetworkRequestLike, callback: ResponseCallback<ServerOnNetwork[]>): void;
    _removeSession(session: ClientSessionImpl): void;
    private _closeSession;
    closeSession(...args: any[]): any;
    disconnect(): Promise<void>;
    disconnect(callback: ErrorCallback): void;
    _on_connection_reestablished(callback: ErrorCallback): void;
    toString(): string;
    getSessions(): ClientSessionImpl[];
    getTransportSettings(): IBasicTransportSettings;
    protected _addSession(session: ClientSessionImpl): void;
    private fetchServerCertificate;
    private _accumulate_statistics;
    private _destroy_secure_channel;
    private _close_pending_sessions;
    private _install_secure_channel_event_handlers;
    /**
     * @internal
     * @private
     *
     * timeout to wait before client attempt to reconnect in case of failure
     *
     */
    static retryDelay: number;
    private _repairConnection;
    private __innerRepairConnection;
    private _finalReconnectionStep;
    /**
     *
     * @internal
     * @private
     */
    __createSession_step2(session: ClientSessionImpl, callback: (err: Error | null, session?: ClientSessionImpl) => void): void;
    _activateSession(session: ClientSessionImpl, userIdentity: UserIdentityInfo, callback: (err: Error | null, session?: ClientSessionImpl) => void): void;
}
export {};
