import { IDefaultWorkerDefinition, IWorkerDefinition } from '../interfaces';

export type TWorkerDefinition<WorkerDefinition extends IWorkerDefinition> = WorkerDefinition & IDefaultWorkerDefinition;
