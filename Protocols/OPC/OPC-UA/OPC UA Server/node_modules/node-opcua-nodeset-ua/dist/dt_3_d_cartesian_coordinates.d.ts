import { ExtensionObject } from "node-opcua-extension-object";
import { DTCartesianCoordinates } from "./dt_cartesian_coordinates";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |3DCartesianCoordinates                                      |
 * | isAbstract|false                                                       |
 */
export interface DT3DCartesianCoordinates extends DTCartesianCoordinates {
    x: number;
    y: number;
    z: number;
}
export interface UDT3DCartesianCoordinates extends ExtensionObject, DT3DCartesianCoordinates {
}
