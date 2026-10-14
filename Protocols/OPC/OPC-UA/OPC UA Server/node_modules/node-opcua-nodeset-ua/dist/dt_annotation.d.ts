import { UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |Annotation                                                  |
 * | isAbstract|false                                                       |
 */
export interface DTAnnotation extends DTStructure {
    message: UAString;
    userName: UAString;
    annotationTime: Date;
}
export interface UDTAnnotation extends ExtensionObject, DTAnnotation {
}
