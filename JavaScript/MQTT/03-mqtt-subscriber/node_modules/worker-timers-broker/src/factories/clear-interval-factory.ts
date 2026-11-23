export const createClearIntervalFactory =
    (scheduledIntervalsState: Map<number, null | symbol>) => (clear: (timerId: number) => Promise<boolean>) => (timerId: number) => {
        if (typeof scheduledIntervalsState.get(timerId) === 'symbol') {
            scheduledIntervalsState.set(timerId, null);

            clear(timerId).then(() => {
                scheduledIntervalsState.delete(timerId);
            });
        }
    };
