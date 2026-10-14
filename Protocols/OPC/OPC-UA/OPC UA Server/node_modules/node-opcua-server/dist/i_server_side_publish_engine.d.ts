import { PublishResponseOptions, StatusChangeNotification } from "node-opcua-types";
import { Subscription } from "./server_subscription";
export interface INotifMsg {
    subscriptionId: number;
    sequenceNumber: number;
    notificationData: any;
    moreNotifications: boolean;
}
export interface IServerSidePublishEngine {
    on_close_subscription(subscription: IClosedOrTransferredSubscription): void;
    readonly pendingPublishRequestCount: number;
    _on_tick(): void;
    send_keep_alive_response(subscriptionId: number, future_sequence_number: number): boolean;
    _send_response(subscription: Subscription, options: PublishResponseOptions): void;
}
export interface IClosedOrTransferredSubscription {
    readonly hasPendingNotifications: boolean;
    dispose(): void;
    readonly id: number;
    _publish_pending_notifications(): void;
}
export declare class TransferredSubscription implements IClosedOrTransferredSubscription {
    id: number;
    publishEngine: any;
    _pending_notification?: StatusChangeNotification;
    private _sequence_number_generator;
    constructor(options: {
        id: number;
        generator: any;
        publishEngine: any;
    });
    get hasPendingNotifications(): boolean;
    dispose(): void;
    _publish_pending_notifications(): void;
    private _get_next_sequence_number;
}
