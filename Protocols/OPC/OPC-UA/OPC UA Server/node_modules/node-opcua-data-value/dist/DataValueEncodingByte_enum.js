"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._enumerationDataValueEncodingByte = exports.schemaDataValueEncodingByte = exports.DataValueEncodingByte = void 0;
const node_opcua_factory_1 = require("node-opcua-factory");
/**
 * @private
 */
var DataValueEncodingByte;
(function (DataValueEncodingByte) {
    DataValueEncodingByte[DataValueEncodingByte["Value"] = 1] = "Value";
    DataValueEncodingByte[DataValueEncodingByte["StatusCode"] = 2] = "StatusCode";
    DataValueEncodingByte[DataValueEncodingByte["SourceTimestamp"] = 4] = "SourceTimestamp";
    DataValueEncodingByte[DataValueEncodingByte["ServerTimestamp"] = 8] = "ServerTimestamp";
    DataValueEncodingByte[DataValueEncodingByte["SourcePicoseconds"] = 16] = "SourcePicoseconds";
    DataValueEncodingByte[DataValueEncodingByte["ServerPicoseconds"] = 32] = "ServerPicoseconds";
})(DataValueEncodingByte || (exports.DataValueEncodingByte = DataValueEncodingByte = {}));
/**
 * @private
 */
exports.schemaDataValueEncodingByte = {
    name: "DataValue_EncodingByte",
    enumValues: DataValueEncodingByte
};
/**
 * @private
 */
exports._enumerationDataValueEncodingByte = (0, node_opcua_factory_1.registerEnumeration)(exports.schemaDataValueEncodingByte);
//# sourceMappingURL=DataValueEncodingByte_enum.js.map