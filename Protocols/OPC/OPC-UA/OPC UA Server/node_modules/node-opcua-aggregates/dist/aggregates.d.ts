/**
 * @module node-opcua-aggregates
 */
import { AggregateFunction } from "node-opcua-constants";
import { NodeId, NodeIdLike } from "node-opcua-nodeid";
import { AddressSpace, BaseNode, IAddressSpace, UAObject, UAServerCapabilities, UAVariable } from "node-opcua-address-space";
import { AggregateConfigurationOptionsEx } from "./interval";
export declare function createHistoryServerCapabilities(addressSpace: AddressSpace, serverCapabilities: UAServerCapabilities): UAObject;
export declare function addAggregateFunctionSupport(addressSpace: AddressSpace, aggregateFunctionNodeId: NodeIdLike): void;
export declare function addAggregateStandardFunctionSupport(addressSpace: AddressSpace, functionName: AggregateFunction): void;
export declare function addAggregateSupport(addressSpace: AddressSpace, aggregatedFunctions?: AggregateFunction[]): void;
export declare function getAggregateFunctions(addressSpace: IAddressSpace): NodeId[];
/**
 * Install aggregateConfiguration on an historizing variable
 *
 * @param node the variable on which to add the aggregateConfiguration.
 * @param options the default AggregateConfigurationOptions.
 * @param aggregateFunctions the aggregatedFunctions, if not specified the aggregatedFunction of ServerCapabilities.AggregatedFunction will be used.

 */
export declare function installAggregateConfigurationOptions(node: UAVariable, options: AggregateConfigurationOptionsEx, aggregateFunctions?: NodeIdLike[]): void;
export declare function getAggregateConfiguration(node: BaseNode): AggregateConfigurationOptionsEx;
