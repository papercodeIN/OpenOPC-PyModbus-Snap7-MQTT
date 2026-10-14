"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryServerCapabilities = void 0;
/**
 * @module node-opcua-server
 */
const node_opcua_assert_1 = require("node-opcua-assert");
/**
 */
class HistoryServerCapabilities {
    constructor(options) {
        options = options || {};
        function coerceBool(value, defaultValue) {
            if (undefined === value) {
                return defaultValue;
            }
            (0, node_opcua_assert_1.assert)(typeof value === "boolean");
            return value;
        }
        function coerceUInt32(value, defaultValue) {
            if (undefined === value) {
                return defaultValue;
            }
            (0, node_opcua_assert_1.assert)(typeof value === "number");
            return value;
        }
        this.accessHistoryDataCapability = coerceBool(options.accessHistoryDataCapability, false);
        this.accessHistoryEventsCapability = coerceBool(options.accessHistoryEventsCapability, false);
        this.maxReturnDataValues = coerceUInt32(options.maxReturnDataValues, 0);
        this.maxReturnEventValues = coerceUInt32(options.maxReturnEventValues, 0);
        this.insertDataCapability = coerceBool(options.insertDataCapability, false);
        this.replaceDataCapability = coerceBool(options.replaceDataCapability, false);
        this.updateDataCapability = coerceBool(options.updateDataCapability, false);
        this.deleteRawCapability = coerceBool(options.deleteRawCapability, false);
        this.deleteAtTimeCapability = coerceBool(options.deleteAtTimeCapability, false);
        this.insertEventCapability = coerceBool(options.insertEventCapability, false);
        this.replaceEventCapability = coerceBool(options.replaceEventCapability, false);
        this.updateEventCapability = coerceBool(options.updateEventCapability, false);
        this.deleteEventCapability = coerceBool(options.deleteEventCapability, false);
        this.insertAnnotationCapability = coerceBool(options.insertAnnotationCapability, false);
    }
}
exports.HistoryServerCapabilities = HistoryServerCapabilities;
//# sourceMappingURL=history_server_capabilities.js.map