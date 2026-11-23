import { IBrokerMessage } from './broker-message';
import { IWorkerDefinition } from './worker-definition';

export interface IBrokerEvent<WorkerDefinition extends IWorkerDefinition> extends Event {
    data: IBrokerMessage<WorkerDefinition>;
}
