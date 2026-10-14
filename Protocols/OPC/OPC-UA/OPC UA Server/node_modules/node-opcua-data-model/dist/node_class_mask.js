"use strict";
/**
 * @module node-opcua-data-model
 */
// tslint:disable:no-bitwise
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeClassMask = void 0;
exports.makeNodeClassMask = makeNodeClassMask;
// Specifies the NodeClasses of the TargetNodes. Only TargetNodes with the
// selected NodeClasses are returned. The NodeClasses are assigned the
// following bits:
// If set to zero, then all NodeClasses are returned.
// @example
//    var mask = NodeClassMask.get("Object |  ObjectType");
//    mask.value.should.eql(1 + (1<<3));
var NodeClassMask;
(function (NodeClassMask) {
    NodeClassMask[NodeClassMask["Object"] = 1] = "Object";
    NodeClassMask[NodeClassMask["Variable"] = 2] = "Variable";
    NodeClassMask[NodeClassMask["Method"] = 4] = "Method";
    NodeClassMask[NodeClassMask["ObjectType"] = 8] = "ObjectType";
    NodeClassMask[NodeClassMask["VariableType"] = 16] = "VariableType";
    NodeClassMask[NodeClassMask["ReferenceType"] = 32] = "ReferenceType";
    NodeClassMask[NodeClassMask["DataType"] = 64] = "DataType";
    NodeClassMask[NodeClassMask["View"] = 128] = "View";
})(NodeClassMask || (exports.NodeClassMask = NodeClassMask = {}));
function makeFlagFromString(type, str) {
    const flags = str.split(" | ");
    let result = 0;
    for (const flag of flags) {
        result |= type[flag];
    }
    return result;
}
// @example
//      makeNodeClassMask("Method | Object").should.eql(5);
function makeNodeClassMask(str) {
    const classMask = makeFlagFromString(NodeClassMask, str);
    /* istanbul ignore next */
    if (!classMask) {
        throw new Error(" cannot find class mask for " + str);
    }
    return classMask;
}
//# sourceMappingURL=node_class_mask.js.map