export const createSetIntervalFactory = (generateUniqueNumber, scheduledIntervalsState) => (set) => (func, delay = 0, ...args) => {
    const symbol = Symbol();
    const timerId = generateUniqueNumber(scheduledIntervalsState);
    scheduledIntervalsState.set(timerId, symbol);
    const schedule = () => set(delay, timerId).then(() => {
        const state = scheduledIntervalsState.get(timerId);
        if (state === undefined) {
            throw new Error('The timer is in an undefined state.');
        }
        if (state === symbol) {
            func(...args);
            // Doublecheck if the interval should still be rescheduled because it could have been cleared inside of func().
            if (scheduledIntervalsState.get(timerId) === symbol) {
                schedule();
            }
        }
    });
    schedule();
    return timerId;
};
//# sourceMappingURL=set-interval-factory.js.map