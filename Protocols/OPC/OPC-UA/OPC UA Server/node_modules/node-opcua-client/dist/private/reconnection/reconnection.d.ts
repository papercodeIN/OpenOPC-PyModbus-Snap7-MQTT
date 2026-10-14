/**
 * @module node-opcua-client-private
 */
import { ClientSessionImpl } from "../client_session_impl";
import { ClientSubscriptionImpl } from "../client_subscription_impl";
import { IClientBase } from "../i_private_client";
export declare function _shouldNotContinue(session: ClientSessionImpl): Error | null;
export declare function _shouldNotContinue2(subscription: ClientSubscriptionImpl): Error | null;
type EmptyCallback = (err?: Error) => void;
export declare function repair_client_session(client: IClientBase, session: ClientSessionImpl, callback: EmptyCallback): void;
export declare function repair_client_sessions(client: IClientBase, callback: (err?: Error) => void): void;
export {};
