import { generateUniqueNumber } from 'fast-unique-numbers';
import { createBrokerFactory } from './factories/create-broker';
import { createCreateOrGetOngoingRequests } from './factories/create-or-get-ongoing-requests';
import { createExtendBrokerImplementation } from './factories/extend-broker-implementation';
import { isMessagePort } from './guards/message-port';
/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';
export const createBroker = createBrokerFactory(createCreateOrGetOngoingRequests(new WeakMap()), createExtendBrokerImplementation(new WeakMap()), generateUniqueNumber, isMessagePort);
//# sourceMappingURL=module.js.map