import { DataType } from "node-opcua-variant";
import { UAFolder, UAAnalogItem } from "node-opcua-nodeset-ua";
import { AddressSpace, BaseNode, InstantiateObjectOptions, Namespace, UATransitionEventType, UAObject, UAObjectType, UAReferenceType, UAVariable, UAProgramStateMachineEx } from "..";
export interface FlowToReference extends UAReferenceType {
}
export interface HotFlowToReference extends UAReferenceType {
}
export interface SignalToReference extends UAReferenceType {
}
export interface BoilerHaltedEventType extends UATransitionEventType {
}
export interface CustomControllerB {
    input1: UAVariable;
    input2: UAVariable;
    input3: UAVariable;
    controlOut: UAVariable;
}
export interface CustomControllerType extends CustomControllerB, UAObjectType {
}
export interface CustomController extends CustomControllerB, UAObject {
}
export interface GenericSensorB {
    output: UAAnalogItem<number, DataType.Double>;
}
export interface GenericSensorType extends GenericSensorB, UAObjectType {
}
export interface GenericSensor extends GenericSensorB, UAObject {
}
export interface GenericControllerB {
    controlOut: UAVariable;
    measurement: UAVariable;
    setPoint: UAVariable;
}
export interface GenericControllerType extends GenericControllerB, UAObjectType {
}
export interface GenericController extends GenericControllerB, UAObject {
}
export interface FlowControllerType extends GenericControllerType {
}
export interface FlowController extends GenericController {
}
export interface LevelControllerType extends GenericControllerType {
}
export interface LevelController extends GenericController {
}
export interface FlowTransmitterType extends GenericSensorType {
}
export interface FlowTransmitter extends GenericSensor {
}
export interface LevelIndicatorType extends GenericSensorType {
}
export interface LevelIndicator extends GenericSensor {
}
export interface GenericActuatorType extends UAObjectType {
    input: UAAnalogItem<number, DataType.Double>;
}
export interface GenericActuator extends UAObject {
    input: UAAnalogItem<number, DataType.Double>;
}
export interface ValveType extends GenericActuatorType {
}
export interface Valve extends GenericActuator {
}
export interface BoilerInputPipeType extends UAObjectType {
    flowTransmitter: FlowTransmitter;
    valve: Valve;
}
export interface BoilerInputPipe extends UAFolder {
    flowTransmitter: FlowTransmitter;
    valve: Valve;
}
export interface BoilerOutputPipeType extends UAObjectType {
    flowTransmitter: FlowTransmitter;
}
export interface BoilerOutputPipe extends UAFolder {
    flowTransmitter: FlowTransmitter;
}
export interface BoilerDrumType extends UAObjectType {
    levelIndicator: LevelIndicator;
}
export interface BoilerDrum extends UAFolder {
    levelIndicator: LevelIndicator;
}
export interface BoilerStateMachineType extends UAObjectType {
}
export interface BoilerStateMachine extends UAObject, UAProgramStateMachineEx {
}
export interface BoilerType extends UAObjectType {
    customController: CustomController;
    flowController: FlowController;
    levelController: LevelController;
    inputPipe: BoilerInputPipe;
    boilerDrum: BoilerDrum;
    outputPipe: BoilerOutputPipe;
    boilerDrum2: BoilerDrum;
    simulation: BoilerStateMachine;
    instantiate(options: InstantiateObjectOptions): Boiler;
}
export interface Boiler extends UAObject {
    customController: CustomController;
    flowController: FlowController;
    levelController: LevelController;
    inputPipe: BoilerInputPipe;
    boilerDrum: BoilerDrum;
    outputPipe: BoilerOutputPipe;
    boilerDrum2: BoilerDrum;
    simulation: BoilerStateMachine;
}
export declare function createBoilerType(namespace: Namespace): BoilerType;
export declare function makeBoiler(addressSpace: AddressSpace, options: {
    browseName: string;
    organizedBy: BaseNode;
}): Boiler;
