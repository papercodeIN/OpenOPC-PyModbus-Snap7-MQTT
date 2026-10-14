/**
 * @module node-opcua-client-private
 */
import { EventEmitter } from "events";
import { AggregateFunction } from "node-opcua-constants";
import { DateTime } from "node-opcua-basic-types";
import { ExtraDataTypeManager } from "node-opcua-client-dynamic-extension-object";
import { Certificate, Nonce } from "node-opcua-crypto/web";
import { LocalizedTextLike } from "node-opcua-data-model";
import { DataValue } from "node-opcua-data-value";
import { ExtensionObject } from "node-opcua-extension-object";
import { NodeId, NodeIdLike } from "node-opcua-nodeid";
import { IBasicTransportSettings, NodeAttributes, ResponseCallback, BrowseDescriptionLike } from "node-opcua-pseudo-session";
import { AnyConstructorFunc } from "node-opcua-schemas";
import { SignatureData } from "node-opcua-secure-channel";
import { BrowseResult } from "node-opcua-service-browse";
import { CallMethodResult } from "node-opcua-service-call";
import { EndpointDescription } from "node-opcua-service-endpoints";
import { HistoryReadRequest, HistoryReadResponse, HistoryReadResult } from "node-opcua-service-history";
import { QueryFirstResponse } from "node-opcua-service-query";
import { ReadValueIdOptions } from "node-opcua-service-read";
import { CreateMonitoredItemsResponse, CreateSubscriptionResponse, DeleteMonitoredItemsResponse, DeleteSubscriptionsResponse, ModifyMonitoredItemsResponse, ModifySubscriptionResponse, PublishRequest, PublishResponse, RepublishRequest, RepublishResponse, SetMonitoringModeResponse, SetTriggeringRequestOptions, SetTriggeringResponse, TransferSubscriptionsResponse } from "node-opcua-service-subscription";
import { BrowsePath, BrowsePathResult } from "node-opcua-service-translate-browse-path";
import { StatusCode, Callback, CallbackT } from "node-opcua-status-code";
import { ErrorCallback } from "node-opcua-status-code";
import { AggregateConfigurationOptions, HistoryReadValueIdOptions, WriteValueOptions } from "node-opcua-types";
import { VariantLike } from "node-opcua-variant";
import { ArgumentDefinition, CallMethodRequestLike, ClientSession, CreateMonitoredItemsRequestLike, CreateSubscriptionRequestLike, DeleteMonitoredItemsRequestLike, DeleteSubscriptionsRequestLike, MethodId, ModifyMonitoredItemsRequestLike, ModifySubscriptionRequestLike, MonitoredItemData, QueryFirstRequestLike, SetMonitoringModeRequestLike, SubscriptionId, TransferSubscriptionsRequestLike, HistoryReadValueIdOptions2, ExtraReadHistoryValueParameters } from "../client_session";
import { UserIdentityInfo } from "../user_identity_info";
import { ClientSubscription } from "../client_subscription";
import { Request, Response } from "../common";
import { ClientSidePublishEngine } from "./client_publish_engine";
import { IClientBase } from "./i_private_client";
type EmptyCallback = (err?: Error) => void;
export interface Reconnectable {
    _reconnecting: {
        reconnecting: boolean;
        pendingCallbacks: EmptyCallback[];
        pendingTransactions: {
            request: Request;
            callback: (err: Error | null, response?: Response) => void;
        }[];
    };
}
/**
 * @class ClientSession
 */
