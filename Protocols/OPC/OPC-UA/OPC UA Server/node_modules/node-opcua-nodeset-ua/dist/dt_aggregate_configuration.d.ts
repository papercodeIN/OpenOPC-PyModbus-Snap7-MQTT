import { Byte } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |AggregateConfiguration                                      |
 * | isAbstract|false                                                       |
 */
export interface DTAggregateConfiguration extends DTStructure {
    useServerCapabilitiesDefaults: boolean;
    treatUncertainAsBad: boolean;
    percentDataBad: Byte;
    percentDataGood: Byte;
    useSlopedExtrapolation: boolean;
}
export interface UDTAggregateConfiguration extends ExtensionObject, DTAggregateConfiguration {
}
