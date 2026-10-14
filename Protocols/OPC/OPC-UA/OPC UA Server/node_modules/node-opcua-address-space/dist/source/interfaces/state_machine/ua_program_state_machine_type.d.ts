/**
 * @module node-opcua-address-space
 */
import { InstantiateObjectOptions, UAObjectType } from "node-opcua-address-space-base";
import { UAProgramStateMachine_Base } from "node-opcua-nodeset-ua";
import { UAStateMachineEx } from "./ua_state_machine_type";
export interface UAProgramStateMachineEx extends UAStateMachineEx {
}
export interface UAProgramStateMachineType extends UAProgramStateMachine_Base, UAObjectType {
    instantiate(options: InstantiateObjectOptions): UAProgramStateMachineEx;
}
