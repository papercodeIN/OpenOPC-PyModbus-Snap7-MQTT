"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._enumerationResultMask = exports.schemaResultMask = exports.ResultMask = void 0;
exports.makeResultMask = makeResultMask;
const node_opcua_factory_1 = require("node-opcua-factory");
var ResultMask;
(function (ResultMask) {
    ResultMask[ResultMask["ReferenceType"] = 1] = "ReferenceType";
    ResultMask[ResultMask["IsForward"] = 2] = "IsForward";
    ResultMask[ResultMask["NodeClass"] = 4] = "NodeClass";
    ResultMask[ResultMask["BrowseName"] = 8] = "BrowseName";
    ResultMask[ResultMask["DisplayName"] = 16] = "DisplayName";
    ResultMask[ResultMask["TypeDefinition"] = 32] = "TypeDefinition";
})(ResultMask || (exports.ResultMask = ResultMask = {}));
exports.schemaResultMask = {
    name: "ResultMask",
    enumValues: ResultMask
};
exports._enumerationResultMask = (0, node_opcua_factory_1.registerEnumeration)(exports.schemaResultMask);
// The ReferenceDescription type is defined in 7.24.
// @example
//      makeNodeClassMask("Method | Object").should.eql(5);
function makeResultMask(str) {
    const flags = str.split(" | ");
    let r = 0;
    for (const flag of flags) {
        r |= ResultMask[flag];
    }
    return r;
}
//# sourceMappingURL=result_mask.js.map