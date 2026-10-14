"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _ClientSessionImpl_instances, _ClientSessionImpl_reprocessRequest, _ClientSessionImpl__recreate_session_and_reperform_transaction;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientSessionImpl = void 0;
/**
 * @module node-opcua-client-private
 */
const events_1 = require("events");
const chalk_1 = __importDefault(require("chalk"));
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_client_dynamic_extension_object_1 = require("node-opcua-client-dynamic-extension-object");
const node_opcua_data_model_1 = require("node-opcua-data-model");
const node_opcua_data_value_1 = require("node-opcua-data-value");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
const node_opcua_pseudo_session_1 = require("node-opcua-pseudo-session");
const node_opcua_secure_channel_1 = require("node-opcua-secure-channel");
const node_opcua_service_browse_1 = require("node-opcua-service-browse");
const node_opcua_service_call_1 = require("node-opcua-service-call");
const node_opcua_service_history_1 = require("node-opcua-service-history");
const node_opcua_service_query_1 = require("node-opcua-service-query");
const node_opcua_service_read_1 = require("node-opcua-service-read");
const node_opcua_service_register_node_1 = require("node-opcua-service-register-node");
const node_opcua_service_subscription_1 = require("node-opcua-service-subscription");
const node_opcua_service_translate_browse_path_1 = require("node-opcua-service-translate-browse-path");
const node_opcua_service_write_1 = require("node-opcua-service-write");
const node_opcua_status_code_1 = require("node-opcua-status-code");
const node_opcua_types_1 = require("node-opcua-types");
const node_opcua_utils_1 = require("node-opcua-utils");
const node_opcua_variant_1 = require("node-opcua-variant");
const client_session_keepalive_manager_1 = require("../client_session_keepalive_manager");
const client_publish_engine_1 = require("./client_publish_engine");
const client_subscription_impl_1 = require("./client_subscription_impl");
const reconnection_1 = require("./reconnection/reconnection");
const helpAPIChange = process.env.DEBUG && process.env.DEBUG.match(/API/);
const debugLog = (0, node_opcua_debug_1.make_debugLog)(__filename);
const doDebug = (0, node_opcua_debug_1.checkDebugFlag)(__filename);
const warningLog = (0, node_opcua_debug_1.make_warningLog)(__filename);
const errorLog = (0, node_opcua_debug_1.make_errorLog)(__filename);
let pendingTransactionMessageDisplayed = false;
function coerceBrowseDescription(data) {
    if (typeof data === "string" || data instanceof node_opcua_nodeid_1.NodeId) {
        return coerceBrowseDescription({
            browseDirection: node_opcua_data_model_1.BrowseDirection.Forward,
            includeSubtypes: true,
            nodeClassMask: 0,
            nodeId: data,
            referenceTypeId: "HierarchicalReferences",
            resultMask: 63
        });
    }
    else {
        data.nodeId = (0, node_opcua_nodeid_1.resolveNodeId)(data.nodeId);
        data.referenceTypeId = data.referenceTypeId ? (0, node_opcua_nodeid_1.resolveNodeId)(data.referenceTypeId) : null;
        return new node_opcua_service_browse_1.BrowseDescription(data);
    }
}
function coerceReadValueId(node) {
    if (typeof node === "string" || node instanceof node_opcua_nodeid_1.NodeId) {
        return new node_opcua_service_read_1.ReadValueId({
            attributeId: node_opcua_service_read_1.AttributeIds.Value,
            dataEncoding: undefined, // {namespaceIndex: 0, name: undefined}
            indexRange: undefined,
            nodeId: (0, node_opcua_nodeid_1.resolveNodeId)(node)
        });
    }
    else {
        (0, node_opcua_assert_1.assert)(node instanceof Object);
        return new node_opcua_service_read_1.ReadValueId(node);
    }
}
const emptyUint32Array = new Uint32Array(0);
/**
 * @class ClientSession
 */
