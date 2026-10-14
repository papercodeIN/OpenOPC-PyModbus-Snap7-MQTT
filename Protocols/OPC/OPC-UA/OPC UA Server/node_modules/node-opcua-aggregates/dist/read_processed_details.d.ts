import { ISessionContext, UAVariable, ContinuationData } from "node-opcua-address-space";
import { NumericRange } from "node-opcua-numeric-range";
import { QualifiedNameLike } from "node-opcua-data-model";
import { CallbackT } from "node-opcua-status-code";
import { HistoryReadResult, ReadProcessedDetails } from "node-opcua-service-history";
export declare function readProcessedDetails(variable: UAVariable, context: ISessionContext, historyReadDetails: ReadProcessedDetails, indexRange: NumericRange | null, dataEncoding: QualifiedNameLike | null, continuationData: ContinuationData, callback: CallbackT<HistoryReadResult>): void;
