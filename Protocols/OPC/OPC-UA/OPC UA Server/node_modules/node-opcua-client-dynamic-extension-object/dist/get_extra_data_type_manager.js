"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateExtraDataTypeManager = invalidateExtraDataTypeManager;
exports.extractDataTypeManagerPrivate = extractDataTypeManagerPrivate;
exports.getExtraDataTypeManager = getExtraDataTypeManager;
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_factory_1 = require("node-opcua-factory");
const node_opcua_pseudo_session_1 = require("node-opcua-pseudo-session");
//
const extra_data_type_manager_1 = require("./extra_data_type_manager");
const populate_data_type_manager_1 = require("./populate_data_type_manager");
const doDebug = (0, node_opcua_debug_1.checkDebugFlag)(__filename);
const debugLog = (0, node_opcua_debug_1.make_debugLog)(__filename);
const errorLog = (0, node_opcua_debug_1.make_errorLog)(__filename);
const warningLog = errorLog;
async function invalidateExtraDataTypeManager(session) {
    const sessionPriv = session;
    (0, node_opcua_pseudo_session_1.clearSessionCache)(session);
    sessionPriv.$$namespaceArray = undefined;
    sessionPriv.$$extraDataTypeManager = undefined;
    if (sessionPriv.$$extraDataTypeManagerToResolve) {
        warningLog("Warning: invalidateExtraDataTypeManager is called while getExtraDataTypeManager is in progress");
    }
}
async function extractDataTypeManagerPrivate(session, strategy) {
    const namespaceArray = await (0, node_opcua_pseudo_session_1.readNamespaceArray)(session);
    // istanbul ignore next
    if (namespaceArray.length === 0) {
        errorLog("namespaceArray is not populated ! Your server must expose a list of namespace ");
    }
    // istanbul ignore next
    if (doDebug) {
        debugLog("Namespace Array = ", namespaceArray.join("\n                   "));
    }
    const dataTypeManager = new extra_data_type_manager_1.ExtraDataTypeManager();
    dataTypeManager.setNamespaceArray(namespaceArray);
    for (let namespaceIndex = 1; namespaceIndex < namespaceArray.length; namespaceIndex++) {
        const dataTypeFactory1 = new node_opcua_factory_1.DataTypeFactory([(0, node_opcua_factory_1.getStandardDataTypeFactory)()]);
        dataTypeManager.registerDataTypeFactory(namespaceIndex, dataTypeFactory1);
    }
    await (0, populate_data_type_manager_1.populateDataTypeManager)(session, dataTypeManager, strategy);
    // istanbul ignore next
    if (dataTypeManager.namespaceArray.length === 0) {
        throw new Error("namespaceArray is not populated ! Your server must expose a list of namespace ");
    }
    return dataTypeManager;
}
function getStrategy(session, strategy) {
    if (strategy !== undefined) {
        return strategy;
    }
    const client = session.client;
    if (client && client.dataTypeExtractStrategy !== undefined) {
        return client.dataTypeExtractStrategy;
    }
    return populate_data_type_manager_1.DataTypeExtractStrategy.Auto;
}
function getSessionForDataTypeManagerExtraction(session) {
    const _session = session;
    if (_session.$$getSessionForDataTypeExtraction) {
        return _session.$$getSessionForDataTypeExtraction();
    }
    return session;
}
function followSession(session) {
    if (session.session) {
        return followSession(session.session);
    }
    return session;
}
async function getExtraDataTypeManager(session, strategy) {
    const sessionPriv = followSession(session);
    if (sessionPriv.$$extraDataTypeManager) {
        return sessionPriv.$$extraDataTypeManager;
    }
    if (sessionPriv.$$extraDataTypeManagerToResolve) {
        doDebug && debugLog("getExtraDataTypeManager is re-entering !");
        return await new Promise((resolve, reject) => {
            sessionPriv.$$extraDataTypeManagerToResolve?.push([resolve, reject]);
        });
    }
    sessionPriv.$$extraDataTypeManagerToResolve = [];
    return await new Promise((_resolve, _reject) => {
        sessionPriv.$$extraDataTypeManagerToResolve.push([_resolve, _reject]);
        (async () => {
            try {
                strategy = getStrategy(session, strategy);
                const sessionToUse = getSessionForDataTypeManagerExtraction(session);
                const dataTypeManager = await extractDataTypeManagerPrivate(sessionToUse, strategy);
                // note: reconnection will call invalidateExtraDataTypeManager
                // if the session is recreated
                const tmp = sessionPriv.$$extraDataTypeManagerToResolve;
                sessionPriv.$$extraDataTypeManagerToResolve = undefined;
                for (const [resolve] of tmp) {
                    resolve(dataTypeManager);
                }
                sessionPriv.$$extraDataTypeManager = dataTypeManager;
            }
            catch (err) {
                const tmp = sessionPriv.$$extraDataTypeManagerToResolve;
                sessionPriv.$$extraDataTypeManagerToResolve = undefined;
                for (const [_resolve, reject] of tmp) {
                    reject(err);
                }
            }
        })();
    });
}
//# sourceMappingURL=get_extra_data_type_manager.js.map