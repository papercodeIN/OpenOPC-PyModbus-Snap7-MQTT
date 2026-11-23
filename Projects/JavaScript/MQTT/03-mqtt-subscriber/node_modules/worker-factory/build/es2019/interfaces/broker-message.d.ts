import { IWorkerDefinition } from './worker-definition';
export interface IBrokerMessage<WorkerDefinition extends IWorkerDefinition> {
    id: null | number;
    method: Extract<keyof WorkerDefinition, string>;
    params: WorkerDefinition[Extract<keyof WorkerDefinition, string>]['params'];
}
//# sourceMappingURL=broker-message.d.ts.map