class ClientSessionImpl extends events_1.EventEmitter {
    constructor(client) {
        super();
        _ClientSessionImpl_instances.add(this);
        this.name = "";
        this.serverEndpoints = [];
        this.recursive_repair_detector = 0;
        this.serverCertificate = Buffer.alloc(0);
        this.sessionId = new node_opcua_nodeid_1.NodeId();
        this._closeEventHasBeenEmitted = false;
        this._client = client;
        this._publishEngine = null;
        this._closed = false;
        this._reconnecting = {
            reconnecting: false,
            pendingCallbacks: [],
            pendingTransactions: []
        };
        this.requestedMaxReferencesPerNode = 10000;
        this.lastRequestSentTime = new Date(1, 1, 1970);
        this.lastResponseReceivedTime = new Date(1, 1, 1970);
        this.timeout = 0;
    }
    getTransportSettings() {
        return this._client.getTransportSettings();
    }
    /**
     * the endpoint on which this session is operating
     * @property endpoint
     * @type {EndpointDescription}
     */
    get endpoint() {
        return this._client.endpoint;
    }
    get subscriptionCount() {
        return this._publishEngine ? this._publishEngine.subscriptionCount : 0;
    }
    get isReconnecting() {
        return this._client ? this._client.isReconnecting || this._reconnecting?.reconnecting : false;
    }
    resolveNodeId(nodeId) {
        return (0, node_opcua_nodeid_1.resolveNodeId)(nodeId);
    }
    getPublishEngine() {
        if (!this._publishEngine) {
            this._publishEngine = new client_publish_engine_1.ClientSidePublishEngine(this);
        }
        return this._publishEngine;
    }
    changeUser(userIdentityInfo, callback) {
        userIdentityInfo = userIdentityInfo || {
            type: node_opcua_types_1.UserTokenType.Anonymous
        };
        if (!this._client || !this.userIdentityInfo) {
            warningLog("changeUser: invalid session");
            return callback(null, node_opcua_status_code_1.StatusCodes.BadInternalError);
        }
        const old_userIdentity = this.userIdentityInfo;
        this._client._activateSession(this, userIdentityInfo, (err1, session2) => {
            if (err1) {
                this.userIdentityInfo = old_userIdentity;
                warningLog("activate session error = ", err1.message);
                return callback(null, node_opcua_status_code_1.StatusCodes.BadUserAccessDenied);
            }
            this.userIdentityInfo = userIdentityInfo;
            callback(null, node_opcua_status_code_1.StatusCodes.Good);
        });
    }
    /**
     * @internal
     * @param args
     */
    browse(...args) {
        const arg0 = args[0];
        const isArray = Array.isArray(arg0);
        const callback = args[1];
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        (0, node_opcua_assert_1.assert)(isFinite(this.requestedMaxReferencesPerNode));
        const nodesToBrowse = (isArray ? arg0 : [arg0]).map(coerceBrowseDescription);
        const request = new node_opcua_service_browse_1.BrowseRequest({
            nodesToBrowse,
            requestedMaxReferencesPerNode: this.requestedMaxReferencesPerNode
        });
        this.performMessageTransaction(request, (err, response) => {
            if (err) {
                return callback(err);
            }
            /* istanbul ignore next */
            if (!response || !(response instanceof node_opcua_service_browse_1.BrowseResponse)) {
                return callback(new Error("Internal Error"));
            }
            const results = response.results ? response.results : [];
            if (this.requestedMaxReferencesPerNode > 0) {
                for (let i = 0; i < results.length; i++) {
                    const r = results[i];
                    /* istanbul ignore next */
                    if (r.references && r.references.length > this.requestedMaxReferencesPerNode) {
                        warningLog(chalk_1.default.yellow("warning") +
                            " BrowseResponse : the server didn't take into" +
                            " account our requestedMaxReferencesPerNode ");
                        warningLog("        this.requestedMaxReferencesPerNode= " + this.requestedMaxReferencesPerNode);
                        warningLog("        got " + r.references.length + "for " + nodesToBrowse[i].nodeId.toString());
                        warningLog("        continuationPoint ", r.continuationPoint);
                    }
                }
            }
            for (const r of results) {
                r.references = r.references || /* istanbul ignore next */ [];
            }
            (0, node_opcua_assert_1.assert)(results[0] instanceof node_opcua_service_browse_1.BrowseResult);
            return callback(null, isArray ? results : results[0]);
        });
    }
    browseNext(...args) {
        const arg0 = args[0];
        const isArray = Array.isArray(arg0);
        const releaseContinuationPoints = args[1];
        const callback = args[2];
        (0, node_opcua_assert_1.assert)(typeof callback === "function", "expecting a callback function here");
        const continuationPoints = isArray ? arg0 : [arg0];
        const request = new node_opcua_types_1.BrowseNextRequest({
            continuationPoints,
            releaseContinuationPoints
        });
        this.performMessageTransaction(request, (err, response) => {
            /* istanbul ignore next */
            if (err) {
                return callback(err);
            }
            /* istanbul ignore next */
            if (!response || !(response instanceof node_opcua_types_1.BrowseNextResponse)) {
                return callback(new Error("Internal Error"));
            }
            const results = response.results ? response.results : [];
            for (const r of results) {
                r.references = r.references || [];
            }
            (0, node_opcua_assert_1.assert)(results[0] instanceof node_opcua_service_browse_1.BrowseResult);
            return callback(null, isArray ? results : results[0]);
        });
    }
    /**
     * @internal
     * @param args
     */
    readVariableValue(...args) {
        const callback = args[1];
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        const isArray = Array.isArray(args[0]);
        const nodes = isArray ? args[0] : [args[0]];
        const nodesToRead = nodes.map(coerceReadValueId);
        const request = new node_opcua_service_read_1.ReadRequest({
            nodesToRead,
            timestampsToReturn: node_opcua_service_read_1.TimestampsToReturn.Neither
        });
        this.performMessageTransaction(request, (err, response) => {
            /* istanbul ignore next */
            if (err) {
                return callback(err);
            }
            /* istanbul ignore next */
            if (!(response instanceof node_opcua_service_read_1.ReadResponse)) {
                return callback(new Error("Internal Error"));
            }
            /* istanbul ignore next */
            if (response.responseHeader.serviceResult.isNot(node_opcua_status_code_1.StatusCodes.Good)) {
                return callback(new Error(response.responseHeader.serviceResult.toString()));
            }
            /* istanbul ignore next */
            if (!response.results) {
                response.results = [];
            }
            (0, node_opcua_assert_1.assert)(nodes.length === response.results.length);
            callback(null, isArray ? response.results : response.results[0]);
        });
    }
    readHistoryValue(...args) {
        const startTime = args[1];
        const endTime = args[2];
        let options = {};
        let callback = args[3];
        if (typeof callback !== "function") {
            options = args[3];
            callback = args[4];
        }
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        // adjust parameters
        options.numValuesPerNode = options.numValuesPerNode || 0;
        options.returnBounds = options.returnBounds || options.returnBounds === undefined ? true : false;
        options.isReadModified = options.isReadModified || false;
        options.timestampsToReturn = options.timestampsToReturn || node_opcua_service_read_1.TimestampsToReturn.Both;
        const arg0 = args[0];
        const isArray = Array.isArray(arg0);
        const nodes = isArray ? arg0 : [arg0];
        const nodesToRead = [];
        for (const node of nodes) {
            if (!node.nodeId) {
                nodesToRead.push({
                    continuationPoint: undefined,
                    dataEncoding: undefined, // {namespaceIndex: 0, name: undefined},
                    indexRange: undefined,
                    nodeId: this.resolveNodeId(node)
                });
            }
            else {
                nodesToRead.push(node);
            }
        }
        const readRawModifiedDetails = new node_opcua_service_history_1.ReadRawModifiedDetails({
            endTime,
            isReadModified: false,
            numValuesPerNode: options.numValuesPerNode,
            returnBounds: options.returnBounds,
            startTime
        });
        const request = new node_opcua_service_history_1.HistoryReadRequest({
            historyReadDetails: readRawModifiedDetails,
            nodesToRead,
            releaseContinuationPoints: false,
            timestampsToReturn: options.timestampsToReturn
        });
        request.nodesToRead = request.nodesToRead || [];
        (0, node_opcua_assert_1.assert)(nodes.length === request.nodesToRead.length);
        this.historyRead(request, (err, response) => {
            /* istanbul ignore next */
            if (err) {
                return callback(err);
            }
            /* istanbul ignore next */
            if (!response || !(response instanceof node_opcua_service_history_1.HistoryReadResponse)) {
                return callback(new Error("Internal Error"));
            }
            response.results = response.results || [];
            (0, node_opcua_assert_1.assert)(nodes.length === response.results.length);
            callback(null, isArray ? response.results : response.results[0]);
        });
    }
    historyRead(request, callback) {
        /* istanbul ignore next */
        if (!callback) {
            throw new Error("expecting a callback");
        }
        this.performMessageTransaction(request, (err, response) => {
            /* istanbul ignore next */
            if (err) {
                return callback(err);
            }
            /* istanbul ignore next */
            if (!response || !(response instanceof node_opcua_service_history_1.HistoryReadResponse)) {
                return callback(new Error("Internal Error"));
            }
            if (response.responseHeader.serviceResult.isNot(node_opcua_status_code_1.StatusCodes.Good)) {
                return callback(new Error(response.responseHeader.serviceResult.toString()));
            }
            response.results = response.results || /* istanbul ignore next */ [];
            callback(null, response);
        });
    }
    readAggregateValue(arg0, startTime, endTime, aggregateFn, processingInterval, ...args) {
        const callback = typeof args[0] === "function" ? args[0] : args[1];
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        const defaultAggregateFunction = {
            percentDataBad: 100,
            percentDataGood: 100,
            treatUncertainAsBad: true,
            useServerCapabilitiesDefaults: true,
            useSlopedExtrapolation: false
        };
        const aggregateConfiguration = typeof args[0] === "function" ? defaultAggregateFunction : args[0];
        const isArray = Array.isArray(arg0);
        const nodesToRead = isArray
            ? arg0
            : [arg0];
        const aggregateFns = Array.isArray(aggregateFn)
            ? aggregateFn
            : [aggregateFn];
        (0, node_opcua_assert_1.assert)(aggregateFns.length === nodesToRead.length);
        const readProcessedDetails = new node_opcua_service_history_1.ReadProcessedDetails({
            aggregateType: aggregateFns,
            endTime,
            processingInterval,
            startTime,
            aggregateConfiguration
        });
        const request = new node_opcua_service_history_1.HistoryReadRequest({
            historyReadDetails: readProcessedDetails,
            nodesToRead,
            releaseContinuationPoints: false,
            timestampsToReturn: node_opcua_service_read_1.TimestampsToReturn.Both
        });
        (0, node_opcua_assert_1.assert)(nodesToRead.length === request.nodesToRead.length);
        this.performMessageTransaction(request, (err, response) => {
            /* istanbul ignore next */
            if (err) {
                return callback(err);
            }
            /* istanbul ignore next */
            if (!response || !(response instanceof node_opcua_service_history_1.HistoryReadResponse)) {
                return callback(new Error("Internal Error"));
            }
            if (response.responseHeader.serviceResult.isNot(node_opcua_status_code_1.StatusCodes.Good)) {
                return callback(new Error(response.responseHeader.serviceResult.toString()));
            }
            response.results = response.results || /* istanbul ignore next */ [];
            (0, node_opcua_assert_1.assert)(nodesToRead.length === response.results.length);
            callback(null, isArray ? response.results : response.results[0]);
        });
    }
    /**
     * @internal
     * @param args
     */
    write(...args) {
        const arg0 = args[0];
        const isArray = Array.isArray(arg0);
        const nodesToWrite = isArray ? arg0 : [arg0];
        const callback = args[1];
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        const request = new node_opcua_service_write_1.WriteRequest({ nodesToWrite });
        this.performMessageTransaction(request, (err, response) => {
            /* istanbul ignore next */
            if (err) {
                return callback(err, response);
            }
            /* istanbul ignore next */
            if (!response || !(response instanceof node_opcua_service_write_1.WriteResponse)) {
                return callback(new Error("Internal Error"));
            }
            /* istanbul ignore next */
            if (response.responseHeader.serviceResult.isNot(node_opcua_status_code_1.StatusCodes.Good)) {
                return callback(new Error(response.responseHeader.serviceResult.toString()));
            }
            response.results = response.results || /* istanbul ignore next */ [];
            (0, node_opcua_assert_1.assert)(nodesToWrite.length === response.results.length);
            callback(null, isArray ? response.results : response.results[0]);
        });
    }
    writeSingleNode(...args) {
        const nodeId = args[0];
        const value = args[1];
        const callback = args[2];
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        const nodeToWrite = new node_opcua_service_write_1.WriteValue({
            attributeId: node_opcua_service_read_1.AttributeIds.Value,
            indexRange: undefined,
            nodeId: this.resolveNodeId(nodeId),
            value: new node_opcua_data_value_1.DataValue({ value })
        });
        this.write(nodeToWrite, (err, statusCode) => {
            /* istanbul ignore next */
            if (err) {
                return callback(err);
            }
            (0, node_opcua_assert_1.assert)(statusCode);
            callback(null, statusCode);
        });
    }
    readAllAttributes(...args) {
        const nodes = args[0];
        const callback = args[1];
        (0, node_opcua_pseudo_session_1.readAllAttributes)(this, nodes)
            .then((data) => callback(null, data))
            .catch((err) => callback(err));
    }
    /**
     * @internal
     * @param args
     */
    read(...args) {
        if (args.length === 2) {
            return this.read(args[0], 0, args[1]);
        }
        (0, node_opcua_assert_1.assert)(args.length === 3);
        const isArray = Array.isArray(args[0]);
        const nodesToRead = isArray ? args[0] : [args[0]];
        (0, node_opcua_assert_1.assert)(Array.isArray(nodesToRead));
        const maxAge = args[1];
        const callback = args[2];
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        /* istanbul ignore next */
        if (helpAPIChange) {
            // the read method deprecation detection and warning
            if (!((0, node_opcua_utils_1.getFunctionParameterNames)(callback)[1] === "dataValues" || (0, node_opcua_utils_1.getFunctionParameterNames)(callback)[1] === "dataValue")) {
                warningLog(chalk_1.default.red("[NODE-OPCUA-E04] the ClientSession#read  API has changed !!, please fix the client code"));
                warningLog(chalk_1.default.red("   replace ..:"));
                warningLog(chalk_1.default.cyan("   session.read(nodesToRead,function(err,nodesToRead,results) {}"));
                warningLog(chalk_1.default.red("   with .... :"));
                warningLog(chalk_1.default.cyan("   session.read(nodesToRead,function(err,dataValues) {}"));
                warningLog("");
                warningLog(chalk_1.default.yellow("please make sure to refactor your code and check that " +
                    "the second argument of your callback function is named"), chalk_1.default.cyan("dataValue" + (isArray ? "s" : "")));
                warningLog(chalk_1.default.cyan("to make this exception disappear"));
                throw new Error("ERROR ClientSession#read  API has changed !!, please fix the client code");
            }
        }
        // coerce nodeIds
        for (const node of nodesToRead) {
            node.nodeId = this.resolveNodeId(node.nodeId);
        }
        const request = new node_opcua_service_read_1.ReadRequest({
            maxAge,
            nodesToRead,
            timestampsToReturn: node_opcua_service_read_1.TimestampsToReturn.Both
        });
        this.performMessageTransaction(request, (err, response) => {
            /* istanbul ignore next */
            if (err) {
                return callback(err, response);
            }
            /* istanbul ignore next */
            if (!response || !(response instanceof node_opcua_service_read_1.ReadResponse)) {
                return callback(new Error("Internal Error"));
            }
            // perform ExtensionObject resolution
            (0, node_opcua_client_dynamic_extension_object_1.promoteOpaqueStructure)(this, response.results).then(() => {
                response.results = response.results || /* istanbul ignore next */ [];
                callback(null, isArray ? response.results : response.results[0]);
            }).catch((err) => {
                callback(err);
            });
        });
    }
    emitCloseEvent(statusCode) {
        if (!this._closeEventHasBeenEmitted) {
            debugLog("ClientSession#emitCloseEvent");
            this._closeEventHasBeenEmitted = true;
            this.emit("session_closed", statusCode);
        }
    }
    createSubscription(options, callback) {
        this._defaultRequest(node_opcua_service_subscription_1.CreateSubscriptionRequest, node_opcua_service_subscription_1.CreateSubscriptionResponse, options, callback);
    }
    createSubscription2(...args) {
        const createSubscriptionRequest = args[0];
        let callback = args[1];
        const subscription = new client_subscription_impl_1.ClientSubscriptionImpl(this, createSubscriptionRequest);
        // tslint:disable-next-line:no-empty
        subscription.on("error", (err) => {
            if (callback) {
                callback(err);
                callback = null;
            }
        });
        subscription.on("started", () => {
            (0, node_opcua_assert_1.assert)(subscription.session === this, "expecting a session here");
            if (callback) {
                callback(null, subscription);
                callback = null;
            }
        });
    }
    deleteSubscriptions(options, callback) {
        this._defaultRequest(node_opcua_service_subscription_1.DeleteSubscriptionsRequest, node_opcua_service_subscription_1.DeleteSubscriptionsResponse, options, callback);
    }
    setTriggering(request, callback) {
        this._defaultRequest(node_opcua_service_subscription_1.SetTriggeringRequest, node_opcua_service_subscription_1.SetTriggeringResponse, request, callback);
    }
    /**
     */
    transferSubscriptions(options, callback) {
        this._defaultRequest(node_opcua_service_subscription_1.TransferSubscriptionsRequest, node_opcua_service_subscription_1.TransferSubscriptionsResponse, options, callback);
    }
    createMonitoredItems(options, callback) {
        this._defaultRequest(node_opcua_service_subscription_1.CreateMonitoredItemsRequest, node_opcua_service_subscription_1.CreateMonitoredItemsResponse, options, callback);
    }
    modifyMonitoredItems(options, callback) {
        this._defaultRequest(node_opcua_service_subscription_1.ModifyMonitoredItemsRequest, node_opcua_service_subscription_1.ModifyMonitoredItemsResponse, options, callback);
    }
    /**
     *
     */
    modifySubscription(options, callback) {
        this._defaultRequest(node_opcua_service_subscription_1.ModifySubscriptionRequest, node_opcua_service_subscription_1.ModifySubscriptionResponse, options, callback);
    }
    setMonitoringMode(options, callback) {
        this._defaultRequest(node_opcua_service_subscription_1.SetMonitoringModeRequest, node_opcua_service_subscription_1.SetMonitoringModeResponse, options, callback);
    }
    /**
     */
    publish(options, callback) {
        this._defaultRequest(node_opcua_service_subscription_1.PublishRequest, node_opcua_service_subscription_1.PublishResponse, options, callback);
    }
    /**
     *
     */
    republish(options, callback) {
        this._defaultRequest(node_opcua_service_subscription_1.RepublishRequest, node_opcua_service_subscription_1.RepublishResponse, options, callback);
    }
    /**
     *
     */
    deleteMonitoredItems(options, callback) {
        this._defaultRequest(node_opcua_service_subscription_1.DeleteMonitoredItemsRequest, node_opcua_service_subscription_1.DeleteMonitoredItemsResponse, options, callback);
    }
    /**
     * @internal
     */
    setPublishingMode(...args) {
        const publishingEnabled = args[0];
        const isArray = Array.isArray(args[1]);
        const subscriptionIds = isArray ? args[1] : [args[1]];
        const callback = args[2];
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        (0, node_opcua_assert_1.assert)(publishingEnabled === true || publishingEnabled === false);
        const options = new node_opcua_service_subscription_1.SetPublishingModeRequest({
            publishingEnabled,
            subscriptionIds
        });
        this._defaultRequest(node_opcua_service_subscription_1.SetPublishingModeRequest, node_opcua_service_subscription_1.SetPublishingModeResponse, options, (err, response) => {
            /* istanbul ignore next */
            if (err) {
                return callback(err);
            }
            /* istanbul ignore next */
            if (!response) {
                return callback(new Error("Internal Error"));
            }
            response.results = response.results || /* istanbul ignore next */ [];
            callback(err, isArray ? response.results : response.results[0]);
        });
    }
    /**
     * @internal
     * @param args
     */
    translateBrowsePath(...args) {
        const isArray = Array.isArray(args[0]);
        const browsePaths = isArray ? args[0] : [args[0]];
        const callback = args[1];
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        const request = new node_opcua_service_translate_browse_path_1.TranslateBrowsePathsToNodeIdsRequest({ browsePaths });
        this.performMessageTransaction(request, (err, response) => {
            /* istanbul ignore next */
            if (err) {
                return callback(err, response);
            }
            /* istanbul ignore next */
            if (!response || !(response instanceof node_opcua_service_translate_browse_path_1.TranslateBrowsePathsToNodeIdsResponse)) {
                return callback(new Error("Internal Error"));
            }
            response.results = response.results || /* istanbul ignore next */ [];
            callback(null, isArray ? response.results : response.results[0]);
        });
    }
    channelId() {
        return this._client !== null && this._client._secureChannel !== null && this._client._secureChannel.isOpened()
            ? this._client._secureChannel.channelId
            : -1;
    }
    isChannelValid() {
        /* istanbul ignore next */
        if (!this._client) {
            debugLog(chalk_1.default.red("Warning SessionClient is null ?"));
        }
        return this._client !== null && this._client._secureChannel !== null && this._client._secureChannel.isOpened();
    }
    performMessageTransaction(request, callback) {
        if (!this._client) {
            // session may have been closed by user ... but is still in used !!
            return callback(new Error("Session has been closed and should not be used to perform a transaction anymore"));
        }
        if (request instanceof node_opcua_service_subscription_1.PublishRequest ||
            request instanceof node_opcua_types_1.ActivateSessionRequest ||
            request instanceof node_opcua_types_1.CloseSessionRequest) {
            return this._performMessageTransaction(request, callback);
        }
        if (this._reconnecting.pendingTransactions.length > 0) {
            /* istanbul ignore next */
            if (this._reconnecting.pendingTransactions.length > 10) {
                if (!pendingTransactionMessageDisplayed) {
                    pendingTransactionMessageDisplayed = true;
                    warningLog("[NODE-OPCUA-W21]", "Pending transactions: ", this._reconnecting.pendingTransactions.map((a) => a.request.constructor.name).join(" "));
                    warningLog("[NODE-OPCUA-W22]", chalk_1.default.yellow("Warning : your opcua client is sending multiple requests simultaneously to the server", request.constructor.name), "\n", chalk_1.default.yellow(" please fix your application code"));
                }
            }
            else if (this._reconnecting.pendingTransactions.length > 3) {
                debugLog(chalk_1.default.yellow("Warning : your client is sending multiple requests simultaneously to the server", request.constructor.name));
            }
            this._reconnecting.pendingTransactions.push({ request, callback });
            return;
        }
        __classPrivateFieldGet(this, _ClientSessionImpl_instances, "m", _ClientSessionImpl_reprocessRequest).call(this, 0, request, callback);
    }
    ;
    _performMessageTransaction(request, callback) {
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        /* istanbul ignore next */
        if (!this._client) {
            // session may have been closed by user ... but is still in used !!
            return callback(new Error("Session has been closed and should not be used to perform a transaction anymore"));
        }
        if (!this.isChannelValid()) {
            // the secure channel is broken, may be the server has crashed or the network cable has been disconnected
            // for a long time
            // we may need to queue this transaction, as a secure token may be being reprocessed
            debugLog(chalk_1.default.bgWhite.red("!!! Performing transaction on invalid channel !!! ", request.constructor.name));
            return callback(new Error("Invalid Channel BadConnectionClosed"));
        }
        // is this stuff useful?
        if (request.requestHeader) {
            request.requestHeader.authenticationToken = this.authenticationToken;
        }
        this.lastRequestSentTime = new Date();
        this._client.performMessageTransaction(request, (err, response) => {
            this.lastResponseReceivedTime = new Date();
            /* istanbul ignore next */
            if (err) {
                if (response && response.responseHeader.serviceDiagnostics) {
                    err.serviceDiagnostics = response.responseHeader.serviceDiagnostics;
                }
                if (response && response.diagnosticInfos) {
                    err.diagnosticsInfo = response.diagnosticInfos;
                }
                return callback(err);
            }
            /* istanbul ignore next */
            if (!response) {
                return callback(new Error("internal Error"));
            }
            /* istanbul ignore next */
            if (response.responseHeader.serviceResult.isNot(node_opcua_status_code_1.StatusCodes.Good)) {
                err = new Error(" ServiceResult is " +
                    response.responseHeader.serviceResult.toString() +
                    " request was " +
                    request.constructor.name);
                if (response && response.responseHeader.serviceDiagnostics) {
                    err.serviceDiagnostics = response.responseHeader.serviceDiagnostics;
                }
                if (response && response.diagnosticInfos) {
                    err.diagnosticsInfo = response.diagnosticInfos;
                }
                return callback(err, response);
            }
            return callback(null, response);
        });
    }
    /**
     *  evaluate the remaining time for the session
     *
     *
     * evaluate the time in milliseconds that the session will live
     * on the server end from now.
     * The remaining live time is calculated based on when the last message was sent to the server
     * and the session timeout.
     *
     * * In normal operation , when server and client communicates on a regular
     *   basis, evaluateRemainingLifetime will return a number slightly below
     *   session.timeout
     *
     * * when the client and server cannot communicate due to a network issue
     *   (or a server crash), evaluateRemainingLifetime returns the estimated number
     *   of milliseconds before the server (if not crash) will keep  the session alive
     *   on its end to allow a automatic reconnection with session.
     *
     * * When evaluateRemainingLifetime returns zero , this mean that
     *   the session has probably ended on the server side and will have to be recreated
     *   from scratch in case of a reconnection.
     *
     * @return the number of milliseconds before session expires
     */
    evaluateRemainingLifetime() {
        const now = Date.now();
        const expiryTime = this.lastRequestSentTime.getTime() + this.timeout;
        return Math.max(0, expiryTime - now);
    }
    _terminatePublishEngine() {
        if (this._publishEngine) {
            this._publishEngine.terminate();
            this._publishEngine = null;
        }
    }
    /**
     * @internal
     * @param args
     */
    close(...args) {
        if (arguments.length === 1) {
            return this.close(true, args[0]);
        }
        const deleteSubscription = args[0];
        const callback = args[1];
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        (0, node_opcua_assert_1.assert)(typeof deleteSubscription === "boolean");
        /* istanbul ignore next */
        if (!this._client) {
            debugLog("ClientSession#close : warning, client is already closed");
            return callback(); // already close ?
        }
        (0, node_opcua_assert_1.assert)(this._client);
        this._terminatePublishEngine();
        this._client.closeSession(this, deleteSubscription, (err) => {
            debugLog("session Close err ", err ? err.message : "null");
            callback();
        });
    }
    /**

     * @return {Boolean}
     */
    hasBeenClosed() {
        return (0, node_opcua_utils_1.isNullOrUndefined)(this._client) || this._closed || this._closeEventHasBeenEmitted;
    }
    /**
     * @internal
     * @param args
     */
    call(...args) {
        const isArray = Array.isArray(args[0]);
        const methodsToCall = isArray ? args[0] : [args[0]];
        (0, node_opcua_assert_1.assert)(Array.isArray(methodsToCall));
        const callback = args[1];
        // Note : The client has no explicit address space and therefore will struggle to
        //        access the method arguments signature.
        //        There are two methods that can be considered:
        //           - get the object definition by querying the server
        //           - load a fake address space to have some thing to query on our end
        // const request = this._client.factory.constructObjectId("CallRequest",{ methodsToCall: methodsToCall});
        const request = new node_opcua_service_call_1.CallRequest({ methodsToCall });
        this.performMessageTransaction(request, (err, response) => {
            /* istanbul ignore next */
            if (err) {
                return callback(err);
            }
            /* istanbul ignore next */
            if (!response || !(response instanceof node_opcua_service_call_1.CallResponse)) {
                return callback(new Error("internal error"));
            }
            response.results = response.results || [];
            promoteOpaqueStructureForCall(this, response.results).then(() => {
                callback(null, isArray ? response.results : response.results[0]);
            }).catch((err) => {
                callback(err);
            });
        });
    }
    getMonitoredItems(...args) {
        const subscriptionId = args[0];
        const callback = args[1];
        // <UAObject NodeId="i=2253"  BrowseName="Server">
        // <UAMethod NodeId="i=11492" BrowseName="GetMonitoredItems"
        //                                         ParentNodeId="i=2253" MethodDeclarationId="i=11489">
        // <UAMethod NodeId="i=11489" BrowseName="GetMonitoredItems" ParentNodeId="i=2004">
        const methodsToCall = new node_opcua_service_call_1.CallMethodRequest({
            inputArguments: [
                // BaseDataType
                { dataType: node_opcua_variant_1.DataType.UInt32, value: subscriptionId }
            ],
            methodId: (0, node_opcua_nodeid_1.coerceNodeId)("ns=0;i=11492"), // MethodIds.Server_GetMonitoredItems;
            objectId: (0, node_opcua_nodeid_1.coerceNodeId)("ns=0;i=2253") // ObjectId.Server
        });
        this.call(methodsToCall, (err, result) => {
            /* istanbul ignore next */
            if (err) {
                return callback(err);
            }
            /* istanbul ignore next */
            if (!result) {
                return callback(new Error("internal error"));
            }
            /* istanbul ignore next */
            if (result.statusCode.isNot(node_opcua_status_code_1.StatusCodes.Good)) {
                callback(new Error(result.statusCode.toString()));
            }
            else {
                result.outputArguments = result.outputArguments || [];
                (0, node_opcua_assert_1.assert)(result.outputArguments.length === 2);
                const data = {
                    clientHandles: result.outputArguments[1].value,
                    serverHandles: result.outputArguments[0].value //
                };
                // Note some server might return null array
                // let make sure we have Uint32Array and not a null pointer
                data.serverHandles = data.serverHandles || /* istanbul ignore next */ emptyUint32Array;
                data.clientHandles = data.clientHandles || /* istanbul ignore next */ emptyUint32Array;
                (0, node_opcua_assert_1.assert)(data.serverHandles instanceof Uint32Array);
                (0, node_opcua_assert_1.assert)(data.clientHandles instanceof Uint32Array);
                callback(null, data);
            }
        });
    }
    /**
     * @internal
     */
    getArgumentDefinition(...args) {
        const methodId = args[0];
        const callback = args[1];
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        return (0, node_opcua_pseudo_session_1.getArgumentDefinitionHelper)(this, methodId)
            .then((result) => {
            callback(null, result);
        })
            .catch((err) => {
            callback(err);
        });
    }
    registerNodes(...args) {
        const nodesToRegister = args[0];
        const callback = args[1];
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        (0, node_opcua_assert_1.assert)(Array.isArray(nodesToRegister));
        const request = new node_opcua_service_register_node_1.RegisterNodesRequest({
            nodesToRegister: nodesToRegister.map((n) => this.resolveNodeId(n))
        });
        this.performMessageTransaction(request, (err, response) => {
            /* istanbul ignore next */
            if (err) {
                return callback(err);
            }
            /* istanbul ignore next */
            if (!response || !(response instanceof node_opcua_service_register_node_1.RegisterNodesResponse)) {
                return callback(new Error("Internal Error"));
            }
            response.registeredNodeIds = response.registeredNodeIds || /* istanbul ignore next */ [];
            callback(null, response.registeredNodeIds);
        });
    }
    unregisterNodes(...args) {
        const nodesToUnregister = args[0];
        const callback = args[1];
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        (0, node_opcua_assert_1.assert)(Array.isArray(nodesToUnregister));
        const request = new node_opcua_service_register_node_1.UnregisterNodesRequest({
            nodesToUnregister: nodesToUnregister.map((n) => this.resolveNodeId(n))
        });
        this.performMessageTransaction(request, (err, response) => {
            /* istanbul ignore next */
            if (err) {
                return callback(err);
            }
            /* istanbul ignore next */
            if (!response || !(response instanceof node_opcua_service_register_node_1.UnregisterNodesResponse)) {
                return callback(new Error("Internal Error"));
            }
            callback();
        });
    }
    queryFirst(...args) {
        const queryFirstRequest = args[0];
        const callback = args[1];
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        const request = new node_opcua_service_query_1.QueryFirstRequest(queryFirstRequest);
        this.performMessageTransaction(request, (err, response) => {
            /* istanbul ignore next */
            if (err) {
                return callback(err);
            }
            /* istanbul ignore next */
            if (!response || !(response instanceof node_opcua_service_query_1.QueryFirstResponse)) {
                return callback(new Error("internal error"));
            }
            callback(null, response);
        });
    }
    startKeepAliveManager(keepAliveInterval) {
        if (this._keepAliveManager) {
            //  "keepAliveManger already started"
            return;
        }
        this._keepAliveManager = new client_session_keepalive_manager_1.ClientSessionKeepAliveManager(this);
        this._keepAliveManager.on("failure", () => {
            /**
             * raised when a keep-alive request has failed on the session, may be the session has timeout
             * unexpectedly on the server side, may be the connection is broken.
             * @event keepalive_failure
             */
            this.emit("keepalive_failure");
        });
        this._keepAliveManager.on("keepalive", (state, count) => {
            /**
             * @event keepalive
             */
            this.emit("keepalive", state, count);
        });
        this._keepAliveManager.start(keepAliveInterval);
    }
    stopKeepAliveManager() {
        if (this._keepAliveManager) {
            this._keepAliveManager.stop();
            this._keepAliveManager = undefined;
        }
    }
    dispose() {
        (0, node_opcua_assert_1.assert)(this._closeEventHasBeenEmitted);
        this._terminatePublishEngine();
        this.stopKeepAliveManager();
        this.removeAllListeners();
        //
        const privateThis = this;
        if (!(!privateThis.pendingTransactions || privateThis.pendingTransactions.length === 0)) {
            // tslint:disable-next-line: no-console
            warningLog("dispose when pendingTransactions is not empty ");
        }
    }
    toString() {
        const now = Date.now();
        const lap1 = now - this.lastRequestSentTime.getTime();
        const lap2 = now - this.lastResponseReceivedTime.getTime();
        const timeoutDelay = this.timeout - lap1;
        const timeoutInfo = timeoutDelay < 0
            ? chalk_1.default.red(" expired since " + -timeoutDelay / 1000 + " seconds")
            : chalk_1.default.green(" timeout in " + timeoutDelay / 1000 + " seconds");
        let str = "";
        str += " name..................... " + this.name;
        str += "\n sessionId................ " + this.sessionId.toString();
        str += "\n authenticationToken...... " + (this.authenticationToken ? this.authenticationToken.toString() : "");
        str += "\n timeout.................. " + this.timeout + "ms" + timeoutInfo;
        str += "\n serverNonce.............. " + (this.serverNonce ? this.serverNonce.toString("hex") : "");
        str += "\n serverCertificate........ " + (0, node_opcua_utils_1.buffer_ellipsis)(this.serverCertificate);
        str += "\n serverSignature.......... " + this.serverSignature;
        str += "\n lastRequestSentTime...... " + new Date(this.lastRequestSentTime).toISOString() + "  (" + lap1 + ")";
        str += "\n lastResponseReceivedTime. " + new Date(this.lastResponseReceivedTime).toISOString() + " (" + lap2 + ")";
        str += "\n isReconnecting........... " + this.isReconnecting;
        str += "\n isValidChannel........... " + this.isChannelValid() + " has been closed  " + this.hasBeenClosed();
        str += "\n channelId................ " + this.channelId();
        str += "\n remaining life time...... " + this.evaluateRemainingLifetime();
        str += "\n subscription count....... " + this.subscriptionCount;
        if (this._client && this._client._secureChannel) {
            if (this._client._secureChannel.activeSecurityToken) {
                str += "\n reviseTokenLifetime...... " + this._client._secureChannel.activeSecurityToken.revisedLifetime;
            }
        }
        str += "\n keepAlive ................ " + this._keepAliveManager ? true : false;
        if (this._keepAliveManager) {
            str += "\n keepAlive checkInterval.. " + this._keepAliveManager.checkInterval + " ms";
            str += "\n (defaultTransportTimeout)." + node_opcua_secure_channel_1.ClientSecureChannelLayer.defaultTransportTimeout + " ms";
            str += "\n session timeout           " + this.timeout + " ms";
        }
        return str;
    }
    getBuiltInDataType(...args) {
        const nodeId = args[0];
        const callback = args[1];
        return (0, node_opcua_pseudo_session_1.getBuiltInDataType)(this, nodeId)
            .then((dataType) => callback(null, dataType))
            .catch(callback);
    }
    readNamespaceArray(...args) {
        const callback = args[0];
        (0, node_opcua_pseudo_session_1.readNamespaceArray)(this)
            .then((namespaceArray) => callback(null, namespaceArray))
            .catch((err) => {
            callback(err);
        });
    }
    getNamespaceIndex(namespaceUri) {
        (0, node_opcua_assert_1.assert)(this.$$namespaceArray, "please make sure that readNamespaceArray has been called");
        return this.$$namespaceArray.indexOf(namespaceUri);
    }
    // tslint:disable:no-empty
    // ---------------------------------------- Alarm & condition stub
    disableCondition() {
        /** empty */
    }
    enableCondition() {
        /** empty */
    }
    addCommentCondition(_conditionId, _eventId, _comment, _callback) {
        /** empty */
    }
    confirmCondition(_conditionId, _eventId, _comment, _callback) {
        /** empty */
    }
    acknowledgeCondition(_conditionId, _eventId, _comment, _callback) {
        /** empty */
    }
    /**
     * @deprecated
     * @private
     */
    findMethodId(_nodeId, _methodName, _callback) {
        /** empty */
    }
    _callMethodCondition(_methodName, _conditionId, _eventId, _comment, _callback) {
        /** empty */
    }
    async extractNamespaceDataType() {
        return (0, node_opcua_client_dynamic_extension_object_1.getExtraDataTypeManager)(this);
    }
    async getExtensionObjectConstructor(dataTypeNodeId) {
        return (0, node_opcua_client_dynamic_extension_object_1.getExtensionObjectConstructor)(this, dataTypeNodeId);
    }
    /**
     * construct a Extension object from a DataType and a pojo
     * @param dataType
     * @param pojo
     */
    async constructExtensionObject(dataType, pojo) {
        const Constructor = await this.getExtensionObjectConstructor(dataType);
        return new Constructor(pojo);
    }
    _defaultRequest(requestClass, _responseClass, options, callback) {
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        const request = options instanceof requestClass ? options : new requestClass(options);
        /* istanbul ignore next */
        if (doDebug) {
            request.trace = new Error("").stack;
        }
        /* istanbul ignore next */
        if (this._closeEventHasBeenEmitted) {
            debugLog("ClientSession#_defaultRequest => session has been closed !!", request.toString());
            setImmediate(() => {
                callback(new Error("ClientSession is closed !"));
            });
            return;
        }
        this.performMessageTransaction(request, (err, response) => {
            if (this._closeEventHasBeenEmitted) {
                debugLog("ClientSession#_defaultRequest ... err =", err ? err.message : "null", response ? response.toString() : " null");
            }
            /* istanbul ignore next */
            if (err) {
                debugLog("Client session : performMessageTransaction error = ", err.message);
                // let intercept interesting error message
                if (err.message.match(/BadSessionClosed/)) {
                    // the session has been closed by Server
                    // probably due to timeout issue
                    // let's print some statistics
                    const now = Date.now();
                    /* istanbul ignore next */
                    if (doDebug) {
                        debugLog(chalk_1.default.bgWhite.red(" server send BadSessionClosed !"));
                        debugLog(chalk_1.default.bgWhite.red(" request was               "), request.toString());
                        debugLog(" timeout.................. ", this.timeout);
                        debugLog(" lastRequestSentTime...... ", new Date(this.lastRequestSentTime).toISOString(), now - this.lastRequestSentTime.getTime());
                        debugLog(" lastResponseReceivedTime. ", new Date(this.lastResponseReceivedTime).toISOString(), now - this.lastResponseReceivedTime.getTime());
                    }
                    //  DO NOT TERMINATE SESSION, as we will need a publishEngine when we
                    //  reconnect this._terminatePublishEngine();
                    if (false) {
                        // ER 10.2019
                        /**
                         * send when the session has been closed by the server ( probably due to inactivity and timeout)
                         * @event session_closed
                         */
                        this.emitCloseEvent(node_opcua_status_code_1.StatusCodes.BadSessionClosed);
                    }
                }
                return callback(err, response);
            }
            callback(null, response);
        });
    }
}
exports.ClientSessionImpl = ClientSessionImpl;
_ClientSessionImpl_instances = new WeakSet(), _ClientSessionImpl_reprocessRequest = function _ClientSessionImpl_reprocessRequest(attemptCount, request, callback) {
    attemptCount > 0 &&
        warningLog("reprocessRequest => ", request.constructor.name, this._reconnecting.pendingTransactions.length);
    this._performMessageTransaction(request, (err, response) => {
        if (err && err.message.match(/BadSessionIdInvalid/) && request.constructor.name !== "ActivateSessionRequest") {
            warningLog("Transaction on Invalid Session ", request.constructor.name, err.message, "isReconnecting?=", this.isReconnecting, "q=", this._reconnecting.pendingTransactions.length);
            request.requestHeader.requestHandle = node_opcua_secure_channel_1.requestHandleNotSetValue;
            if (this.isReconnecting) {
                this.once("session_restored", () => {
                    warningLog("redoing", request.constructor.name, this.isReconnecting);
                    __classPrivateFieldGet(this, _ClientSessionImpl_instances, "m", _ClientSessionImpl_reprocessRequest).call(this, attemptCount + 1, request, callback);
                });
            }
            else {
                __classPrivateFieldGet(this, _ClientSessionImpl_instances, "m", _ClientSessionImpl__recreate_session_and_reperform_transaction).call(this, request, callback);
            }
            return;
        }
        callback(err, response);
        const length = this._reconnecting.pendingTransactions.length; // record length before callback is called !
        if (length > 0) {
            debugLog("reprocessRequest => ", this._reconnecting.pendingTransactions.length, " transaction(s) left in queue");
            // tslint:disable-next-line: no-shadowed-variable
            const { request, callback } = this._reconnecting.pendingTransactions.shift();
            __classPrivateFieldGet(this, _ClientSessionImpl_instances, "m", _ClientSessionImpl_reprocessRequest).call(this, 0, request, callback);
        }
    });
}, _ClientSessionImpl__recreate_session_and_reperform_transaction = function _ClientSessionImpl__recreate_session_and_reperform_transaction(request, callback) {
    warningLog("attempt to recreate session to reperform a transaction ", request.constructor.name);
    if (this.recursive_repair_detector >= 1) {
        // tslint:disable-next-line: no-console
        warningLog("recreate_session_and_reperform_transaction => Already in Progress");
        return callback(new Error("Cannot recreate session"));
    }
    this.recursive_repair_detector += 1;
    warningLog(chalk_1.default.red("----------------> Repairing Client Session as Server believes it is invalid now "));
    (0, reconnection_1.repair_client_session)(this._client, this, (err) => {
        this.recursive_repair_detector -= 1;
        if (err) {
            warningLog(chalk_1.default.red("----------------> session Repaired has failed with error", err.message));
            return callback(err);
        }
        warningLog(chalk_1.default.red("----------------> session Repaired, now redoing original transaction "));
        this._performMessageTransaction(request, callback);
    });
};
ClientSessionImpl.reconnectingElement = new WeakMap();
async function promoteOpaqueStructureForCallMethodResult(session, callMethodResult) {
    if (!callMethodResult || !callMethodResult.outputArguments || callMethodResult.outputArguments.length === 0) {
        return;
    }
    await (0, node_opcua_client_dynamic_extension_object_1.promoteOpaqueStructure)(session, callMethodResult.outputArguments.map((a) => ({ value: a })));
}
function countOpaqueStructures(callMethodResults) {
    const x = (a) => {
        if (a === null)
            return [];
        return a.map((value) => {
            return { value: value };
        });
    };
    const opaqueStructureCount = callMethodResults.reduce((prev, callMethodResult) => {
        return prev + (0, node_opcua_client_dynamic_extension_object_1.extractDataValueToPromote)(x(callMethodResult.outputArguments)).length;
    }, 0);
    return opaqueStructureCount;
}
async function promoteOpaqueStructureForCall(session, callMethodResults) {
    const opaqueStructureCount = countOpaqueStructures(callMethodResults);
    if (0 === opaqueStructureCount)
        return;
    // construct dataTypeManager if not already present
    await (0, node_opcua_client_dynamic_extension_object_1.getExtraDataTypeManager)(session);
    const promises = callMethodResults.map(async (x) => promoteOpaqueStructureForCallMethodResult(session, x));
    await Promise.all(promises);
}
// tslint:disable:no-var-requires
// tslint:disable:max-line-length
const thenify_ex_1 = require("thenify-ex");
const opts = { multiArgs: false };
ClientSessionImpl.prototype.browse = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.browse, opts);
ClientSessionImpl.prototype.browseNext = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.browseNext, opts);
ClientSessionImpl.prototype.readVariableValue = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.readVariableValue, opts);
ClientSessionImpl.prototype.readHistoryValue = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.readHistoryValue, opts);
ClientSessionImpl.prototype.readAggregateValue = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.readAggregateValue, opts);
ClientSessionImpl.prototype.historyRead = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.historyRead, opts);
ClientSessionImpl.prototype.write = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.write, opts);
ClientSessionImpl.prototype.writeSingleNode = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.writeSingleNode, opts);
ClientSessionImpl.prototype.readAllAttributes = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.readAllAttributes, opts);
ClientSessionImpl.prototype.read = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.read, opts);
ClientSessionImpl.prototype.createSubscription = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.createSubscription, opts);
ClientSessionImpl.prototype.createSubscription2 = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.createSubscription2, opts);
ClientSessionImpl.prototype.deleteSubscriptions = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.deleteSubscriptions, opts);
ClientSessionImpl.prototype.transferSubscriptions = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.transferSubscriptions, opts);
ClientSessionImpl.prototype.createMonitoredItems = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.createMonitoredItems, opts);
ClientSessionImpl.prototype.modifyMonitoredItems = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.modifyMonitoredItems, opts);
ClientSessionImpl.prototype.modifySubscription = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.modifySubscription, opts);
ClientSessionImpl.prototype.setTriggering = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.setTriggering, opts);
ClientSessionImpl.prototype.setMonitoringMode = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.setMonitoringMode, opts);
ClientSessionImpl.prototype.publish = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.publish, opts);
ClientSessionImpl.prototype.republish = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.republish, opts);
ClientSessionImpl.prototype.deleteMonitoredItems = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.deleteMonitoredItems, opts);
ClientSessionImpl.prototype.setPublishingMode = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.setPublishingMode, opts);
ClientSessionImpl.prototype.translateBrowsePath = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.translateBrowsePath, opts);
ClientSessionImpl.prototype.performMessageTransaction = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.performMessageTransaction, opts);
ClientSessionImpl.prototype.close = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.close, opts);
ClientSessionImpl.prototype.call = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.call, opts);
ClientSessionImpl.prototype.getMonitoredItems = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.getMonitoredItems, opts);
ClientSessionImpl.prototype.getArgumentDefinition = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.getArgumentDefinition, opts);
ClientSessionImpl.prototype.queryFirst = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.queryFirst, opts);
ClientSessionImpl.prototype.registerNodes = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.registerNodes, opts);
ClientSessionImpl.prototype.unregisterNodes = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.unregisterNodes, opts);
ClientSessionImpl.prototype.readNamespaceArray = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.readNamespaceArray, opts);
ClientSessionImpl.prototype.getBuiltInDataType = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.getBuiltInDataType, opts);
ClientSessionImpl.prototype.changeUser = (0, thenify_ex_1.withCallback)(ClientSessionImpl.prototype.changeUser, opts);
//# sourceMappingURL=client_session_impl.js.map