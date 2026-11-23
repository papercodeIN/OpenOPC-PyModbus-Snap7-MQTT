import type { Packet, ISubackPacket } from 'mqtt-packet';
import type { Duplex as NativeDuplex } from 'node:stream';
import type { Duplex } from 'readable-stream';
import type MqttClient from './client';
import type { IClientOptions } from './client';
export type DoneCallback = (error?: Error) => void;
export type GenericCallback<T> = (error?: Error, result?: T) => void;
export type VoidCallback = () => void;
export type IStream = (Duplex | NativeDuplex) & {
    socket?: any;
};
export type StreamBuilder = (client: MqttClient, opts?: IClientOptions) => IStream;
export type Callback = () => void;
export interface PacketPump {
    discardParsedPackets(): void;
    isCurrent(): boolean;
}
export type PacketHandler = (client: MqttClient, packet: Packet, done?: DoneCallback, pump?: PacketPump) => void;
export type TimerVariant = 'auto' | 'worker' | 'native';
export declare class ErrorWithReasonCode extends Error {
    code: number;
    constructor(message: string, code: number);
}
export declare class ErrorWithSubackPacket extends Error {
    packet: ISubackPacket;
    constructor(message: string, packet: ISubackPacket);
}
export type Constructor<T = {}> = new (...args: any[]) => T;
export declare function applyMixin(target: Constructor, mixin: Constructor, includeConstructor?: boolean): void;
export declare const nextTick: (callback: Function, ...args: any[]) => void;
export declare const MQTTJS_VERSION: any;
