"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recreateSubscriptionAndMonitoredItem = recreateSubscriptionAndMonitoredItem;
const util_1 = require("util");
const node_opcua_assert_1 = __importDefault(require("node-opcua-assert"));
const node_opcua_data_value_1 = require("node-opcua-data-value");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_pki_1 = require("node-opcua-pki");
const node_opcua_types_1 = require("node-opcua-types");
const node_opcua_pseudo_session_1 = require("node-opcua-pseudo-session");
const client_subscription_impl_1 = require("../client_subscription_impl");
const reconnection_1 = require("./reconnection");
const debugLog = (0, node_opcua_debug_1.make_debugLog)("RECONNECTION");
const doDebug = (0, node_opcua_debug_1.checkDebugFlag)("RECONNECTION");
async function createMonitoredItemsAndRespectOperationalLimits(session, createMonitorItemsRequest) {
    const operationalLimits = await (0, node_opcua_pseudo_session_1.readOperationLimits)(session);
    const createMonitoredItemResponse = await (0, node_opcua_pseudo_session_1.createMonitoredItemsLimit)(operationalLimits.maxMonitoredItemsPerCall || 0, session, createMonitorItemsRequest);
    return createMonitoredItemResponse;
}
async function adjustMonitoredItemNodeIds(subscription, oldMonitoredItems) {
    // to Do 
}
/**
 *  utility function to recreate new subscription

 */
async function recreateSubscriptionAndMonitoredItem(_subscription) {
    debugLog("recreateSubscriptionAndMonitoredItem", _subscription.subscriptionId.toString());
    const subscription = _subscription;
    if (subscription.subscriptionId === client_subscription_impl_1.TERMINATED_SUBSCRIPTION_ID) {
        debugLog("Subscription is not in a valid state");
        return;
    }
    const oldMonitoredItems = subscription.monitoredItems;
    const oldSubscriptionId = subscription.subscriptionId;
    subscription.publishEngine.unregisterSubscription(oldSubscriptionId);
    await (0, util_1.promisify)(client_subscription_impl_1.__create_subscription)(subscription);
    const _err = (0, reconnection_1._shouldNotContinue)(subscription.session);
    if (_err) {
        throw _err;
    }
    const test = subscription.publishEngine.getSubscription(subscription.subscriptionId);
    debugLog("recreating ", Object.keys(oldMonitoredItems).length, " monitored Items");
    // re-create monitored items
    const itemsToCreate = [];
    await adjustMonitoredItemNodeIds(subscription, oldMonitoredItems);
    for (const monitoredItem of Object.values(oldMonitoredItems)) {
        (0, node_opcua_assert_1.default)(monitoredItem.monitoringParameters.clientHandle > 0);
        itemsToCreate.push({
            itemToMonitor: monitoredItem.itemToMonitor,
            monitoringMode: monitoredItem.monitoringMode,
            requestedParameters: monitoredItem.monitoringParameters
        });
    }
    const createMonitorItemsRequest = new node_opcua_types_1.CreateMonitoredItemsRequest({
        itemsToCreate,
        subscriptionId: subscription.subscriptionId,
        timestampsToReturn: node_opcua_data_value_1.TimestampsToReturn.Both // this.timestampsToReturn,
    });
    const session = subscription.session;
    // istanbul ignore next
    if (!session) {
        throw new Error("no session");
    }
    debugLog("Recreating ", itemsToCreate.length, " monitored items");
    const response = await createMonitoredItemsAndRespectOperationalLimits(session, createMonitorItemsRequest);
    const monitoredItemResults = response.results || [];
    let _errCount = 0;
    monitoredItemResults.forEach((monitoredItemResult, index) => {
        const itemToCreate = itemsToCreate[index];
        /* istanbul ignore next */
        if (!itemToCreate || !itemToCreate.requestedParameters) {
            _errCount++;
            return;
        }
        const clientHandle = itemToCreate.requestedParameters.clientHandle;
        /* istanbul ignore next */
        if (!clientHandle) {
            _errCount++;
            return;
        }
        const monitoredItem = subscription.monitoredItems[clientHandle];
        if (monitoredItem) {
            monitoredItem._applyResult(monitoredItemResult);
        }
        else {
            _errCount++;
            (0, node_opcua_pki_1.warningLog)("cannot find monitored item for clientHandle !:", clientHandle);
            (0, node_opcua_pki_1.warningLog)("itemsToCreate = ", itemsToCreate[index].toString());
        }
    });
    if (_errCount > 0) {
        (0, node_opcua_pki_1.warningLog)("Warning: some monitored items have not been recreated properly");
    }
}
//# sourceMappingURL=client_subscription_reconnection.js.map