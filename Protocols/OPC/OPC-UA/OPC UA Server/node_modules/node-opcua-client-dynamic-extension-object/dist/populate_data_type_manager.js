"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTypeExtractStrategy = void 0;
exports.serverImplementsDataTypeDefinition = serverImplementsDataTypeDefinition;
exports.populateDataTypeManager = populateDataTypeManager;
const node_opcua_data_model_1 = require("node-opcua-data-model");
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
const node_opcua_pseudo_session_1 = require("node-opcua-pseudo-session");
const node_opcua_constants_1 = require("node-opcua-constants");
const node_opcua_variant_1 = require("node-opcua-variant");
const node_opcua_service_translate_browse_path_1 = require("node-opcua-service-translate-browse-path");
const populate_data_type_manager_103_1 = require("./private/populate_data_type_manager_103");
const populate_data_type_manager_104_1 = require("./private/populate_data_type_manager_104");
/**
 * @private
 */
async function serverImplementsDataTypeDefinition(session) {
    // One way to figure out is to check if the server provides DataTypeDefinition node
    // ( see OPCUA 1.04 part 6 -)
    // This is the preferred route, as we go along, more and more servers will implement this.
    const browseResult1 = await (0, node_opcua_pseudo_session_1.browseAll)(session, {
        browseDirection: node_opcua_data_model_1.BrowseDirection.Forward,
        includeSubtypes: true,
        nodeClassMask: node_opcua_data_model_1.NodeClassMask.Variable,
        nodeId: (0, node_opcua_nodeid_1.resolveNodeId)(node_opcua_constants_1.ObjectIds.OPCBinarySchema_TypeSystem),
        resultMask: node_opcua_data_model_1.ResultMask.TypeDefinition
    });
    let count103DataType = 0;
    const innerF = async (ref) => {
        const td = ref.typeDefinition;
        if (!(td.namespace === 0 && td.value === node_opcua_constants_1.VariableTypeIds.DataTypeDictionaryType)) {
            return;
        }
        // we have a type definition,
        // let check if there is a deprecated property
        const p = await session.translateBrowsePath((0, node_opcua_service_translate_browse_path_1.makeBrowsePath)(ref.nodeId, "/Deprecated"));
        if (!p.statusCode.isGood() || !p.targets || p.targets.length === 0) {
            // the dataTypeDictionaryType is not exposing a Deprecated property
            count103DataType++;
            return;
        }
        const deprecatedNodeId = p.targets[0].targetId;
        // we have a deprecated property => this is a 1.03 server or 1.04
        // => we need to check if the server provides DataTypeDefinition
        const dataValue = await session.read({ nodeId: deprecatedNodeId, attributeId: node_opcua_data_model_1.AttributeIds.Value });
        if (dataValue.statusCode.isGood() && dataValue.value.value === false) {
            // this is a 1.03 server
            count103DataType++;
            return;
        }
    };
    if (false) {
        for (let r of (browseResult1.references || [])) {
            await innerF(r);
        }
    }
    else {
        const promises = (browseResult1.references || []).map((a) => innerF(a));
        await Promise.all(promises);
    }
    if (count103DataType >= 1) {
        // some namespace are old , we cannot assume that all namespace are 1.04
        return false;
    }
    // check if server provides DataTypeDefinition => in this case this is the preferred route,
    // as we go along, more and more servers will implement this.
    const browseResult = await (0, node_opcua_pseudo_session_1.browseAll)(session, {
        browseDirection: node_opcua_data_model_1.BrowseDirection.Forward,
        includeSubtypes: true,
        nodeClassMask: node_opcua_data_model_1.NodeClassMask.DataType,
        nodeId: (0, node_opcua_nodeid_1.resolveNodeId)(node_opcua_variant_1.DataType.ExtensionObject),
        referenceTypeId: "HasSubtype",
        resultMask: 63
    });
    const browseResult2 = await (0, node_opcua_pseudo_session_1.browseAll)(session, {
        browseDirection: node_opcua_data_model_1.BrowseDirection.Forward,
        includeSubtypes: true,
        nodeClassMask: node_opcua_data_model_1.NodeClassMask.DataType,
        nodeId: (0, node_opcua_nodeid_1.resolveNodeId)(node_opcua_constants_1.DataTypeIds.Union),
        referenceTypeId: "HasSubtype",
        resultMask: 63
    });
    let references = [];
    if (browseResult && browseResult.references)
        references = references.concat(browseResult.references);
    if (browseResult2 && browseResult2.references)
        references = references.concat(browseResult2.references);
    if (references.length === 0)
        return false;
    // DataType Structure from namespace 0 are not interesting and will not provide DataTypeDefinition attribute anyway
    // on some servers.
    references = references.filter((a, index) => a.nodeId.namespace !== 0);
    if (references.length === 0)
        return false;
    let nodesToRead = references.map((r) => ({
        nodeId: r.nodeId,
        attributeId: node_opcua_data_model_1.AttributeIds.DataTypeDefinition
    }));
    const nodesToRead2 = nodesToRead.map((r) => ({ nodeId: r.nodeId, attributeId: node_opcua_data_model_1.AttributeIds.IsAbstract }));
    const abstractFlags = (await session.read(nodesToRead2)).map((d) => d.value.value);
    // also remove the abstract dataStructure => they don't provide valid DataTypeDefinition
    nodesToRead = nodesToRead.filter((_nodesToRead, index) => !abstractFlags[index]);
    if (nodesToRead.length === 0)
        return false;
    const dataValues = await session.read(nodesToRead);
    const countOK = dataValues.reduce((prev, a) => prev + (a.statusCode.isGood() ? 1 : 0), 0);
    if (countOK === dataValues.length) {
        return true;
        // await populateDataTypeManager104(session, dataTypeManager);
        // return;
    }
    return false;
}
var DataTypeExtractStrategy;
(function (DataTypeExtractStrategy) {
    DataTypeExtractStrategy[DataTypeExtractStrategy["Auto"] = 0] = "Auto";
    DataTypeExtractStrategy[DataTypeExtractStrategy["Force103"] = 1] = "Force103";
    DataTypeExtractStrategy[DataTypeExtractStrategy["Force104"] = 2] = "Force104";
    DataTypeExtractStrategy[DataTypeExtractStrategy["Both"] = 3] = "Both";
})(DataTypeExtractStrategy || (exports.DataTypeExtractStrategy = DataTypeExtractStrategy = {}));
;
async function populateDataTypeManager(session, dataTypeManager, strategy) {
    if (strategy === DataTypeExtractStrategy.Auto) {
        const force104 = await serverImplementsDataTypeDefinition(session);
        if (force104) {
            await (0, populate_data_type_manager_104_1.populateDataTypeManager104)(session, dataTypeManager);
            return;
        }
        // old way for 1.03 and early 1.04 prototype
        await (0, populate_data_type_manager_103_1.populateDataTypeManager103)(session, dataTypeManager);
        await (0, populate_data_type_manager_104_1.populateDataTypeManager104)(session, dataTypeManager);
        return;
    }
    if (strategy == DataTypeExtractStrategy.Force103 || strategy == DataTypeExtractStrategy.Both) {
        await (0, populate_data_type_manager_103_1.populateDataTypeManager103)(session, dataTypeManager);
    }
    if (strategy == DataTypeExtractStrategy.Force104 || strategy == DataTypeExtractStrategy.Both) {
        await (0, populate_data_type_manager_104_1.populateDataTypeManager104)(session, dataTypeManager);
    }
}
//# sourceMappingURL=populate_data_type_manager.js.map