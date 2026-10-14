"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallResponse = exports.CallMethodResult = exports.CallRequest = exports.CallMethodRequest = exports.Argument = void 0;
/**
 * @module node-opcua-service-browse
 */
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
const node_opcua_types_1 = require("node-opcua-types");
const node_opcua_variant_1 = require("node-opcua-variant");
var node_opcua_types_2 = require("node-opcua-types");
Object.defineProperty(exports, "Argument", { enumerable: true, get: function () { return node_opcua_types_2.Argument; } });
Object.defineProperty(exports, "CallMethodRequest", { enumerable: true, get: function () { return node_opcua_types_2.CallMethodRequest; } });
Object.defineProperty(exports, "CallRequest", { enumerable: true, get: function () { return node_opcua_types_2.CallRequest; } });
Object.defineProperty(exports, "CallMethodResult", { enumerable: true, get: function () { return node_opcua_types_2.CallMethodResult; } });
Object.defineProperty(exports, "CallResponse", { enumerable: true, get: function () { return node_opcua_types_2.CallResponse; } });
function _coerceToNodeId(n) {
    const dataType = n;
    if (!dataType) {
        return new node_opcua_nodeid_1.NodeId();
    }
    if (typeof dataType === "string") {
        return (0, node_opcua_nodeid_1.resolveNodeId)(dataType);
    }
    if (dataType instanceof node_opcua_nodeid_1.NodeId) {
        return dataType;
    }
    if (Object.prototype.hasOwnProperty.call(dataType, "value")) {
        const a = dataType;
        return (0, node_opcua_nodeid_1.coerceNodeId)(a.value, a.namespace);
    }
    (0, node_opcua_assert_1.assert)(typeof dataType === "number");
    return (0, node_opcua_nodeid_1.coerceNodeId)(dataType);
}
function constructHookArgument(_options) {
    const options = _options || { valueRank: -1, dataType: node_opcua_variant_1.DataType.Null };
    const dataType = _coerceToNodeId(options.dataType || node_opcua_variant_1.DataType.Null);
    (0, node_opcua_variant_1.verifyRankAndDimensions)(options);
    return { ...options, dataType };
}
node_opcua_types_1.Argument.schema.constructHook = constructHookArgument;
//# sourceMappingURL=imports.js.map