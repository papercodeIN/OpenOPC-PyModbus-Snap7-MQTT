"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelloMessage = void 0;
/**
 * @module node-opcua-transport
 */
const node_opcua_basic_types_1 = require("node-opcua-basic-types");
const node_opcua_factory_1 = require("node-opcua-factory");
const schemaHelloMessage = (0, node_opcua_factory_1.buildStructuredType)({
    name: "HelloMessage",
    baseType: "BaseUAObject",
    fields: [
        {
            name: "ProtocolVersion",
            fieldType: "UInt32",
            documentation: "The latest version of the OPC UA TCP protocol supported by the Client"
        },
        {
            name: "ReceiveBufferSize",
            fieldType: "UInt32",
            documentation: "The largest message that the sender can receive."
        },
        {
            name: "SendBufferSize",
            fieldType: "UInt32",
            documentation: "The largest message that the sender will send."
        },
        { name: "MaxMessageSize", fieldType: "UInt32", documentation: "The maximum size for any response message." },
        {
            name: "maxChunkCount",
            fieldType: "UInt32",
            documentation: "The maximum number of chunks in any response message"
        },
        {
            name: "EndpointUrl",
            fieldType: "String",
            documentation: "The URL of the Endpoint which the Client wished to connect to."
        }
    ]
});
class HelloMessage extends node_opcua_factory_1.BaseUAObject {
    constructor(options) {
        options = options || {};
        super();
        const schema = schemaHelloMessage;
        /* istanbul ignore next */
        if (node_opcua_factory_1.parameters.debugSchemaHelper) {
            (0, node_opcua_factory_1.check_options_correctness_against_schema)(this, schema, options);
        }
        this.protocolVersion = (0, node_opcua_factory_1.initialize_field)(schema.fields[0], options.protocolVersion);
        this.receiveBufferSize = (0, node_opcua_factory_1.initialize_field)(schema.fields[1], options.receiveBufferSize);
        this.sendBufferSize = (0, node_opcua_factory_1.initialize_field)(schema.fields[2], options.sendBufferSize);
        this.maxMessageSize = (0, node_opcua_factory_1.initialize_field)(schema.fields[3], options.maxMessageSize);
        this.maxChunkCount = (0, node_opcua_factory_1.initialize_field)(schema.fields[4], options.maxChunkCount);
        this.endpointUrl = (0, node_opcua_factory_1.initialize_field)(schema.fields[5], options.endpointUrl);
    }
    encode(stream) {
        super.encode(stream);
        (0, node_opcua_basic_types_1.encodeUInt32)(this.protocolVersion, stream);
        (0, node_opcua_basic_types_1.encodeUInt32)(this.receiveBufferSize, stream);
        (0, node_opcua_basic_types_1.encodeUInt32)(this.sendBufferSize, stream);
        (0, node_opcua_basic_types_1.encodeUInt32)(this.maxMessageSize, stream);
        (0, node_opcua_basic_types_1.encodeUInt32)(this.maxChunkCount, stream);
        (0, node_opcua_basic_types_1.encodeUAString)(this.endpointUrl, stream);
    }
    decode(stream) {
        super.decode(stream);
        this.protocolVersion = (0, node_opcua_basic_types_1.decodeUInt32)(stream);
        this.receiveBufferSize = (0, node_opcua_basic_types_1.decodeUInt32)(stream);
        this.sendBufferSize = (0, node_opcua_basic_types_1.decodeUInt32)(stream);
        this.maxMessageSize = (0, node_opcua_basic_types_1.decodeUInt32)(stream);
        this.maxChunkCount = (0, node_opcua_basic_types_1.decodeUInt32)(stream);
        this.endpointUrl = (0, node_opcua_basic_types_1.decodeUAString)(stream);
    }
    toString() {
        let str = "";
        str += "protocolVersion   = " + this.protocolVersion + "\n";
        str += "receiveBufferSize = " + this.receiveBufferSize + "\n";
        str += "sendBufferSize    = " + this.sendBufferSize + "\n";
        str += "maxMessageSize    = " + this.maxMessageSize + "\n";
        str += "maxChunkCount     = " + this.maxChunkCount + "\n";
        str += "endpointUrl       = " + this.endpointUrl + "\n";
        return str;
    }
}
exports.HelloMessage = HelloMessage;
HelloMessage.possibleFields = [
    "protocolVersion",
    "receiveBufferSize",
    "sendBufferSize",
    "maxMessageSize",
    "maxChunkCount",
    "endpointUrl"
];
//# sourceMappingURL=HelloMessage.js.map