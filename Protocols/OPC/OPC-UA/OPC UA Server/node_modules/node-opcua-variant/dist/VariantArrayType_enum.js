"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._enumerationVariantArrayType = exports.VariantArrayType = void 0;
const node_opcua_factory_1 = require("node-opcua-factory");
var VariantArrayType;
(function (VariantArrayType) {
    VariantArrayType[VariantArrayType["Scalar"] = 0] = "Scalar";
    VariantArrayType[VariantArrayType["Array"] = 1] = "Array";
    VariantArrayType[VariantArrayType["Matrix"] = 2] = "Matrix";
})(VariantArrayType || (exports.VariantArrayType = VariantArrayType = {}));
const schemaVariantArrayType = {
    enumValues: VariantArrayType,
    name: "VariantArrayType"
};
/***
 * @private
 */
exports._enumerationVariantArrayType = (0, node_opcua_factory_1.registerEnumeration)(schemaVariantArrayType);
//# sourceMappingURL=VariantArrayType_enum.js.map