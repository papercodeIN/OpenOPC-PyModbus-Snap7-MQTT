import { IDefaultBrokerDefinition } from 'broker-factory';
import { IWorkerTimersBrokerDefinition } from '../interfaces';
export type TWorkerTimersBrokerWrapper = (sender: MessagePort | Worker) => IWorkerTimersBrokerDefinition & IDefaultBrokerDefinition;
//# sourceMappingURL=worker-timers-broker-wrapper.d.ts.map