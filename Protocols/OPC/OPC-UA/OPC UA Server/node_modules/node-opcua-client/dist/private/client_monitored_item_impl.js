"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientMonitoredItemImpl = void 0;
/**
 * @module node-opcua-client-private
 */
// tslint:disable:unified-signatures
// tslint:disable:no-empty
const events_1 = require("events");
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_data_model_1 = require("node-opcua-data-model");
const node_opcua_data_value_1 = require("node-opcua-data-value");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_service_filter_1 = require("node-opcua-service-filter");
const node_opcua_service_read_1 = require("node-opcua-service-read");
const node_opcua_service_subscription_1 = require("node-opcua-service-subscription");
const node_opcua_status_code_1 = require("node-opcua-status-code");
const client_monitored_item_1 = require("../client_monitored_item");
const client_monitored_item_toolbox_1 = require("../client_monitored_item_toolbox");
const client_subscription_impl_1 = require("./client_subscription_impl");
const debugLog = (0, node_opcua_debug_1.make_debugLog)(__filename);
const warningLog = (0, node_opcua_debug_1.make_warningLog)(__filename);
const doDebug = (0, node_opcua_debug_1.checkDebugFlag)(__filename);
/**
 * ClientMonitoredItem
 * @class ClientMonitoredItem
 * @extends ClientMonitoredItemBase
 *
 * - event:
 *   - "initialized"
 *   - "err"
 *   - "changed"
 *
 *  note: this.monitoringMode = subscription_service.MonitoringMode.Reporting;
 */
