"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UAViewImpl = void 0;
/**
 * @module node-opcua-address-space
 */
const node_opcua_data_model_1 = require("node-opcua-data-model");
const node_opcua_data_model_2 = require("node-opcua-data-model");
const node_opcua_data_value_1 = require("node-opcua-data-value");
const node_opcua_status_code_1 = require("node-opcua-status-code");
const node_opcua_variant_1 = require("node-opcua-variant");
const node_opcua_address_space_base_1 = require("node-opcua-address-space-base");
const session_context_1 = require("../source/session_context");
const base_node_impl_1 = require("./base_node_impl");
class UAViewImpl extends base_node_impl_1.BaseNodeImpl {
    get eventNotifier() {
        return this._eventNotifier;
    }
    constructor(options) {
        super(options);
        this.nodeClass = node_opcua_data_model_1.NodeClass.View;
        this.containsNoLoops = !!options.containsNoLoops;
        this._eventNotifier = node_opcua_address_space_base_1.EventNotifierFlags.None;
    }
    readAttribute(context, attributeId) {
        context = context || session_context_1.SessionContext.defaultContext;
        const options = {};
        switch (attributeId) {
            case node_opcua_data_model_2.AttributeIds.EventNotifier:
                options.value = { dataType: node_opcua_variant_1.DataType.Byte, value: this.eventNotifier };
                options.statusCode = node_opcua_status_code_1.StatusCodes.Good;
                break;
            case node_opcua_data_model_2.AttributeIds.ContainsNoLoops:
                options.value = { dataType: node_opcua_variant_1.DataType.Boolean, value: this.containsNoLoops };
                options.statusCode = node_opcua_status_code_1.StatusCodes.Good;
                break;
            default:
                return super.readAttribute(context, attributeId);
        }
        return new node_opcua_data_value_1.DataValue(options);
    }
}
exports.UAViewImpl = UAViewImpl;
//# sourceMappingURL=ua_view_impl.js.map