export declare enum NodeIdType {
    ReferenceType = 1,
    IsForward = 2,
    NodeClass = 4,
    BrowseName = 8,
    DisplayName = 16,
    TypeDefinition = 32
}
export declare const schemaNodeIdType: {
    name: string;
    enumValues: typeof NodeIdType;
};
export declare const _enumerationNodeIdType: import("node-opcua-enum").Enum;
