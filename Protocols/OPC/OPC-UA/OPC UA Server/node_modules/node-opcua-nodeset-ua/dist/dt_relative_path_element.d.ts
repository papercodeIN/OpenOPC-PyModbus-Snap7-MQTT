import { QualifiedName } from "node-opcua-data-model";
import { NodeId } from "node-opcua-nodeid";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |RelativePathElement                                         |
 * | isAbstract|false                                                       |
 */
export interface DTRelativePathElement extends DTStructure {
    referenceTypeId: NodeId;
    isInverse: boolean;
    includeSubtypes: boolean;
    targetName: QualifiedName;
}
export interface UDTRelativePathElement extends ExtensionObject, DTRelativePathElement {
}
