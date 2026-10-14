import { NodeId } from "node-opcua-nodeid";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTPublishedDataSetSource } from "./dt_published_data_set_source";
import { DTSimpleAttributeOperand } from "./dt_simple_attribute_operand";
import { DTContentFilter } from "./dt_content_filter";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |PublishedEventsDataType                                     |
 * | isAbstract|false                                                       |
 */
export interface DTPublishedEvents extends DTPublishedDataSetSource {
    eventNotifier: NodeId;
    selectedFields: DTSimpleAttributeOperand[];
    filter: DTContentFilter;
}
export interface UDTPublishedEvents extends ExtensionObject, DTPublishedEvents {
}
