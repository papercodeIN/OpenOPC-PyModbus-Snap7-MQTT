import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { DTContentFilterElement } from "./dt_content_filter_element";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |ContentFilter                                               |
 * | isAbstract|false                                                       |
 */
export interface DTContentFilter extends DTStructure {
    elements: DTContentFilterElement[];
}
export interface UDTContentFilter extends ExtensionObject, DTContentFilter {
}
