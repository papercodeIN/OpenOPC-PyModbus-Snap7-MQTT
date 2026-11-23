import type { generateUniqueNumber as generateUniqueNumberFunction } from 'fast-unique-numbers';
import { IWorkerDefinition, IWorkerErrorMessage, IWorkerResultMessage } from 'worker-factory';
import type { isMessagePort as isMessagePortFunction } from '../guards/message-port';
import { IBrokerDefinition, IDefaultBrokerDefinition, IWorkerEvent } from '../interfaces';
import { TBrokerImplementation } from '../types';
import type { createCreateOrGetOngoingRequests } from './create-or-get-ongoing-requests';
import type { createExtendBrokerImplementation } from './extend-broker-implementation';

export const createBrokerFactory =
    (
        createOrGetOngoingRequests: ReturnType<typeof createCreateOrGetOngoingRequests>,
        extendBrokerImplementation: ReturnType<typeof createExtendBrokerImplementation>,
        generateUniqueNumber: typeof generateUniqueNumberFunction,
        isMessagePort: typeof isMessagePortFunction
    ) =>
    <T extends IBrokerDefinition, U extends IWorkerDefinition>(
        brokerImplementation: TBrokerImplementation<T, U>
    ): ((sender: MessagePort | Worker) => T & IDefaultBrokerDefinition) => {
        const fullBrokerImplementation = extendBrokerImplementation(brokerImplementation);

        return (sender: MessagePort | Worker) => {
            const ongoingRequests = createOrGetOngoingRequests(sender);

            sender.addEventListener('message', <EventListener>(({ data: message }: IWorkerEvent) => {
                const { id } = message;

                if (id !== null && ongoingRequests.has(id)) {
                    const { reject, resolve } = <{ reject: Function; resolve: Function }>ongoingRequests.get(id);

                    ongoingRequests.delete(id);

                    if ((<IWorkerErrorMessage>message).error === undefined) {
                        resolve((<IWorkerResultMessage>message).result);
                    } else {
                        reject(new Error((<IWorkerErrorMessage>message).error.message));
                    }
                }
            }));

            if (isMessagePort(sender)) {
                sender.start();
            }

            const call = <V extends keyof U>(method: V, params: U[V]['params'] = null, transferables: U[V]['transferables'] = []) => {
                return new Promise<U[V]['response']['result']>((resolve, reject) => {
                    const id = generateUniqueNumber(ongoingRequests);

                    ongoingRequests.set(id, { reject, resolve });

                    if (params === null) {
                        sender.postMessage({ id, method }, <Transferable[]>transferables);
                    } else {
                        sender.postMessage({ id, method, params }, <Transferable[]>transferables);
                    }
                });
            };
            const notify = <V extends keyof U>(method: V, params: U[V]['params'], transferables: U[V]['transferables'] = []) => {
                sender.postMessage({ id: null, method, params }, <Transferable[]>transferables);
            };

            let functions: object = {};

            for (const [key, handler] of Object.entries(fullBrokerImplementation)) {
                functions = { ...functions, [key]: handler({ call, notify }) };
            }

            return <T & IDefaultBrokerDefinition>{ ...functions };
        };
    };
