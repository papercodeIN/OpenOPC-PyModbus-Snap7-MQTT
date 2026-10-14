"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractDataValueToPromote = extractDataValueToPromote;
exports.promoteOpaqueStructure = promoteOpaqueStructure;
const node_opcua_extension_object_1 = require("node-opcua-extension-object");
const node_opcua_variant_1 = require("node-opcua-variant");
//
const get_extra_data_type_manager_1 = require("./get_extra_data_type_manager");
const resolve_dynamic_extension_object_1 = require("./resolve_dynamic_extension_object");
function extractDataValueToPromote(dataValues) {
    // count number of Opaque Structures
    const dataValuesToFix = dataValues.filter((dataValue) => dataValue.value &&
        dataValue.value.dataType === node_opcua_variant_1.DataType.ExtensionObject &&
        ((dataValue.value.arrayType === node_opcua_variant_1.VariantArrayType.Scalar && dataValue.value.value instanceof node_opcua_extension_object_1.OpaqueStructure) ||
            (dataValue.value.arrayType !== node_opcua_variant_1.VariantArrayType.Scalar &&
                dataValue.value.value &&
                dataValue.value.value.length >= 0 &&
                dataValue.value.value[0] instanceof node_opcua_extension_object_1.OpaqueStructure)));
    return dataValuesToFix;
}
/**
 *
 * @private
 */
async function promoteOpaqueStructure(session, dataValues) {
    const dataValuesToFix = extractDataValueToPromote(dataValues);
    if (dataValuesToFix.length === 0) {
        return;
    }
    // construct dataTypeManager if not already present
    const extraDataTypeManager = await (0, get_extra_data_type_manager_1.getExtraDataTypeManager)(session);
    const promises = dataValuesToFix.map(async (dataValue) => {
        return await (0, resolve_dynamic_extension_object_1.resolveDynamicExtensionObject)(session, dataValue.value, extraDataTypeManager);
    });
    // https://medium.com/swlh/dealing-with-multiple-promises-in-javascript-41d6c21f20ff
    await Promise.all(promises.map((p) => p.catch((e) => e)));
}
//# sourceMappingURL=promote_opaque_structure.js.map