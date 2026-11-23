import { IWorkerDefinition } from 'worker-factory';
import { IBrokerDefinition, IDefaultBrokerDefinition } from '../interfaces';
import { TBrokerImplementation } from '../types';
export declare const createExtendBrokerImplementation: (portMap: WeakMap<MessagePort, number>) => <T extends IBrokerDefinition, U extends IWorkerDefinition>(partialBrokerImplementation: TBrokerImplementation<T, U>) => TBrokerImplementation<T & IDefaultBrokerDefinition, U>;
//# sourceMappingURL=extend-broker-implementation.d.ts.map