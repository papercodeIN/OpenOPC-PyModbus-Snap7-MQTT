import { OPCUAServer } from "./opcua_server";
import { ServerEngine } from "./server_engine";
import { Subscription } from "./server_subscription";
/**
 *
 * @private
 */
export declare function installSessionLogging(server: OPCUAServer): void;
export declare function installSubscriptionMonitoring(subscription: Subscription): void;
export declare function installSessionLoggingOnEngine(serverEngine: ServerEngine): void;
