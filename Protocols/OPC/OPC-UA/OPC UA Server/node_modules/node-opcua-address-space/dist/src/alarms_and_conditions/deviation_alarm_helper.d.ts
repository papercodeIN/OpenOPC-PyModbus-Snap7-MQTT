import { DataValue } from "node-opcua-data-value";
import { DataType } from "node-opcua-variant";
import { UAVariableT } from "node-opcua-address-space-base";
import { DeviationStuff } from "../../source/interfaces/alarms_and_conditions/deviation_stuff";
import { InstallSetPointOptions } from "../../source/interfaces/alarms_and_conditions/install_setpoint_options";
export declare function DeviationAlarmHelper_getSetpointNodeNode(this: DeviationStuff): UAVariableT<number, DataType.Double> | UAVariableT<number, DataType.Float> | undefined;
export declare function DeviationAlarmHelper_getSetpointValue(this: DeviationStuff): number | null;
export declare function DeviationAlarmHelper_onSetpointDataValueChange(this: DeviationStuff, dataValue: DataValue): void;
export declare function DeviationAlarmHelper_install_setpoint(this: DeviationStuff, options: InstallSetPointOptions): void;
