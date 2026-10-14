"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveOpaqueStructureInExtensionObject = resolveOpaqueStructureInExtensionObject;
exports.resolveDynamicExtensionObject = resolveDynamicExtensionObject;
const node_opcua_binary_stream_1 = require("node-opcua-binary-stream");
const node_opcua_extension_object_1 = require("node-opcua-extension-object");
const node_opcua_variant_1 = require("node-opcua-variant");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_data_model_1 = require("node-opcua-data-model");
const populate_data_type_manager_104_1 = require("./private/populate_data_type_manager_104");
const warningLog = (0, node_opcua_debug_1.make_warningLog)(__filename);
async function getOrExtractConstructor(session, binaryEncodingNodeId, dataTypeManager) {
    const dataTypeFactory = dataTypeManager.getDataTypeFactoryForNamespace(binaryEncodingNodeId.namespace);
    const Constructor = dataTypeFactory.getConstructor(binaryEncodingNodeId);
    if (Constructor) {
        return Constructor;
    }
    if (binaryEncodingNodeId.namespace === 0) {
        throw new Error("Internal Error");
    }
    // need to extract it
    const browseResult = await session.browse({
        nodeId: binaryEncodingNodeId,
        referenceTypeId: "HasEncoding",
        browseDirection: node_opcua_data_model_1.BrowseDirection.Inverse,
        includeSubtypes: false,
        nodeClassMask: node_opcua_data_model_1.NodeClassMask.DataType,
        resultMask: node_opcua_data_model_1.ResultMask.BrowseName
    });
    if (browseResult.statusCode.isNotGood() || browseResult.references.length !== 1) {
        throw new Error("browse failed");
    }
    const r = browseResult.references[0];
    const dataTypeNodeId = r.nodeId;
    if (dataTypeFactory.getStructureInfoForDataType(dataTypeNodeId)) {
        throw new Error("Internal Error: we are not expecting this dataType to be processed already " + dataTypeNodeId.toString());
    }
    await (0, populate_data_type_manager_104_1.readDataTypeDefinitionAndBuildType)(session, dataTypeNodeId, r.browseName.name, dataTypeFactory, {});
    const structureInfo = dataTypeFactory.getStructureInfoForDataType(dataTypeNodeId);
    if (!structureInfo.constructor) {
        throw new Error("Cannot find constructor for abstract DataType");
    }
    return structureInfo.constructor;
}
async function resolveOpaqueStructureInExtensionObject(session, dataTypeManager, object) {
    const schema = object.schema;
    async function fixOpaqueStructureOnElement(element, field, data, args) {
        if (element instanceof node_opcua_variant_1.Variant) {
            await resolveDynamicExtensionObject(session, element, dataTypeManager);
            return element;
        }
        if (!(element instanceof node_opcua_extension_object_1.OpaqueStructure)) {
            return element;
        }
        const variant = new node_opcua_variant_1.Variant({ dataType: node_opcua_variant_1.DataType.ExtensionObject, value: element });
        await resolveDynamicExtensionObject(session, variant, dataTypeManager);
        return variant.value;
    }
    function fixOpaqueStructure(object, field, data, args) {
        if (field.category === "complex" && !field.allowSubType) {
            return;
        }
        if (field.category === "basic" && field.fieldType !== "Variant") {
            return;
        }
        const a = object[field.name];
        if (!a) {
            return;
        }
        if (field.isArray) {
            for (let i = 0; i < a.length; i++) {
                const x = a[i];
                promises.push((async () => {
                    a[i] = await fixOpaqueStructureOnElement(x, field, data, args);
                })());
            }
        }
        else {
            promises.push((async () => {
                object[field.name] = await fixOpaqueStructureOnElement(a, field, data, args);
            })());
        }
    }
    const promises = [];
    object.applyOnAllFields(fixOpaqueStructure, { dataTypeManager, promises });
    await Promise.all(promises);
}
async function resolveDynamicExtensionObjectV(session, opaque, dataTypeManager) {
    try {
        const Constructor = await getOrExtractConstructor(session, opaque.nodeId, dataTypeManager);
        const object = new Constructor();
        const stream = new node_opcua_binary_stream_1.BinaryStream(opaque.buffer);
        try {
            object.decode(stream);
            await resolveOpaqueStructureInExtensionObject(session, dataTypeManager, object);
            return object;
        }
        catch (err) {
            warningLog("Constructor = ", Constructor.name);
            warningLog("opaqueStructure = ", opaque?.nodeId?.toString());
            warningLog("opaqueStructure = ", (0, node_opcua_debug_1.hexDump)(opaque.buffer, 132, 100));
            warningLog((0, node_opcua_debug_1.hexDump)(opaque.buffer));
            warningLog("resolveDynamicExtensionObjectV err = ", err);
            // try again for debugging
            object.decode(stream);
            return opaque;
        }
    }
    catch (err) {
        warningLog("err", err);
        warningLog("opaqueStructure = ", opaque.nodeId.toString());
        warningLog("opaqueStructure = ", "0x" + (0, node_opcua_debug_1.hexDump)(opaque.buffer, 132, 100));
        warningLog((0, node_opcua_debug_1.hexDump)(opaque.buffer));
        warningLog(dataTypeManager.toString());
        throw err;
    }
}
async function resolveDynamicExtensionObject(session, variant, dataTypeManager) {
    if (variant.dataType !== node_opcua_variant_1.DataType.ExtensionObject) {
        return;
    }
    if (variant.arrayType !== node_opcua_variant_1.VariantArrayType.Scalar) {
        if (variant.value instanceof Array) {
            for (let i = 0; i < variant.value.length; i++) {
                if (variant.value[i] instanceof node_opcua_extension_object_1.OpaqueStructure) {
                    variant.value[i] = await resolveDynamicExtensionObjectV(session, variant.value[i], dataTypeManager);
                }
            }
        }
        return;
    }
    if (!(variant.value instanceof node_opcua_extension_object_1.OpaqueStructure)) {
        return;
    }
    variant.value = await resolveDynamicExtensionObjectV(session, variant.value, dataTypeManager);
}
//# sourceMappingURL=resolve_dynamic_extension_object.js.map