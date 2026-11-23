import { IWorkerDefinition } from 'worker-factory';
import { IBrokerDefinition, IDefaultBrokerDefinition } from '../interfaces';
import { TBrokerImplementation } from '../types';

export const createExtendBrokerImplementation =
    (portMap: WeakMap<MessagePort, number>) =>
    <T extends IBrokerDefinition, U extends IWorkerDefinition>(
        partialBrokerImplementation: TBrokerImplementation<T, U>
    ): TBrokerImplementation<T & IDefaultBrokerDefinition, U> =>
        <TBrokerImplementation<T & IDefaultBrokerDefinition, U>>{
            ...partialBrokerImplementation,
            connect: ({ call }) => {
                return async (): Promise<MessagePort> => {
                    const { port1, port2 } = new MessageChannel();

                    const portId = <number>await call('connect', { port: port1 }, [port1]);

                    portMap.set(port2, portId);

                    return port2;
                };
            },
            disconnect: ({ call }) => {
                return async (port: MessagePort): Promise<void> => {
                    const portId = portMap.get(port);

                    if (portId === undefined) {
                        throw new Error('The given port is not connected.');
                    }

                    await call('disconnect', { portId });
                };
            },
            isSupported: ({ call }) => {
                return () => call('isSupported');
            }
        };
