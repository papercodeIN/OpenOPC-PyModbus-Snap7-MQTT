"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimestampsToReturn = exports.AttributeIds = exports.attributeNameById = exports.ReadResponse = exports.ReadRequest = exports.ReadValueId = exports.ResponseHeader = exports.RequestHeader = void 0;
/**
 * @module node-opcua-service-read
 */
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_types_1 = require("node-opcua-types");
const node_opcua_data_model_1 = require("node-opcua-data-model");
const node_opcua_data_value_1 = require("node-opcua-data-value");
(0, node_opcua_assert_1.assert)(node_opcua_types_1.ReadRequest.schema.fields[2].name === "timestampsToReturn");
node_opcua_types_1.ReadRequest.schema.fields[2].defaultValue = () => node_opcua_data_value_1.TimestampsToReturn.Both;
(0, node_opcua_assert_1.assert)(node_opcua_types_1.ReadValueId.schema.fields[1].name === "attributeId");
node_opcua_types_1.ReadValueId.schema.fields[1].defaultValue = () => node_opcua_data_model_1.AttributeIds.Value;
node_opcua_types_1.ReadValueId.schema.fields[1].validate = (value) => {
    return (0, node_opcua_data_model_1.isValidAttributeId)(value) || value === node_opcua_data_model_1.AttributeIds.INVALID;
};
var node_opcua_service_secure_channel_1 = require("node-opcua-service-secure-channel");
Object.defineProperty(exports, "RequestHeader", { enumerable: true, get: function () { return node_opcua_service_secure_channel_1.RequestHeader; } });
Object.defineProperty(exports, "ResponseHeader", { enumerable: true, get: function () { return node_opcua_service_secure_channel_1.ResponseHeader; } });
// --------------------------------------------------------------------------------
// OPCUA Part 4 $5.10 : Attribute Service Set
// This Service Set provides Service sto access Attributes that are part of Nodes.
//  --------------------------------------------------------------------------------
var node_opcua_types_2 = require("node-opcua-types");
Object.defineProperty(exports, "ReadValueId", { enumerable: true, get: function () { return node_opcua_types_2.ReadValueId; } });
Object.defineProperty(exports, "ReadRequest", { enumerable: true, get: function () { return node_opcua_types_2.ReadRequest; } });
Object.defineProperty(exports, "ReadResponse", { enumerable: true, get: function () { return node_opcua_types_2.ReadResponse; } });
var node_opcua_data_model_2 = require("node-opcua-data-model");
Object.defineProperty(exports, "attributeNameById", { enumerable: true, get: function () { return node_opcua_data_model_2.attributeNameById; } });
Object.defineProperty(exports, "AttributeIds", { enumerable: true, get: function () { return node_opcua_data_model_2.AttributeIds; } });
var node_opcua_data_value_2 = require("node-opcua-data-value");
Object.defineProperty(exports, "TimestampsToReturn", { enumerable: true, get: function () { return node_opcua_data_value_2.TimestampsToReturn; } });
//# sourceMappingURL=index.js.map