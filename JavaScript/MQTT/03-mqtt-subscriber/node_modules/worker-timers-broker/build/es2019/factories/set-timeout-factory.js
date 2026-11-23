export const createSetTimeoutFactory = (generateUniqueNumber, scheduledTimeoutsState) => (set) => (func, delay = 0, ...args) => {
    const symbol = Symbol();
    const timerId = generateUniqueNumber(scheduledTimeoutsState);
    scheduledTimeoutsState.set(timerId, symbol);
    set(delay, timerId).then(() => {
        const state = scheduledTimeoutsState.get(timerId);
        if (state === undefined) {
            throw new Error('The timer is in an undefined state.');
        }
        if (state === symbol) {
            // A timeout can be savely deleted because it is only called once.
            scheduledTimeoutsState.delete(timerId);
            func(...args);
        }
    });
    return timerId;
};
//# sourceMappingURL=set-timeout-factory.js.map