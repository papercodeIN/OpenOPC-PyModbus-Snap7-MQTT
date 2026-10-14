/**
 * @module node-opcua-data-model
 */
import { Enum } from "node-opcua-enum";
export declare enum ResultMask {
    ReferenceType = 1,
    IsForward = 2,
    NodeClass = 4,
    BrowseName = 8,
    DisplayName = 16,
    TypeDefinition = 32
}
export declare const schemaResultMask: {
    name: string;
    enumValues: typeof ResultMask;
};
export declare const _enumerationResultMask: Enum;
export declare function makeResultMask(str: string): ResultMask;