export declare class ClientSessionImpl extends EventEmitter implements ClientSession, Reconnectable {
    #private;
    static reconnectingElement: WeakMap<ClientSessionImpl, Reconnectable>;
    timeout: number;
    authenticationToken?: NodeId;
    requestedMaxReferencesPerNode: number;
    sessionId: NodeId;
    lastRequestSentTime: Date;
    lastResponseReceivedTime: Date;
    serverCertificate: Certificate;
    userIdentityInfo?: UserIdentityInfo;
    name: string;
    serverNonce?: Nonce;
    serverSignature?: SignatureData;
    serverEndpoints: EndpointDescription[];
    _client: IClientBase | null;
    _closed: boolean;
    _reconnecting: {
        reconnecting: boolean;
        pendingCallbacks: EmptyCallback[];
        pendingTransactions: any[];
    };
    /**
     * @internal
     */
    _closeEventHasBeenEmitted: boolean;
    private _publishEngine;
    private _keepAliveManager?;
    private $$namespaceArray?;
    private recursive_repair_detector;
    constructor(client: IClientBase);
    getTransportSettings(): IBasicTransportSettings;
    /**
     * the endpoint on which this session is operating
     * @property endpoint
     * @type {EndpointDescription}
     */
    get endpoint(): EndpointDescription;
    get subscriptionCount(): number;
    get isReconnecting(): boolean;
    protected resolveNodeId(nodeId: NodeIdLike): NodeIdLike;
    getPublishEngine(): ClientSidePublishEngine;
    changeUser(userIdentityInfo: UserIdentityInfo): Promise<StatusCode>;
    changeUser(userIdentityInfo: UserIdentityInfo, callback: CallbackT<StatusCode>): void;
    /**
     *
     * @example
     *
     *    ```javascript
     *    session.browse("RootFolder",function(err,browseResult) {
     *      if(err) return callback(err);
     *      console.log(browseResult.toString());
     *      callback();
     *    } );
     *    ```
     *
     *
     * @example
     *
     *    ``` javascript
     *    const browseDescription = {
     *       nodeId: "ObjectsFolder",
     *       referenceTypeId: "Organizes",
     *       browseDirection: BrowseDirection.Inverse,
     *       includeSubtypes: true,
     *       nodeClassMask: 0,
     *       resultMask: 63
     *    }
     *    session.browse(browseDescription,function(err, browseResult) {
     *       if(err) return callback(err);
     *       console.log(browseResult.toString());
     *       callback();
     *    });
     *    ```
     * @example
     *
     * ``` javascript
     * session.browse([ "RootFolder", "ObjectsFolder"],function(err, browseResults) {
     *       assert(browseResults.length === 2);
     * });
     * ```
     *
     * @example
     * ``` javascript
     * const browseDescriptions = [
     * {
     *   nodeId: "ObjectsFolder",
     *   referenceTypeId: "Organizes",
     *   browseDirection: BrowseDirection.Inverse,
     *   includeSubtypes: true,
     *   nodeClassMask: 0,
     *   resultMask: 63
     * },
     * // {...}
     * ]
     *  session.browse(browseDescriptions,function(err, browseResults) {
     *
     *   });
     * ```
     *
     *
     */
    browse(nodeToBrowse: BrowseDescriptionLike, callback: ResponseCallback<BrowseResult>): void;
    browse(nodesToBrowse: BrowseDescriptionLike[], callback: ResponseCallback<BrowseResult[]>): void;
    browse(nodeToBrowse: BrowseDescriptionLike): Promise<BrowseResult>;
    browse(nodesToBrowse: BrowseDescriptionLike[]): Promise<BrowseResult[]>;
    browseNext(continuationPoint: Buffer, releaseContinuationPoints: boolean, callback: ResponseCallback<BrowseResult>): void;
    browseNext(continuationPoints: Buffer[], releaseContinuationPoints: boolean, callback: ResponseCallback<BrowseResult[]>): void;
    browseNext(continuationPoint: Buffer, releaseContinuationPoints: boolean): Promise<BrowseResult>;
    browseNext(continuationPoints: Buffer[], releaseContinuationPoints: boolean): Promise<BrowseResult[]>;
    /**
     *
     * @example
     *
     * ```javascript
     *     session.readVariableValue("ns=2;s=Furnace_1.Temperature",function(err,dataValue) {
     *        if(err) { return callback(err); }
     *        if (dataValue.isGood()) {
     *        }
     *        console.log(dataValue.toString());
     *        callback();
     *     });
     * ```
     *
     * @example
     *
     * ```javascript
     *   session.readVariableValue(["ns=0;i=2257","ns=0;i=2258"],function(err,dataValues) {
     *      if (!err) {
     *         console.log(dataValues[0].toString());
     *         console.log(dataValues[1].toString());
     *      }
     *   });
     * ```
     *
     * @example
     * ```javascript
     *     const dataValues = await session.readVariableValue(["ns=1;s=Temperature","ns=1;s=Pressure"]);
     * ```
     *
     * @deprecated
     */
    readVariableValue(nodeId: NodeIdLike, callback: ResponseCallback<DataValue>): void;
    readVariableValue(nodeIds: NodeIdLike[], callback: ResponseCallback<DataValue[]>): void;
    readVariableValue(nodeId: NodeIdLike): Promise<DataValue>;
    readVariableValue(nodeIds: NodeIdLike[]): Promise<DataValue[]>;
    /**
     *
     * @example
     *
     * ```javascript
     * //  es5
     * session.readHistoryValue(
     *   "ns=5;s=Simulation Examples.Functions.Sine1",
     *   "2015-06-10T09:00:00.000Z",
     *   "2015-06-10T09:01:00.000Z", function(err,dataValues) {
     *
     * });
     * ```
     *
     * ```javascript
     * //  es6
     * const dataValues = await session.readHistoryValue(
     *   "ns=5;s=Simulation Examples.Functions.Sine1",
     *   "2015-06-10T09:00:00.000Z",
     *   "2015-06-10T09:01:00.000Z");
     * ```
     * @param nodeToRead   the read value id
     * @param start   the start time in UTC format
     * @param end     the end time in UTC format
     * @param callback
     */
    readHistoryValue(nodesToRead: NodeIdLike[] | HistoryReadValueIdOptions2[], start: DateTime, end: DateTime, callback: (err: Error | null, results?: HistoryReadResult[]) => void): void;
    readHistoryValue(nodesToRead: NodeIdLike[] | HistoryReadValueIdOptions2[], start: DateTime, end: DateTime, options: ExtraReadHistoryValueParameters | undefined, callback: (err: Error | null, results?: HistoryReadResult[]) => void): void;
    readHistoryValue(nodesToRead: NodeIdLike[] | HistoryReadValueIdOptions2[], start: DateTime, end: DateTime, options?: ExtraReadHistoryValueParameters): Promise<HistoryReadResult[]>;
    readHistoryValue(nodeToRead: NodeIdLike | HistoryReadValueIdOptions2, start: DateTime, end: DateTime, callback: (err: Error | null, results?: HistoryReadResult) => void): void;
    readHistoryValue(nodeToRead: NodeIdLike | HistoryReadValueIdOptions2, start: DateTime, end: DateTime, options: ExtraReadHistoryValueParameters | undefined, callback: (err: Error | null, results?: HistoryReadResult) => void): void;
    readHistoryValue(nodeToRead: NodeIdLike | HistoryReadValueIdOptions2, start: DateTime, end: DateTime, parameters: ExtraReadHistoryValueParameters): Promise<HistoryReadResult>;
    historyRead(request: HistoryReadRequest, callback: Callback<HistoryReadResponse>): void;
    historyRead(request: HistoryReadRequest): Promise<HistoryReadResponse>;
    readAggregateValue(nodesToRead: HistoryReadValueIdOptions[], startTime: DateTime, endTime: DateTime, aggregateFn: AggregateFunction[], processingInterval: number, callback: Callback<HistoryReadResult[]>): void;
    readAggregateValue(nodesToRead: HistoryReadValueIdOptions[], startTime: DateTime, endTime: DateTime, aggregateFn: AggregateFunction[], processingInterval: number): Promise<HistoryReadResult[]>;
    readAggregateValue(nodeToRead: HistoryReadValueIdOptions, startTime: DateTime, endTime: DateTime, aggregateFn: AggregateFunction, processingInterval: number, callback: Callback<HistoryReadResult>): void;
    readAggregateValue(nodeToRead: HistoryReadValueIdOptions, startTime: DateTime, endTime: DateTime, aggregateFn: AggregateFunction, processingInterval: number): Promise<HistoryReadResult>;
    readAggregateValue(nodesToRead: HistoryReadValueIdOptions[], startTime: DateTime, endTime: DateTime, aggregateFn: AggregateFunction[], processingInterval: number, aggregateConfiguration: AggregateConfigurationOptions, callback: Callback<HistoryReadResult[]>): void;
    readAggregateValue(nodesToRead: HistoryReadValueIdOptions[], startTime: DateTime, endTime: DateTime, aggregateFn: AggregateFunction[], processingInterval: number, aggregateConfiguration: AggregateConfigurationOptions): Promise<HistoryReadResult[]>;
    readAggregateValue(nodeToRead: HistoryReadValueIdOptions, startTime: DateTime, endTime: DateTime, aggregateFn: AggregateFunction, processingInterval: number, aggregateConfiguration: AggregateConfigurationOptions, callback: Callback<HistoryReadResult>): void;
    readAggregateValue(nodeToRead: HistoryReadValueIdOptions, startTime: DateTime, endTime: DateTime, aggregateFn: AggregateFunction, processingInterval: number, aggregateConfiguration: AggregateConfigurationOptions): Promise<HistoryReadResult>;
    /**
     *

     * @param nodesToWrite {WriteValue[]}  - the array of value to write. One or more elements.
     * @param {Function} callback -   the callback function
     * @param callback.err {object|null} the error if write has failed or null if OK
     * @param callback.statusCodes {StatusCode[]} - an array of status code of each write
     *
     * @example
     *
     *     const nodesToWrite = [
     *     {
     *          nodeId: "ns=1;s=SetPoint1",
     *          attributeId: opcua.AttributeIds.Value,
     *          value: {
     *             statusCode: Good,
     *             value: {
     *               dataType: opcua.DataType.Double,
     *               value: 100.0
     *             }
     *          }
     *     },
     *     {
     *          nodeId: "ns=1;s=SetPoint2",
     *          attributeIds opcua.AttributeIds.Value,
     *          value: {
     *             statusCode: Good,
     *             value: {
     *               dataType: opcua.DataType.Double,
     *               value: 45.0
     *             }
     *          }
     *     }
     *     ];
     *     session.write(nodesToWrite,function (err,statusCodes) {
     *       if(err) { return callback(err);}
     *       //
     *     });
     *

     * @param nodeToWrite {WriteValue}  - the value to write
     * @param callback -   the callback function
     * @param callback.err {object|null} the error if write has failed or null if OK
     * @param callback.statusCode {StatusCodes} - the status code of the write
     *
     * @example
     *
     *     const nodeToWrite = {
     *          nodeId: "ns=1;s=SetPoint",
     *          attributeId: opcua.AttributeIds.Value,
     *          value: {
     *             statusCode: Good,
     *             value: {
     *               dataType: opcua.DataType.Double,
     *               value: 100.0
     *             }
     *          }
     *     };
     *     session.write(nodeToWrite,function (err,statusCode) {
     *       if(err) { return callback(err);}
     *       //
     *     });
     *
     *

     * @param nodeToWrite {WriteValue}  - the value to write
     * @return {Promise<StatusCode>}
     *
     * @example
     *
     * ```javascript
     *   session.write(nodeToWrite).then(function(statusCode) { });
     * ```
     *
     * @example
     *
     * ```javascript
     *   const statusCode = await session.write(nodeToWrite);
     * ```
     *

     * @param nodesToWrite {Array<WriteValue>}  - the value to write
     * @return {Promise<Array<StatusCode>>}
     *
     * @example
     * ```javascript
     * session.write(nodesToWrite).then(function(statusCodes) { });
     * ```
     *
     * @example
     * ```javascript
     *   const statusCodes = await session.write(nodesToWrite);
     * ```
     */
    write(nodeToWrite: WriteValueOptions, callback: ResponseCallback<StatusCode>): void;
    write(nodesToWrite: WriteValueOptions[], callback: ResponseCallback<StatusCode[]>): void;
    write(nodesToWrite: WriteValueOptions[]): Promise<StatusCode[]>;
    write(nodeToWrite: WriteValueOptions): Promise<StatusCode>;
    /**
     * @deprecated use session.write instead
     *
     * @param nodeId  {NodeId}  - the node id of the node to write
     * @param value   {Variant} - the value to write
     * @param callback   {Function}
     * @param callback.err {object|null} the error if write has failed or null if OK
     * @param callback.statusCode {StatusCode} - the status code of the write
     *
     * @param nodeId  {NodeId}  - the node id of the node to write
     * @param value   {Variant} - the value to write
     * @return {Promise<StatusCode>} - the status code of the write
     *
     *
     * @example
     *     // please use session.write instead of session.writeSingleNode
     *     // as follow
     *     const statusCode = await session.write({
     *          nodeId,
     *          attributeId: AttributeIds.Value,
     *          value: {
     *             statusCode: Good,
     *             sourceTimestamp: new Date(), // optional, some server may not accept this
     *             value: {
     *               dataType: opcua.DataType.Double,
     *               value: 100.0
     *             }
     *          }
     *     });
     *
     *
     */
    writeSingleNode(nodeId: NodeIdLike, value: VariantLike, callback: ResponseCallback<StatusCode>): void;
    writeSingleNode(nodeId: NodeIdLike, value: VariantLike): Promise<StatusCode>;
    /**

     *
     * @example
     *
     *
     *  ``` javascript
     *  session.readAllAttributes("ns=2;s=Furnace_1.Temperature",function(err,data) {
     *    if(data.statusCode.isGood()) {
     *      console.log(" nodeId      = ",data.nodeId.toString());
     *      console.log(" browseName  = ",data.browseName.toString());
     *      console.log(" description = ",data.description.toString());
     *      console.log(" value       = ",data.value.toString()));
     *    }
     *  });
     *  ```
     *
     * @param nodes  array of nodeId to read
     * @param node  nodeId to read
     * @param callback
     */
    readAllAttributes(node: NodeIdLike, callback: (err: Error | null, data?: NodeAttributes) => void): void;
    readAllAttributes(nodes: NodeIdLike[], callback: (err: Error | null, data?: NodeAttributes[]) => void): void;
    /**
     *
     *
     * @example
     *
     *     ```javascript
     *     ```
     *
     *   form1: reading a single node
     *
     *  ``` javascript
     *    const nodeToRead = {
     *             nodeId:      "ns=2;s=Furnace_1.Temperature",
     *             attributeId: AttributeIds.BrowseName
     *    };
     *
     *    session.read(nodeToRead,function(err,dataValue) {
     *        if (!err) {
     *           console.log(dataValue.toString());
     *        }
     *    });
     *    ```
     *
     *

     * @param nodesToRead               {Array<ReadValueId>} - an array of nodeId to read or a ReadValueId
     * @param [maxAge]                 {Number}
     * @param callback                 {Function}                - the callback function
     * @param callback.err             {Error|null}              - the error or null if the transaction was OK}
     * @param callback.dataValues       {Array<DataValue>}
     *
     * @example
     *
     *   ``` javascript
     *   const nodesToRead = [
     *        {
     *             nodeId:      "ns=2;s=Furnace_1.Temperature",
     *             attributeId: AttributeIds.BrowseName
     *        }
     *   ];
     *   session.read(nodesToRead,function(err,dataValues) {
     *     if (!err) {
     *       dataValues.forEach(dataValue=>console.log(dataValue.toString()));
     *     }
     *   });
     *   ```
     *
     */
    read(nodeToRead: ReadValueIdOptions, maxAge: number, callback: ResponseCallback<DataValue>): void;
    read(nodesToRead: ReadValueIdOptions[], maxAge: number, callback: ResponseCallback<DataValue[]>): void;
    read(nodeToRead: ReadValueIdOptions, callback: ResponseCallback<DataValue>): void;
    read(nodesToRead: ReadValueIdOptions[], callback: ResponseCallback<DataValue[]>): void;
    read(nodeToRead: ReadValueIdOptions, maxAge?: number): Promise<DataValue>;
    read(nodeToRead: ReadValueIdOptions[], maxAge?: number): Promise<DataValue[]>;
    emitCloseEvent(statusCode: StatusCode): void;
    createSubscription(options: CreateSubscriptionRequestLike, callback?: ResponseCallback<CreateSubscriptionResponse>): any;
    /**

     * @param createSubscriptionRequest
     * @param callback
     *
     *
     * subscription.on("error',    function(err){ ... });
     * subscription.on("terminate',function(err){ ... });
     * const monitoredItem = await subscription.monitor(itemToMonitor,monitoringParameters,requestedParameters);
     * monitoredItem.on("changed",function( dataValue) {...});
     *
     */
    createSubscription2(createSubscriptionRequest: CreateSubscriptionRequestLike): Promise<ClientSubscription>;
    createSubscription2(createSubscriptionRequest: CreateSubscriptionRequestLike, callback: (err: Error | null, subscription?: ClientSubscription) => void): void;
    deleteSubscriptions(options: DeleteSubscriptionsRequestLike, callback?: ResponseCallback<DeleteSubscriptionsResponse>): any;
    setTriggering(request: SetTriggeringRequestOptions, callback?: ResponseCallback<SetTriggeringResponse>): any;
    /**
     */
    transferSubscriptions(options: TransferSubscriptionsRequestLike, callback?: ResponseCallback<TransferSubscriptionsResponse>): any;
    createMonitoredItems(options: CreateMonitoredItemsRequestLike, callback?: ResponseCallback<CreateMonitoredItemsResponse>): any;
    modifyMonitoredItems(options: ModifyMonitoredItemsRequestLike, callback?: ResponseCallback<ModifyMonitoredItemsResponse>): any;
    /**
     *
     */
    modifySubscription(options: ModifySubscriptionRequestLike, callback?: ResponseCallback<ModifySubscriptionResponse>): any;
    setMonitoringMode(options: SetMonitoringModeRequestLike, callback?: ResponseCallback<SetMonitoringModeResponse>): any;
    /**
     */
    publish(options: PublishRequest, callback: (err: Error | null, response?: PublishResponse) => void): void;
    /**
     *
     */
    republish(options: RepublishRequest, callback: (err: Error | null, response?: RepublishResponse) => void): void;
    /**
     *
     */
    deleteMonitoredItems(options: DeleteMonitoredItemsRequestLike, callback: (err: Error | null, response?: DeleteMonitoredItemsResponse) => void): void;
    /**
     *
     */
    setPublishingMode(publishingEnabled: boolean, subscriptionId: SubscriptionId): Promise<StatusCode>;
    setPublishingMode(publishingEnabled: boolean, subscriptionIds: SubscriptionId[]): Promise<StatusCode[]>;
    setPublishingMode(publishingEnabled: boolean, subscriptionId: SubscriptionId, callback: (err: Error | null, statusCode?: StatusCode) => void): void;
    setPublishingMode(publishingEnabled: boolean, subscriptionIds: SubscriptionId[], callback: (err: Error | null, statusCodes?: StatusCode[]) => void): void;
    /**
     *
     */
    translateBrowsePath(browsePath: BrowsePath, callback: ResponseCallback<BrowsePathResult>): void;
    translateBrowsePath(browsesPath: BrowsePath[], callback: ResponseCallback<BrowsePathResult[]>): void;
    translateBrowsePath(browsePath: BrowsePath): Promise<BrowsePathResult>;
    translateBrowsePath(browsePaths: BrowsePath[]): Promise<BrowsePathResult[]>;
    channelId(): number;
    isChannelValid(): boolean;
    performMessageTransaction(request: Request, callback: (err: Error | null, response?: Response) => void): void;
    _performMessageTransaction(request: Request, callback: (err: Error | null, response?: Response) => void): void;
    /**
     *  evaluate the remaining time for the session
     *
     *
     * evaluate the time in milliseconds that the session will live
     * on the server end from now.
     * The remaining live time is calculated based on when the last message was sent to the server
     * and the session timeout.
     *
     * * In normal operation , when server and client communicates on a regular
     *   basis, evaluateRemainingLifetime will return a number slightly below
     *   session.timeout
     *
     * * when the client and server cannot communicate due to a network issue
     *   (or a server crash), evaluateRemainingLifetime returns the estimated number
     *   of milliseconds before the server (if not crash) will keep  the session alive
     *   on its end to allow a automatic reconnection with session.
     *
     * * When evaluateRemainingLifetime returns zero , this mean that
     *   the session has probably ended on the server side and will have to be recreated
     *   from scratch in case of a reconnection.
     *
     * @return the number of milliseconds before session expires
     */
    evaluateRemainingLifetime(): number;
    _terminatePublishEngine(): void;
    /**
     *
     */
    close(callback: ErrorCallback): void;
    close(deleteSubscription: boolean, callback: ErrorCallback): void;
    close(deleteSubscription?: boolean): Promise<void>;
    /**

     * @return {Boolean}
     */
    hasBeenClosed(): boolean;
    call(methodToCall: CallMethodRequestLike): Promise<CallMethodResult>;
    call(methodToCall: CallMethodRequestLike[]): Promise<CallMethodResult[]>;
    call(methodToCall: CallMethodRequestLike, callback: ResponseCallback<CallMethodResult>): void;
    call(methodsToCall: CallMethodRequestLike[], callback: ResponseCallback<CallMethodResult[]>): void;
    /**

     * @param subscriptionId {UInt32} the subscription Id to return
     * @param callback {Function}
     * @param callback.err {Error}
     * @param callback.monitoredItems the monitored Items
     * @param callback.monitoredItems the monitored Items
     */
    getMonitoredItems(subscriptionId: SubscriptionId): Promise<MonitoredItemData>;
    getMonitoredItems(subscriptionId: SubscriptionId, callback: ResponseCallback<MonitoredItemData>): void;
    /**
     *
     */
    getArgumentDefinition(methodId: MethodId): Promise<ArgumentDefinition>;
    getArgumentDefinition(methodId: MethodId, callback: ResponseCallback<ArgumentDefinition>): void;
    registerNodes(nodesToRegister: NodeIdLike[]): Promise<NodeId[]>;
    registerNodes(nodesToRegister: NodeIdLike[], callback: (err: Error | null, registeredNodeIds?: NodeId[]) => void): void;
    unregisterNodes(nodesToUnregister: NodeIdLike[]): Promise<void>;
    unregisterNodes(nodesToUnregister: NodeIdLike[], callback: (err?: Error) => void): void;
    queryFirst(queryFirstRequest: QueryFirstRequestLike): Promise<QueryFirstResponse>;
    queryFirst(queryFirstRequest: QueryFirstRequestLike, callback: ResponseCallback<QueryFirstResponse>): void;
    startKeepAliveManager(keepAliveInterval?: number): void;
    stopKeepAliveManager(): void;
    dispose(): void;
    toString(): string;
    getBuiltInDataType(...args: any[]): any;
    readNamespaceArray(): Promise<string[]>;
    readNamespaceArray(callback: (err: Error | null, namespaceArray?: string[]) => void): void;
    getNamespaceIndex(namespaceUri: string): number;
    disableCondition(): void;
    enableCondition(): void;
    addCommentCondition(_conditionId: NodeIdLike, _eventId: Buffer, _comment: LocalizedTextLike, _callback?: Callback<StatusCode>): any;
    confirmCondition(_conditionId: NodeIdLike, _eventId: Buffer, _comment: LocalizedTextLike, _callback?: Callback<StatusCode>): any;
    acknowledgeCondition(_conditionId: NodeId, _eventId: Buffer, _comment: LocalizedTextLike, _callback?: Callback<StatusCode>): any;
    /**
     * @deprecated
     * @private
     */
    findMethodId(_nodeId: NodeIdLike, _methodName: string, _callback?: ResponseCallback<NodeId>): any;
    _callMethodCondition(_methodName: string, _conditionId: NodeIdLike, _eventId: Buffer, _comment: LocalizedTextLike, _callback: Callback<StatusCode>): void;
    extractNamespaceDataType(): Promise<ExtraDataTypeManager>;
    getExtensionObjectConstructor(dataTypeNodeId: NodeId): Promise<AnyConstructorFunc>;
    /**
     * construct a Extension object from a DataType and a pojo
     * @param dataType
     * @param pojo
     */
    constructExtensionObject(dataType: NodeId, pojo: Record<string, any>): Promise<ExtensionObject>;
    private _defaultRequest;
}
export {};
