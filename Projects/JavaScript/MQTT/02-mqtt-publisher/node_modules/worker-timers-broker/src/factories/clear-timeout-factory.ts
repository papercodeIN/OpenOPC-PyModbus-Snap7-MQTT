export const createClearTimeoutFactory =
    (scheduledTimeoutsState: Map<number, null | symbol>) => (clear: (timerId: number) => Promise<boolean>) => (timerId: number) => {
        if (typeof scheduledTimeoutsState.get(timerId) === 'symbol') {
            scheduledTimeoutsState.set(timerId, null);

            clear(timerId).then(() => {
                scheduledTimeoutsState.delete(timerId);
            });
        }
    };
