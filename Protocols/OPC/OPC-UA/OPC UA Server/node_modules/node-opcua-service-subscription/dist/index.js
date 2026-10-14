"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferSubscriptionsResponse = exports.TransferSubscriptionsRequest = exports.TransferResult = exports.SetTriggeringResponse = exports.SetTriggeringRequest = exports.AggregateFilter = exports.DataChangeFilter = exports.EventFieldList = exports.ContentFilterElementResult = exports.ContentFilterResult = exports.EventFilterResult = exports.SetMonitoringModeResponse = exports.SetMonitoringModeRequest = exports.ModifyMonitoredItemsResponse = exports.ModifyMonitoredItemsRequest = exports.MonitoredItemModifyResult = exports.MonitoredItemModifyRequest = exports.MonitoredItemNotification = exports.DeleteSubscriptionsResponse = exports.DeleteSubscriptionsRequest = exports.SetPublishingModeResponse = exports.SetPublishingModeRequest = exports.DeleteMonitoredItemsResponse = exports.DeleteMonitoredItemsRequest = exports.RepublishResponse = exports.RepublishRequest = exports.PublishResponse = exports.EventNotificationList = exports.StatusChangeNotification = exports.DataChangeNotification = exports.NotificationMessage = exports.PublishRequest = exports.SubscriptionAcknowledgement = exports.CreateMonitoredItemsResponse = exports.CreateMonitoredItemsRequest = exports.MonitoredItemCreateResult = exports.MonitoredItemCreateRequest = exports.MonitoringParameters = exports.ModifySubscriptionResponse = exports.ModifySubscriptionRequest = exports.CreateSubscriptionResponse = exports.CreateSubscriptionRequest = exports.DataChangeTrigger = exports.MonitoringMode = exports.NotificationData = void 0;
/**
 * @module node-opcua-service-subscription
 */
