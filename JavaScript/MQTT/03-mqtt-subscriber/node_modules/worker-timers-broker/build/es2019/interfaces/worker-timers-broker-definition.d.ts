import { IBrokerDefinition } from 'broker-factory';
export interface IWorkerTimersBrokerDefinition extends IBrokerDefinition {
    clearInterval(timerId: number): void;
    clearTimeout(timerId: number): void;
    setInterval(func: Function, delay?: number, ...args: any[]): number;
    setTimeout(func: Function, delay?: number, ...args: any[]): number;
}
//# sourceMappingURL=worker-timers-broker-definition.d.ts.map