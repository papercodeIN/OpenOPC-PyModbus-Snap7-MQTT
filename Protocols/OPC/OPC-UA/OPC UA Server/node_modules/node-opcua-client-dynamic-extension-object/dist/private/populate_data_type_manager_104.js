"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDataTypeDefinitionAndBuildType = readDataTypeDefinitionAndBuildType;
exports.populateDataTypeManager104 = populateDataTypeManager104;
const node_opcua_data_model_1 = require("node-opcua-data-model");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_factory_1 = require("node-opcua-factory");
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
const node_opcua_pseudo_session_1 = require("node-opcua-pseudo-session");
const node_opcua_schemas_1 = require("node-opcua-schemas");
const node_opcua_types_1 = require("node-opcua-types");
const convert_data_type_definition_to_structuretype_schema_1 = require("../convert_data_type_definition_to_structuretype_schema");
const node_opcua_status_code_1 = require("node-opcua-status-code");
const errorLog = (0, node_opcua_debug_1.make_errorLog)(__filename);
const debugLog = (0, node_opcua_debug_1.make_debugLog)(__filename);
const warningLog = (0, node_opcua_debug_1.make_warningLog)(__filename);
const doDebug = (0, node_opcua_debug_1.checkDebugFlag)(__filename);
async function readDataTypeDefinitionAndBuildType(session, dataTypeNodeId, name, dataTypeFactory, cache) {
    const dependentNamespaces = new Set();
    try {
        if (dataTypeFactory.getStructureInfoForDataType(dataTypeNodeId)) {
            return dependentNamespaces;
        }
        const [isAbstractDataValue, dataTypeDefinitionDataValue, browseNameDataValue] = await session.read([
            {
                attributeId: node_opcua_data_model_1.AttributeIds.IsAbstract,
                nodeId: dataTypeNodeId
            },
            {
                attributeId: node_opcua_data_model_1.AttributeIds.DataTypeDefinition,
                nodeId: dataTypeNodeId
            },
            {
                attributeId: node_opcua_data_model_1.AttributeIds.BrowseName,
                nodeId: dataTypeNodeId
            }
        ]);
        if (isAbstractDataValue.statusCode == node_opcua_status_code_1.StatusCodes.BadNodeIdUnknown) {
            // may be model is incomplete and dataTypeNodeId is missing
            debugLog("Cannot find dataTypeNodeId = ", dataTypeNodeId.toString());
            return dependentNamespaces;
        }
        /* istanbul ignore next */
        if (isAbstractDataValue.statusCode.isNotGood()) {
            errorLog("browseName", browseNameDataValue.value.toString());
            throw new Error(" Cannot find dataType isAbstract ! with nodeId =" + dataTypeNodeId.toString() + " " + isAbstractDataValue.statusCode.toString());
        }
        const isAbstract = isAbstractDataValue.value.value;
        let dataTypeDefinition = dataTypeDefinitionDataValue.value.value;
        /* istanbul ignore next */
        if (dataTypeDefinitionDataValue.statusCode.isNotGood()) {
            // may be we are reading a 1.03 server
            // or it could be some of the di:ParameterResultDataType that are not marked as abstract
            // in some cases
            if (!isAbstract) {
                const [isAbstract2, browseNameDV] = await session.read([
                    { nodeId: dataTypeNodeId, attributeId: node_opcua_data_model_1.AttributeIds.IsAbstract },
                    { nodeId: dataTypeNodeId, attributeId: node_opcua_data_model_1.AttributeIds.BrowseName }
                ]);
                warningLog(" Cannot find dataType Definition ! with nodeId =" + dataTypeNodeId.toString(), browseNameDV.value?.value?.toString(), isAbstract2.value?.value);
                return dependentNamespaces;
            }
            // it is OK to not have dataTypeDefinition for Abstract type!
            dataTypeDefinition = new node_opcua_types_1.StructureDefinition();
        }
        // get dependencies of struct
        if (dataTypeDefinition instanceof node_opcua_types_1.StructureDefinition && dataTypeDefinition.fields) {
            for (const field of dataTypeDefinition.fields) {
                const dataTypeNamespace = field.dataType.namespace;
                if (dataTypeNamespace === dataTypeDefinition.defaultEncodingId.namespace) {
                    continue; // not dependent on own namespace
                }
                ;
                dependentNamespaces.add(dataTypeNamespace);
            }
        }
        const schema = await (0, convert_data_type_definition_to_structuretype_schema_1.convertDataTypeDefinitionToStructureTypeSchema)(session, dataTypeNodeId, name, dataTypeDefinition, null, dataTypeFactory, isAbstract, cache);
        if (isAbstract) {
            // cannot construct an abstract structure
            dataTypeFactory.registerAbstractStructure(dataTypeNodeId, name, schema);
        }
        else {
            const Constructor = (0, node_opcua_schemas_1.createDynamicObjectConstructor)(schema, dataTypeFactory);
        }
    }
    catch (err) {
        errorLog("Error", err);
    }
    return dependentNamespaces;
}
async function populateDataTypeManager104(session, dataTypeManager) {
    const dataFactoriesDependencies = new Map();
    const cache = {};
    async function withDataType(r) {
        const dataTypeNodeId = r.nodeId;
        try {
            if (dataTypeNodeId.namespace === 0) {
                // already known I guess
                return;
            }
            let dataTypeFactory = dataTypeManager.getDataTypeFactory(dataTypeNodeId.namespace);
            if (!dataTypeFactory) {
                dataTypeFactory = new node_opcua_factory_1.DataTypeFactory([]);
                dataTypeManager.registerDataTypeFactory(dataTypeNodeId.namespace, dataTypeFactory);
                //   throw new Error("cannot find dataType Manager for namespace of " + dataTypeNodeId.toString());
            }
            // if not found already
            if (dataTypeFactory.getStructureInfoForDataType(dataTypeNodeId)) {
                // already known !
                return;
            }
            // extract it formally
            doDebug && debugLog(" DataType => ", r.browseName.toString(), dataTypeNodeId.toString());
            const dependentNamespaces = await readDataTypeDefinitionAndBuildType(session, dataTypeNodeId, r.browseName.name, dataTypeFactory, cache);
            // add dependent namespaces to dataFactoriesDependencies
            let dataFactoryDependencies = dataFactoriesDependencies.get(dataTypeNodeId.namespace);
            if (!dataFactoryDependencies) {
                // add new dependencies set if not already existing
                dataFactoryDependencies = new Set([0]); // always dependent on UA node set
                dataFactoriesDependencies.set(dataTypeNodeId.namespace, dataFactoryDependencies);
            }
            dependentNamespaces.forEach((ns) => dataFactoryDependencies.add(ns));
        }
        catch (err) {
            errorLog("err=", err);
        }
    }
    const nodeToBrowse = {
        nodeId: node_opcua_nodeid_1.NodeId.nullNodeId, // to be replaced
        includeSubtypes: true,
        browseDirection: node_opcua_data_model_1.BrowseDirection.Forward,
        nodeClassMask: 0xff,
        referenceTypeId: (0, node_opcua_nodeid_1.resolveNodeId)("HasSubtype"),
        resultMask: 0xff
    };
    await applyOnReferenceRecursively(session, (0, node_opcua_nodeid_1.resolveNodeId)("Structure"), nodeToBrowse, withDataType);
    // set factory dependencies
    for (const [namespace, dependentNamespaces] of dataFactoriesDependencies) {
        const namespaceDataTypeFactory = dataTypeManager.getDataTypeFactoryForNamespace(namespace);
        const dependentTypeFactories = new Set([(0, node_opcua_factory_1.getStandardDataTypeFactory)()]);
        for (const dependentNamespace of dependentNamespaces) {
            if (dependentNamespace === 0)
                continue; // already added above
            const dependentTypeFactory = dataTypeManager.getDataTypeFactoryForNamespace(dependentNamespace);
            dependentTypeFactories.add(dependentTypeFactory);
        }
        const baseDataFactories = Array.from(dependentTypeFactories);
        namespaceDataTypeFactory.repairBaseDataFactories(baseDataFactories);
    }
}
async function applyOnReferenceRecursively(session, nodeId, browseDescriptionTemplate, action) {
    const oneLevel = async (nodeId) => {
        const nodeToBrowse = {
            ...browseDescriptionTemplate,
            nodeId
        };
        const browseResult = await (0, node_opcua_pseudo_session_1.browseAll)(session, nodeToBrowse);
        const promises = [];
        for (const ref of browseResult.references || []) {
            promises.push((async () => {
                await action(ref);
                await oneLevel(ref.nodeId);
            })());
        }
        await Promise.all(promises);
    };
    await oneLevel(nodeId);
}
//# sourceMappingURL=populate_data_type_manager_104.js.map