var node_opcua_types_1 = require("node-opcua-types");
Object.defineProperty(exports, "NotificationData", { enumerable: true, get: function () { return node_opcua_types_1.NotificationData; } });
Object.defineProperty(exports, "MonitoringMode", { enumerable: true, get: function () { return node_opcua_types_1.MonitoringMode; } });
Object.defineProperty(exports, "DataChangeTrigger", { enumerable: true, get: function () { return node_opcua_types_1.DataChangeTrigger; } });
Object.defineProperty(exports, "CreateSubscriptionRequest", { enumerable: true, get: function () { return node_opcua_types_1.CreateSubscriptionRequest; } });
Object.defineProperty(exports, "CreateSubscriptionResponse", { enumerable: true, get: function () { return node_opcua_types_1.CreateSubscriptionResponse; } });
Object.defineProperty(exports, "ModifySubscriptionRequest", { enumerable: true, get: function () { return node_opcua_types_1.ModifySubscriptionRequest; } });
Object.defineProperty(exports, "ModifySubscriptionResponse", { enumerable: true, get: function () { return node_opcua_types_1.ModifySubscriptionResponse; } });
Object.defineProperty(exports, "MonitoringParameters", { enumerable: true, get: function () { return node_opcua_types_1.MonitoringParameters; } });
Object.defineProperty(exports, "MonitoredItemCreateRequest", { enumerable: true, get: function () { return node_opcua_types_1.MonitoredItemCreateRequest; } });
Object.defineProperty(exports, "MonitoredItemCreateResult", { enumerable: true, get: function () { return node_opcua_types_1.MonitoredItemCreateResult; } });
Object.defineProperty(exports, "CreateMonitoredItemsRequest", { enumerable: true, get: function () { return node_opcua_types_1.CreateMonitoredItemsRequest; } });
Object.defineProperty(exports, "CreateMonitoredItemsResponse", { enumerable: true, get: function () { return node_opcua_types_1.CreateMonitoredItemsResponse; } });
Object.defineProperty(exports, "SubscriptionAcknowledgement", { enumerable: true, get: function () { return node_opcua_types_1.SubscriptionAcknowledgement; } });
Object.defineProperty(exports, "PublishRequest", { enumerable: true, get: function () { return node_opcua_types_1.PublishRequest; } });
Object.defineProperty(exports, "NotificationMessage", { enumerable: true, get: function () { return node_opcua_types_1.NotificationMessage; } });
Object.defineProperty(exports, "DataChangeNotification", { enumerable: true, get: function () { return node_opcua_types_1.DataChangeNotification; } });
Object.defineProperty(exports, "StatusChangeNotification", { enumerable: true, get: function () { return node_opcua_types_1.StatusChangeNotification; } });
Object.defineProperty(exports, "EventNotificationList", { enumerable: true, get: function () { return node_opcua_types_1.EventNotificationList; } });
Object.defineProperty(exports, "PublishResponse", { enumerable: true, get: function () { return node_opcua_types_1.PublishResponse; } });
Object.defineProperty(exports, "RepublishRequest", { enumerable: true, get: function () { return node_opcua_types_1.RepublishRequest; } });
Object.defineProperty(exports, "RepublishResponse", { enumerable: true, get: function () { return node_opcua_types_1.RepublishResponse; } });
Object.defineProperty(exports, "DeleteMonitoredItemsRequest", { enumerable: true, get: function () { return node_opcua_types_1.DeleteMonitoredItemsRequest; } });
Object.defineProperty(exports, "DeleteMonitoredItemsResponse", { enumerable: true, get: function () { return node_opcua_types_1.DeleteMonitoredItemsResponse; } });
Object.defineProperty(exports, "SetPublishingModeRequest", { enumerable: true, get: function () { return node_opcua_types_1.SetPublishingModeRequest; } });
Object.defineProperty(exports, "SetPublishingModeResponse", { enumerable: true, get: function () { return node_opcua_types_1.SetPublishingModeResponse; } });
Object.defineProperty(exports, "DeleteSubscriptionsRequest", { enumerable: true, get: function () { return node_opcua_types_1.DeleteSubscriptionsRequest; } });
Object.defineProperty(exports, "DeleteSubscriptionsResponse", { enumerable: true, get: function () { return node_opcua_types_1.DeleteSubscriptionsResponse; } });
Object.defineProperty(exports, "MonitoredItemNotification", { enumerable: true, get: function () { return node_opcua_types_1.MonitoredItemNotification; } });
Object.defineProperty(exports, "MonitoredItemModifyRequest", { enumerable: true, get: function () { return node_opcua_types_1.MonitoredItemModifyRequest; } });
Object.defineProperty(exports, "MonitoredItemModifyResult", { enumerable: true, get: function () { return node_opcua_types_1.MonitoredItemModifyResult; } });
Object.defineProperty(exports, "ModifyMonitoredItemsRequest", { enumerable: true, get: function () { return node_opcua_types_1.ModifyMonitoredItemsRequest; } });
Object.defineProperty(exports, "ModifyMonitoredItemsResponse", { enumerable: true, get: function () { return node_opcua_types_1.ModifyMonitoredItemsResponse; } });
Object.defineProperty(exports, "SetMonitoringModeRequest", { enumerable: true, get: function () { return node_opcua_types_1.SetMonitoringModeRequest; } });
Object.defineProperty(exports, "SetMonitoringModeResponse", { enumerable: true, get: function () { return node_opcua_types_1.SetMonitoringModeResponse; } });
Object.defineProperty(exports, "EventFilterResult", { enumerable: true, get: function () { return node_opcua_types_1.EventFilterResult; } });
Object.defineProperty(exports, "ContentFilterResult", { enumerable: true, get: function () { return node_opcua_types_1.ContentFilterResult; } });
Object.defineProperty(exports, "ContentFilterElementResult", { enumerable: true, get: function () { return node_opcua_types_1.ContentFilterElementResult; } });
Object.defineProperty(exports, "EventFieldList", { enumerable: true, get: function () { return node_opcua_types_1.EventFieldList; } });
Object.defineProperty(exports, "DataChangeFilter", { enumerable: true, get: function () { return node_opcua_types_1.DataChangeFilter; } });
Object.defineProperty(exports, "AggregateFilter", { enumerable: true, get: function () { return node_opcua_types_1.AggregateFilter; } });
Object.defineProperty(exports, "SetTriggeringRequest", { enumerable: true, get: function () { return node_opcua_types_1.SetTriggeringRequest; } });
Object.defineProperty(exports, "SetTriggeringResponse", { enumerable: true, get: function () { return node_opcua_types_1.SetTriggeringResponse; } });
Object.defineProperty(exports, "TransferResult", { enumerable: true, get: function () { return node_opcua_types_1.TransferResult; } });
Object.defineProperty(exports, "TransferSubscriptionsRequest", { enumerable: true, get: function () { return node_opcua_types_1.TransferSubscriptionsRequest; } });
Object.defineProperty(exports, "TransferSubscriptionsResponse", { enumerable: true, get: function () { return node_opcua_types_1.TransferSubscriptionsResponse; } });
__exportStar(require("./deadband_checker"), exports);
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_types_2 = require("node-opcua-types");
(0, node_opcua_assert_1.assert)(node_opcua_types_2.PublishResponse.schema.fields[1].name === "subscriptionId");
node_opcua_types_2.PublishResponse.schema.fields[1].defaultValue = 0xFFFFFFFF;
(0, node_opcua_assert_1.assert)(node_opcua_types_2.MonitoringParameters.schema.fields[0].name === "clientHandle");
node_opcua_types_2.MonitoringParameters.schema.fields[0].defaultValue = 0xFFFFFFFF;
//# sourceMappingURL=index.js.map