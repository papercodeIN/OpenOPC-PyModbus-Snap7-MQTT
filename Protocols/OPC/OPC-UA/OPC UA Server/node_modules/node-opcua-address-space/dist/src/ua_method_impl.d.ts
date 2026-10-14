import { AttributeIds, QualifiedNameLike } from "node-opcua-data-model";
import { NodeClass } from "node-opcua-data-model";
import { DataValue } from "node-opcua-data-value";
import { NodeId } from "node-opcua-nodeid";
import { NumericRange } from "node-opcua-numeric-range";
import { Argument } from "node-opcua-service-call";
import { CallbackT } from "node-opcua-status-code";
import { CallMethodResultOptions } from "node-opcua-types";
import { VariantLike } from "node-opcua-variant";
import { MethodFunctor, UAMethod, UAObject, CloneExtraInfo, CloneFilter, CloneOptions, UAObjectType, ISessionContext } from "node-opcua-address-space-base";
import { SessionContext } from "../source/session_context";
import { BaseNodeImpl } from "./base_node_impl";
export declare class UAMethodImpl extends BaseNodeImpl implements UAMethod {
    static checkValidArgument(args: unknown): boolean;
    readonly nodeClass = NodeClass.Method;
    get typeDefinitionObj(): UAObjectType;
    get parent(): UAObject | null;
    value?: any;
    methodDeclarationId: NodeId;
    _getExecutableFlag?: (this: UAMethod, context: ISessionContext | null) => boolean;
    _asyncExecutionFunction?: MethodFunctor;
    constructor(options: any);
    /**
     *
     *
     */
    getExecutableFlag(context: ISessionContext | null): boolean;
    getUserExecutableFlag(context: ISessionContext | null): boolean;
    /**
     *
     * @returns  true if the method is bound
     */
    isBound(): boolean;
    readAttribute(context: ISessionContext | null, attributeId: AttributeIds, indexRange?: NumericRange, dataEncoding?: QualifiedNameLike | null): DataValue;
    getInputArguments(): Argument[];
    getOutputArguments(): Argument[];
    bindMethod(async_func: MethodFunctor): void;
    execute(object: UAObject | UAObjectType | null, inputArguments: null | VariantLike[], context: SessionContext): Promise<CallMethodResultOptions>;
    execute(object: UAObject | UAObjectType | null, inputArguments: null | VariantLike[], context: ISessionContext, callback: CallbackT<CallMethodResultOptions>): void;
    clone(options: CloneOptions, optionalFilter?: CloneFilter, extraInfo?: CloneExtraInfo): UAMethod;
    private _getArguments;
}
