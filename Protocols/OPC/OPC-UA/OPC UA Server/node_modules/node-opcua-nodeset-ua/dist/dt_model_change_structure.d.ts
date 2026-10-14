import { NodeId } from "node-opcua-nodeid";
import { Byte } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |ModelChangeStructureDataType                                |
 * | isAbstract|false                                                       |
 */
export interface DTModelChangeStructure extends DTStructure {
    affected: NodeId;
    affectedType: NodeId;
    verb: Byte;
}
export interface UDTModelChangeStructure extends ExtensionObject, DTModelChangeStructure {
}
