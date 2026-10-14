import { AddressSpace } from "node-opcua-address-space";
import { ISessionContext, ContinuationData } from "node-opcua-address-space-base";
import { TimestampsToReturn, DataValue } from "node-opcua-data-value";
import { StatusCode } from "node-opcua-status-code";
import { BrowseDescriptionOptions, BrowseResult, ReadValueIdOptions, WriteValue, CallMethodRequest, CallMethodResultOptions, HistoryReadValueId, HistoryReadDetails, HistoryReadResult, ReadRequestOptions, HistoryReadRequest } from "node-opcua-types";
import { IAddressSpaceAccessor } from "./i_address_space_accessor";
interface IAddressSpaceAccessorSingle {
    browseNode(browseDescription: BrowseDescriptionOptions, context?: ISessionContext): Promise<BrowseResult>;
    readNode(context: ISessionContext, nodeToRead: ReadValueIdOptions, maxAge: number, timestampsToReturn?: TimestampsToReturn): Promise<DataValue>;
    writeNode(context: ISessionContext, writeValue: WriteValue): Promise<StatusCode>;
    callMethod(context: ISessionContext, methodToCall: CallMethodRequest): Promise<CallMethodResultOptions>;
    historyReadNode(context: ISessionContext, nodeToRead: HistoryReadValueId, historyReadDetails: HistoryReadDetails, timestampsToReturn: TimestampsToReturn, continuationData: ContinuationData): Promise<HistoryReadResult>;
}
export declare class AddressSpaceAccessor implements IAddressSpaceAccessor, IAddressSpaceAccessorSingle {
    addressSpace: AddressSpace;
    constructor(addressSpace: AddressSpace);
    browse(context: ISessionContext, nodesToBrowse: BrowseDescriptionOptions[]): Promise<BrowseResult[]>;
    read(context: ISessionContext, readRequest: ReadRequestOptions): Promise<DataValue[]>;
    write(context: ISessionContext, nodesToWrite: WriteValue[]): Promise<StatusCode[]>;
    call(context: ISessionContext, methodsToCall: CallMethodRequest[]): Promise<CallMethodResultOptions[]>;
    historyRead(context: ISessionContext, historyReadRequest: HistoryReadRequest): Promise<HistoryReadResult[]>;
    browseNode(browseDescription: BrowseDescriptionOptions, context?: ISessionContext): Promise<BrowseResult>;
    readNode(context: ISessionContext, nodeToRead: ReadValueIdOptions, maxAge: number, timestampsToReturn?: TimestampsToReturn): Promise<DataValue>;
    private __findNode;
    writeNode(context: ISessionContext, writeValue: WriteValue): Promise<StatusCode>;
    callMethod(context: ISessionContext, methodToCall: CallMethodRequest): Promise<CallMethodResultOptions>;
    historyReadNode(context: ISessionContext, nodeToRead: HistoryReadValueId, historyReadDetails: HistoryReadDetails, timestampsToReturn: TimestampsToReturn, continuationData: ContinuationData): Promise<HistoryReadResult>;
}
export {};
