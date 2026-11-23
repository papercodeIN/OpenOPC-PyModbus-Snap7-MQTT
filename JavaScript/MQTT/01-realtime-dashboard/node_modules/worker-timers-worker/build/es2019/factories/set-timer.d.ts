import { TResolveSetResponseResultPromise } from '../types';
import type { createSetTimeoutCallback } from './set-timeout-callback';
export declare const createSetTimer: (identifiersAndResolvers: Map<number, [number, TResolveSetResponseResultPromise]>, performance: Pick<Performance, "now" | "timeOrigin">, setTimeout: (typeof globalThis)["setTimeout"], setTimeoutCallback: ReturnType<typeof createSetTimeoutCallback>) => (delay: number, nowAndTimeOrigin: number, timerId: number) => Promise<unknown>;
//# sourceMappingURL=set-timer.d.ts.map