"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promoteOpaqueStructureInNotificationData = promoteOpaqueStructureInNotificationData;
const node_opcua_types_1 = require("node-opcua-types");
const node_opcua_variant_1 = require("node-opcua-variant");
const promote_opaque_structure_1 = require("./promote_opaque_structure");
async function promoteOpaqueStructureInNotificationData(session, notificationData) {
    const dataValuesToPromote = [];
    for (const notification of notificationData) {
        if (!notification) {
            continue;
        }
        if (notification instanceof node_opcua_types_1.DataChangeNotification) {
            if (notification.monitoredItems) {
                for (const monitoredItem of notification.monitoredItems) {
                    if (monitoredItem.value.value && monitoredItem.value.value.dataType === node_opcua_variant_1.DataType.ExtensionObject) {
                        dataValuesToPromote.push(monitoredItem.value);
                    }
                }
            }
        }
        else if (notification instanceof node_opcua_types_1.EventNotificationList) {
            if (notification.events) {
                for (const events of notification.events) {
                    if (events.eventFields) {
                        // eslint-disable-next-line max-depth
                        for (const eventField of events.eventFields) {
                            // eslint-disable-next-line max-depth
                            if (eventField.dataType === node_opcua_variant_1.DataType.ExtensionObject) {
                                dataValuesToPromote.push({ value: eventField });
                            }
                        }
                    }
                }
            }
        }
    }
    await (0, promote_opaque_structure_1.promoteOpaqueStructure)(session, dataValuesToPromote);
}
//# sourceMappingURL=promote_opaque_structure_in_notification_data.js.map