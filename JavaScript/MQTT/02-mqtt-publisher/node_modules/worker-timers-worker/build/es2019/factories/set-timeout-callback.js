export const createSetTimeoutCallback = (performance, setTimeout) => {
    const setTimeoutCallback = (expected, identifiersAndResolvers, resolveSetResponseResultPromise, timerId) => {
        const remainingDelay = expected - performance.now();
        if (remainingDelay > 0) {
            identifiersAndResolvers.set(timerId, [
                setTimeout(setTimeoutCallback, remainingDelay, expected, identifiersAndResolvers, resolveSetResponseResultPromise, timerId),
                resolveSetResponseResultPromise
            ]);
        }
        else {
            identifiersAndResolvers.delete(timerId);
            resolveSetResponseResultPromise(true);
        }
    };
    return setTimeoutCallback;
};
//# sourceMappingURL=set-timeout-callback.js.map