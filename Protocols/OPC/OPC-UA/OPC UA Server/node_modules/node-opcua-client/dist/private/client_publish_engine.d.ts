import { ClientSession, SubscriptionId } from "../client_session";
import { ClientSubscription } from "../client_subscription";
import { ClientSubscriptionImpl } from "./client_subscription_impl";
/**
 * A client side implementation to deal with publish service.
 *
 * @class ClientSidePublishEngine
 * The ClientSidePublishEngine encapsulates the mechanism to
 * deal with a OPCUA Server and constantly sending PublishRequest
 * The ClientSidePublishEngine also performs  notification acknowledgements.
 * Finally, ClientSidePublishEngine dispatch PublishResponse to the correct
 * Subscription id callback
 *
 * @private
 */
export declare class ClientSidePublishEngine {
    static publishRequestCountInPipeline: number;
    timeoutHint: number;
    activeSubscriptionCount: number;
    nbPendingPublishRequests: number;
    nbMaxPublishRequestsAcceptedByServer: number;
    isSuspended: boolean;
    session: ClientSession | null;
    private subscriptionAcknowledgements;
    /**
     * @internal
     * @private
     */
    readonly subscriptionMap: {
        [key: number]: ClientSubscriptionImpl;
    };
    lastRequestSentTime: Date;
    constructor(session: ClientSession);
    /**
     * the number of active subscriptions managed by this publish engine.
     * @property subscriptionCount
     * @type {Number}
     */
    get subscriptionCount(): number;
    suspend(suspendedState: boolean): void;
    acknowledge_notification(subscriptionId: SubscriptionId, sequenceNumber: number): void;
    cleanup_acknowledgment_for_subscription(subscriptionId: SubscriptionId): void;
    /**
     * @private
     */
    send_publish_request(): void;
    /**
     * @private
     */
    terminate(): void;
    /**
     * @private
     */
    registerSubscription(subscription: ClientSubscription): void;
    /**
     * @private
     */
    replenish_publish_request_queue(): void;
    /**
     *
     * @param subscriptionId
     * @private
     */
    unregisterSubscription(subscriptionId: SubscriptionId): void;
    getSubscriptionIds(): SubscriptionId[];
    /***
     * get the client subscription from Id
     */
    getSubscription(subscriptionId: SubscriptionId): ClientSubscription;
    hasSubscription(subscriptionId: SubscriptionId): boolean;
    internalSendPublishRequest(): void;
    private _receive_publish_response;
}
