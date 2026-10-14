import { SimpleAttributeOperand, AttributeOperand } from "node-opcua-types";
import { Variant } from "node-opcua-variant";
import { FilterContext } from "./filter_context";
export declare function resolveOperand(context: FilterContext, operand: SimpleAttributeOperand | AttributeOperand): Variant;
