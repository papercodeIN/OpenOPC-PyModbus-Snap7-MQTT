/**
 * @module node-opcua-client
 */
import { EventEmitter } from "events";
import { ServerState } from "node-opcua-common";
import { ClientSessionImpl } from "./private/client_session_impl";
export interface ClientSessionKeepAliveManagerEvents {
    on(event: "keepalive", eventHandler: (lastKnownServerState: ServerState, count: number) => void): this;
    on(event: "failure", eventHandler: () => void): this;
}
export declare class ClientSessionKeepAliveManager extends EventEmitter implements ClientSessionKeepAliveManagerEvents {
    private readonly session;
    private timerId?;
    private pingTimeout;
    private lastKnownState?;
    private transactionInProgress;
    count: number;
    checkInterval: number;
    constructor(session: ClientSessionImpl);
    start(keepAliveInterval?: number): void;
    stop(): void;
    private ping_server;
    /**
     * @private
     * when a session is opened on a server, the client shall send request on a regular basis otherwise the server
     * session object might time out.
     * start_ping make sure that ping_server is called on a regular basis to prevent session to timeout.
     *
     */
    private _ping_server;
}
