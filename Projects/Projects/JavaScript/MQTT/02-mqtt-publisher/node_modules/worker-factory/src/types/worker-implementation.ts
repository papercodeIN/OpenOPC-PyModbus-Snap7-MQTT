import { IWorkerDefinition } from '../interfaces';
import { TMessageReceiver } from './message-receiver';

export type TWorkerImplementation<WorkerDefinition extends IWorkerDefinition> = {
    [P in keyof WorkerDefinition]: TMessageReceiver<WorkerDefinition[P]>;
};
