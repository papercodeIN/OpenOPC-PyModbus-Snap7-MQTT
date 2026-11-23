import { TResolveSetResponseResultPromise } from '../types';
import type { createSetTimeoutCallback } from './set-timeout-callback';

export const createSetTimer =
    (
        identifiersAndResolvers: Map<number, [number, TResolveSetResponseResultPromise]>,
        performance: Pick<Performance, 'now' | 'timeOrigin'>,
        setTimeout: (typeof globalThis)['setTimeout'],
        setTimeoutCallback: ReturnType<typeof createSetTimeoutCallback>
    ) =>
    (delay: number, nowAndTimeOrigin: number, timerId: number) => {
        const expected = delay + nowAndTimeOrigin - performance.timeOrigin;
        const remainingDelay = expected - performance.now();

        return new Promise((resolve) => {
            identifiersAndResolvers.set(timerId, [
                setTimeout(setTimeoutCallback, remainingDelay, expected, identifiersAndResolvers, resolve, timerId),
                resolve
            ]);
        });
    };
