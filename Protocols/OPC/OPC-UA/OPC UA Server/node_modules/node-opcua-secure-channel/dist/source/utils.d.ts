import { ChannelSecurityToken } from "node-opcua-types";
import { Request, Response } from "./common";
export declare const doTraceServerMessage: RegExpMatchArray | null;
export declare const doTraceRequest: RegExpMatchArray | null;
export declare const doTraceResponse: RegExpMatchArray | null;
export declare const doPerfMonitoring: RegExpMatchArray | null;
export declare let doTraceClientMessage: RegExpMatchArray | null;
export declare let doTraceClientRequestContent: RegExpMatchArray | null;
export declare let doTraceClientResponseContent: RegExpMatchArray | null;
export declare const doTraceStatistics: boolean | "" | undefined;
export declare const dumpSecurityHeader: boolean | "" | undefined;
export interface ServerTransactionStatistics {
    bytesRead: number;
    bytesWritten: number;
    lap_reception: number;
    lap_processing: number;
    lap_emission: number;
}
export declare function _dump_transaction_statistics(stats?: ServerTransactionStatistics): void;
export interface ClientTransactionStatistics {
    dump: () => void;
    request: Request;
    response: Response;
    bytesRead: number;
    bytesWritten: number;
    lap_transaction: number;
    lap_sending_request: number;
    lap_waiting_response: number;
    lap_receiving_response: number;
    lap_processing_response: number;
}
export declare function _dump_client_transaction_statistics(stats: ClientTransactionStatistics): void;
export declare function traceRequestMessage(request: Request, channelId: number, instance: number): void;
export declare function traceResponseMessage(response: Response, tokenId: number, channelId: number, instance: number): void;
export declare function traceClientRequestContent(request: Request, channelId: number, securityToken: ChannelSecurityToken | null): void;
export declare function traceClientResponseContent(response: Response, channelId: number): void;
export declare function traceClientRequestMessage(request: Request, channelId: number, instance: number): void;
export declare function traceClientConnectionClosed(err: Error | undefined | null, channelId: number, instance: number): void;
export declare function traceClientResponseMessage(response: Response, channelId: number, instance: number): void;
