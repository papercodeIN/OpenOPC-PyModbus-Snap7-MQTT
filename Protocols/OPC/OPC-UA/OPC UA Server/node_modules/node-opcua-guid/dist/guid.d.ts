/**
 * checks if provided string is a valid Guid
 * a valid GUID has the form  XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXX
 * when X is a hexadecimal digit
 *
 * @param guid - the GUID to test for validaty
 * @return  - true if the string is a valid GUID.
 */
export declare function isValidGuid(guid: string): boolean;
export declare const emptyGuid = "00000000-0000-0000-0000-000000000000";
export declare function normalizeGuid(guid: Guid | null | undefined): Guid;
export type Guid = string;
