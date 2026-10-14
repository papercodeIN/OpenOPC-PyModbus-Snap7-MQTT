"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uninstallAlarmMonitoring = uninstallAlarmMonitoring;
exports.installAlarmMonitoring = installAlarmMonitoring;
const node_opcua_data_model_1 = require("node-opcua-data-model");
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
const node_opcua_service_filter_1 = require("node-opcua-service-filter");
const node_opcua_service_read_1 = require("node-opcua-service-read");
const node_opcua_variant_1 = require("node-opcua-variant");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_alarm_condition_1 = require("node-opcua-alarm-condition");
const doDebug = (0, node_opcua_debug_1.checkDebugFlag)("A&E");
const debugLog = (0, node_opcua_debug_1.make_debugLog)("A&E");
const warningLog = (0, node_opcua_debug_1.make_warningLog)("A&E");
function r(_key, o) {
    if (o && o.dataType === "Null") {
        return undefined;
    }
    return o;
}
// ------------------------------------------------------------------------------------------------------------------------------
async function uninstallAlarmMonitoring(session) {
    const _sessionPriv = session;
    if (!_sessionPriv.$clientAlarmList) {
        return;
    }
    const mi = _sessionPriv.$monitoredItemForAlarmList;
    mi.removeAllListeners();
    _sessionPriv.$monitoredItemForAlarmList = null;
    await _sessionPriv.$subscriptionForAlarmList.terminate();
    _sessionPriv.$clientAlarmList = null;
    return;
}
// Release 1.04 8 OPC Unified Architecture, Part 9
// 4.5 Condition state synchronization
//
// A Client that wishes to display the current status of Alarms and Conditions (known as a
// “current Alarm display”) would use the following logic to process Refresh Event Notifications.
// The Client flags all Retained Conditions as suspect on reception of the Event of the
// RefreshStartEventType. The Client adds any new Events that are received during the Refresh
// without flagging them as suspect. The Client also removes the suspect flag from any Retained
// Conditions that are returned as part of the Refresh. When the Client receives a
// RefreshEndEvent, the Client removes any remaining suspect Events, since they no longer
// apply.
// ------------------------------------------------------------------------------------------------------------------------------
async function installAlarmMonitoring(session) {
    const _sessionPriv = session;
    // create
    if (_sessionPriv.$clientAlarmList) {
        return _sessionPriv.$clientAlarmList;
    }
    const clientAlarmList = new node_opcua_alarm_condition_1.ClientAlarmList();
    _sessionPriv.$clientAlarmList = clientAlarmList;
    const request = {
        maxNotificationsPerPublish: 100,
        priority: 6,
        publishingEnabled: true,
        requestedLifetimeCount: 10000,
        requestedMaxKeepAliveCount: 10,
        requestedPublishingInterval: 500
    };
    const subscription = await session.createSubscription2(request);
    _sessionPriv.$subscriptionForAlarmList = subscription;
    const itemToMonitor = {
        attributeId: node_opcua_data_model_1.AttributeIds.EventNotifier,
        nodeId: (0, node_opcua_nodeid_1.resolveNodeId)("Server") // i=2253
    };
    const fields = await (0, node_opcua_alarm_condition_1.extractConditionFields)(session, "AlarmConditionType");
    const AcknowledgeableConditionType = (0, node_opcua_nodeid_1.resolveNodeId)("AcknowledgeableConditionType");
    const eventFilter = (0, node_opcua_service_filter_1.constructEventFilter)(fields, (0, node_opcua_service_filter_1.ofType)(AcknowledgeableConditionType));
    const monitoringParameters = {
        discardOldest: false,
        filter: eventFilter,
        queueSize: 1000,
        samplingInterval: 0
    };
    // now create a event monitored Item
    const eventMonitoringItem = await subscription.monitor(itemToMonitor, monitoringParameters, node_opcua_service_read_1.TimestampsToReturn.Both);
    const queueEvent = [];
    function flushQueue() {
        const q = [...queueEvent];
        queueEvent.length = 0;
        for (const pojo of q) {
            clientAlarmList.update(pojo);
        }
    }
    let inInit = true;
    eventMonitoringItem.on("changed", (eventFields) => {
        const pojo = (0, node_opcua_alarm_condition_1.fieldsToJson)(fields, eventFields);
        const { eventType, eventId, conditionId, conditionName } = pojo;
        debugLog("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ---- ALARM RECEIVED " +
            eventType.value.toString() +
            " " +
            eventId.value?.toString("hex"));
        try {
            if (!conditionId || !conditionId.value || conditionId.dataType === node_opcua_variant_1.DataType.Null) {
                // not a acknowledgeable condition
                warningLog(" not acknowledgeable condition ---- " + eventType.value.toString() + " ", conditionId, conditionName?.value, " " + eventId.value?.toString("hex"));
                return;
            }
            queueEvent.push(pojo);
            if (queueEvent.length === 1 && !inInit) {
                setTimeout(() => flushQueue(), 10);
            }
        }
        catch (err) {
            warningLog(JSON.stringify(pojo, r, " "));
            warningLog("Error !!", err);
        }
        // Release 1.04 8 OPC Unified Architecture, Part 9
        // 4.5 Condition state synchronization
        // RefreshRequiredEventType
        // Under some circumstances a Server may not be capable of ensuring the Client is fully
        //  in sync with the current state of Condition instances. For example, if the underlying
        // system represented by the Server is reset or communications are lost for some period
        // of time the Server may need to resynchronize itself with the underlying system. In
        // these cases, the Server shall send an Event of the RefreshRequiredEventType to
        // advise the Client that a Refresh may be necessary. A Client receiving this special
        // Event should initiate a ConditionRefresh as noted in this clause.
        // TODO
    });
    try {
        await (0, node_opcua_alarm_condition_1.callConditionRefresh)(session, subscription.subscriptionId);
    }
    catch (err) {
        if (err.message.match(/BadNothingToDo/)) {
            /** fine! nothing to do */
        }
        else {
            warningLog("Server may not implement condition refresh", err.message);
        }
    }
    _sessionPriv.$monitoredItemForAlarmList = eventMonitoringItem;
    setTimeout(() => flushQueue(), 10);
    inInit = false;
    // also request updates
    return clientAlarmList;
}
//# sourceMappingURL=client_alarm_tools.js.map