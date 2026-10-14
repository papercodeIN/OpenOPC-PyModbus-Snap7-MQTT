import { QualifiedName } from "node-opcua-data-model";
import { NodeId } from "node-opcua-nodeid";
import { Byte } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTDataTypeDescription } from "./dt_data_type_description";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |SimpleTypeDescription                                       |
 * | isAbstract|false                                                       |
 */
export interface DTSimpleTypeDescription extends DTDataTypeDescription {
    dataTypeId: NodeId;
    name: QualifiedName;
    baseDataType: NodeId;
    builtInType: Byte;
}
export interface UDTSimpleTypeDescription extends ExtensionObject, DTSimpleTypeDescription {
}
