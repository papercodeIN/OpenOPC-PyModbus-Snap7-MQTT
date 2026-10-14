"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readHistoryServerCapabilities = readHistoryServerCapabilities;
/**
 * @module node-opcua-client
 */
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_constants_1 = require("node-opcua-constants");
const node_opcua_data_model_1 = require("node-opcua-data-model");
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
const node_opcua_service_translate_browse_path_1 = require("node-opcua-service-translate-browse-path");
const node_opcua_utils_1 = require("node-opcua-utils");
function readHistoryServerCapabilities(session, callback) {
    if (!callback) {
        throw new Error("Internal error");
    }
    // display HistoryCapabilities of server
    const browsePath = (0, node_opcua_service_translate_browse_path_1.makeBrowsePath)(node_opcua_constants_1.ObjectIds.ObjectsFolder, "/Server/ServerCapabilities.HistoryServerCapabilities");
    session.translateBrowsePath(browsePath, (err, result) => {
        if (err) {
            return callback(err);
        }
        /* istanbul ignore next */
        if (!result) {
            return callback(new Error("Internal Error"));
        }
        if (result.statusCode.isNotGood()) {
            return callback(new Error("StatusCode = " + result.statusCode.toString()));
        }
        result.targets = result.targets || [];
        const historyServerCapabilitiesNodeId = result.targets[0].targetId;
        // (should be ns=0;i=11192)
        (0, node_opcua_assert_1.assert)(historyServerCapabilitiesNodeId.toString() === "ns=0;i=11192");
        // -------------------------
        const properties = [
            "AccessHistoryDataCapability",
            "AccessHistoryEventsCapability",
            "DeleteAtTimeCapability",
            "DeleteRawCapability",
            "DeleteEventCapability",
            "InsertAnnotationCapability",
            "InsertDataCapability",
            "InsertEventCapability",
            "ReplaceDataCapability",
            "ReplaceEventCapability",
            "UpdateDataCapability",
            "UpdateEventCapability",
            "MaxReturnDataValues",
            "MaxReturnEventValues",
            "AggregateFunctions/AnnotationCount",
            "AggregateFunctions/Average",
            "AggregateFunctions/Count",
            "AggregateFunctions/Delta",
            "AggregateFunctions/DeltaBounds",
            "AggregateFunctions/DurationBad",
            "AggregateFunctions/DurationGood",
            "AggregateFunctions/DurationStateNonZero"
            // etc....
        ];
        const browsePaths = properties.map((prop) => (0, node_opcua_service_translate_browse_path_1.makeBrowsePath)(historyServerCapabilitiesNodeId, "." + prop));
        session.translateBrowsePath(browsePaths, (innerErr, results) => {
            if (innerErr) {
                return callback(innerErr);
            }
            /* istanbul ignore next */
            if (!results) {
                return callback(new Error("Internal Error"));
            }
            const nodeIds = results.map((innerResult) => innerResult.statusCode.isGood() && innerResult.targets
                ? innerResult.targets[0].targetId
                : new node_opcua_nodeid_1.NodeId());
            const nodesToRead = nodeIds.map((nodeId) => ({
                attributeId: node_opcua_data_model_1.AttributeIds.Value,
                nodeId /*: coerceNodeId(nodeId)*/
            }));
            const data = {};
            session.read(nodesToRead, (err2, dataValues) => {
                if (err2) {
                    return callback(err2);
                }
                /* istanbul ignore next */
                if (!dataValues) {
                    return callback(new Error("Internal Error"));
                }
                for (let i = 0; i < dataValues.length; i++) {
                    const propName = (0, node_opcua_utils_1.lowerFirstLetter)(properties[i]);
                    data[propName] = dataValues[i].value;
                }
                callback(null, data);
            });
        });
    });
}
// tslint:disable:no-var-requires
const thenify_ex_1 = require("thenify-ex");
const opts = { multiArgs: false };
module.exports.readHistoryServerCapabilities = (0, thenify_ex_1.withCallback)(module.exports.readHistoryServerCapabilities, opts);
//# sourceMappingURL=read_history_server_capabilities.js.map