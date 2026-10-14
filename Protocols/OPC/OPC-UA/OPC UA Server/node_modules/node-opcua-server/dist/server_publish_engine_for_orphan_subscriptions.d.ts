import { ServerSidePublishEngine, ServerSidePublishEngineOptions } from "./server_publish_engine";
import { Subscription } from "./server_subscription";
/**
 * the ServerSidePublishEngineForOrphanSubscription is keeping track of
 * live subscription that have been detached from timed out session.
 * It takes care of providing back those subscription to any session that
 * will claim them again with transferSubscription  service
 * It also make sure that subscription are properly disposed when  they expire.
 *
 * @internal
 */
export declare class ServerSidePublishEngineForOrphanSubscription extends ServerSidePublishEngine {
    constructor(options: ServerSidePublishEngineOptions);
    add_subscription(subscription: Subscription): Subscription;
    detach_subscription(subscription: Subscription): Subscription;
}
