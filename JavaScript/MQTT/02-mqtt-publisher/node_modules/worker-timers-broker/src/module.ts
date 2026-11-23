import { createBroker } from 'broker-factory';
import { generateUniqueNumber } from 'fast-unique-numbers';
import { TWorkerTimersWorkerDefinition } from 'worker-timers-worker';
import { createClearIntervalFactory } from './factories/clear-interval-factory';
import { createClearTimeoutFactory } from './factories/clear-timeout-factory';
import { createSetIntervalFactory } from './factories/set-interval-factory';
import { createSetTimeoutFactory } from './factories/set-timeout-factory';
import { IWorkerTimersBrokerDefinition } from './interfaces';
import { TWorkerTimersBrokerLoader, TWorkerTimersBrokerWrapper } from './types';

/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';

// Prefilling the Maps with a function indexed by zero is necessary to be compliant with the specification.
const scheduledIntervalsState: Map<number, null | symbol> = new Map([[0, null]]); // tslint:disable-line no-empty
const scheduledTimeoutsState: Map<number, null | symbol> = new Map([[0, null]]); // tslint:disable-line no-empty

const createClearInterval = createClearIntervalFactory(scheduledIntervalsState);
const createClearTimeout = createClearTimeoutFactory(scheduledTimeoutsState);
const createSetInterval = createSetIntervalFactory(generateUniqueNumber, scheduledIntervalsState);
const createSetTimeout = createSetTimeoutFactory(generateUniqueNumber, scheduledTimeoutsState);

export const wrap: TWorkerTimersBrokerWrapper = createBroker<IWorkerTimersBrokerDefinition, TWorkerTimersWorkerDefinition>({
    clearInterval: ({ call }) => createClearInterval((timerId) => call('clear', { timerId, timerType: 'interval' })),
    clearTimeout: ({ call }) => createClearTimeout((timerId) => call('clear', { timerId, timerType: 'timeout' })),
    setInterval: ({ call }) =>
        createSetInterval((delay, timerId) =>
            call('set', { delay, now: performance.timeOrigin + performance.now(), timerId, timerType: 'interval' })
        ),
    setTimeout: ({ call }) =>
        createSetTimeout((delay, timerId) =>
            call('set', { delay, now: performance.timeOrigin + performance.now(), timerId, timerType: 'timeout' })
        )
});

export const load: TWorkerTimersBrokerLoader = (url: string) => {
    const worker = new Worker(url);

    return wrap(worker);
};
