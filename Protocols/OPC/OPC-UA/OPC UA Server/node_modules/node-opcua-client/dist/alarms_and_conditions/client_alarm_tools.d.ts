import { ClientAlarmList } from "node-opcua-alarm-condition";
import { ClientSession } from "../client_session";
export declare function uninstallAlarmMonitoring(session: ClientSession): Promise<void>;
export declare function installAlarmMonitoring(session: ClientSession): Promise<ClientAlarmList>;
