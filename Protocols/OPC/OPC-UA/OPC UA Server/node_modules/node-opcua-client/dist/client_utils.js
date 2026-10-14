"use strict";
/**
 * @module node-opcua-client
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.readUAAnalogItem = readUAAnalogItem;
const node_opcua_data_model_1 = require("node-opcua-data-model");
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
const node_opcua_service_translate_browse_path_1 = require("node-opcua-service-translate-browse-path");
const hasPropertyRefId = (0, node_opcua_nodeid_1.resolveNodeId)("HasProperty");
/* NodeId  ns=0;i=46*/
function browsePathPropertyRequest(nodeId, propertyName) {
    return new node_opcua_service_translate_browse_path_1.BrowsePath({
        relativePath: /* RelativePath   */ {
            elements: /* RelativePathElement */ [
                {
                    includeSubtypes: false,
                    isInverse: false,
                    referenceTypeId: hasPropertyRefId,
                    targetName: { namespaceIndex: 0, name: propertyName }
                }
            ]
        },
        startingNode: /* NodeId  */ nodeId
    });
}
/**
 *
 */
async function readUAAnalogItem(session, nodeId) {
    const browsePaths = [
        browsePathPropertyRequest(nodeId, "EngineeringUnits"),
        browsePathPropertyRequest(nodeId, "EURange"),
        browsePathPropertyRequest(nodeId, "InstrumentRange"),
        browsePathPropertyRequest(nodeId, "ValuePrecision"),
        browsePathPropertyRequest(nodeId, "Definition")
    ];
    const analogItemData = {
        definition: null,
        engineeringUnits: null,
        engineeringUnitsRange: null,
        instrumentRange: null,
        valuePrecision: null
    };
    const browsePathResults = await session.translateBrowsePath(browsePaths);
    const actions = [];
    const nodesToRead = [];
    function processProperty(browsePathResult, propertyName) {
        if (browsePathResult.statusCode.isGood()) {
            browsePathResult.targets = browsePathResult.targets || [];
            nodesToRead.push({
                attributeId: node_opcua_data_model_1.AttributeIds.Value,
                nodeId: browsePathResult.targets[0].targetId
            });
            actions.push((readResult) => (analogItemData[propertyName] = readResult.value.value));
        }
    }
    processProperty(browsePathResults[0], "engineeringUnits");
    processProperty(browsePathResults[1], "engineeringUnitsRange");
    processProperty(browsePathResults[2], "instrumentRange");
    processProperty(browsePathResults[3], "valuePrecision");
    processProperty(browsePathResults[4], "definition");
    const dataValues = await session.read(nodesToRead);
    dataValues.forEach((result, index) => {
        actions[index].call(null, result);
    });
    return analogItemData;
}
//# sourceMappingURL=client_utils.js.map