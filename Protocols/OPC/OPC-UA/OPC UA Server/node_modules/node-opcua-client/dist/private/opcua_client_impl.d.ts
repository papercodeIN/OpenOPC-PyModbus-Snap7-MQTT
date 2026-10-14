import { EndpointDescription } from "node-opcua-service-endpoints";
import { CallbackT, StatusCode } from "node-opcua-status-code";
import { Callback } from "node-opcua-status-code";
import { ClientSession } from "../client_session";
import { ClientSubscriptionOptions } from "../client_subscription";
import { OPCUAClient, OPCUAClientOptions, WithSessionFuncP, WithSubscriptionFuncP, EndpointWithUserIdentity } from "../opcua_client";
import { UserIdentityInfo } from "../user_identity_info";
import { ClientBaseImpl } from "./client_base_impl";
import { ClientSessionImpl } from "./client_session_impl";
import { DataTypeExtractStrategy } from "node-opcua-client-dynamic-extension-object";
export declare class OPCUAClientImpl extends ClientBaseImpl implements OPCUAClient {
    #private;
    static minimumRevisedSessionTimeout: number;
    private _retryCreateSessionTimer?;
    static create(options: OPCUAClientOptions): OPCUAClient;
    endpoint?: EndpointDescription;
    private endpointMustExist;
    private requestedSessionTimeout;
    private ___sessionName_counter;
    private serverUri?;
    private clientNonce?;
    dataTypeExtractStrategy: DataTypeExtractStrategy;
    constructor(options?: OPCUAClientOptions);
    /**
     * create and activate a new session
     *
     *
     * @example
     *     // create a anonymous session
     *     const session = await client.createSession();
     *
     * @example
     *     // create a session with a userName and password
     *     const session = await client.createSession({
     *            type: UserTokenType.UserName,
     *            userName: "JoeDoe",
     *            password:"secret"
     *      });
     *
     */
    createSession(userIdentityInfo?: UserIdentityInfo): Promise<ClientSession>;
    createSession(userIdentityInfo: UserIdentityInfo, callback: Callback<ClientSession>): void;
    createSession(callback: Callback<ClientSession>): void;
    /**
     * createSession2 create a session with persistance
     *
     * - if the server returns BadTooManySession, the method will make an other attempt
     *   until create session succeed or connection is closed.
     *
     * @experimental
     * @param userIdentityInfo
     */
    createSession2(userIdentityInfo?: UserIdentityInfo): Promise<ClientSession>;
    createSession2(userIdentityInfo: UserIdentityInfo, callback: Callback<ClientSession>): void;
    createSession2(callback: Callback<ClientSession>): void;
    /**
     * @deprecated use session.changeUser instead
     */
    changeSessionIdentity(session: ClientSession, userIdentityInfo: UserIdentityInfo): Promise<StatusCode>;
    changeSessionIdentity(session: ClientSession, userIdentityInfo: UserIdentityInfo, callback: CallbackT<StatusCode>): void;
    /**
     * close a session
     */
    closeSession(session: ClientSession, deleteSubscriptions: boolean): Promise<void>;
    closeSession(session: ClientSession, deleteSubscriptions: boolean, callback: (err?: Error) => void): void;
    toString(): string;
    /**
     *
     * @example
     *
     * ```javascript
     *
     * const session = await OPCUAClient.createSession(endpointUrl);
     * const dataValue = await session.read({ nodeId, attributeId: AttributeIds.Value });
     * await session.close();
     *
     * ```
     * @stability experimental
     *
     * @param endpointUrl
     * @param userIdentity
     * @returns session
     *
     *
     * const create
     */
    static createSession(endpointUrl: string, userIdentity?: UserIdentityInfo, clientOptions?: OPCUAClientOptions): Promise<ClientSession>;
    /**
     *
     * @param connectionPoint
     * @param func
     * @returns
     */
    withSessionAsync<T>(connectionPoint: string | EndpointWithUserIdentity, func: WithSessionFuncP<T>): Promise<T>;
    withSubscriptionAsync<T>(connectionPoint: string | EndpointWithUserIdentity, parameters: ClientSubscriptionOptions, func: WithSubscriptionFuncP<T>): Promise<T>;
    /**
     * transfer session to this client

     * @param session
     * @param callback
     * @return {*}
     */
    reactivateSession(session: ClientSession): Promise<void>;
    reactivateSession(session: ClientSession, callback: (err?: Error) => void): void;
    /**
     * @internal
     * @private
     */
    _on_connection_reestablished(callback: (err?: Error) => void): void;
    /**
     *
     * @internal
     * @private
     */
    __createSession_step2(session: ClientSessionImpl, callback: (err: Error | null, session?: ClientSessionImpl) => void): void;
    /**
     * @internal
     * @private
     */
    _activateSession(session: ClientSessionImpl, userIdentityInfo: UserIdentityInfo, callback: (err: Error | null, session?: ClientSessionImpl) => void): void;
    /**
     *
     * @private
     */
    private _nextSessionName;
    /**
     *
     * @private
     */
    private _getApplicationUri;
    /**
     *
     * @private
     */
    private __resolveEndPoint;
    /**
     *
     * @private
     */
    private _createSession;
    /**
     *
     * @private
     */
    private computeClientSignature;
    /**
     *
     * @private
     */
    private createUserIdentityToken;
}
