import { TWorkerTimersWorkerDefinition } from './worker-timers-worker-definition';

export type TResolveSetResponseResultPromise = Parameters<
    ConstructorParameters<typeof Promise<TWorkerTimersWorkerDefinition['set']['response']['result']>>[0]
>[0];
