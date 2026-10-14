/**
 * @module node-opcua-service-filter
 */
import { DataType } from "node-opcua-basic-types";
import { AttributeIds } from "node-opcua-data-model";
import { NodeIdLike } from "node-opcua-nodeid";
import { AttributeOperand, ContentFilter, ContentFilterElement, ContentFilterElementOptions, LiteralOperand, SimpleAttributeOperand } from "./imports";
export declare function ofType(nodeId: NodeIdLike): ContentFilterElement;
export declare function l(dataType: DataType, value: any): LiteralOperand;
export declare function n(n: NodeIdLike): LiteralOperand;
export declare function s(attributeId: AttributeIds, path: string): SimpleAttributeOperand;
type A = LiteralOperand | SimpleAttributeOperand | AttributeOperand | ContentFilterElement;
export declare function or(a: A, b: A): ContentFilterElement;
export declare function and(a: A, b: A): ContentFilterElement;
export declare function lessThan(a: A, b: A): ContentFilterElement;
export declare function LessThanOrEqual(a: A, b: A): ContentFilterElement;
export declare function greaterThanOrEqual(a: A, b: A): ContentFilterElement;
export declare function greaterThan(a: A, b: A): ContentFilterElement;
export declare function inList(a: A, l: A[]): ContentFilterElement;
export declare function makeContentFilterElements(o: ContentFilterElement): ContentFilterElement[];
export declare function makeContentFilter(o: ContentFilterElementOptions): ContentFilter;
export {};
