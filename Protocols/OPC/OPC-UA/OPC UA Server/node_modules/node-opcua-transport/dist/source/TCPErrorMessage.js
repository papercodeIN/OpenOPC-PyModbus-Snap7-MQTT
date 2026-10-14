"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TCPErrorMessage = void 0;
/**
 * @module node-opcua-transport
 */
const node_opcua_basic_types_1 = require("node-opcua-basic-types");
const node_opcua_factory_1 = require("node-opcua-factory");
const node_opcua_status_code_1 = require("node-opcua-status-code");
// TCP Error Message  OPC Unified Architecture, Part 6 page 46
// the server always close the connection after sending the TCPError message
const schemaTCPErrorMessage = (0, node_opcua_factory_1.buildStructuredType)({
    name: "TCPErrorMessage",
    baseType: "BaseUAObject",
    fields: [
        { name: "StatusCode", fieldType: "StatusCode" },
        { name: "Reason", fieldType: "String" } // A more verbose description of the error.
    ]
});
class TCPErrorMessage extends node_opcua_factory_1.BaseUAObject {
    constructor(options) {
        options = options || {};
        const schema = schemaTCPErrorMessage;
        super();
        /* istanbul ignore next */
        if (node_opcua_factory_1.parameters.debugSchemaHelper) {
            (0, node_opcua_factory_1.check_options_correctness_against_schema)(this, schema, options);
        }
        this.statusCode = (0, node_opcua_factory_1.initialize_field)(schema.fields[0], options.statusCode);
        this.reason = (0, node_opcua_factory_1.initialize_field)(schema.fields[1], options.reason);
    }
    encode(stream) {
        // call base class implementation first
        super.encode(stream);
        (0, node_opcua_status_code_1.encodeStatusCode)(this.statusCode, stream);
        (0, node_opcua_basic_types_1.encodeString)(this.reason, stream);
    }
    decode(stream) {
        // call base class implementation first
        super.decode(stream);
        this.statusCode = (0, node_opcua_status_code_1.decodeStatusCode)(stream);
        this.reason = (0, node_opcua_basic_types_1.decodeString)(stream);
    }
}
exports.TCPErrorMessage = TCPErrorMessage;
TCPErrorMessage.possibleFields = ["statusCode", "reason"];
//# sourceMappingURL=TCPErrorMessage.js.map