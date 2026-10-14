import { ContinuationData, IContinuationPointInfo, IContinuationPointManager, ISessionBase } from "node-opcua-address-space-base";
import { DataValue } from "node-opcua-data-value";
import { ReferenceDescription } from "node-opcua-service-browse";
export declare class MockContinuationPointManager implements IContinuationPointManager {
    registerHistoryReadRaw(maxElements: number, dataValues: DataValue[], cnt: ContinuationData): IContinuationPointInfo<DataValue>;
    getNextHistoryReadRaw(numValues: number, cnt: ContinuationData): IContinuationPointInfo<DataValue>;
    registerReferences(maxElements: number, values: ReferenceDescription[], cnt: ContinuationData): IContinuationPointInfo<ReferenceDescription>;
    getNextReferences(numValue: number, cnt: ContinuationData): IContinuationPointInfo<ReferenceDescription>;
}
export declare const mockSession: ISessionBase;
