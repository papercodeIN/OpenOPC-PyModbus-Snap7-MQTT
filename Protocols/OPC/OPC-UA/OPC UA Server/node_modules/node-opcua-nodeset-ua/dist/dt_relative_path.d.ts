import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { DTRelativePathElement } from "./dt_relative_path_element";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |RelativePath                                                |
 * | isAbstract|false                                                       |
 */
export interface DTRelativePath extends DTStructure {
    elements: DTRelativePathElement[];
}
export interface UDTRelativePath extends ExtensionObject, DTRelativePath {
}
