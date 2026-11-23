import { type IConnackPacket } from 'mqtt-packet';
import { type PacketPump } from '../shared';
import type MqttClient from '../client';
declare const handleConnack: (client: MqttClient, packet: IConnackPacket, pump?: PacketPump) => void;
export default handleConnack;
