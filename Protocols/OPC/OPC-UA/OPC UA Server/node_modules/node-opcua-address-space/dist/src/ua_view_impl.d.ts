/**
 * @module node-opcua-address-space
 */
import { NodeClass } from "node-opcua-data-model";
import { AttributeIds } from "node-opcua-data-model";
import { DataValue } from "node-opcua-data-value";
import { EventNotifierFlags, ISessionContext, UAView } from "node-opcua-address-space-base";
import { BaseNodeImpl, InternalBaseNodeOptions } from "./base_node_impl";
export interface InternalViewOptions extends InternalBaseNodeOptions {
    containsNoLoops?: boolean;
}
export declare class UAViewImpl extends BaseNodeImpl implements UAView {
    readonly nodeClass = NodeClass.View;
    readonly containsNoLoops: boolean;
    private _eventNotifier;
    get eventNotifier(): EventNotifierFlags;
    constructor(options: InternalViewOptions);
    readAttribute(context: ISessionContext | null, attributeId: AttributeIds): DataValue;
}
