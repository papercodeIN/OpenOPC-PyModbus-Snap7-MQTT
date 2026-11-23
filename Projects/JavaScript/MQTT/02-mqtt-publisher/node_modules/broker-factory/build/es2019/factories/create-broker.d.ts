import type { generateUniqueNumber as generateUniqueNumberFunction } from 'fast-unique-numbers';
import { IWorkerDefinition } from 'worker-factory';
import type { isMessagePort as isMessagePortFunction } from '../guards/message-port';
import { IBrokerDefinition, IDefaultBrokerDefinition } from '../interfaces';
import { TBrokerImplementation } from '../types';
import type { createCreateOrGetOngoingRequests } from './create-or-get-ongoing-requests';
import type { createExtendBrokerImplementation } from './extend-broker-implementation';
export declare const createBrokerFactory: (createOrGetOngoingRequests: ReturnType<typeof createCreateOrGetOngoingRequests>, extendBrokerImplementation: ReturnType<typeof createExtendBrokerImplementation>, generateUniqueNumber: typeof generateUniqueNumberFunction, isMessagePort: typeof isMessagePortFunction) => <T extends IBrokerDefinition, U extends IWorkerDefinition>(brokerImplementation: TBrokerImplementation<T, U>) => ((sender: MessagePort | Worker) => T & IDefaultBrokerDefinition);
//# sourceMappingURL=create-broker.d.ts.map