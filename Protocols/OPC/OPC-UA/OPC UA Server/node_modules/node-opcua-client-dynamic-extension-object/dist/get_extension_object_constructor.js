"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExtensionObjectConstructor = getExtensionObjectConstructor;
const node_opcua_data_model_1 = require("node-opcua-data-model");
//
const get_extra_data_type_manager_1 = require("./get_extra_data_type_manager");
const populate_data_type_manager_104_1 = require("./private/populate_data_type_manager_104");
/**
 *
 */
async function getExtensionObjectConstructor(session, dataTypeNodeId) {
    const extraDataTypeManager = await (0, get_extra_data_type_manager_1.getExtraDataTypeManager)(session);
    const dataTypeFactory = extraDataTypeManager.getDataTypeFactory(dataTypeNodeId.namespace);
    const structureInfo = dataTypeFactory.getStructureInfoForDataType(dataTypeNodeId);
    if (structureInfo) {
        return structureInfo.constructor;
    }
    const dataValue = await session.read({
        nodeId: dataTypeNodeId,
        attributeId: node_opcua_data_model_1.AttributeIds.BrowseName
    });
    const browseName = dataValue.value.value;
    await (0, populate_data_type_manager_104_1.readDataTypeDefinitionAndBuildType)(session, dataTypeNodeId, browseName.name, dataTypeFactory, {});
    return await extraDataTypeManager.getExtensionObjectConstructorFromDataType(dataTypeNodeId);
}
//# sourceMappingURL=get_extension_object_constructor.js.map