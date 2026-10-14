"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientMonitoredItemToolbox = void 0;
/**
 * @module node-opcua-client
 */
const chalk_1 = __importDefault(require("chalk"));
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_service_subscription_1 = require("node-opcua-service-subscription");
const debugLog = (0, node_opcua_debug_1.make_debugLog)(__filename);
const doDebug = (0, node_opcua_debug_1.checkDebugFlag)(__filename);
/**
 * @internal
 */
class ClientMonitoredItemToolbox {
    static _toolbox_monitor(subscription, timestampsToReturn, monitoredItems, done) {
        (0, node_opcua_assert_1.assert)(typeof done === "function");
        const itemsToCreate = [];
        for (const monitoredItem of monitoredItems) {
            const monitoredItemI = monitoredItem;
            const itemToCreate = monitoredItemI._prepare_for_monitoring();
            if (typeof itemToCreate.error === "string") {
                return done(new Error(itemToCreate.error));
            }
            itemsToCreate.push(itemToCreate);
        }
        const createMonitorItemsRequest = new node_opcua_service_subscription_1.CreateMonitoredItemsRequest({
            itemsToCreate,
            subscriptionId: subscription.subscriptionId,
            timestampsToReturn
        });
        for (let i = 0; i < monitoredItems.length; i++) {
            const monitoredItem = monitoredItems[i];
            monitoredItem._before_create();
        }
        const session = subscription.session;
        (0, node_opcua_assert_1.assert)(session, "expecting a valid session attached to the subscription ");
        session.createMonitoredItems(createMonitorItemsRequest, (err, response) => {
            /* istanbul ignore next */
            if (err) {
                debugLog(chalk_1.default.red("ClientMonitoredItemBase#_toolbox_monitor:  ERROR in createMonitoredItems ", err.message));
            }
            else {
                /* istanbul ignore next */
                if (!response) {
                    return done(new Error("Internal Error"));
                }
                response.results = response.results || [];
                for (let i = 0; i < response.results.length; i++) {
                    const monitoredItemResult = response.results[i];
                    const monitoredItem = monitoredItems[i];
                    monitoredItem._after_create(monitoredItemResult);
                }
            }
            done(err ? err : undefined);
        });
    }
    static _toolbox_modify(subscription, monitoredItems, parameters, timestampsToReturn, callback) {
        (0, node_opcua_assert_1.assert)(callback === undefined || typeof callback === "function");
        const itemsToModify = monitoredItems.map((monitoredItem) => {
            const clientHandle = monitoredItem.monitoringParameters.clientHandle;
            (0, node_opcua_assert_1.assert)(clientHandle !== 4294967295);
            return new node_opcua_service_subscription_1.MonitoredItemModifyRequest({
                monitoredItemId: monitoredItem.monitoredItemId,
                requestedParameters: {
                    ...parameters,
                    clientHandle
                }
            });
        });
        const modifyMonitoredItemsRequest = new node_opcua_service_subscription_1.ModifyMonitoredItemsRequest({
            itemsToModify,
            subscriptionId: subscription.subscriptionId,
            timestampsToReturn
        });
        const session = subscription.session;
        (0, node_opcua_assert_1.assert)(session, "expecting a valid session attached to the subscription ");
        session.modifyMonitoredItems(modifyMonitoredItemsRequest, (err, response) => {
            /* istanbul ignore next */
            if (err) {
                return callback(err);
            }
            if (!response || !(response instanceof node_opcua_service_subscription_1.ModifyMonitoredItemsResponse)) {
                return callback(new Error("internal error"));
            }
            response.results = response.results || [];
            (0, node_opcua_assert_1.assert)(response.results.length === monitoredItems.length);
            const res = response.results[0];
            /* istanbul ignore next */
            if (response.results.length === 1 && res.statusCode.isNotGood()) {
                return callback(new Error("Error" + res.statusCode.toString()));
            }
            callback(null, response.results);
        });
    }
    static _toolbox_setMonitoringMode(subscription, monitoredItems, monitoringMode, callback) {
        const monitoredItemIds = monitoredItems.map((monitoredItem) => monitoredItem.monitoredItemId);
        const setMonitoringModeRequest = {
            monitoredItemIds,
            monitoringMode,
            subscriptionId: subscription.subscriptionId
        };
        const session = subscription.session;
        (0, node_opcua_assert_1.assert)(session, "expecting a valid session attached to the subscription ");
        session.setMonitoringMode(setMonitoringModeRequest, (err, response) => {
            if (err) {
                return callback(err);
            }
            monitoredItems.forEach((monitoredItem) => {
                monitoredItem.monitoringMode = monitoringMode;
            });
            response = response;
            response.results = response.results || [];
            callback(null, response.results);
        });
    }
}
exports.ClientMonitoredItemToolbox = ClientMonitoredItemToolbox;
//# sourceMappingURL=client_monitored_item_toolbox.js.map