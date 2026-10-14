"use strict";
/**
 * @module node-opcua-client-private
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._shouldNotContinue = _shouldNotContinue;
exports._shouldNotContinue2 = _shouldNotContinue2;
exports.repair_client_session = repair_client_session;
exports.repair_client_sessions = repair_client_sessions;
// tslint:disable:only-arrow-functions
const async_1 = __importDefault(require("async"));
const chalk_1 = __importDefault(require("chalk"));
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_service_subscription_1 = require("node-opcua-service-subscription");
const node_opcua_status_code_1 = require("node-opcua-status-code");
const node_opcua_types_1 = require("node-opcua-types");
const node_opcua_client_dynamic_extension_object_1 = require("node-opcua-client-dynamic-extension-object");
const client_publish_engine_reconnection_1 = require("./client_publish_engine_reconnection");
const client_subscription_reconnection_1 = require("./client_subscription_reconnection");
const debugLog = (0, node_opcua_debug_1.make_debugLog)("RECONNECTION");
const doDebug = (0, node_opcua_debug_1.checkDebugFlag)("RECONNECTION");
const errorLog = (0, node_opcua_debug_1.make_errorLog)("RECONNECTION");
const warningLog = (0, node_opcua_debug_1.make_warningLog)("RECONNECTION");
function _shouldNotContinue3(client) {
    if (!client._secureChannel) {
        return new Error("Failure during reconnection : client or session is not usable anymore");
    }
    return null;
}
function _shouldNotContinue(session) {
    if (!session._client || session.hasBeenClosed() || !session._client._secureChannel || session._client.isUnusable()) {
        return new Error("Failure during reconnection : client or session is not usable anymore");
    }
    return null;
}
function _shouldNotContinue2(subscription) {
    if (!subscription.hasSession) {
        return new Error("Failure during reconnection : client or session is not usable anymore");
    }
    return _shouldNotContinue(subscription.session);
}
//
// a new secure channel has be created, we need to reactivate the corresponding session,
// and reestablish the subscription and restart the publish engine.
//
//
// see OPC UA part 4 ( version 1.03 ) figure 34 page 106
// 6.5 Reestablishing subscription....
//
//
//
//                      +---------------------+
//                      | CreateSecureChannel |
//                      | CreateSession       |
//                      | ActivateSession     |
//                      +---------------------+
//                                |
//                                |
//                                v
//                      +---------------------+
//                      | CreateSubscription  |<-------------------------------------------------------------+
//                      +---------------------+                                                              |
//                                |                                                                         (1)
//                                |
//                                v
//                      +---------------------+
//     (2)------------->| StartPublishEngine  |
//                      +---------------------+
//                                |
//                                V
//                      +---------------------+
//             +------->| Monitor Connection  |
//             |        +---------------------+
//             |                    |
//             |                    v
//             |          Good    /   \
//             +-----------------/ SR? \______Broken_____+
//                               \     /                 |
//                                \   /                  |
//                                                       |
//                                                       v
//                                                 +---------------------+
//                                                 |                     |
//                                                 | CreateSecureChannel |<-----+
//                                                 |                     |      |
//                                                 +---------------------+      |
//                                                         |                    |
//                                                         v                    |
//                                                       /   \                  |
//                                                      / SR? \______Bad________+
//                                                      \     /
//                                                       \   /
//                                                         |
//                                                         |Good
//                                                         v
//                                                 +---------------------+
//                                                 |                     |
//                                                 | ActivateSession     |
//                                                 |                     |
//                                                 +---------------------+
//                                                         |
//                                  +----------------------+
//                                  |
//                                  v                    +-------------------+       +----------------------+
//                                /   \                  | CreateSession     |       |                      |
//                               / SR? \______Bad_______>| ActivateSession   |-----> | TransferSubscription |
//                               \     /                 |                   |       |                      |       (1)
//                                \   /                  +-------------------+       +----------------------+        ^
//                                  | Good                                                      |                    |
//                                  v   (for each subscription)                                 |                    |
//                          +--------------------+                                            /   \                  |
//                          |                    |                                     OK    / OK? \______Bad________+
//                          | RePublish          |<----------------------------------------- \     /
//                      +-->|                    |                                            \   /
//                      |   +--------------------+
//                      |           |
//                      |           v
//                      | GOOD    /   \
//                      +------  / SR? \______Bad SubscriptionInvalidId______>(1)
// (2)                           \     /
//  ^                             \   /
//  |                               |
//  |                               |
//  |      BadMessageNotAvailable   |
//  +-------------------------------+
function _ask_for_subscription_republish(session, callback) {
    // prettier-ignore
    {
        const err = _shouldNotContinue(session);
        if (err) {
            return callback(err);
        }
    }
    doDebug && debugLog(chalk_1.default.bgCyan.yellow.bold("_ask_for_subscription_republish "));
    // assert(session.getPublishEngine().nbPendingPublishRequests === 0,
    //   "at this time, publish request queue shall still be empty");
    const engine = session.getPublishEngine();
    (0, client_publish_engine_reconnection_1.republish)(engine, (err) => {
        doDebug && debugLog("_ask_for_subscription_republish :  republish sent");
        // prettier-ignore
        {
            const err = _shouldNotContinue(session);
            if (err) {
                return callback(err);
            }
        }
        doDebug && debugLog(chalk_1.default.bgCyan.green.bold("_ask_for_subscription_republish done "), err ? err.message : "OK");
        if (err) {
            warningLog("republish has failed with error :", err.message);
            doDebug && debugLog("_ask_for_subscription_republish has :  recreating subscription");
            return repair_client_session_by_recreating_a_new_session(session._client, session, callback);
        }
        callback(err);
    });
}
function create_session_and_repeat_if_failed(client, session, callback) {
    // prettier-ignore
    {
        const err = _shouldNotContinue(session);
        if (err) {
            return callback(err);
        }
    }
    doDebug && debugLog(chalk_1.default.bgWhite.red("    => creating a new session ...."));
    // create new session, based on old session,
    // so we can reuse subscriptions data
    client.__createSession_step2(session, (err, session1) => {
        // prettier-ignore
        {
            const err = _shouldNotContinue(session);
            if (err) {
                return callback(err);
            }
        }
        if (!err && session1) {
            (0, node_opcua_assert_1.assert)(session === session1, "session should have been recycled");
            callback(err, session);
            return;
        }
        else {
            doDebug && debugLog("Cannot complete subscription republish err = ", err?.message);
            callback(err);
        }
    });
}
function repair_client_session_by_recreating_a_new_session(client, session, callback) {
    // prettier-ignore
    {
        const err = _shouldNotContinue(session);
        if (err) {
            return callback(err);
        }
    }
    // As we don"t know if server has been rebooted or not,
    // and may be upgraded in between, we have to invalidate the extra data type manager
    (0, node_opcua_client_dynamic_extension_object_1.invalidateExtraDataTypeManager)(session);
    // istanbul ignore next
    if (doDebug) {
        debugLog(" repairing client session by_recreating a new session for old session ", session.sessionId.toString());
    }
    let newSession;
    const listenerCountBefore = session.listenerCount("");
    function recreateSubscription(subscriptionsToRecreate, innerCallback) {
        async_1.default.forEach(subscriptionsToRecreate, (subscriptionId, next) => {
            // prettier-ignore
            {
                const err = _shouldNotContinue(session);
                if (err) {
                    return next(err);
                }
            }
            if (!session.getPublishEngine().hasSubscription(subscriptionId)) {
                doDebug && debugLog(chalk_1.default.red("          => CANNOT RECREATE SUBSCRIPTION  "), subscriptionId);
                return next();
            }
            const subscription = session.getPublishEngine().getSubscription(subscriptionId);
            doDebug && debugLog(chalk_1.default.red("          => RECREATING SUBSCRIPTION  "), subscriptionId);
            (0, node_opcua_assert_1.assert)(subscription.session === newSession, "must have the new session");
            (0, client_subscription_reconnection_1.recreateSubscriptionAndMonitoredItem)(subscription)
                .then(() => {
                doDebug &&
                    debugLog(chalk_1.default.cyan("          => RECREATING SUBSCRIPTION  AND MONITORED ITEM DONE subscriptionId="), subscriptionId);
                next();
            })
                .catch((err) => {
                doDebug && debugLog("_recreateSubscription failed !" + err.message);
                next();
            });
        }, (err1) => {
            // prettier-ignore
            {
                const err = _shouldNotContinue(session);
                if (err) {
                    return innerCallback(err);
                }
            }
            if (!err1) {
                // prettier-ignore
            }
            innerCallback(err1);
        });
    }
    async_1.default.series([
        function suspend_old_session_publish_engine(innerCallback) {
            // prettier-ignore
            {
                const err = _shouldNotContinue(session);
                if (err) {
                    return innerCallback(err);
                }
            }
            // istanbul ignore next
            doDebug && debugLog(chalk_1.default.bgWhite.red("    => suspend old session publish engine...."));
            session.getPublishEngine().suspend(true);
            innerCallback();
        },
        function create_new_session(innerCallback) {
            create_session_and_repeat_if_failed(client, session, (err, _newSession) => {
                // prettier-ignore
                {
                    const err = _shouldNotContinue(session);
                    if (err) {
                        return innerCallback(err);
                    }
                }
                if (_newSession) {
                    newSession = _newSession;
                }
                innerCallback(err || undefined);
            });
        },
        function activate_new_session(innerCallback) {
            // prettier-ignore
            {
                const err = _shouldNotContinue(session);
                if (err) {
                    return innerCallback(err);
                }
            }
            doDebug && debugLog(chalk_1.default.bgWhite.red("    => activating a new session ...."));
            client._activateSession(newSession, newSession.userIdentityInfo, (err, session1) => {
                // istanbul ignore next
                doDebug && debugLog("    =>  activating a new session .... Done err=", err ? err.message : "null");
                if (err) {
                    doDebug &&
                        debugLog("reactivation of the new session has failed: let be smart and close it before failing this repair attempt");
                    // but just on the server side, not on the client side
                    const closeSessionRequest = new node_opcua_types_1.CloseSessionRequest({
                        requestHeader: {
                            authenticationToken: newSession.authenticationToken
                        },
                        deleteSubscriptions: true
                    });
                    newSession._client.performMessageTransaction(closeSessionRequest, (err2) => {
                        if (err2) {
                            warningLog("closing session", err2.message);
                        }
                        // istanbul ignore next
                        doDebug && debugLog("the temporary replacement session is now closed");
                        // istanbul ignore next
                        doDebug && debugLog(" err ", err.message, "propagated upwards");
                        innerCallback(err);
                    });
                }
                else {
                    innerCallback(err ? err : undefined);
                }
            });
        },
        function beforeSubscriptionRepair(innerCallback) {
            if (!client.beforeSubscriptionRecreate) {
                innerCallback();
                return;
            }
            client
                .beforeSubscriptionRecreate(newSession)
                .then((err) => {
                {
                    const err = _shouldNotContinue(session);
                    if (err) {
                        return innerCallback(err);
                    }
                }
                if (!err) {
                    innerCallback();
                }
                else {
                    innerCallback(err);
                }
            })
                .catch((err) => {
                innerCallback(err);
            });
        },
        function attempt_subscription_transfer(innerCallback) {
            // prettier-ignore
            {
                const err = _shouldNotContinue(session);
                if (err) {
                    return innerCallback(err);
                }
            }
            // get the old subscriptions id from the old session
            const subscriptionsIds = session.getPublishEngine().getSubscriptionIds();
            doDebug && debugLog("  session subscriptionCount = ", newSession.getPublishEngine().subscriptionCount);
            if (subscriptionsIds.length === 0) {
                doDebug && debugLog(" No subscriptions => skipping transfer subscriptions");
                return innerCallback(); // no need to transfer subscriptions
            }
            doDebug && debugLog("    => asking server to transfer subscriptions = [", subscriptionsIds.join(", "), "]");
            // Transfer subscriptions - ask for initial values....
            const subscriptionsToTransfer = new node_opcua_service_subscription_1.TransferSubscriptionsRequest({
                sendInitialValues: true,
                subscriptionIds: subscriptionsIds
            });
            if (newSession.getPublishEngine().nbPendingPublishRequests !== 0) {
                warningLog("Warning : we should not be publishing here");
            }
            newSession.transferSubscriptions(subscriptionsToTransfer, (err, transferSubscriptionsResponse) => {
                // may be the connection with server has been disconnected
                // prettier-ignore
                {
                    const err = _shouldNotContinue(session);
                    if (err) {
                        return innerCallback(err);
                    }
                }
                if (err || !transferSubscriptionsResponse) {
                    warningLog(chalk_1.default.bgCyan("May be the server is not supporting this feature"));
                    // when transfer subscription has failed, we have no other choice but
                    // recreate the subscriptions on the server side
                    const subscriptionsToRecreate = [...(subscriptionsToTransfer.subscriptionIds || [])];
                    warningLog(chalk_1.default.bgCyan("We need to recreate entirely the subscription"));
                    recreateSubscription(subscriptionsToRecreate, innerCallback);
                    return;
                }
                const results = transferSubscriptionsResponse.results || [];
                // istanbul ignore next
                if (doDebug) {
                    debugLog(chalk_1.default.cyan("    =>  transfer subscriptions  done"), results.map((x) => x.statusCode.toString()).join(" "));
                }
                const subscriptionsToRecreate = [];
                // some subscriptions may be marked as invalid on the server side ...
                // those one need to be recreated and repaired ....
                for (let i = 0; i < results.length; i++) {
                    const statusCode = results[i].statusCode;
                    if (statusCode.equals(node_opcua_status_code_1.StatusCodes.BadSubscriptionIdInvalid)) {
                        // repair subscription
                        doDebug &&
                            debugLog(chalk_1.default.red("         WARNING SUBSCRIPTION  "), subscriptionsIds[i], chalk_1.default.red(" SHOULD BE RECREATED"));
                        subscriptionsToRecreate.push(subscriptionsIds[i]);
                    }
                    else {
                        const availableSequenceNumbers = results[i].availableSequenceNumbers;
                        doDebug &&
                            debugLog(chalk_1.default.green("         SUBSCRIPTION "), subscriptionsIds[i], chalk_1.default.green(" CAN BE REPAIRED AND AVAILABLE "), availableSequenceNumbers);
                        // should be Good.
                    }
                }
                doDebug && debugLog("  new session subscriptionCount = ", newSession.getPublishEngine().subscriptionCount);
                recreateSubscription(subscriptionsToRecreate, innerCallback);
            });
        },
        function ask_for_subscription_republish(innerCallback) {
            // prettier-ignore
            {
                const err = _shouldNotContinue(session);
                if (err) {
                    return innerCallback(err);
                }
            }
            //  assert(newSession.getPublishEngine().nbPendingPublishRequests === 0, "we should not be publishing here");
            //      call Republish
            return _ask_for_subscription_republish(newSession, (err) => {
                if (err) {
                    warningLog("warning: Subscription republished has failed ", err.message);
                }
                innerCallback(err);
            });
        },
        function start_publishing_as_normal(innerCallback) {
            // prettier-ignore
            {
                const err = _shouldNotContinue(session);
                if (err) {
                    return innerCallback(err);
                }
            }
            newSession.getPublishEngine().suspend(false);
            const listenerCountAfter = session.listenerCount("");
            (0, node_opcua_assert_1.assert)(newSession === session);
            doDebug && debugLog("listenerCountBefore =", listenerCountBefore, "listenerCountAfter = ", listenerCountAfter);
            innerCallback();
        }
    ], (err) => {
        doDebug && err && debugLog("repair_client_session_by_recreating_a_new_session failed with ", err.message);
        callback(err);
    });
}
function _repair_client_session(client, session, callback) {
    const callback2 = (err2) => {
        doDebug &&
            debugLog("Session repair completed with err: ", err2 ? err2.message : "<no error>", session.sessionId.toString());
        if (!err2) {
            session.emit("session_repaired");
        }
        else {
            session.emit("session_repaired_failed", err2);
        }
        callback(err2);
    };
    if (doDebug) {
        doDebug && debugLog(chalk_1.default.yellow("  TRYING TO REACTIVATE EXISTING SESSION"), session.sessionId.toString());
        doDebug && debugLog("   SubscriptionIds :", session.getPublishEngine().getSubscriptionIds());
    }
    // prettier-ignore
    {
        const err = _shouldNotContinue(session);
        if (err) {
            return callback(err);
        }
    }
    client._activateSession(session, session.userIdentityInfo, (err, session2) => {
        // prettier-ignore
        {
            const err = _shouldNotContinue(session);
            if (err) {
                return callback(err);
            }
        }
        //
        // Note: current limitation :
        //  - The reconnection doesn't work yet, if connection break is caused by a server that crashes and restarts.
        //
        doDebug && debugLog("   ActivateSession : ", err ? chalk_1.default.red(err.message) : chalk_1.default.green(" SUCCESS !!! "));
        if (err) {
            //  activate old session has failed => let's  recreate a new Channel and transfer the subscription
            return repair_client_session_by_recreating_a_new_session(client, session, callback2);
        }
        else {
            // activate old session has succeeded => let's call Republish
            return _ask_for_subscription_republish(session, callback2);
        }
    });
}
function repair_client_session(client, session, callback) {
    if (!client) {
        doDebug && debugLog("Aborting reactivation of old session because user requested session to be close");
        return callback();
    }
    doDebug && debugLog(chalk_1.default.yellow("Starting client session repair"));
    const privateSession = session;
    privateSession._reconnecting = privateSession._reconnecting || { reconnecting: false, pendingCallbacks: [] };
    if (session.hasBeenClosed()) {
        privateSession._reconnecting.reconnecting = false;
        doDebug && debugLog("Aborting reactivation of old session because session has been closed");
        return callback();
    }
    if (privateSession._reconnecting.reconnecting) {
        doDebug && debugLog(chalk_1.default.bgCyan("Reconnection is already happening for session"), session.sessionId.toString());
        privateSession._reconnecting.pendingCallbacks.push(callback);
        return;
    }
    privateSession._reconnecting.reconnecting = true;
    // get old transaction queue ...
    const transactionQueue = privateSession._reconnecting.pendingTransactions.splice(0);
    const repeatedAction = (callback) => {
        // prettier-ignore
        {
            const err = _shouldNotContinue(session);
            if (err) {
                return callback(err);
            }
        }
        _repair_client_session(client, session, (err) => {
            // prettier-ignore
            {
                const err = _shouldNotContinue(session);
                if (err) {
                    return callback(err);
                }
            }
            if (err) {
                errorLog(chalk_1.default.red("session restoration has failed! err ="), err.message, session.sessionId.toString(), " => Let's retry");
                if (!session.hasBeenClosed()) {
                    const delay = 2000;
                    errorLog(chalk_1.default.red(`... will retry session repair... in ${delay} ms`));
                    setTimeout(() => {
                        {
                            const err = _shouldNotContinue(session);
                            if (err) {
                                warningLog("cancelling session repair");
                                return callback(err);
                            }
                        }
                        errorLog(chalk_1.default.red("Retrying session repair..."));
                        repeatedAction(callback);
                    }, delay);
                    return;
                }
                else {
                    errorLog(chalk_1.default.red("session restoration should be interrupted because session has been closed forcefully"));
                }
                // session does not need to be repaired anymore
                callback();
                return;
            }
            // istanbul ignore next
            doDebug && debugLog(chalk_1.default.yellow("session has been restored"), session.sessionId.toString());
            session.emit("session_restored");
            callback(err);
        });
    };
    repeatedAction((err) => {
        privateSession._reconnecting.reconnecting = false;
        const otherCallbacks = privateSession._reconnecting.pendingCallbacks.splice(0);
        // re-inject element in queue
        // istanbul ignore next
        if (transactionQueue.length > 0) {
            doDebug && debugLog(chalk_1.default.yellow("re-injecting transaction queue"), transactionQueue.length);
            transactionQueue.forEach((e) => privateSession._reconnecting.pendingTransactions.push(e));
        }
        otherCallbacks.forEach((c) => c(err));
        callback(err);
    });
}
function repair_client_sessions(client, callback) {
    // repair session
    const sessions = client.getSessions();
    doDebug && debugLog(chalk_1.default.red.bgWhite(" Starting sessions reactivation", sessions.length));
    async_1.default.map(sessions, (session, next) => {
        repair_client_session(client, session, (err) => {
            next(null, err);
        });
    }, (err, allErrors) => {
        err && errorLog("sessions reactivation completed with err: err ", err ? err.message : "null");
        // prettier-ignore
        {
            const err = _shouldNotContinue3(client);
            if (err) {
                return callback(err);
            }
        }
        return callback(err);
    });
}
//# sourceMappingURL=reconnection.js.map