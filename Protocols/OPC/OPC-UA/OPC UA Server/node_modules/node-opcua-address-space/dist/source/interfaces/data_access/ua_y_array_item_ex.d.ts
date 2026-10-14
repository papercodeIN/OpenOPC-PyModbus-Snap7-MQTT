/**
 * @module node-opcua-address-space
 */
import { UAVariableT } from "node-opcua-address-space-base";
import { DataType } from "node-opcua-variant";
import { UAYArrayItem_Base } from "node-opcua-nodeset-ua";
export interface UAYArrayItemEx<DT extends DataType.Double | DataType.Float> extends UAVariableT<number[], DT>, UAYArrayItem_Base<number[], DT> {
}