class ClientMonitoredItemImpl extends events_1.EventEmitter {
    constructor(subscription, itemToMonitor, monitoringParameters, timestampsToReturn, monitoringMode = node_opcua_service_subscription_1.MonitoringMode.Reporting) {
        super();
        this.statusCode = node_opcua_status_code_1.StatusCodes.BadDataUnavailable;
        this.subscription = subscription;
        this.itemToMonitor = new node_opcua_service_read_1.ReadValueId(itemToMonitor);
        this.monitoringParameters = new node_opcua_service_subscription_1.MonitoringParameters(monitoringParameters);
        this.monitoringMode = monitoringMode;
        (0, node_opcua_assert_1.assert)(this.monitoringParameters.clientHandle === 0xffffffff, "should not have a client handle yet");
        (0, node_opcua_assert_1.assert)(subscription.session, "expecting session");
        timestampsToReturn = (0, node_opcua_data_value_1.coerceTimestampsToReturn)(timestampsToReturn);
        this.timestampsToReturn = timestampsToReturn;
    }
    toString() {
        let ret = "";
        ret += "itemToMonitor:        " + this.itemToMonitor.toString() + "\n";
        ret += "monitoringParameters: " + this.monitoringParameters.toString() + "\n";
        ret += "timestampsToReturn:   " + this.timestampsToReturn.toString() + "\n";
        ret += "itemToMonitor         " + this.itemToMonitor.nodeId + "\n";
        ret += "statusCode            " + this.statusCode?.toString() + "\n";
        ret += "result =" + this.result?.toString() + "\n";
        return ret;
    }
    terminate(...args) {
        const done = args[0];
        (0, node_opcua_assert_1.assert)(typeof done === "function");
        const subscription = this.subscription;
        subscription._delete_monitored_items([this], (err) => {
            if (done) {
                done(err);
            }
        });
    }
    modify(...args) {
        if (args.length === 2) {
            return this.modify(args[0], null, args[1]);
        }
        const parameters = args[0];
        const timestampsToReturn = args[1];
        const callback = args[2];
        this.timestampsToReturn = timestampsToReturn || this.timestampsToReturn;
        client_monitored_item_toolbox_1.ClientMonitoredItemToolbox._toolbox_modify(this.subscription, [this], parameters, this.timestampsToReturn, (err, results) => {
            if (err) {
                return callback(err);
            }
            if (!results) {
                return callback(new Error("internal error"));
            }
            (0, node_opcua_assert_1.assert)(results.length === 1);
            callback(null, results[0]);
        });
    }
    setMonitoringMode(...args) {
        const monitoringMode = args[0];
        const callback = args[1];
        client_monitored_item_toolbox_1.ClientMonitoredItemToolbox._toolbox_setMonitoringMode(this.subscription, [this], monitoringMode, (err, statusCodes) => {
            callback(err ? err : null, statusCodes ? statusCodes[0] : undefined);
        });
    }
    /**
     * @internal
     * @param value
     * @private
     */
    _notify_value_change(value) {
        // it is possible that the first notification arrives before the CreateMonitoredItemsRequest is fully proceed
        // in this case we need to put the dataValue aside so we can send the notification changed after
        // the node-opcua client had time to fully install the on("changed") event handler
        if (this.statusCode?.value === node_opcua_status_code_1.StatusCodes.BadDataUnavailable.value) {
            this._pendingDataValue = this._pendingDataValue || [];
            this._pendingDataValue.push(value);
            return;
        }
        /**
         * Notify the observers that the MonitoredItem value has changed on the server side.
         * @event changed
         * @param value
         */
        try {
            this.emit("changed", value);
        }
        catch (err) {
            warningLog("[NODE-OPCUA-W28] Exception raised inside the event handler called by ClientMonitoredItem.on('change')", err);
            warningLog("                 Please verify the application using this node-opcua client");
        }
    }
    /**
     * @internal
     * @param eventFields
     * @private
     */
    _notify_event(eventFields) {
        if (this.statusCode?.value === node_opcua_status_code_1.StatusCodes.BadDataUnavailable.value) {
            this._pendingEvents = this._pendingEvents || [];
            this._pendingEvents.push(eventFields);
            return;
        }
        /**
         * Notify the observers that the MonitoredItem value has changed on the server side.
         * @event changed
         * @param value
         */
        try {
            this.emit("changed", eventFields);
        }
        catch (err) {
            warningLog("[NODE-OPCUA-W29] Exception raised inside the event handler called by ClientMonitoredItem.on('change')", err);
            warningLog("                 Please verify the application using this node-opcua client");
        }
    }
    /**
     * @internal
     * @private
     */
    _prepare_for_monitoring() {
        (0, node_opcua_assert_1.assert)(this.monitoringParameters.clientHandle === 4294967295, "should not have a client handle yet");
        const subscription = this.subscription;
        this.monitoringParameters.clientHandle = subscription.nextClientHandle();
        (0, node_opcua_assert_1.assert)(this.monitoringParameters.clientHandle > 0 && this.monitoringParameters.clientHandle !== 4294967295);
        // If attributeId is EventNotifier then monitoring parameters need a filter.
        // The filter must then either be DataChangeFilter, EventFilter or AggregateFilter.
        // todo can be done in another way?
        // todo implement AggregateFilter
        // todo support DataChangeFilter
        // todo support whereClause
        if (this.itemToMonitor.attributeId === node_opcua_data_model_1.AttributeIds.EventNotifier) {
            //
            // see OPCUA Spec 1.02 part 4 page 65 : 5.12.1.4 Filter
            // see                 part 4 page 130: 7.16.3 EventFilter
            //                     part 3 page 11 : 4.6 Event Model
            // To monitor for Events, the attributeId element of the ReadValueId structure is the
            // the id of the EventNotifierAttribute
            // OPC Unified Architecture 1.02, Part 4 5.12.1.2 Sampling interval page 64:
            // "A Client shall define a sampling interval of 0 if it subscribes for Events."
            // toDO
            // note : the EventFilter is used when monitoring Events.
            this.monitoringParameters.filter = this.monitoringParameters.filter || new node_opcua_service_filter_1.EventFilter({});
            const filter = this.monitoringParameters.filter;
            // istanbul ignore next
            if (!filter) {
                return { error: "Internal Error" };
            }
            if (filter.schema.name !== "EventFilter") {
                return {
                    error: "Mismatch between attributeId and filter in monitoring parameters : " +
                        "Got a " +
                        filter.schema.name +
                        " but a EventFilter object is required " +
                        "when itemToMonitor.attributeId== AttributeIds.EventNotifier"
                };
            }
        }
        else if (this.itemToMonitor.attributeId === node_opcua_data_model_1.AttributeIds.Value) {
            // the DataChangeFilter and the AggregateFilter are used when monitoring Variable Values
            // The Value Attribute is used when monitoring Variables. Variable values are monitored for a change
            // in value or a change in their status. The filters defined in this standard (see 7.16.2) and in Part 8 are
            // used to determine if the value change is large enough to cause a Notification to be generated for the
            // to do : check 'DataChangeFilter'  && 'AggregateFilter'
        }
        else {
            if (this.monitoringParameters.filter) {
                return {
                    error: "Mismatch between attributeId and filter in monitoring parameters : " +
                        "no filter expected when attributeId is not Value  or  EventNotifier"
                };
            }
        }
        return {
            itemToMonitor: this.itemToMonitor,
            monitoringMode: this.monitoringMode,
            requestedParameters: this.monitoringParameters
        };
    }
    /**
     * @internal
     * @param monitoredItemResult
     * @private
     */
    _applyResult(monitoredItemResult) {
        this.statusCode = monitoredItemResult.statusCode;
        /* istanbul ignore else */
        if (monitoredItemResult.statusCode.isGood()) {
            this.result = monitoredItemResult;
            this.monitoredItemId = monitoredItemResult.monitoredItemId;
            this.monitoringParameters.samplingInterval = monitoredItemResult.revisedSamplingInterval;
            this.monitoringParameters.queueSize = monitoredItemResult.revisedQueueSize;
            this.filterResult = monitoredItemResult.filterResult || undefined;
        }
        // some PublishRequest with DataNotificationChange might have been sent by the server, before the monitored
        // item has been fully initialized it is time to process now any pending notification that were put on hold.
        if (this._pendingDataValue) {
            const dataValues = this._pendingDataValue;
            this._pendingDataValue = undefined;
            setImmediate(() => {
                dataValues.map((dataValue) => this._notify_value_change(dataValue));
            });
        }
        if (this._pendingEvents) {
            const events = this._pendingEvents;
            this._pendingEvents = undefined;
            setImmediate(() => {
                events.map((event) => this._notify_event(event));
            });
        }
    }
    _before_create() {
        const subscription = this.subscription;
        subscription._add_monitored_item(this.monitoringParameters.clientHandle, this);
    }
    /**
     * @internal
     * @param monitoredItemResult
     * @private
     */
    _after_create(monitoredItemResult) {
        this._applyResult(monitoredItemResult);
        if (this.statusCode.isGood()) {
            /**
             * Notify the observers that the monitored item is now fully initialized.
             * @event initialized
             */
            this.emit("initialized");
        }
        else {
            /**
             * Notify the observers that the monitored item has failed to initialize.
             * @event err
             * @param statusCode {StatusCode}
             */
            const err = new Error(monitoredItemResult.statusCode.toString());
            this._terminate_and_emit(err);
        }
    }
    _terminate_and_emit(err) {
        if (this._terminated) {
            return; // already terminated
        }
        if (err) {
            this.emit("err", err.message);
        }
        (0, node_opcua_assert_1.assert)(!this._terminated);
        this._terminated = true;
        /**
         * Notify the observer that this monitored item has been terminated.
         * @event terminated
         */
        this.emit("terminated", err);
        this.removeAllListeners();
        // also remove from subscription
        const clientHandle = this.monitoringParameters.clientHandle;
        delete this.subscription.monitoredItems[clientHandle];
    }
}
exports.ClientMonitoredItemImpl = ClientMonitoredItemImpl;
// tslint:disable:no-var-requires
// tslint:disable:max-line-length
const thenify_ex_1 = require("thenify-ex");
const opts = { multiArgs: false };
ClientMonitoredItemImpl.prototype.terminate = (0, thenify_ex_1.withCallback)(ClientMonitoredItemImpl.prototype.terminate);
ClientMonitoredItemImpl.prototype.setMonitoringMode = (0, thenify_ex_1.withCallback)(ClientMonitoredItemImpl.prototype.setMonitoringMode);
ClientMonitoredItemImpl.prototype.modify = (0, thenify_ex_1.withCallback)(ClientMonitoredItemImpl.prototype.modify);
client_monitored_item_1.ClientMonitoredItem.create = (subscription, itemToMonitor, monitoringParameters, timestampsToReturn, monitoringMode = node_opcua_service_subscription_1.MonitoringMode.Reporting) => {
    return (0, client_subscription_impl_1.ClientMonitoredItem_create)(subscription, itemToMonitor, monitoringParameters, timestampsToReturn, monitoringMode);
};
//# sourceMappingURL=client_monitored_item_impl.js.map