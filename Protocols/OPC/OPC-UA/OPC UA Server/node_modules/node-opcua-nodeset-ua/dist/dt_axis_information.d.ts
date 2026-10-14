import { LocalizedText } from "node-opcua-data-model";
import { EUInformation } from "node-opcua-data-access";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { DTRange } from "./dt_range";
import { EnumAxisScale } from "./enum_axis_scale";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |AxisInformation                                             |
 * | isAbstract|false                                                       |
 */
export interface DTAxisInformation extends DTStructure {
    engineeringUnits: EUInformation;
    euRange: DTRange;
    title: LocalizedText;
    axisScaleType: EnumAxisScale;
    axisSteps: number[];
}
export interface UDTAxisInformation extends ExtensionObject, DTAxisInformation {
}
