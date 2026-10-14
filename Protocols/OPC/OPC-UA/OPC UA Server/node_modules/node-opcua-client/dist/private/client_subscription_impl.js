"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientSubscriptionImpl = exports.TERMINATING_SUBSCRIPTION_ID = exports.TERMINATED_SUBSCRIPTION_ID = exports.PENDING_SUBSCRIPTION_ID = void 0;
exports.ClientMonitoredItem_create = ClientMonitoredItem_create;
exports.__create_subscription = __create_subscription;
/**
 * @module node-opcua-client-private
 */
// tslint:disable:unified-signatures
const events_1 = require("events");
const chalk_1 = __importDefault(require("chalk"));
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_data_model_1 = require("node-opcua-data-model");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
const node_opcua_service_subscription_1 = require("node-opcua-service-subscription");
const node_opcua_status_code_1 = require("node-opcua-status-code");
const node_opcua_utils_1 = require("node-opcua-utils");
const node_opcua_client_dynamic_extension_object_1 = require("node-opcua-client-dynamic-extension-object");
const client_subscription_1 = require("../client_subscription");
const client_monitored_item_toolbox_1 = require("../client_monitored_item_toolbox");
const client_monitored_item_group_impl_1 = require("./client_monitored_item_group_impl");
const client_monitored_item_impl_1 = require("./client_monitored_item_impl");
const performance_1 = require("./performance");
const debugLog = (0, node_opcua_debug_1.make_debugLog)("CLIENT_SUBSCRIPTION");
const doDebug = (0, node_opcua_debug_1.checkDebugFlag)("CLIENT_SUBSCRIPTION");
const warningLog = (0, node_opcua_debug_1.make_warningLog)("CLIENT_SUBSCRIPTION");
exports.PENDING_SUBSCRIPTION_ID = 0xc0cac01a;
exports.TERMINATED_SUBSCRIPTION_ID = 0xc0cac01b;
exports.TERMINATING_SUBSCRIPTION_ID = 0xc0cac01c;
const minimumMaxKeepAliveCount = 3;
function displayKeepAliveWarning(sessionTimeout, maxKeepAliveCount, publishingInterval) {
    const keepAliveInterval = maxKeepAliveCount * publishingInterval;
    // istanbul ignore next
    if (sessionTimeout < keepAliveInterval) {
        warningLog(chalk_1.default.yellowBright(`[NODE-OPCUA-W09] The subscription parameters are not compatible with the session timeout !
                  session timeout    = ${sessionTimeout}  milliseconds
                  maxKeepAliveCount  = ${maxKeepAliveCount}
                  publishingInterval = ${publishingInterval} milliseconds"

                  It is important that the session timeout    ( ${chalk_1.default.red(sessionTimeout)} ms) is largely greater than :
                      (maxKeepAliveCount*publishingInterval  =  ${chalk_1.default.red(keepAliveInterval)} ms),
                  otherwise you may experience unexpected disconnection from the server if your monitored items are not
                  changing frequently.`));
        if (sessionTimeout < 3000 && publishingInterval <= 1000) {
            warningLog(`[NODE-OPCUA-W10] You'll need to increase your sessionTimeout significantly.`);
        }
        if (sessionTimeout >= 3000 &&
            sessionTimeout < publishingInterval * minimumMaxKeepAliveCount &&
            maxKeepAliveCount <= minimumMaxKeepAliveCount + 2) {
            warningLog(`[NODE-OPCUA-W11] your publishingInterval interval is probably too large, consider reducing it.`);
        }
        const idealMaxKeepAliveCount = Math.max(4, Math.floor((sessionTimeout * 0.8) / publishingInterval - 0.5));
        const idealPublishingInternal = Math.min(publishingInterval, sessionTimeout / (idealMaxKeepAliveCount + 3));
        const idealKeepAliveInterval = idealMaxKeepAliveCount * publishingInterval;
        warningLog(`[NODE-OPCUA-W12]  An ideal value for maxKeepAliveCount could be ${idealMaxKeepAliveCount}.
                  An ideal value for publishingInterval could be ${idealPublishingInternal} ms.
                  This will make  your subscription emit a keep alive signal every ${idealKeepAliveInterval} ms
                  if no monitored items are generating notifications.
                  for instance:
                    const  client = OPCUAClient.create({
                        requestedSessionTimeout: 30* 60* 1000, // 30 minutes
                    });
`);
        if (!client_subscription_1.ClientSubscription.ignoreNextWarning) {
            throw new Error("[NODE-OPCUA-W09] The subscription parameters are not compatible with the session timeout ");
        }
        return true;
    }
    return false;
}
class ClientSubscriptionImpl extends events_1.EventEmitter {
    /**
     * the associated session
     * @property session
     * @type {ClientSession}
     */
    get session() {
        (0, node_opcua_assert_1.assert)(this.publishEngine.session, "expecting a valid session here");
        return this.publishEngine.session;
    }
    get hasSession() {
        return !!this.publishEngine.session;
    }
    get isActive() {
        return !(this.subscriptionId === exports.PENDING_SUBSCRIPTION_ID ||
            this.subscriptionId === exports.TERMINATED_SUBSCRIPTION_ID ||
            this.subscriptionId === exports.TERMINATING_SUBSCRIPTION_ID);
    }
    constructor(session, options) {
        super();
        this.monitoredItemGroups = [];
        this.timeoutHint = 0;
        this._nextClientHandle = 0;
        const sessionImpl = session;
        this.publishEngine = sessionImpl.getPublishEngine();
        this.lastSequenceNumber = -1;
        options = options || {};
        options.requestedPublishingInterval = options.requestedPublishingInterval || 100;
        options.requestedLifetimeCount = options.requestedLifetimeCount || 60;
        options.requestedMaxKeepAliveCount = options.requestedMaxKeepAliveCount || 10;
        options.requestedMaxKeepAliveCount = Math.max(options.requestedMaxKeepAliveCount, minimumMaxKeepAliveCount);
        // perform some verification
        const warningEmitted = displayKeepAliveWarning(session.timeout, options.requestedMaxKeepAliveCount, options.requestedPublishingInterval);
        // istanbul ignore next
        if (warningEmitted) {
            warningLog(JSON.stringify({
                ...options
            }, null, " "));
        }
        options.maxNotificationsPerPublish = (0, node_opcua_utils_1.isNullOrUndefined)(options.maxNotificationsPerPublish)
            ? 0
            : options.maxNotificationsPerPublish;
        options.publishingEnabled = !!options.publishingEnabled;
        options.priority = options.priority || 1;
        this.publishingInterval = options.requestedPublishingInterval;
        this.lifetimeCount = options.requestedLifetimeCount;
        this.maxKeepAliveCount = options.requestedMaxKeepAliveCount;
        this.maxNotificationsPerPublish = options.maxNotificationsPerPublish || 0;
        this.publishingEnabled = options.publishingEnabled === undefined ? true : options.publishingEnabled;
        this.priority = options.priority;
        this.subscriptionId = exports.PENDING_SUBSCRIPTION_ID;
        this._nextClientHandle = 0;
        this.monitoredItems = {};
        /**
         * set to True when the server has notified us that this subscription has timed out
         * ( maxLifeCounter x published interval without being able to process a PublishRequest
         * @property hasTimedOut
         * @type {boolean}
         */
        this.hasTimedOut = false;
        setImmediate(() => {
            __create_subscription(this, (err) => {
                if (!err) {
                    setImmediate(() => {
                        /**
                         * notify the observers that the subscription has now started
                         * @event started
                         */
                        this.emit("started", this.subscriptionId);
                    });
                }
                else {
                    setImmediate(() => {
                        /**
                         * notify the observers that the subscription has now failed
                         * @event failed
                         */
                        this.emit("error", err);
                    });
                }
            });
        });
    }
    terminate(...args) {
        debugLog("Terminating client subscription ", this.subscriptionId);
        const callback = args[0];
        (0, node_opcua_assert_1.assert)(typeof callback === "function", "expecting a callback function");
        if (this.subscriptionId === exports.TERMINATED_SUBSCRIPTION_ID || this.subscriptionId === exports.TERMINATING_SUBSCRIPTION_ID) {
            // already terminated... just ignore
            return callback(new Error("Already Terminated"));
        }
        if (isFinite(this.subscriptionId)) {
            const subscriptionId = this.subscriptionId;
            this.subscriptionId = exports.TERMINATING_SUBSCRIPTION_ID;
            this.publishEngine.unregisterSubscription(subscriptionId);
            if (!this.hasSession) {
                return this._terminate_step2(callback);
            }
            const session = this.session;
            if (!session) {
                return callback(new Error("no session"));
            }
            session.deleteSubscriptions({
                subscriptionIds: [subscriptionId]
            }, (err, response) => {
                if (response && response.results[0] !== node_opcua_status_code_1.StatusCodes.Good) {
                    debugLog("warning: deleteSubscription returned ", response.results);
                }
                if (err) {
                    /**
                     * notify the observers that an error has occurred
                     * @event internal_error
                     * @param err the error
                     */
                    this.emit("internal_error", err);
                }
                this._terminate_step2(callback);
            });
        }
        else {
            debugLog("subscriptionId is not value ", this.subscriptionId);
            (0, node_opcua_assert_1.assert)(this.subscriptionId === exports.PENDING_SUBSCRIPTION_ID);
            this._terminate_step2(callback);
        }
    }
    /**

     */
    nextClientHandle() {
        this._nextClientHandle += 1;
        return this._nextClientHandle;
    }
    monitor(...args) {
        const itemToMonitor = args[0];
        const requestedParameters = args[1];
        const timestampsToReturn = args[2];
        const monitoringMode = typeof args[3] === "function" ? node_opcua_service_subscription_1.MonitoringMode.Reporting : args[3];
        const done = (typeof args[3] === "function" ? args[3] : args[4]);
        (0, node_opcua_assert_1.assert)(typeof done === "function", "expecting a function here");
        itemToMonitor.nodeId = (0, node_opcua_nodeid_1.resolveNodeId)(itemToMonitor.nodeId);
        const monitoredItem = ClientMonitoredItem_create(this, itemToMonitor, requestedParameters, timestampsToReturn, monitoringMode, (err1, monitoredItem2) => {
            if (err1) {
                return done && done(err1);
            }
            done(err1 || null, monitoredItem);
        });
    }
    monitorItems(...args) {
        const itemsToMonitor = args[0];
        const requestedParameters = args[1];
        const timestampsToReturn = args[2];
        const done = args[3];
        const monitoredItemGroup = new client_monitored_item_group_impl_1.ClientMonitoredItemGroupImpl(this, itemsToMonitor, requestedParameters, timestampsToReturn);
        this._wait_for_subscription_to_be_ready((err) => {
            if (err) {
                return done(err);
            }
            monitoredItemGroup._monitor((err1) => {
                if (err1) {
                    return done && done(err1);
                }
                done(err1, monitoredItemGroup);
            });
        });
    }
    _delete_monitored_items(monitoredItems, callback) {
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        (0, node_opcua_assert_1.assert)(Array.isArray(monitoredItems));
        (0, node_opcua_assert_1.assert)(this.isActive);
        for (const monitoredItem of monitoredItems) {
            this._remove(monitoredItem);
        }
        const session = this.session;
        session.deleteMonitoredItems({
            monitoredItemIds: monitoredItems.map((monitoredItem) => monitoredItem.monitoredItemId),
            subscriptionId: this.subscriptionId
        }, (err, response) => {
            callback(err);
        });
    }
    setPublishingMode(...args) {
        const publishingEnabled = args[0];
        const callback = args[1];
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        const session = this.session;
        if (!session) {
            return callback(new Error("no session"));
        }
        const subscriptionId = this.subscriptionId;
        session.setPublishingMode(publishingEnabled, subscriptionId, (err, statusCode) => {
            if (err) {
                return callback(err);
            }
            /* istanbul ignore next */
            if (!statusCode) {
                return callback(new Error("Internal Error"));
            }
            if (statusCode.isNotGood()) {
                return callback(null, statusCode);
            }
            callback(null, node_opcua_status_code_1.StatusCodes.Good);
        });
    }
    setTriggering(...args) {
        const triggeringItem = args[0];
        const linksToAdd = args[1];
        const linksToRemove = args[2];
        const callback = args[3];
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        const session = this.session;
        if (!session) {
            return callback(new Error("no session"));
        }
        const subscriptionId = this.subscriptionId;
        const triggeringItemId = triggeringItem.monitoredItemId;
        const setTriggeringRequest = new node_opcua_service_subscription_1.SetTriggeringRequest({
            linksToAdd: linksToAdd ? linksToAdd.map((i) => i.monitoredItemId) : null,
            linksToRemove: linksToRemove ? linksToRemove.map((i) => i.monitoredItemId) : null,
            subscriptionId,
            triggeringItemId
        });
        session.setTriggering(setTriggeringRequest, (err, response) => {
            if (err) {
                if (response) {
                    // use soft error, no exceptions
                    return callback(null, response);
                }
                else {
                    return callback(err);
                }
            }
            // istanbul ignore next
            if (!response) {
                return callback(new Error("Internal Error"));
            }
            callback(null, response);
        });
    }
    modify(...args) {
        const modifySubscriptionRequest = args[0];
        const callback = args[1];
        const session = this.session;
        if (!session) {
            return callback(new Error("no session"));
        }
        modifySubscriptionRequest.subscriptionId = this.subscriptionId;
        modifySubscriptionRequest.priority =
            modifySubscriptionRequest.priority === undefined ? this.priority : modifySubscriptionRequest.priority;
        modifySubscriptionRequest.requestedLifetimeCount =
            modifySubscriptionRequest.requestedLifetimeCount === undefined
                ? this.lifetimeCount
                : modifySubscriptionRequest.requestedLifetimeCount;
        modifySubscriptionRequest.requestedMaxKeepAliveCount =
            modifySubscriptionRequest.requestedMaxKeepAliveCount === undefined
                ? this.maxKeepAliveCount
                : modifySubscriptionRequest.requestedMaxKeepAliveCount;
        modifySubscriptionRequest.requestedPublishingInterval =
            modifySubscriptionRequest.requestedPublishingInterval === undefined
                ? this.publishingInterval
                : modifySubscriptionRequest.requestedPublishingInterval;
        modifySubscriptionRequest.maxNotificationsPerPublish =
            modifySubscriptionRequest.maxNotificationsPerPublish === undefined
                ? this.maxNotificationsPerPublish
                : modifySubscriptionRequest.maxNotificationsPerPublish;
        session.modifySubscription(modifySubscriptionRequest, (err, response) => {
            if (err || !response) {
                return callback(err);
            }
            this.publishingInterval = response.revisedPublishingInterval;
            this.lifetimeCount = response.revisedLifetimeCount;
            this.maxKeepAliveCount = response.revisedMaxKeepAliveCount;
            callback(null, response);
        });
    }
    getMonitoredItems(...args) {
        this.session.getMonitoredItems(this.subscriptionId, args[0]);
    }
    toString() {
        let str = "";
        str += "subscriptionId      : " + this.subscriptionId + "\n";
        str += "publishingInterval  : " + this.publishingInterval + "\n";
        str += "lifetimeCount       : " + this.lifetimeCount + "\n";
        str += "maxKeepAliveCount   : " + this.maxKeepAliveCount + "\n";
        str += "hasTimedOut         : " + this.hasTimedOut + "\n";
        const timeToLive = this.lifetimeCount * this.publishingInterval;
        str += "(maxKeepAliveCount*publishingInterval: " + this.publishingInterval * this.maxKeepAliveCount + " ms)\n";
        str += "(maxLifetimeCount*publishingInterval: " + timeToLive + " ms)\n";
        const lastRequestSentTime = this.publishEngine.lastRequestSentTime;
        str += "lastRequestSentTime : " + lastRequestSentTime.toString() + "\n";
        const duration = Date.now() - lastRequestSentTime.getTime();
        const extra = duration - timeToLive > 0
            ? chalk_1.default.red(" expired since " + (duration - timeToLive) / 1000 + " seconds")
            : chalk_1.default.green(" valid for " + -(duration - timeToLive) / 1000 + " seconds");
        str += "timeSinceLast PR    : " + duration + "ms" + extra + "\n";
        str += "has expired         : " + (duration > timeToLive) + "\n";
        str += "(session timeout    : " + this.session.timeout + " ms)\n";
        return str;
    }
    /**
     * returns the approximated remaining life time of this subscription in milliseconds
     */
    evaluateRemainingLifetime() {
        const now = Date.now();
        const timeout = this.publishingInterval * this.lifetimeCount;
        const lastRequestSentTime = this.publishEngine.lastRequestSentTime;
        const expiryTime = lastRequestSentTime.getTime() + timeout;
        return Math.max(0, expiryTime - now);
    }
    _add_monitored_item(clientHandle, monitoredItem) {
        (0, node_opcua_assert_1.assert)(this.isActive, "subscription must be active and not terminated");
        (0, node_opcua_assert_1.assert)(monitoredItem.monitoringParameters.clientHandle === clientHandle);
        this.monitoredItems[clientHandle] = monitoredItem;
        /**
         * notify the observers that a new monitored item has been added to the subscription.
         * @event item_added
         * @param the monitored item.
         */
        this.emit("item_added", monitoredItem);
    }
    _add_monitored_items_group(monitoredItemGroup) {
        this.monitoredItemGroups.push(monitoredItemGroup);
    }
    _wait_for_subscription_to_be_ready(done) {
        let _watchDogCount = 0;
        const waitForSubscriptionAndMonitor = () => {
            _watchDogCount++;
            if (this.subscriptionId === exports.PENDING_SUBSCRIPTION_ID) {
                // the subscriptionID is not yet known because the server hasn't replied yet
                // let postpone this call, a little bit, to let things happen
                setImmediate(waitForSubscriptionAndMonitor);
            }
            else if (this.subscriptionId === exports.TERMINATED_SUBSCRIPTION_ID) {
                // the subscription has been terminated in the meantime
                // this indicates a potential issue in the code using this api.
                if (typeof done === "function") {
                    done(new Error("subscription has been deleted"));
                }
            }
            else {
                done();
            }
        };
        setImmediate(waitForSubscriptionAndMonitor);
    }
    __on_publish_response_DataChangeNotification(notification) {
        (0, node_opcua_assert_1.assert)(notification.schema.name === "DataChangeNotification");
        const monitoredItems = notification.monitoredItems || [];
        let repeated = 0;
        for (const monitoredItem of monitoredItems) {
            const monitorItemObj = this.monitoredItems[monitoredItem.clientHandle];
            if (monitorItemObj) {
                if (monitorItemObj.itemToMonitor.attributeId === node_opcua_data_model_1.AttributeIds.EventNotifier) {
                    warningLog(chalk_1.default.yellow("Warning"), chalk_1.default.cyan(" Server send a DataChangeNotification for an EventNotifier." + " EventNotificationList was expected"));
                    warningLog(chalk_1.default.cyan("         the Server may not be fully OPCUA compliant"), chalk_1.default.yellow(". This notification will be ignored."));
                }
                else {
                    const monitoredItemImpl = monitorItemObj;
                    monitoredItemImpl._notify_value_change(monitoredItem.value);
                }
            }
            else {
                repeated += 1;
                if (repeated === 1) {
                    warningLog("Receiving a notification for a unknown monitoredItem with clientHandle ", monitoredItem.clientHandle);
                }
            }
        }
        // istanbul ignore next
        if (repeated > 1) {
            warningLog("previous message repeated", repeated, "times");
        }
    }
    __on_publish_response_StatusChangeNotification(notification) {
        (0, node_opcua_assert_1.assert)(notification.schema.name === "StatusChangeNotification");
        debugLog("Client has received a Status Change Notification ", notification.status.toString());
        if (notification.status === node_opcua_status_code_1.StatusCodes.GoodSubscriptionTransferred) {
            // OPCUA UA Spec 1.0.3 : part 3 - page 82 - 5.13.7 TransferSubscriptions:
            // If the Server transfers the Subscription to the new Session, the Server shall issue
            // a StatusChangeNotification  notificationMessage with the status code
            // Good_SubscriptionTransferred to the old Session.
            debugLog("ClientSubscription#__on_publish_response_StatusChangeNotification : GoodSubscriptionTransferred");
            // may be it has been transferred after a reconnection.... in this case should do nothing about it
        }
        if (notification.status === node_opcua_status_code_1.StatusCodes.BadTimeout) {
            // the server tells use that the subscription has timed out ..
            // this mean that this subscription has been closed on the server side and cannot process any
            // new PublishRequest.
            //
            // from Spec OPCUA Version 1.03 Part 4 - 5.13.1.1 Description : Page 69:
            //
            // h. Subscriptions have a lifetime counter that counts the number of consecutive publishing cycles in
            //    which there have been no Publish requests available to send a Publish response for the
            //    Subscription. Any Service call that uses the SubscriptionId or the processing of a Publish
            //    response resets the lifetime counter of this Subscription. When this counter reaches the value
            //    calculated for the lifetime of a Subscription based on the MaxKeepAliveCount parameter in the
            //    CreateSubscription Service (5.13.2), the Subscription is closed. Closing the Subscription causes
            //    its MonitoredItems to be deleted. In addition the Server shall issue a StatusChangeNotification
            //    notificationMessage with the status code BadTimeout.
            //
            this.hasTimedOut = true;
            this.terminate(() => {
                /* empty */
            });
        }
        /**
         * notify the observers that the server has send a status changed notification (such as BadTimeout )
         * @event status_changed
         */
        this.emit("status_changed", notification.status, notification.diagnosticInfo);
    }
    __on_publish_response_EventNotificationList(notification) {
        (0, node_opcua_assert_1.assert)(notification.schema.name === "EventNotificationList");
        const events = notification.events || [];
        for (const event of events) {
            const monitorItemObj = this.monitoredItems[event.clientHandle];
            (0, node_opcua_assert_1.assert)(monitorItemObj, "Expecting a monitored item");
            const monitoredItemImpl = monitorItemObj;
            monitoredItemImpl._notify_event(event.eventFields || []);
        }
    }
    onNotificationMessage(notificationMessage) {
        (0, node_opcua_assert_1.assert)(Object.prototype.hasOwnProperty.call(notificationMessage, "sequenceNumber"));
        this.lastSequenceNumber = notificationMessage.sequenceNumber;
        this.emit("raw_notification", notificationMessage);
        const notificationData = (notificationMessage.notificationData || []);
        if (notificationData.length === 0) {
            // this is a keep alive message
            debugLog(chalk_1.default.yellow("Client : received a keep alive notification from client"));
            /**
             * notify the observers that a keep alive Publish Response has been received from the server.
             * @event keepalive
             */
            this.emit("keepalive");
        }
        else {
            /**
             * notify the observers that some notifications has been received from the server in  a PublishResponse
             * each modified monitored Item
             * @event  received_notifications
             */
            this.emit("received_notifications", notificationMessage);
            // let publish a global event
            (0, node_opcua_client_dynamic_extension_object_1.promoteOpaqueStructureInNotificationData)(this.session, notificationData).then(() => {
                (0, performance_1.detectLongOperation)(() => {
                    // now process all notifications
                    for (const notification of notificationData) {
                        // istanbul ignore next
                        if (!notification) {
                            continue;
                        }
                        // DataChangeNotification / StatusChangeNotification / EventNotification
                        switch (notification.schema.name) {
                            case "DataChangeNotification":
                                // now inform each individual monitored item
                                this.__on_publish_response_DataChangeNotification(notification);
                                break;
                            case "StatusChangeNotification":
                                this.__on_publish_response_StatusChangeNotification(notification);
                                break;
                            case "EventNotificationList":
                                this.__on_publish_response_EventNotificationList(notification);
                                break;
                            default:
                                warningLog(" Invalid notification :", notification.toString());
                        }
                    }
                }, (duration) => {
                    const s = (a) => {
                        const b = a;
                        b.$_slowNotifCount = b.$_slowNotifCount || 0;
                        b.$_maxDuration = b.$_maxDuration || 0;
                        return b;
                    };
                    s(this).$_maxDuration = Math.max(s(this).$_maxDuration, duration);
                    if (s(this).$_slowNotifCount > 0 && s(this).$_slowNotifCount % 1000 !== 0)
                        return;
                    s(this).$_slowNotifCount++;
                    warningLog(`[NODE-OPCUA-W32]}: monitored.item event handler takes too much time : operation duration ${duration} ms [repeated ${s(this).$_slowNotifCount} times]\n         please ensure that your monitoredItem event handler is not blocking the event loop.`);
                });
            });
        }
    }
    _terminate_step2(callback) {
        const monitoredItems = Object.values(this.monitoredItems);
        for (const monitoredItem of monitoredItems) {
            this._remove(monitoredItem);
        }
        const monitoredItemGroups = this.monitoredItemGroups;
        for (const monitoredItemGroup of monitoredItemGroups) {
            this._removeGroup(monitoredItemGroup);
        }
        (0, node_opcua_assert_1.assert)(Object.values(this.monitoredItems).length === 0);
        setImmediate(() => {
            /**
             * notify the observers that the client subscription has terminated
             * @event  terminated
             */
            this.subscriptionId = exports.TERMINATED_SUBSCRIPTION_ID;
            this.emit("terminated");
            callback();
        });
    }
    _remove(monitoredItem) {
        const clientHandle = monitoredItem.monitoringParameters.clientHandle;
        (0, node_opcua_assert_1.assert)(clientHandle > 0);
        if (!Object.prototype.hasOwnProperty.call(this.monitoredItems, clientHandle)) {
            return; // may be monitoredItem failed to be created  ....
        }
        (0, node_opcua_assert_1.assert)(Object.prototype.hasOwnProperty.call(this.monitoredItems, clientHandle));
        const priv = monitoredItem;
        priv._terminate_and_emit();
    }
    _removeGroup(monitoredItemGroup) {
        monitoredItemGroup._terminate_and_emit();
        this.monitoredItemGroups = this.monitoredItemGroups.filter((obj) => obj !== monitoredItemGroup);
    }
    /**
     * @private
     * @param itemToMonitor
     * @param monitoringParameters
     * @param timestampsToReturn
     */
    _createMonitoredItem(itemToMonitor, monitoringParameters, timestampsToReturn, monitoringMode = node_opcua_service_subscription_1.MonitoringMode.Reporting) {
        /* istanbul ignore next*/
        const monitoredItem = new client_monitored_item_impl_1.ClientMonitoredItemImpl(this, itemToMonitor, monitoringParameters, timestampsToReturn, monitoringMode);
        return monitoredItem;
    }
}
exports.ClientSubscriptionImpl = ClientSubscriptionImpl;
function ClientMonitoredItem_create(subscription, itemToMonitor, monitoringParameters, timestampsToReturn, monitoringMode = node_opcua_service_subscription_1.MonitoringMode.Reporting, callback) {
    const monitoredItem = new client_monitored_item_impl_1.ClientMonitoredItemImpl(subscription, itemToMonitor, monitoringParameters, timestampsToReturn, monitoringMode);
    setImmediate(() => {
        subscription._wait_for_subscription_to_be_ready((err) => {
            if (err) {
                if (callback) {
                    callback(err);
                }
                return;
            }
            client_monitored_item_toolbox_1.ClientMonitoredItemToolbox._toolbox_monitor(subscription, timestampsToReturn, [monitoredItem], (err1) => {
                if (err1) {
                    monitoredItem._terminate_and_emit(err1);
                }
                if (callback) {
                    callback(err1, monitoredItem);
                }
            });
        });
    });
    return monitoredItem;
}
// tslint:disable:no-var-requires
// tslint:disable:max-line-length
const thenify_ex_1 = require("thenify-ex");
const opts = { multiArgs: false };
ClientSubscriptionImpl.prototype.setPublishingMode = (0, thenify_ex_1.withCallback)(ClientSubscriptionImpl.prototype.setPublishingMode);
ClientSubscriptionImpl.prototype.monitor = (0, thenify_ex_1.withCallback)(ClientSubscriptionImpl.prototype.monitor);
ClientSubscriptionImpl.prototype.monitorItems = (0, thenify_ex_1.withCallback)(ClientSubscriptionImpl.prototype.monitorItems);
ClientSubscriptionImpl.prototype.setTriggering = (0, thenify_ex_1.withCallback)(ClientSubscriptionImpl.prototype.setTriggering);
ClientSubscriptionImpl.prototype.modify = (0, thenify_ex_1.withCallback)(ClientSubscriptionImpl.prototype.modify);
ClientSubscriptionImpl.prototype.terminate = (0, thenify_ex_1.withCallback)(ClientSubscriptionImpl.prototype.terminate);
ClientSubscriptionImpl.prototype.getMonitoredItems = (0, thenify_ex_1.withCallback)(ClientSubscriptionImpl.prototype.getMonitoredItems);
client_subscription_1.ClientSubscription.create = (clientSession, options) => {
    return new ClientSubscriptionImpl(clientSession, options);
};
function __create_subscription(subscription, callback) {
    // istanbul ignore next
    if (!subscription.hasSession) {
        return callback(new Error("__create_subscription: subscription has no Session"));
    }
    const session = subscription.session;
    debugLog(chalk_1.default.yellow.bold("ClientSubscription created "));
    const request = new node_opcua_service_subscription_1.CreateSubscriptionRequest({
        maxNotificationsPerPublish: subscription.maxNotificationsPerPublish,
        priority: subscription.priority,
        publishingEnabled: subscription.publishingEnabled,
        requestedLifetimeCount: subscription.lifetimeCount,
        requestedMaxKeepAliveCount: subscription.maxKeepAliveCount,
        requestedPublishingInterval: subscription.publishingInterval
    });
    session.createSubscription(request, (err, response) => {
        if (err) {
            /* istanbul ignore next */
            subscription.emit("internal_error", err);
            if (callback) {
                return callback(err);
            }
            return;
        }
        /* istanbul ignore next */
        if (!response) {
            return callback(new Error("internal error"));
        }
        if (!subscription.hasSession) {
            return callback(new Error("createSubscription has failed = > no session"));
        }
        (0, node_opcua_assert_1.assert)(subscription.hasSession);
        subscription.subscriptionId = response.subscriptionId;
        subscription.publishingInterval = response.revisedPublishingInterval;
        subscription.lifetimeCount = response.revisedLifetimeCount;
        subscription.maxKeepAliveCount = response.revisedMaxKeepAliveCount;
        subscription.timeoutHint = Math.min((subscription.maxKeepAliveCount + 10) * subscription.publishingInterval * 2, 0x7ffff);
        displayKeepAliveWarning(subscription.session.timeout, subscription.maxKeepAliveCount, subscription.publishingInterval);
        client_subscription_1.ClientSubscription.ignoreNextWarning = false;
        // istanbul ignore next
        if (doDebug) {
            debugLog(chalk_1.default.yellow.bold("registering callback"));
            debugLog(chalk_1.default.yellow.bold("publishingInterval               "), subscription.publishingInterval);
            debugLog(chalk_1.default.yellow.bold("lifetimeCount                    "), subscription.lifetimeCount);
            debugLog(chalk_1.default.yellow.bold("maxKeepAliveCount                "), subscription.maxKeepAliveCount);
            debugLog(chalk_1.default.yellow.bold("publish request timeout hint =   "), subscription.timeoutHint);
            debugLog(chalk_1.default.yellow.bold("hasTimedOut                      "), subscription.hasTimedOut);
            debugLog(chalk_1.default.yellow.bold("timeoutHint for publish request  "), subscription.timeoutHint);
        }
        subscription.publishEngine.registerSubscription(subscription);
        if (callback) {
            callback();
        }
    });
}
//# sourceMappingURL=client_subscription_impl.js.map