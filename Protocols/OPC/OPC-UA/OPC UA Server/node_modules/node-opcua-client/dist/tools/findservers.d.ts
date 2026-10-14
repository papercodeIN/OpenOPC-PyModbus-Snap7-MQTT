import { ServerOnNetwork } from "node-opcua-service-discovery";
import { ApplicationDescription, EndpointDescription } from "node-opcua-service-endpoints";
export interface FindServerResults {
    servers: ApplicationDescription[];
    endpoints: EndpointDescription[];
}
/**
 * extract the server endpoints exposed by a discovery server
 */
export declare function findServers(discoveryServerEndpointUri: string, callback: (err: Error | null, result?: FindServerResults) => void): void;
export declare function findServers(discoveryServerEndpointUri: string): Promise<FindServerResults>;
/**
 * extract the server endpoints exposed by a discovery server
 */
export declare function findServersOnNetwork(discoveryServerEndpointUri: string): Promise<ServerOnNetwork[]>;
export declare function findServersOnNetwork(discoveryServerEndpointUri: string, callback: (err: Error | null, servers?: ServerOnNetwork[]) => void): void;
