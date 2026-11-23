export const createClearTimeoutFactory = (scheduledTimeoutsState) => (clear) => (timerId) => {
    if (typeof scheduledTimeoutsState.get(timerId) === 'symbol') {
        scheduledTimeoutsState.set(timerId, null);
        clear(timerId).then(() => {
            scheduledTimeoutsState.delete(timerId);
        });
    }
};
//# sourceMappingURL=clear-timeout-factory.js.map