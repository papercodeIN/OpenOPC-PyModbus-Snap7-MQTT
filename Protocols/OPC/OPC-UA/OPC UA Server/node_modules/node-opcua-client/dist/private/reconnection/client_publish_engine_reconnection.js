"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.republish = republish;
const util_1 = require("util");
const async_1 = __importDefault(require("async"));
const chalk_1 = __importDefault(require("chalk"));
const node_opcua_assert_1 = __importDefault(require("node-opcua-assert"));
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_status_code_1 = require("node-opcua-status-code");
const node_opcua_types_1 = require("node-opcua-types");
const client_subscription_reconnection_1 = require("./client_subscription_reconnection");
const reconnection_1 = require("./reconnection");
const debugLog = (0, node_opcua_debug_1.make_debugLog)("RECONNECTION");
const doDebug = (0, node_opcua_debug_1.checkDebugFlag)("RECONNECTION");
function _republish(engine, subscription, callback) {
    let isDone = false;
    const session = engine.session;
    const sendRepublishFunc = (callback2) => {
        (0, node_opcua_assert_1.default)(isFinite(subscription.lastSequenceNumber) && subscription.lastSequenceNumber + 1 >= 0);
        const request = new node_opcua_types_1.RepublishRequest({
            retransmitSequenceNumber: subscription.lastSequenceNumber + 1,
            subscriptionId: subscription.subscriptionId
        });
        // istanbul ignore next
        if (doDebug) {
            // istanbul ignore next
            debugLog(chalk_1.default.bgCyan.yellow.bold(" republish Request for subscription"), request.subscriptionId, " retransmitSequenceNumber=", request.retransmitSequenceNumber);
        }
        if (!session || session._closeEventHasBeenEmitted) {
            debugLog("ClientPublishEngine#_republish aborted ");
            // has  client been disconnected in the mean time ?
            isDone = true;
            return callback2();
        }
        session.republish(request, (err, response) => {
            const statusCode = err ? node_opcua_status_code_1.StatusCodes.Bad : response.responseHeader.serviceResult;
            if (!err && (statusCode.equals(node_opcua_status_code_1.StatusCodes.Good) || statusCode.equals(node_opcua_status_code_1.StatusCodes.BadMessageNotAvailable))) {
                // reprocess notification message  and keep going
                if (statusCode.equals(node_opcua_status_code_1.StatusCodes.Good)) {
                    subscription.onNotificationMessage(response.notificationMessage);
                }
            }
            else {
                if (!err) {
                    err = new Error(response.responseHeader.serviceResult.toString());
                }
                debugLog(" _send_republish ends with ", err.message);
                isDone = true;
            }
            callback2(err ? err : undefined);
        });
    };
    const sendRepublishUntilDone = () => {
        async_1.default.whilst((cb) => cb(null, !isDone), sendRepublishFunc, ((err) => {
            debugLog("nbPendingPublishRequest = ", engine.nbPendingPublishRequests);
            debugLog(" _republish ends with ", err ? err.message : "null");
            callback(err);
        }) // Wait for @type/async bug to be fixed !
        );
    };
    setImmediate(sendRepublishUntilDone);
}
function __askSubscriptionRepublish(engine, subscription, callback) {
    _republish(engine, subscription, (err) => {
        // prettier-ignore
        {
            const _err = (0, reconnection_1._shouldNotContinue2)(subscription);
            if (_err) {
                return callback(_err);
            }
        }
        (0, node_opcua_assert_1.default)(!err || util_1.types.isNativeError(err));
        debugLog("__askSubscriptionRepublish--------------------- err =", err ? err.message : null);
        if (err && err.message.match(/BadSessionInvalid/)) {
            // _republish failed because session is not valid anymore on server side.
            return callback(err);
        }
        if (err && err.message.match(/SubscriptionIdInvalid/)) {
            // _republish failed because subscriptionId is not valid anymore on server side.
            //
            // This could happen when the subscription has timed out and has been deleted by server
            // Subscription may time out if the duration of the connection break exceed the max life time
            // of the subscription.
            //
            // In this case, Client must recreate a subscription and recreate monitored item without altering
            // the event handlers
            //
            debugLog(chalk_1.default.bgWhite.red("__askSubscriptionRepublish failed " + " subscriptionId is not valid anymore on server side."));
            return (0, client_subscription_reconnection_1.recreateSubscriptionAndMonitoredItem)(subscription).then(() => callback()).catch(err => callback(err));
        }
        if (err && err.message.match(/|MessageNotAvailable/)) {
            // start engine and start monitoring
        }
        callback();
    });
}
function republish(engine, callback) {
    // After re-establishing the connection the Client shall call Republish in a loop, starting with
    // the next expected sequence number and incrementing the sequence number until the Server returns
    // the status BadMessageNotAvailable.
    // After receiving this status, the Client shall start sending Publish requests with the normal Publish
    // handling.
    // This sequence ensures that the lost NotificationMessages queued in the Server are not overwritten
    // by newPublish responses
    /**
     * call Republish continuously until all Notification messages of
     * un-acknowledged notifications are reprocessed.
     */
    const askSubscriptionRepublish = (subscription, subscriptionId, innerCallback) => {
        __askSubscriptionRepublish(engine, subscription, innerCallback);
    };
    async_1.default.forEachOf(engine.subscriptionMap, askSubscriptionRepublish, callback);
}
//# sourceMappingURL=client_publish_engine_reconnection.js.map