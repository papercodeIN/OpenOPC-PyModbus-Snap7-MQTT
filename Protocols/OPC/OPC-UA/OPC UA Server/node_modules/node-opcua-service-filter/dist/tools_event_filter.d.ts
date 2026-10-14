import { QualifiedName, QualifiedNameOptions } from "node-opcua-data-model";
import { ContentFilterElement, ContentFilterOptions, EventFilter, SimpleAttributeOperand } from "./imports";
export declare function constructSimpleBrowsePath(a: string | string[] | (QualifiedNameOptions | string)[]): QualifiedName[];
export declare function constructSelectClause(arrayOfNames: string | string[] | (QualifiedNameOptions | string)[][]): SimpleAttributeOperand[];
/**
 * helper to construct event filters:
 * construct a simple event filter
 *
 *  "ConditionId" in the arrayOfNames has a special meaning
 *
 * @example
 *
 *     constructEventFilter(["SourceName","Message","ReceiveTime"]);
 *     constructEventFilter(["SourceName","2:MyData" ]);
 *     constructEventFilter(["SourceName" ,["EnabledState","EffectiveDisplayName"] ]);
 *     constructEventFilter(["SourceName" ,"EnabledState.EffectiveDisplayName" ]);
 *     constructEventFilter([ ["SourceName",{namespaceIndex:2 , "MyData"} ]]);
 *
 */
export declare function constructEventFilter(arrayOfNames: (QualifiedNameOptions | string)[][] | string[] | string, whereClause?: ContentFilterOptions | ContentFilterElement): EventFilter;
