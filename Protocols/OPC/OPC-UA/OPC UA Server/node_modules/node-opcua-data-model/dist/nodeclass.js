"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaEnumNodeClass = exports.NodeClass = void 0;
/**
 * @module node-opcua-data-model
 */
const node_opcua_factory_1 = require("node-opcua-factory");
var NodeClass;
(function (NodeClass) {
    NodeClass[NodeClass["Unspecified"] = 0] = "Unspecified";
    NodeClass[NodeClass["Object"] = 1] = "Object";
    NodeClass[NodeClass["Variable"] = 2] = "Variable";
    NodeClass[NodeClass["Method"] = 4] = "Method";
    NodeClass[NodeClass["ObjectType"] = 8] = "ObjectType";
    NodeClass[NodeClass["VariableType"] = 16] = "VariableType";
    NodeClass[NodeClass["ReferenceType"] = 32] = "ReferenceType";
    NodeClass[NodeClass["DataType"] = 64] = "DataType";
    NodeClass[NodeClass["View"] = 128] = "View"; // The node is a view.
})(NodeClass || (exports.NodeClass = NodeClass = {}));
exports.schemaEnumNodeClass = {
    name: "NodeClass",
    documentation: "A mask specifying the class of the node.",
    enumValues: NodeClass
};
(0, node_opcua_factory_1.registerEnumeration)(exports.schemaEnumNodeClass);
//# sourceMappingURL=nodeclass.js.map