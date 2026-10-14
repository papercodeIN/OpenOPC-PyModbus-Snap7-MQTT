/**
 * @module node-opcua-server
 */
import { ExtensionObject } from "node-opcua-extension-object";
import { ExpandedNodeId } from "node-opcua-nodeid";
export interface EngineForFactory {
}
export declare class Factory {
    engine: EngineForFactory;
    constructor(engine: EngineForFactory);
    constructObject(id: ExpandedNodeId): ExtensionObject;
}
