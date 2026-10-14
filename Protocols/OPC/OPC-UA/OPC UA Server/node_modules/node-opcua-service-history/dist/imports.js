"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadEventDetails = exports.ModificationInfo = exports.HistoryUpdateType = exports.ReadAtTimeDetails = exports.ReadProcessedDetails = exports.ReadRawModifiedDetails = exports.HistoryUpdateResponse = exports.HistoryUpdateRequest = exports.HistoryReadResponse = exports.HistoryReadRequest = exports.HistoryUpdateResult = exports.HistoryReadResult = exports.HistoryReadValueId = exports.HistoryReadDetails = exports.HistoryModifiedData = exports.HistoryData = exports.AggregateConfiguration = void 0;
/**
 * @module node-opcua-service-history
 */
const node_opcua_data_value_1 = require("node-opcua-data-value");
var node_opcua_types_1 = require("node-opcua-types");
Object.defineProperty(exports, "AggregateConfiguration", { enumerable: true, get: function () { return node_opcua_types_1.AggregateConfiguration; } });
Object.defineProperty(exports, "HistoryData", { enumerable: true, get: function () { return node_opcua_types_1.HistoryData; } });
Object.defineProperty(exports, "HistoryModifiedData", { enumerable: true, get: function () { return node_opcua_types_1.HistoryModifiedData; } });
Object.defineProperty(exports, "HistoryReadDetails", { enumerable: true, get: function () { return node_opcua_types_1.HistoryReadDetails; } });
Object.defineProperty(exports, "HistoryReadValueId", { enumerable: true, get: function () { return node_opcua_types_1.HistoryReadValueId; } });
Object.defineProperty(exports, "HistoryReadResult", { enumerable: true, get: function () { return node_opcua_types_1.HistoryReadResult; } });
Object.defineProperty(exports, "HistoryUpdateResult", { enumerable: true, get: function () { return node_opcua_types_1.HistoryUpdateResult; } });
Object.defineProperty(exports, "HistoryReadRequest", { enumerable: true, get: function () { return node_opcua_types_1.HistoryReadRequest; } });
Object.defineProperty(exports, "HistoryReadResponse", { enumerable: true, get: function () { return node_opcua_types_1.HistoryReadResponse; } });
Object.defineProperty(exports, "HistoryUpdateRequest", { enumerable: true, get: function () { return node_opcua_types_1.HistoryUpdateRequest; } });
Object.defineProperty(exports, "HistoryUpdateResponse", { enumerable: true, get: function () { return node_opcua_types_1.HistoryUpdateResponse; } });
Object.defineProperty(exports, "ReadRawModifiedDetails", { enumerable: true, get: function () { return node_opcua_types_1.ReadRawModifiedDetails; } });
Object.defineProperty(exports, "ReadProcessedDetails", { enumerable: true, get: function () { return node_opcua_types_1.ReadProcessedDetails; } });
Object.defineProperty(exports, "ReadAtTimeDetails", { enumerable: true, get: function () { return node_opcua_types_1.ReadAtTimeDetails; } });
Object.defineProperty(exports, "HistoryUpdateType", { enumerable: true, get: function () { return node_opcua_types_1.HistoryUpdateType; } });
Object.defineProperty(exports, "ModificationInfo", { enumerable: true, get: function () { return node_opcua_types_1.ModificationInfo; } });
Object.defineProperty(exports, "ReadEventDetails", { enumerable: true, get: function () { return node_opcua_types_1.ReadEventDetails; } });
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_types_2 = require("node-opcua-types");
(0, node_opcua_assert_1.assert)(node_opcua_types_2.HistoryReadRequest.schema.fields[2].name === "timestampsToReturn");
node_opcua_types_2.HistoryReadRequest.schema.fields[2].defaultValue = node_opcua_data_value_1.TimestampsToReturn.Neither;
//# sourceMappingURL=imports.js.map