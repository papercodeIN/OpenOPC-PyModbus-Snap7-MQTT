import { ExtensionObject } from "node-opcua-extension-object";
import { DTFrame } from "./dt_frame";
import { DT3DCartesianCoordinates } from "./dt_3_d_cartesian_coordinates";
import { DT3DOrientation } from "./dt_3_d_orientation";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |3DFrame                                                     |
 * | isAbstract|false                                                       |
 */
export interface DT3DFrame extends DTFrame {
    cartesianCoordinates: DT3DCartesianCoordinates;
    orientation: DT3DOrientation;
}
export interface UDT3DFrame extends ExtensionObject, DT3DFrame {
}
