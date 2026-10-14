/**
 * @module node-opcua-data-model
 */
import { QualifiedNameLike } from "./qualified_name";
export declare function isDataEncoding(dataEncoding: unknown): boolean;
export declare function isValidDataEncoding(dataEncoding?: string | null | QualifiedNameLike): boolean;
