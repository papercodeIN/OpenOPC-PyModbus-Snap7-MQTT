"use strict";
/**
 * @module node-opcua
 */
// tslint:disable:max-line-length
// tslint:disable:no-var-requires
// tslint:disable:no-console
// tslint:disable:variable-name
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDebugLogger = exports.setLogLevel = exports.hexDump = exports.LogLevel = exports.utils = exports.get_mini_nodeset_filename = exports.get_empty_nodeset_filename = exports.nodesets = exports.Range = exports.makeEUInformation = exports.standardUnits = exports.DiagnosticInfo = exports.BrowseDirection = exports.AttributeIds = exports.NodeClassMask = exports.NodeClass = exports.coerceQualifiedName = exports.QualifiedName = exports.coerceLocalizedText = exports.LocalizedText = exports.makeAccessLevelFlag = exports.AccessLevelFlag = exports.NumericRange = exports.sameDataValue = exports.DataValue = exports.buildVariantArray = exports.VariantArrayType = exports.Variant = exports.DataType = exports.AggregateFunction = exports.DataTypeIds = exports.ReferenceTypeIds = exports.ObjectTypeIds = exports.ObjectIds = exports.MethodIds = exports.VariableIds = exports.VariableTypeIds = exports.StatusCodes = exports.StatusCode = exports.coerceExpandedNodeId = exports.makeExpandedNodeId = exports.ExpandedNodeId = exports.NodeIdType = exports.sameNodeId = exports.coerceNodeId = exports.makeNodeId = exports.resolveNodeId = exports.NodeId = exports.BinaryStream = exports.assert = void 0;
exports.is_valid_endpointUrl = exports.parseEndpointUrl = exports.setErrorLogger = exports.setWarningLogger = void 0;
const chalk_1 = __importDefault(require("chalk"));
const semver = require("semver");
const minimumNodeJsVersionRequired = ">=16.7.0"; // minimum
// istanbul ignore next
if (typeof process === "object" && !semver.satisfies(process.version, minimumNodeJsVersionRequired)) {
    console.log(chalk_1.default.cyan(`warning node-opcua: Required nodejs version ${minimumNodeJsVersionRequired} not satisfied with current nodejs version ${process.version}.`));
}
__exportStar(require("node-opcua-common"), exports);
var node_opcua_assert_1 = require("node-opcua-assert");
Object.defineProperty(exports, "assert", { enumerable: true, get: function () { return node_opcua_assert_1.assert; } });
var node_opcua_binary_stream_1 = require("node-opcua-binary-stream");
Object.defineProperty(exports, "BinaryStream", { enumerable: true, get: function () { return node_opcua_binary_stream_1.BinaryStream; } });
__exportStar(require("node-opcua-utils"), exports);
var node_opcua_nodeid_1 = require("node-opcua-nodeid");
Object.defineProperty(exports, "NodeId", { enumerable: true, get: function () { return node_opcua_nodeid_1.NodeId; } });
Object.defineProperty(exports, "resolveNodeId", { enumerable: true, get: function () { return node_opcua_nodeid_1.resolveNodeId; } });
Object.defineProperty(exports, "makeNodeId", { enumerable: true, get: function () { return node_opcua_nodeid_1.makeNodeId; } });
Object.defineProperty(exports, "coerceNodeId", { enumerable: true, get: function () { return node_opcua_nodeid_1.coerceNodeId; } });
Object.defineProperty(exports, "sameNodeId", { enumerable: true, get: function () { return node_opcua_nodeid_1.sameNodeId; } });
Object.defineProperty(exports, "NodeIdType", { enumerable: true, get: function () { return node_opcua_nodeid_1.NodeIdType; } });
Object.defineProperty(exports, "ExpandedNodeId", { enumerable: true, get: function () { return node_opcua_nodeid_1.ExpandedNodeId; } });
Object.defineProperty(exports, "makeExpandedNodeId", { enumerable: true, get: function () { return node_opcua_nodeid_1.makeExpandedNodeId; } });
Object.defineProperty(exports, "coerceExpandedNodeId", { enumerable: true, get: function () { return node_opcua_nodeid_1.coerceExpandedNodeId; } });
var node_opcua_status_code_1 = require("node-opcua-status-code");
Object.defineProperty(exports, "StatusCode", { enumerable: true, get: function () { return node_opcua_status_code_1.StatusCode; } });
Object.defineProperty(exports, "StatusCodes", { enumerable: true, get: function () { return node_opcua_status_code_1.StatusCodes; } });
var node_opcua_constants_1 = require("node-opcua-constants");
Object.defineProperty(exports, "VariableTypeIds", { enumerable: true, get: function () { return node_opcua_constants_1.VariableTypeIds; } });
Object.defineProperty(exports, "VariableIds", { enumerable: true, get: function () { return node_opcua_constants_1.VariableIds; } });
Object.defineProperty(exports, "MethodIds", { enumerable: true, get: function () { return node_opcua_constants_1.MethodIds; } });
Object.defineProperty(exports, "ObjectIds", { enumerable: true, get: function () { return node_opcua_constants_1.ObjectIds; } });
Object.defineProperty(exports, "ObjectTypeIds", { enumerable: true, get: function () { return node_opcua_constants_1.ObjectTypeIds; } });
Object.defineProperty(exports, "ReferenceTypeIds", { enumerable: true, get: function () { return node_opcua_constants_1.ReferenceTypeIds; } });
Object.defineProperty(exports, "DataTypeIds", { enumerable: true, get: function () { return node_opcua_constants_1.DataTypeIds; } });
Object.defineProperty(exports, "AggregateFunction", { enumerable: true, get: function () { return node_opcua_constants_1.AggregateFunction; } });
var node_opcua_variant_1 = require("node-opcua-variant");
Object.defineProperty(exports, "DataType", { enumerable: true, get: function () { return node_opcua_variant_1.DataType; } });
Object.defineProperty(exports, "Variant", { enumerable: true, get: function () { return node_opcua_variant_1.Variant; } });
Object.defineProperty(exports, "VariantArrayType", { enumerable: true, get: function () { return node_opcua_variant_1.VariantArrayType; } });
Object.defineProperty(exports, "buildVariantArray", { enumerable: true, get: function () { return node_opcua_variant_1.buildVariantArray; } });
var node_opcua_data_value_1 = require("node-opcua-data-value");
Object.defineProperty(exports, "DataValue", { enumerable: true, get: function () { return node_opcua_data_value_1.DataValue; } });
Object.defineProperty(exports, "sameDataValue", { enumerable: true, get: function () { return node_opcua_data_value_1.sameDataValue; } });
var node_opcua_numeric_range_1 = require("node-opcua-numeric-range");
Object.defineProperty(exports, "NumericRange", { enumerable: true, get: function () { return node_opcua_numeric_range_1.NumericRange; } });
var node_opcua_data_model_1 = require("node-opcua-data-model");
Object.defineProperty(exports, "AccessLevelFlag", { enumerable: true, get: function () { return node_opcua_data_model_1.AccessLevelFlag; } });
Object.defineProperty(exports, "makeAccessLevelFlag", { enumerable: true, get: function () { return node_opcua_data_model_1.makeAccessLevelFlag; } });
Object.defineProperty(exports, "LocalizedText", { enumerable: true, get: function () { return node_opcua_data_model_1.LocalizedText; } });
Object.defineProperty(exports, "coerceLocalizedText", { enumerable: true, get: function () { return node_opcua_data_model_1.coerceLocalizedText; } });
Object.defineProperty(exports, "QualifiedName", { enumerable: true, get: function () { return node_opcua_data_model_1.QualifiedName; } });
Object.defineProperty(exports, "coerceQualifiedName", { enumerable: true, get: function () { return node_opcua_data_model_1.coerceQualifiedName; } });
Object.defineProperty(exports, "NodeClass", { enumerable: true, get: function () { return node_opcua_data_model_1.NodeClass; } });
Object.defineProperty(exports, "NodeClassMask", { enumerable: true, get: function () { return node_opcua_data_model_1.NodeClassMask; } });
Object.defineProperty(exports, "AttributeIds", { enumerable: true, get: function () { return node_opcua_data_model_1.AttributeIds; } });
Object.defineProperty(exports, "BrowseDirection", { enumerable: true, get: function () { return node_opcua_data_model_1.BrowseDirection; } });
Object.defineProperty(exports, "DiagnosticInfo", { enumerable: true, get: function () { return node_opcua_data_model_1.DiagnosticInfo; } });
// basic_types
__exportStar(require("node-opcua-basic-types"), exports);
// DA
var node_opcua_data_access_1 = require("node-opcua-data-access");
Object.defineProperty(exports, "standardUnits", { enumerable: true, get: function () { return node_opcua_data_access_1.standardUnits; } });
Object.defineProperty(exports, "makeEUInformation", { enumerable: true, get: function () { return node_opcua_data_access_1.makeEUInformation; } });
Object.defineProperty(exports, "Range", { enumerable: true, get: function () { return node_opcua_data_access_1.Range; } });
__exportStar(require("node-opcua-hostname"), exports);
// services
__exportStar(require("node-opcua-service-browse"), exports);
__exportStar(require("node-opcua-service-read"), exports);
__exportStar(require("node-opcua-service-write"), exports);
__exportStar(require("node-opcua-service-call"), exports);
__exportStar(require("node-opcua-service-session"), exports);
__exportStar(require("node-opcua-service-register-node"), exports);
__exportStar(require("node-opcua-service-endpoints"), exports);
__exportStar(require("node-opcua-service-subscription"), exports);
// export * from "node-opcua-service-history";
__exportStar(require("node-opcua-service-discovery"), exports);
__exportStar(require("node-opcua-service-secure-channel"), exports);
__exportStar(require("node-opcua-service-translate-browse-path"), exports);
__exportStar(require("node-opcua-service-query"), exports);
__exportStar(require("node-opcua-service-node-management"), exports);
// -----------------------------------------------------------------------------
// Nodeset stuff
// -----------------------------------------------------------------------------
var node_opcua_nodesets_1 = require("node-opcua-nodesets");
Object.defineProperty(exports, "nodesets", { enumerable: true, get: function () { return node_opcua_nodesets_1.nodesets; } });
// an incomplete but sufficient nodeset file used during testing
var testHelpers_1 = require("node-opcua-address-space/testHelpers");
Object.defineProperty(exports, "get_empty_nodeset_filename", { enumerable: true, get: function () { return testHelpers_1.get_empty_nodeset_filename; } });
Object.defineProperty(exports, "get_mini_nodeset_filename", { enumerable: true, get: function () { return testHelpers_1.get_mini_nodeset_filename; } });
__exportStar(require("node-opcua-address-space/nodeJS"), exports);
exports.utils = require("node-opcua-utils");
var node_opcua_debug_1 = require("node-opcua-debug");
Object.defineProperty(exports, "LogLevel", { enumerable: true, get: function () { return node_opcua_debug_1.LogLevel; } });
Object.defineProperty(exports, "hexDump", { enumerable: true, get: function () { return node_opcua_debug_1.hexDump; } });
Object.defineProperty(exports, "setLogLevel", { enumerable: true, get: function () { return node_opcua_debug_1.setLogLevel; } });
Object.defineProperty(exports, "setDebugLogger", { enumerable: true, get: function () { return node_opcua_debug_1.setDebugLogger; } });
Object.defineProperty(exports, "setWarningLogger", { enumerable: true, get: function () { return node_opcua_debug_1.setWarningLogger; } });
Object.defineProperty(exports, "setErrorLogger", { enumerable: true, get: function () { return node_opcua_debug_1.setErrorLogger; } });
// ----------------------------------------------------------------------------------------------------------
// client services
// ----------------------------------------------------------------------------------------------------------
__exportStar(require("node-opcua-client"), exports);
var node_opcua_transport_1 = require("node-opcua-transport");
Object.defineProperty(exports, "parseEndpointUrl", { enumerable: true, get: function () { return node_opcua_transport_1.parseEndpointUrl; } });
Object.defineProperty(exports, "is_valid_endpointUrl", { enumerable: true, get: function () { return node_opcua_transport_1.is_valid_endpointUrl; } });
// ----------------------------------------------------------------------------------------------------------
// server management
// ----------------------------------------------------------------------------------------------------------
__exportStar(require("./server-stuff"), exports);
// filtering tools
__exportStar(require("node-opcua-service-filter"), exports);
// filtering tools
__exportStar(require("node-opcua-transport"), exports);
__exportStar(require("node-opcua-aggregates"), exports);
//# sourceMappingURL=index.js.map