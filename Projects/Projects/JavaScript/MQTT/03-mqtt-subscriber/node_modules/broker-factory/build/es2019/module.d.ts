export * from './interfaces/index';
export * from './types/index';
export declare const createBroker: <T extends import("./interfaces/broker-definition").IBrokerDefinition, U extends import("worker-factory").IWorkerDefinition>(brokerImplementation: import("./types/broker-implementation").TBrokerImplementation<T, U>) => ((sender: MessagePort | Worker) => T & import("./interfaces/default-broker-definition").IDefaultBrokerDefinition);
//# sourceMappingURL=module.d.ts.map