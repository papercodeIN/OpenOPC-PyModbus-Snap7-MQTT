"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientMonitoredItemGroupImpl = void 0;
/**
 * @module node-opcua-client-private
 */
// tslint:disable:no-empty
const events_1 = require("events");
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_data_value_1 = require("node-opcua-data-value");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_service_subscription_1 = require("node-opcua-service-subscription");
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
const client_monitored_item_group_1 = require("../client_monitored_item_group");
const client_monitored_item_toolbox_1 = require("../client_monitored_item_toolbox");
const client_monitored_item_impl_1 = require("./client_monitored_item_impl");
const debugLog = (0, node_opcua_debug_1.make_debugLog)(__filename);
const doDebug = (0, node_opcua_debug_1.checkDebugFlag)(__filename);
const warningLog = (0, node_opcua_debug_1.make_warningLog)(__filename);
/**
 * ClientMonitoredItemGroup
 * event:
 *    "initialized"
 *    "err"
 *    "changed"
 *
 *  note: this.monitoringMode = subscription_service.MonitoringMode.Reporting;
 */
class ClientMonitoredItemGroupImpl extends events_1.EventEmitter {
    constructor(subscription, itemsToMonitor, monitoringParameters, timestampsToReturn, monitoringMode = node_opcua_service_subscription_1.MonitoringMode.Reporting) {
        super();
        (0, node_opcua_assert_1.assert)(Array.isArray(itemsToMonitor));
        // Try to resolve the nodeId and fail fast if we can't.
        itemsToMonitor.forEach((itemToMonitor) => {
            itemToMonitor.nodeId = (0, node_opcua_nodeid_1.resolveNodeId)(itemToMonitor.nodeId);
        });
        timestampsToReturn = (0, node_opcua_data_value_1.coerceTimestampsToReturn)(timestampsToReturn);
        (0, node_opcua_assert_1.assert)(subscription.constructor.name === "ClientSubscriptionImpl");
        this.subscription = subscription;
        this.timestampsToReturn = timestampsToReturn;
        this.monitoringMode = monitoringMode;
        this.monitoredItems = itemsToMonitor.map((itemToMonitor) => new client_monitored_item_impl_1.ClientMonitoredItemImpl(subscription, itemToMonitor, monitoringParameters, node_opcua_data_value_1.TimestampsToReturn.Both, this.monitoringMode));
    }
    toString() {
        let ret = "ClientMonitoredItemGroup : \n";
        ret +=
            "itemsToMonitor:       = [\n " +
                this.monitoredItems
                    .slice(0, 10)
                    .map((monitoredItem) => 
                //  monitoredItem.itemToMonitor.toString() +
                monitoredItem.toString())
                    .join("\n") +
                "\n];\n";
        ret += "timestampsToReturn:   " + node_opcua_data_value_1.TimestampsToReturn[this.timestampsToReturn] + "\n";
        ret += "monitoringMode        " + node_opcua_service_subscription_1.MonitoringMode[this.monitoringMode];
        return ret;
    }
    terminate(...args) {
        const done = args[0];
        (0, node_opcua_assert_1.assert)(!done || typeof done === "function");
        const subscription = this.subscription;
        subscription._delete_monitored_items(this.monitoredItems, (err) => {
            subscription._removeGroup(this);
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
        client_monitored_item_toolbox_1.ClientMonitoredItemToolbox._toolbox_modify(this.subscription, this.monitoredItems, parameters, this.timestampsToReturn, (err) => {
            callback(err ? err : undefined);
        });
    }
    setMonitoringMode(...args) {
        const monitoringMode = args[0];
        const callback = args[1];
        client_monitored_item_toolbox_1.ClientMonitoredItemToolbox._toolbox_setMonitoringMode(this.subscription, this.monitoredItems, monitoringMode, (err, statusCode) => {
            // todo fix me
            callback(err, statusCode[0]);
        });
    }
    /**
     * @internal

     * Creates the monitor item (monitoring mode = Reporting)
     * @private
     */
    _monitor(done) {
        (0, node_opcua_assert_1.assert)(done === undefined || typeof done === "function");
        this.monitoredItems.forEach((monitoredItem, index) => {
            monitoredItem.on("changed", (dataValue) => {
                /**
                 * Notify the observers that a group MonitoredItem value has changed on the server side.
                 * @event changed
                 * @param monitoredItem
                 * @param value
                 * @param index
                 */
                try {
                    this.emit("changed", monitoredItem, dataValue, index);
                }
                catch (err) {
                    warningLog(`[NODE-OPCUA-W20] the monitoredItem.on('changed') handler has raised an exception.
error message : ${err.message}
Please investigate the code of the event handler function to fix the error.`);
                }
            });
        });
        client_monitored_item_toolbox_1.ClientMonitoredItemToolbox._toolbox_monitor(this.subscription, this.timestampsToReturn, this.monitoredItems, (err) => {
            if (err) {
                this._terminate_and_emit(err);
            }
            else {
                this.emit("initialized");
                // set the event handler
                const priv_subscription = this.subscription;
                priv_subscription._add_monitored_items_group(this);
            }
            if (done) {
                done(err);
            }
        });
    }
    _terminate_and_emit(err) {
        (0, node_opcua_assert_1.assert)(!this._terminated);
        this._terminated = true;
        if (err) {
            this.emit("err", err.message);
        }
        this.emit("terminated", err);
    }
}
exports.ClientMonitoredItemGroupImpl = ClientMonitoredItemGroupImpl;
// tslint:disable:no-var-requires
// tslint:disable:max-line-length
const thenify_ex_1 = require("thenify-ex");
const opts = { multiArgs: false };
ClientMonitoredItemGroupImpl.prototype.terminate = (0, thenify_ex_1.withCallback)(ClientMonitoredItemGroupImpl.prototype.terminate);
ClientMonitoredItemGroupImpl.prototype.setMonitoringMode = (0, thenify_ex_1.withCallback)(ClientMonitoredItemGroupImpl.prototype.setMonitoringMode);
ClientMonitoredItemGroupImpl.prototype.modify = (0, thenify_ex_1.withCallback)(ClientMonitoredItemGroupImpl.prototype.modify);
client_monitored_item_group_1.ClientMonitoredItemGroup.create = (subscription, itemsToMonitor, monitoringParameters, timestampsToReturn) => {
    const monitoredItemGroup = new ClientMonitoredItemGroupImpl(subscription, itemsToMonitor, monitoringParameters, timestampsToReturn);
    const priv_subscription = subscription;
    priv_subscription._wait_for_subscription_to_be_ready((err) => {
        if (err) {
            return;
        }
        monitoredItemGroup._monitor((err1) => {
            /** */
        });
    });
    return monitoredItemGroup;
};
//# sourceMappingURL=client_monitored_item_group_impl.js.map