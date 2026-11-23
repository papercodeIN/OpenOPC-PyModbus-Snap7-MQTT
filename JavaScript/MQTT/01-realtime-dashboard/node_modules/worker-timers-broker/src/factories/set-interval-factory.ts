import type { generateUniqueNumber as generateUniqueNumberFunction } from 'fast-unique-numbers';

export const createSetIntervalFactory =
    (generateUniqueNumber: typeof generateUniqueNumberFunction, scheduledIntervalsState: Map<number, null | symbol>) =>
    (set: (delay: number, timerId: number) => Promise<boolean>) =>
    (func: Function, delay = 0, ...args: any[]) => {
        const symbol = Symbol();
        const timerId = generateUniqueNumber(scheduledIntervalsState);

        scheduledIntervalsState.set(timerId, symbol);

        const schedule = () =>
            set(delay, timerId).then(() => {
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
