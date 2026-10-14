/**
 * @module node-opcua-address-space.DataAccess
 */
import { UAVariable, ModellingRuleType } from "node-opcua-address-space-base";
interface add_dataItem_stuffOptions {
    definition?: string;
    valuePrecision?: number;
    modellingRule?: ModellingRuleType;
}
export declare function add_dataItem_stuff(variable: UAVariable, options: add_dataItem_stuffOptions): void;
export {};
