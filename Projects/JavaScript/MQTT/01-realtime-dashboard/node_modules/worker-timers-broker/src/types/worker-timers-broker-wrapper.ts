import { IDefaultBrokerDefinition } from 'broker-factory';
import { IWorkerTimersBrokerDefinition } from '../interfaces';

export type TWorkerTimersBrokerWrapper = (sender: MessagePort | Worker) => IWorkerTimersBrokerDefinition & IDefaultBrokerDefinition;
