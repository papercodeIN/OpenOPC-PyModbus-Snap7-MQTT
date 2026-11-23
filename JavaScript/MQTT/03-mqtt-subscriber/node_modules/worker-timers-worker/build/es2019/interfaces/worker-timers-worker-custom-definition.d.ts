import { IWorkerDefinition } from 'worker-factory';
import { TTimerType } from '../types';
export interface IWorkerTimersWorkerCustomDefinition extends IWorkerDefinition {
    clear: {
        params: {
            timerId: number;
            timerType: TTimerType;
        };
        response: {
            result: boolean;
        };
    };
    set: {
        params: {
            delay: number;
            now: number;
            timerId: number;
            timerType: TTimerType;
        };
        response: {
            result: boolean;
        };
    };
}
//# sourceMappingURL=worker-timers-worker-custom-definition.d.ts.map