export const createSetTimer = (identifiersAndResolvers, performance, setTimeout, setTimeoutCallback) => (delay, nowAndTimeOrigin, timerId) => {
    const expected = delay + nowAndTimeOrigin - performance.timeOrigin;
    const remainingDelay = expected - performance.now();
    return new Promise((resolve) => {
        identifiersAndResolvers.set(timerId, [
            setTimeout(setTimeoutCallback, remainingDelay, expected, identifiersAndResolvers, resolve, timerId),
            resolve
        ]);
    });
};
//# sourceMappingURL=set-timer.js.map