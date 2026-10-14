"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsymmetricAlgorithmSecurityHeader = void 0;
/**
 * @module node-opcua-service-secure-channel
 */
// OPC UA Secure Conversation Message Header : Part 6 page 36
// Asymmetric algorithms are used to secure the OpenSecureChannel messages.
const node_opcua_basic_types_1 = require("node-opcua-basic-types");
const node_opcua_factory_1 = require("node-opcua-factory");
const schemaAsymmetricAlgorithmSecurityHeader = (0, node_opcua_factory_1.buildStructuredType)({
    name: "AsymmetricAlgorithmSecurityHeader",
    baseType: "BaseUAObject",
    fields: [
        // length shall not exceed 256
        // The URI of the security policy used to secure the message.
        // This field is encoded as a UTF8 string without a null terminator
        { name: "SecurityPolicyUri", fieldType: "String" },
        // The X509v3 certificate assigned to the sending application instance.
        // This is a DER encoded blob.
        // This indicates what private key was used to sign the MessageChunk.
        // This field shall be null if the message is not signed.
        // The structure of an X509 Certificate is defined in X509.
        // The DER format for a Certificate is defined in X690
        // The Stack shall close the channel and report an error to the Application if the SenderCertificate
        // is too large for the buffer size supported by the transport layer.
        // If the Certificate is signed by a CA the DER encoded CA Certificate may be appended after the Certificate
        // in the byte array. If the CA Certificate is also signed by another CA this process is repeated until
        // the entire Certificate chain is in the buffer or if MaxSenderCertificateSize limit is reached
        // (the process stops after the last whole Certificate that can be added without exceeding the
        // MaxSenderCertificateSize limit).
        // Receivers can extract the Certificates from the byte array by using the Certificate size contained
        // in DER header (see X509).
        // Receivers that do not handle Certificate chains shall ignore the extra bytes.
        { name: "SenderCertificate", fieldType: "ByteString", defaultValue: null },
        // The thumbprint of the X509v3 certificate assigned to the receiving application
        // The thumbprint is the SHA1 digest of the DER encoded form of the certificate.
        // This indicates what public key was used to encrypt the MessageChunk
        // This field shall be null if the message is not encrypted.
        { name: "ReceiverCertificateThumbprint", fieldType: "ByteString", defaultValue: null }
    ]
});
class AsymmetricAlgorithmSecurityHeader extends node_opcua_factory_1.BaseUAObject {
    constructor(options) {
        options = options || {};
        super();
        const schema = schemaAsymmetricAlgorithmSecurityHeader;
        /* istanbul ignore next */
        if (node_opcua_factory_1.parameters.debugSchemaHelper) {
            (0, node_opcua_factory_1.check_options_correctness_against_schema)(this, schema, options);
        }
        this.securityPolicyUri = (0, node_opcua_factory_1.initialize_field)(schema.fields[0], options.securityPolicyUri);
        this.senderCertificate = (0, node_opcua_factory_1.initialize_field)(schema.fields[1], options.senderCertificate);
        this.receiverCertificateThumbprint = (0, node_opcua_factory_1.initialize_field)(schema.fields[2], options.receiverCertificateThumbprint);
    }
    encode(stream) {
        super.encode(stream);
        (0, node_opcua_basic_types_1.encodeString)(this.securityPolicyUri, stream);
        (0, node_opcua_basic_types_1.encodeByteString)(this.senderCertificate, stream);
        (0, node_opcua_basic_types_1.encodeByteString)(this.receiverCertificateThumbprint, stream);
    }
    decode(stream) {
        super.decode(stream);
        this.securityPolicyUri = (0, node_opcua_basic_types_1.decodeString)(stream);
        this.senderCertificate = (0, node_opcua_basic_types_1.decodeByteString)(stream);
        this.receiverCertificateThumbprint = (0, node_opcua_basic_types_1.decodeByteString)(stream);
    }
}
exports.AsymmetricAlgorithmSecurityHeader = AsymmetricAlgorithmSecurityHeader;
AsymmetricAlgorithmSecurityHeader.possibleFields = [
    "securityPolicyUri",
    "senderCertificate",
    "receiverCertificateThumbprint"
];
AsymmetricAlgorithmSecurityHeader.schema = schemaAsymmetricAlgorithmSecurityHeader;
AsymmetricAlgorithmSecurityHeader.prototype.schema = AsymmetricAlgorithmSecurityHeader.schema;
//# sourceMappingURL=AsymmetricAlgorithmSecurityHeader.js.map