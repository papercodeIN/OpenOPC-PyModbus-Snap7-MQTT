"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._enumerationDataType = exports.DataType = void 0;
const node_opcua_factory_1 = require("node-opcua-factory");
const node_opcua_basic_types_1 = require("node-opcua-basic-types");
var node_opcua_basic_types_2 = require("node-opcua-basic-types");
Object.defineProperty(exports, "DataType", { enumerable: true, get: function () { return node_opcua_basic_types_2.DataType; } });
const schemaDataType = {
    name: "DataType",
    enumValues: node_opcua_basic_types_1.DataType
};
exports._enumerationDataType = (0, node_opcua_factory_1.registerEnumeration)(schemaDataType);
//# sourceMappingURL=DataType_enum.js.map