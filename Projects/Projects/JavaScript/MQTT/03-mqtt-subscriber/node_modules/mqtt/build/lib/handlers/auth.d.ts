import { type IAuthPacket } from 'mqtt-packet';
import { type PacketPump } from '../shared';
import type MqttClient from '../client';
declare const handleAuth: (client: MqttClient, packet: IAuthPacket & {
    returnCode?: number;
}, pump?: PacketPump) => void;
export default handleAuth;
