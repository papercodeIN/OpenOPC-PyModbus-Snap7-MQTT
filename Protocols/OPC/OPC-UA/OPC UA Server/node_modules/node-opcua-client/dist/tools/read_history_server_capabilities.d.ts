import { ClientSession } from "../client_session";
export interface HistoryServerCapabilities {
    [key: string]: any;
}
export declare function readHistoryServerCapabilities(session: ClientSession): Promise<HistoryServerCapabilities>;
export declare function readHistoryServerCapabilities(session: ClientSession, callback: (err: Error | null, capabilities?: HistoryServerCapabilities) => void): void;
