/**
 * @module node-opcua-client
 */
import { NodeIdLike } from "node-opcua-nodeid";
import { Variant } from "node-opcua-variant";
import { IBasicSessionReadAsyncMultiple, IBasicSessionTranslateBrowsePathAsyncMultiple } from "node-opcua-pseudo-session";
interface AnalogDataItemSnapshot {
    engineeringUnits: Variant | null;
    engineeringUnitsRange: Variant | null;
    instrumentRange: Variant | null;
    valuePrecision: Variant | null;
    definition: Variant | null;
}
/**
 *
 */
export declare function readUAAnalogItem(session: IBasicSessionTranslateBrowsePathAsyncMultiple & IBasicSessionReadAsyncMultiple, nodeId: NodeIdLike): Promise<AnalogDataItemSnapshot>;
export {};
