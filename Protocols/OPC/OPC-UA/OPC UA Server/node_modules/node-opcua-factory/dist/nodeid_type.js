"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._enumerationNodeIdType = exports.schemaNodeIdType = exports.NodeIdType = void 0;
const enumerations_1 = require("./enumerations");
var NodeIdType;
(function (NodeIdType) {
    NodeIdType[NodeIdType["ReferenceType"] = 1] = "ReferenceType";
    NodeIdType[NodeIdType["IsForward"] = 2] = "IsForward";
    NodeIdType[NodeIdType["NodeClass"] = 4] = "NodeClass";
    NodeIdType[NodeIdType["BrowseName"] = 8] = "BrowseName";
    NodeIdType[NodeIdType["DisplayName"] = 16] = "DisplayName";
    NodeIdType[NodeIdType["TypeDefinition"] = 32] = "TypeDefinition";
})(NodeIdType || (exports.NodeIdType = NodeIdType = {}));
exports.schemaNodeIdType = {
    name: "NodeIdType",
    enumValues: NodeIdType
};
exports._enumerationNodeIdType = (0, enumerations_1.registerEnumeration)(exports.schemaNodeIdType);
//# sourceMappingURL=nodeid_type.js.map