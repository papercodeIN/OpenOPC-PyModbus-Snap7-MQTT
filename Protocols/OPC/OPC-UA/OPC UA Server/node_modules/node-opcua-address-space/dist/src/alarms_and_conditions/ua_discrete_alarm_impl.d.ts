import { NodeId } from "node-opcua-nodeid";
import { VariantOptions } from "node-opcua-variant";
import { INamespace, UAEventType } from "node-opcua-address-space-base";
import { UADiscreteAlarmEx } from "../../source/interfaces/alarms_and_conditions/ua_discrete_alarm_ex";
import { InstantiateAlarmConditionOptions } from "../../source/interfaces/alarms_and_conditions/instantiate_alarm_condition_options";
import { UAAlarmConditionImpl } from "./ua_alarm_condition_impl";
/**
 * The DiscreteAlarmType is used to classify Types into Alarm Conditions where the input for the
 * Alarm may take on only a certain number of possible values (e.g. true/false,
 * running/stopped/terminating).
 */
export declare class UADiscreteAlarmImpl extends UAAlarmConditionImpl implements UADiscreteAlarmEx {
    static instantiate(namespace: INamespace, discreteAlarmTypeId: UAEventType | NodeId | string, options: InstantiateAlarmConditionOptions, data?: Record<string, VariantOptions>): UADiscreteAlarmImpl;
}
