import { TResolveSetResponseResultPromise } from '../types';

export const createSetTimeoutCallback = (performance: Pick<Performance, 'now'>, setTimeout: (typeof globalThis)['setTimeout']) => {
    const setTimeoutCallback = (
        expected: number,
        identifiersAndResolvers: Map<number, [number, TResolveSetResponseResultPromise]>,
        resolveSetResponseResultPromise: TResolveSetResponseResultPromise,
        timerId: number
    ) => {
        const remainingDelay = expected - performance.now();

        if (remainingDelay > 0) {
            identifiersAndResolvers.set(timerId, [
                setTimeout(setTimeoutCallback, remainingDelay, expected, identifiersAndResolvers, resolveSetResponseResultPromise, timerId),
                resolveSetResponseResultPromise
            ]);
        } else {
            identifiersAndResolvers.delete(timerId);
            resolveSetResponseResultPromise(true);
        }
    };

    return setTimeoutCallback;
};
