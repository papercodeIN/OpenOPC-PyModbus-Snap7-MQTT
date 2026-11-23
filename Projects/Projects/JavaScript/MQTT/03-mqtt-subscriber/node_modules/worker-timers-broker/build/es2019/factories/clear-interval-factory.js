export const createClearIntervalFactory = (scheduledIntervalsState) => (clear) => (timerId) => {
    if (typeof scheduledIntervalsState.get(timerId) === 'symbol') {
        scheduledIntervalsState.set(timerId, null);
        clear(timerId).then(() => {
            scheduledIntervalsState.delete(timerId);
        });
    }
};
//# sourceMappingURL=clear-interval-factory.js.map