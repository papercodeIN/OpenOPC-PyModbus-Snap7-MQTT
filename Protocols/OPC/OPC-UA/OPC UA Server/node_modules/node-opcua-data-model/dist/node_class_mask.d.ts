/**
 * @module node-opcua-data-model
 */
export declare enum NodeClassMask {
    Object = 1,
    Variable = 2,
    Method = 4,
    ObjectType = 8,
    VariableType = 16,
    ReferenceType = 32,
    DataType = 64,
    View = 128
}
export declare function makeNodeClassMask(str: string): NodeClassMask;
