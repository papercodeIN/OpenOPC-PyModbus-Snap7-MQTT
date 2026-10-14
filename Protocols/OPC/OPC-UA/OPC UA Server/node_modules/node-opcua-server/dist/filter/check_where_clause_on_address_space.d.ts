import { IAddressSpace, ISessionContext, IEventData } from "node-opcua-address-space-base";
import { ContentFilter } from "node-opcua-types";
export declare function checkWhereClauseOnAdressSpace(addressSpace: IAddressSpace, sessionContext: ISessionContext, whereClause: ContentFilter, eventData: IEventData): boolean;
