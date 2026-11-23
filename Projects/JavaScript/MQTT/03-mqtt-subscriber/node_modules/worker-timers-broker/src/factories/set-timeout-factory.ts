import type { generateUniqueNumber as generateUniqueNumberFunction } from 'fast-unique-numbers';

export const createSetTimeoutFactory =
    (generateUniqueNumber: typeof generateUniqueNumberFunction, scheduledTimeoutsState: Map<number, null | symbol>) =>
    (set: (delay: number, timerId: number) => Promise<boolean>) =>
    (func: Function, delay = 0, ...args: any[]) => {
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
