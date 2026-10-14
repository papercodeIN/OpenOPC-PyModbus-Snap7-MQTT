import { NotificationData } from "node-opcua-types";
import { IBasicSessionAsync2 } from "node-opcua-pseudo-session";
export declare function promoteOpaqueStructureInNotificationData(session: IBasicSessionAsync2, notificationData: NotificationData[]): Promise<void>;
