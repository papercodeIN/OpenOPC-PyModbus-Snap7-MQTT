import { NodeId, NodeIdLike } from "node-opcua-nodeid";
import { LocalizedText, NodeClass, QualifiedName } from "node-opcua-data-model";
import { BaseNode } from "./base_node";
import { ModellingRuleType } from "./modelling_rule_type";
import { INamespace } from "./namespace";
import { UAMethod } from "./ua_method";
import { UAObject } from "./ua_object";
import { UAObjectType } from "./ua_object_type";
import { UAReference } from "./ua_reference";
import { UAVariable } from "./ua_variable";
export interface CloneFilter {
    shouldKeep(node: BaseNode): boolean;
    filterFor(childInstance: UAVariable | UAObject | UAMethod): CloneFilter;
}
export declare const defaultCloneFilter: CloneFilter;
export interface CloneExtraInfo {
    level: number;
    pad(): string;
    pushContext(params: {
        clonedParent: BaseNode;
        originalParent: BaseNode;
    }): void;
    popContext(): void;
    registerClonedObject(params: {
        clonedNode: BaseNode;
        originalNode: BaseNode;
    }): void;
    getCloned(params: {
        originalParent: BaseNode;
        clonedParent: BaseNode;
        originalNode: UAVariable | UAObject | UAMethod;
    }): BaseNode | null;
}
export declare const makeDefaultCloneExtraInfo: (node: UAVariable | UAMethod | UAObject) => CloneExtraInfo;
export interface CloneOptions {
    namespace: INamespace;
    references?: UAReference[];
    nodeId?: string | NodeIdLike | null;
    nodeClass?: NodeClass;
    browseName?: QualifiedName;
    descriptions?: LocalizedText;
    modellingRule?: ModellingRuleType;
    accessLevel?: number;
    arrayDimensions?: number[] | null;
    dataType?: NodeId;
    historizing?: boolean;
    minimumSamplingInterval?: number;
    userAccessLevel?: number;
    valueRank?: number;
    eventNotifier?: number;
    symbolicName?: string;
    executable?: boolean;
    methodDeclarationId?: NodeId;
    componentOf?: UAObjectType | UAObject;
    copyAlsoModellingRules?: boolean;
    ignoreChildren?: boolean;
}
