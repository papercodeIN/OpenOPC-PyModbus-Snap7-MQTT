import { BaseNode, IEventData, ISessionContext } from "node-opcua-address-space-base";
import { NodeClass } from "node-opcua-data-model";
import { NodeId, NodeIdLike } from "node-opcua-nodeid";
import { BrowsePath } from "node-opcua-types";
import { Variant } from "node-opcua-variant";
import { FilterContext } from "../filter_context";
export declare class FilterContextOnAddressSpace implements FilterContext {
    private sessionContext;
    private eventData;
    eventSource: NodeId;
    constructor(sessionContext: ISessionContext, eventData: IEventData);
    getNodeClass(nodeId: NodeId): NodeClass;
    isSubtypeOf(nodeId: NodeId, baseType: NodeId): boolean;
    getTypeDefinition(nodeId: NodeId): NodeId | null;
    readNodeValue(nodeId: NodeIdLike): Variant;
    private getAddressSpace;
    browsePath(browsePath: BrowsePath): NodeId | null;
    setEventSource(eventSource: BaseNode | null): void;
}
