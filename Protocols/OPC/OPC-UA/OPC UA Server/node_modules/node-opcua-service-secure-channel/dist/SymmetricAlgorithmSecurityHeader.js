"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymmetricAlgorithmSecurityHeader = void 0;
/**
 * @module node-opcua-service-secure-channel
 */
// Symmetric algorithms are used to secure all messages other than the OpenSecureChannel messages
// OPC UA Secure Conversation Message Header Release 1.02 Part 6 page 39
const node_opcua_basic_types_1 = require("node-opcua-basic-types");
const node_opcua_factory_1 = require("node-opcua-factory");
const schemaSymmetricAlgorithmSecurityHeader = (0, node_opcua_factory_1.buildStructuredType)({
    name: "SymmetricAlgorithmSecurityHeader",
    baseType: "BaseUAObject",
    fields: [
        // A unique identifier for the ClientSecureChannelLayer token used to secure the message
        // This identifier is returned by the server in an OpenSecureChannel response message. If a
        // Server receives a TokenId which it does not recognize it shall return an appropriate
        // transport layer error.
        { name: "TokenId", fieldType: "UInt32", defaultValue: 0xDEADBEEF }
    ]
});
class SymmetricAlgorithmSecurityHeader extends node_opcua_factory_1.BaseUAObject {
    constructor(options) {
        options = options || {};
        super();
        const schema = schemaSymmetricAlgorithmSecurityHeader;
        this.tokenId = (0, node_opcua_factory_1.initialize_field)(schema.fields[0], options.tokenId);
    }
    encode(stream) {
        // call base class implementation first
        super.encode(stream);
        (0, node_opcua_basic_types_1.encodeUInt32)(this.tokenId, stream);
    }
    decode(stream) {
        // call base class implementation first
        super.decode(stream);
        this.tokenId = (0, node_opcua_basic_types_1.decodeUInt32)(stream);
    }
}
exports.SymmetricAlgorithmSecurityHeader = SymmetricAlgorithmSecurityHeader;
SymmetricAlgorithmSecurityHeader.possibleFields = ["tokenId"];
SymmetricAlgorithmSecurityHeader.schema = schemaSymmetricAlgorithmSecurityHeader;
SymmetricAlgorithmSecurityHeader.prototype.schema = SymmetricAlgorithmSecurityHeader.schema;
//# sourceMappingURL=SymmetricAlgorithmSecurityHeader.js.map