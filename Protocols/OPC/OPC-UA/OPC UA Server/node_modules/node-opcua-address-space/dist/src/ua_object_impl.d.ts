import { NodeClass, QualifiedNameLike, QualifiedNameOptions } from "node-opcua-data-model";
import { AttributeIds } from "node-opcua-data-model";
import { DataValue } from "node-opcua-data-value";
import { NumericRange } from "node-opcua-numeric-range";
import { EventTypeLike, RaiseEventData, ISessionContext, UAMethod, UAObject, UAObjectType, CloneOptions, CloneFilter, CloneExtraInfo, BaseNode, IEventData, EventNotifierFlags } from "node-opcua-address-space-base";
import { BaseNodeImpl, InternalBaseNodeOptions } from "./base_node_impl";
import { ConditionRefreshCache } from "./apply_condition_refresh";
export declare class UAObjectImpl extends BaseNodeImpl implements UAObject {
    private _eventNotifier;
    readonly nodeClass = NodeClass.Object;
    get eventNotifier(): EventNotifierFlags;
    readonly symbolicName: string | null;
    get typeDefinitionObj(): UAObjectType;
    constructor(options: InternalBaseNodeOptions & {
        eventNotifier?: number;
        symbolicName?: string | null;
    });
    readAttribute(context: ISessionContext | null, attributeId: AttributeIds, indexRange?: NumericRange, dataEncoding?: QualifiedNameLike | null): DataValue;
    clone(options: CloneOptions, optionalFilter?: CloneFilter, extraInfo?: CloneExtraInfo): UAObject;
    /**
     * returns true if the object has some opcua methods
     */
    get hasMethods(): boolean;
    getMethodByName(methodName: QualifiedNameOptions): UAMethod | null;
    getMethodByName(methodName: string, namespaceIndex?: number): UAMethod | null;
    getMethods(): UAMethod[];
    setEventNotifier(eventNotifierFlags: EventNotifierFlags): void;
    /**
     * Raise a transient Event
     */
    raiseEvent(eventType: EventTypeLike | BaseNode, data: RaiseEventData): void;
    _bubble_up_event(eventData: IEventData): void;
    _conditionRefresh(_cache?: ConditionRefreshCache): void;
    toString(): string;
}
