import { IBrokerEvent, IReceiver, IWorkerDefinition } from '../interfaces';
import { TWorkerImplementation } from '../types';
export declare const createMessageHandler: <WorkerDefinition extends IWorkerDefinition>(receiver: IReceiver, workerImplementation: TWorkerImplementation<WorkerDefinition>) => ({ data: { id, method, params } }: IBrokerEvent<WorkerDefinition>) => Promise<void>;
//# sourceMappingURL=create-message-handler.d.ts.map