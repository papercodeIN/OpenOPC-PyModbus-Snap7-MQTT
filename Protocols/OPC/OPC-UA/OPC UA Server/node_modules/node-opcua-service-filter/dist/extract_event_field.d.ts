import { SimpleAttributeOperand } from "node-opcua-types";
import { Variant } from "node-opcua-variant";
import { FilterContext } from "./filter_context";
/**
 *
 * extract a eventField from a event node, matching the given selectClause
 */
export declare function extractEventField(context: FilterContext, operand: SimpleAttributeOperand): Variant;
export declare function extractEventFieldsBase(context: FilterContext, selectClauses: SimpleAttributeOperand[]): Variant[];
