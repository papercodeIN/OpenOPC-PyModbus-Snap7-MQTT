"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _MessageBuilder_instances, _MessageBuilder_objectFactory, _MessageBuilder_previousSequenceNumber, _MessageBuilder_derivedKeyProvider, _MessageBuilder_privateKey, _MessageBuilder__validateSequenceNumber, _MessageBuilder__decrypt_OPN, _MessageBuilder__decrypt_MSG, _MessageBuilder__decrypt, _MessageBuilder__safe_decode_message_body;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBuilder = exports.invalidPrivateKey = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/**
 * @module node-opcua-secure-channel
 */
// tslint:disable:variable-name
// tslint:disable:max-line-length
const util_1 = require("util");
const chalk_1 = __importDefault(require("chalk"));
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_basic_types_1 = require("node-opcua-basic-types");
const node_opcua_binary_stream_1 = require("node-opcua-binary-stream");
const web_1 = require("node-opcua-crypto/web");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_factory_1 = require("node-opcua-factory");
const node_opcua_packet_analyzer_1 = require("node-opcua-packet-analyzer");
const node_opcua_service_secure_channel_1 = require("node-opcua-service-secure-channel");
const node_opcua_status_code_1 = require("node-opcua-status-code");
const node_opcua_transport_1 = require("node-opcua-transport");
const node_opcua_utils_1 = require("node-opcua-utils");
const node_opcua_chunkmanager_1 = require("node-opcua-chunkmanager");
const node_opcua_transport_2 = require("node-opcua-transport");
const secure_channel_service_1 = require("./secure_channel_service");
const secure_message_chunk_manager_1 = require("./secure_message_chunk_manager");
const security_policy_1 = require("./security_policy");
const debugLog = (0, node_opcua_debug_1.make_debugLog)("SecureChannel");
const doDebug = (0, node_opcua_debug_1.checkDebugFlag)("SecureChannel");
const warningLog = (0, node_opcua_debug_1.make_warningLog)("SecureChannel");
const defaultObjectFactory = {
    constructObject(binaryEncodingNodeId) {
        return (0, node_opcua_factory_1.getStandardDataTypeFactory)().constructObject(binaryEncodingNodeId);
    },
    hasConstructor(binaryEncodingNodeId) {
        return (0, node_opcua_factory_1.getStandardDataTypeFactory)().hasConstructor(binaryEncodingNodeId);
    }
};
exports.invalidPrivateKey = null;
let counter = 0;
/**
 */
class MessageBuilder extends node_opcua_transport_1.MessageBuilderBase {
    /**
     *
     * @param derivedKeyProvider the key for client signing verification
     * @param options
     */
    constructor(derivedKeyProvider, options) {
        super(options);
        _MessageBuilder_instances.add(this);
        _MessageBuilder_objectFactory.set(this, void 0);
        _MessageBuilder_previousSequenceNumber.set(this, void 0);
        _MessageBuilder_derivedKeyProvider.set(this, void 0);
        _MessageBuilder_privateKey.set(this, void 0);
        __classPrivateFieldSet(this, _MessageBuilder_derivedKeyProvider, derivedKeyProvider, "f");
        options = options || {};
        this.id = (options.name ? options.name : "Id") + counter++;
        __classPrivateFieldSet(this, _MessageBuilder_privateKey, options.privateKey || exports.invalidPrivateKey, "f");
        this.securityPolicy = security_policy_1.SecurityPolicy.Invalid; // not known yet, we will need to call setSecurity
        this.securityMode = options.securityMode || node_opcua_service_secure_channel_1.MessageSecurityMode.Invalid; // not known yet
        __classPrivateFieldSet(this, _MessageBuilder_objectFactory, options.objectFactory || defaultObjectFactory, "f");
        (0, node_opcua_assert_1.assert)(typeof __classPrivateFieldGet(this, _MessageBuilder_objectFactory, "f").constructObject === "function", " the objectFactory must provide a constructObject method");
        __classPrivateFieldSet(this, _MessageBuilder_previousSequenceNumber, -1, "f"); // means unknown
        (0, node_opcua_assert_1.assert)(isFinite(__classPrivateFieldGet(this, _MessageBuilder_previousSequenceNumber, "f")));
    }
    setSecurity(securityMode, securityPolicy) {
        // can only be called once
        (0, node_opcua_assert_1.assert)(this.securityMode === node_opcua_service_secure_channel_1.MessageSecurityMode.Invalid, "security already set");
        this.securityPolicy = (0, security_policy_1.coerceSecurityPolicy)(securityPolicy);
        this.securityMode = (0, node_opcua_service_secure_channel_1.coerceMessageSecurityMode)(securityMode);
        (0, node_opcua_assert_1.assert)(this.securityPolicy !== security_policy_1.SecurityPolicy.Invalid);
        (0, node_opcua_assert_1.assert)(this.securityMode !== node_opcua_service_secure_channel_1.MessageSecurityMode.Invalid);
    }
    dispose() {
        super.dispose();
        this.securityHeader = undefined;
        __classPrivateFieldSet(this, _MessageBuilder_privateKey, exports.invalidPrivateKey, "f");
    }
    _read_headers(binaryStream) {
        if (!super._read_headers(binaryStream)) {
            return false;
        }
        // istanbul ignore next
        if (!this.messageHeader) {
            throw new Error("internal error");
        }
        try {
            const msgType = this.messageHeader.msgType;
            if (msgType === "HEL" || msgType === "ACK") {
                this.securityPolicy = security_policy_1.SecurityPolicy.None;
            }
            else if (msgType === "ERR") {
                // extract Error StatusCode and additional message
                binaryStream.length = 8;
                const errorCode = (0, node_opcua_status_code_1.decodeStatusCode)(binaryStream);
                const message = (0, node_opcua_basic_types_1.decodeString)(binaryStream);
                /* istanbul ignore next */
                if (doDebug) {
                    debugLog(chalk_1.default.red.bold(" ERROR RECEIVED FROM SENDER"), chalk_1.default.cyan(errorCode.toString()), message);
                    debugLog((0, node_opcua_debug_1.hexDump)(binaryStream.buffer));
                }
                if (node_opcua_transport_2.doTraceChunk) {
                    warningLog((0, node_opcua_utils_1.timestamp)(), chalk_1.default.red("   >$$ "), chalk_1.default.red(this.messageHeader.msgType), chalk_1.default.red("nbChunk = " + this.messageChunks.length.toString().padStart(3)), chalk_1.default.red("totalLength = " + this.totalMessageSize.toString().padStart(8)), "l=", this.messageHeader.length.toString().padStart(6), errorCode.toString(), message);
                }
                return true;
            }
            else {
                this.securityHeader = (0, secure_message_chunk_manager_1.chooseSecurityHeader)(msgType);
                this.securityHeader.decode(binaryStream);
                if (msgType === "OPN") {
                    const asymmetricAlgorithmSecurityHeader = this.securityHeader;
                    const securityPolicyFromResponse = (0, security_policy_1.coerceSecurityPolicy)(asymmetricAlgorithmSecurityHeader.securityPolicyUri);
                    if (securityPolicyFromResponse === security_policy_1.SecurityPolicy.Invalid) {
                        warningLog("Invalid Security Policy", this.securityPolicy);
                        return this._report_error(node_opcua_transport_1.StatusCodes2.BadSecurityChecksFailed, "Invalid Security Policy (1)");
                    }
                    if (this.securityPolicy === security_policy_1.SecurityPolicy.Invalid) {
                        this.securityPolicy = securityPolicyFromResponse;
                    }
                    if (securityPolicyFromResponse !== this.securityPolicy) {
                        warningLog("Invalid Security Policy", this.securityPolicy);
                        return this._report_error(node_opcua_transport_1.StatusCodes2.BadSecurityChecksFailed, "Invalid Security Policy (2)");
                    }
                }
                if (!__classPrivateFieldGet(this, _MessageBuilder_instances, "m", _MessageBuilder__decrypt).call(this, binaryStream)) {
                    return false;
                }
                this.sequenceHeader = new node_opcua_chunkmanager_1.SequenceHeader();
                this.sequenceHeader.decode(binaryStream);
                /* istanbul ignore next */
                if (doDebug) {
                    debugLog(" Sequence Header", this.sequenceHeader);
                }
                /* istanbul ignore next */
                if (node_opcua_transport_2.doTraceChunk) {
                    console.log(chalk_1.default.cyan((0, node_opcua_utils_1.timestamp)()), chalk_1.default.green("   >$$ "), chalk_1.default.green(this.messageHeader.msgType), chalk_1.default.green("nbChunk = " + this.messageChunks.length.toString().padStart(3)), chalk_1.default.green("totalLength = " + this.totalMessageSize.toString().padStart(8)), "l=", this.messageHeader.length.toString().padStart(6), "s=", this.sequenceHeader.sequenceNumber.toString().padEnd(4), "r=", this.sequenceHeader.requestId.toString().padEnd(4));
                }
                if (!__classPrivateFieldGet(this, _MessageBuilder_instances, "m", _MessageBuilder__validateSequenceNumber).call(this, this.sequenceHeader.sequenceNumber)) {
                    return false;
                }
            }
            return true;
        }
        catch (err) {
            warningLog(chalk_1.default.red("Error"), err.message);
            return this._report_error(node_opcua_transport_1.StatusCodes2.BadTcpInternalError, "Internal Error " + err.message);
        }
    }
    _decodeMessageBody(fullMessageBody) {
        // istanbul ignore next
        if (!this.messageHeader || !this.securityHeader) {
            return this._report_error(node_opcua_transport_1.StatusCodes2.BadTcpInternalError, "internal error");
        }
        const msgType = this.messageHeader.msgType;
        /* istanbul ignore next */
        if (msgType === "HEL" || msgType === "ACK" || msgType === "ERR") {
            // invalid message type
            return this._report_error(node_opcua_transport_1.StatusCodes2.BadTcpMessageTypeInvalid, "Invalid message type ( HEL/ACK/ERR )");
        }
        if (msgType === "CLO" && fullMessageBody.length === 0 && this.sequenceHeader) {
            // The Client closes the connection by sending a CloseSecureChannel request and closing the
            // socket gracefully. When the Server receives this Message, it shall release all resources
            // allocated for the channel. The body of the CloseSecureChannel request is empty. The Server
            // does not send a CloseSecureChannel response.
            const objMessage1 = new node_opcua_service_secure_channel_1.CloseSecureChannelRequest();
            this.emit("message", objMessage1, msgType, this.securityHeader, this.sequenceHeader.requestId, this.channelId);
            return true;
        }
        const binaryStream = new node_opcua_binary_stream_1.BinaryStream(fullMessageBody);
        // read expandedNodeId:
        let id;
        try {
            id = (0, node_opcua_basic_types_1.decodeExpandedNodeId)(binaryStream);
        }
        catch (err) {
            // this may happen if the message is not well formed or has been altered
            // we better off reporting an error and abort the communication
            return this._report_error(node_opcua_transport_1.StatusCodes2.BadTcpInternalError, "decodeExpandedNodeId " + (util_1.types.isNativeError(err) ? err.message : ""));
        }
        if (!__classPrivateFieldGet(this, _MessageBuilder_objectFactory, "f").hasConstructor(id)) {
            // the datatype NodeId is not supported by the server and unknown in the factory
            // we better off reporting an error and abort the communication
            return this._report_error(node_opcua_status_code_1.StatusCodes.BadNotSupported, "cannot construct object with nodeID " + id.toString());
        }
        // construct the object
        const objMessage = __classPrivateFieldGet(this, _MessageBuilder_objectFactory, "f").constructObject(id);
        if (!objMessage) {
            return this._report_error(node_opcua_status_code_1.StatusCodes.BadNotSupported, "cannot construct object with nodeID " + id);
        }
        else {
            if (__classPrivateFieldGet(this, _MessageBuilder_instances, "m", _MessageBuilder__safe_decode_message_body).call(this, fullMessageBody, objMessage, binaryStream)) {
                /* istanbul ignore next */
                if (doDebug) {
                    const o = objMessage;
                    const requestHandle = o.responseHeader
                        ? o.responseHeader.requestHandle
                        : o.requestHeader
                            ? o.requestHeader.requestHandle
                            : "";
                    debugLog(this.id, "message size =", ("" + this.totalMessageSize).padEnd(8), " body size   =", ("" + this.totalBodySize).padEnd(8), " requestHandle = ", requestHandle, objMessage.constructor.name);
                }
                try {
                    /**
                     * notify the observers that a full message has been received
                     * @event message
                     * @param  objMessage the decoded message object
                     * @param  msgType the message type ( "HEL","ACK","OPN","CLO" or "MSG" )
                     * @param  the request Id
                     */
                    this.emit("message", objMessage, msgType, this.securityHeader, this.sequenceHeader.requestId, this.channelId);
                }
                catch (err) {
                    // this code catches a uncaught exception somewhere in one of the event handler
                    // this indicates a bug in the code that uses this class
                    // please check the stack trace to find the problem
                    /* istanbul ignore next */
                    if (doDebug) {
                        debugLog(err);
                    }
                    warningLog(chalk_1.default.red("MessageBuilder : ERROR DETECTED IN 'message' event handler"), err.message);
                    if (util_1.types.isNativeError(err)) {
                        warningLog(err.message);
                        // warningLog(err.stack);
                    }
                }
            }
            else {
                warningLog("cannot decode message  for valid object of type " + id.toString() + " " + objMessage.constructor.name);
                this.emit("invalid_message", objMessage);
                debugLog(this.id, "message size =", ("" + this.totalMessageSize).padEnd(8), " body size   =", ("" + this.totalBodySize).padEnd(8), objMessage.constructor.name);
                warningLog(objMessage.toString());
                // we don't report an error here, we just ignore the message
                return false; // this._report_error(message);
            }
        }
        return true;
    }
}
exports.MessageBuilder = MessageBuilder;
_MessageBuilder_objectFactory = new WeakMap(), _MessageBuilder_previousSequenceNumber = new WeakMap(), _MessageBuilder_derivedKeyProvider = new WeakMap(), _MessageBuilder_privateKey = new WeakMap(), _MessageBuilder_instances = new WeakSet(), _MessageBuilder__validateSequenceNumber = function _MessageBuilder__validateSequenceNumber(sequenceNumber) {
    // checking that sequenceNumber is increasing
    (0, node_opcua_assert_1.assert)(isFinite(__classPrivateFieldGet(this, _MessageBuilder_previousSequenceNumber, "f")));
    (0, node_opcua_assert_1.assert)(isFinite(sequenceNumber) && sequenceNumber >= 0);
    let expectedSequenceNumber;
    if (__classPrivateFieldGet(this, _MessageBuilder_previousSequenceNumber, "f") !== -1) {
        expectedSequenceNumber = __classPrivateFieldGet(this, _MessageBuilder_previousSequenceNumber, "f") + 1;
        if (expectedSequenceNumber !== sequenceNumber) {
            const errMessage = "Invalid Sequence Number found ( expected " + expectedSequenceNumber + ", got " + sequenceNumber + ")";
            /* istanbul ignore next */
            debugLog(chalk_1.default.red.bold(errMessage));
            /**
             * notify the observers that a message with an invalid sequence number has been received.
             * @event invalid_sequence_number
             * @param  expected sequence Number
             * @param  actual sequence Number
             */
            this.emit("invalid_sequence_number", expectedSequenceNumber, sequenceNumber);
            return this._report_error(node_opcua_transport_1.StatusCodes2.BadTcpInternalError, errMessage);
        }
        // todo : handle the case where sequenceNumber wraps back to < 1024
    }
    /* istanbul ignore next */
    if (doDebug) {
        debugLog(chalk_1.default.yellow.bold("" + this.id + " Sequence Number = "), sequenceNumber);
    }
    __classPrivateFieldSet(this, _MessageBuilder_previousSequenceNumber, sequenceNumber, "f");
    return true;
}, _MessageBuilder__decrypt_OPN = function _MessageBuilder__decrypt_OPN(binaryStream) {
    (0, node_opcua_assert_1.assert)(this.securityPolicy !== security_policy_1.SecurityPolicy.None);
    (0, node_opcua_assert_1.assert)(this.securityPolicy !== security_policy_1.SecurityPolicy.Invalid);
    (0, node_opcua_assert_1.assert)(this.securityMode !== node_opcua_service_secure_channel_1.MessageSecurityMode.None);
    (0, node_opcua_assert_1.assert)(this.securityHeader instanceof node_opcua_service_secure_channel_1.AsymmetricAlgorithmSecurityHeader);
    const asymmetricAlgorithmSecurityHeader = this.securityHeader;
    /* istanbul ignore next */
    if (doDebug) {
        debugLog("securityHeader = {");
        debugLog("              securityPolicyId: ", asymmetricAlgorithmSecurityHeader.securityPolicyUri);
        debugLog("             senderCertificate: ", (0, web_1.makeSHA1Thumbprint)(asymmetricAlgorithmSecurityHeader.senderCertificate).toString("hex"));
        debugLog("};");
    }
    // istanbul ignore next
    if (doDebug) {
        // OpcUA part 2 V 1.02 page 15
        // 4.11 OPC UA Security Related Services
        // [...]
        // The OPC UA Client sends its Public Key in a Digital Certificate and secret information with the
        // OpenSecureChannel service Message to the Server. This Message is secured by applying
        // Asymmetric Encryption with the Server's Public Key and by generating Asymmetric Signatures with
        // the Client's Private Key. However the Digital Certificate is sent unencrypted so that the receiver can
        // use it to verify the Asymmetric Signature.
        // [...]
        //
        /* istanbul ignore next */
        debugLog(chalk_1.default.cyan("EN------------------------------"));
        // xx debugLog(hexDump(binaryStream.buffer, 32, 0xFFFFFFFF));
        debugLog("---------------------- SENDER CERTIFICATE");
        debugLog("thumbprint ", (0, web_1.makeSHA1Thumbprint)(asymmetricAlgorithmSecurityHeader.senderCertificate).toString("hex"));
    }
    // istanbul ignore next
    if (node_opcua_transport_2.doTraceChunk) {
        const thumb = (0, web_1.makeSHA1Thumbprint)(asymmetricAlgorithmSecurityHeader.senderCertificate).toString("hex");
        warningLog((0, node_opcua_utils_1.timestamp)(), ` >$$ securityPolicyId:  ${asymmetricAlgorithmSecurityHeader.securityPolicyUri} ${thumb} `);
    }
    const cryptoFactory = (0, security_policy_1.getCryptoFactory)(this.securityPolicy);
    // istanbul ignore next
    if (!cryptoFactory) {
        return this._report_error(node_opcua_transport_1.StatusCodes2.BadTcpInternalError, " Security Policy " + this.securityPolicy + " is not implemented yet");
    }
    // The message has been signed  with sender private key and has been encrypted with receiver public key.
    // We shall decrypt it with the receiver private key.
    const buf = binaryStream.buffer.subarray(binaryStream.length);
    if (asymmetricAlgorithmSecurityHeader.receiverCertificateThumbprint) {
        if (this.securityMode === node_opcua_service_secure_channel_1.MessageSecurityMode.None) {
            warningLog("receiverCertificateThumbprint is not null but securityMode is None");
        }
        // this mean that the message has been encrypted ....
        (0, node_opcua_assert_1.assert)(__classPrivateFieldGet(this, _MessageBuilder_privateKey, "f") !== exports.invalidPrivateKey, "expecting a valid private key");
        try {
            const decryptedBuffer = cryptoFactory.asymmetricDecrypt(buf, __classPrivateFieldGet(this, _MessageBuilder_privateKey, "f"));
            // replace decrypted buffer in initial buffer
            decryptedBuffer.copy(binaryStream.buffer, binaryStream.length);
            // adjust length
            binaryStream.buffer = binaryStream.buffer.subarray(0, binaryStream.length + decryptedBuffer.length);
        }
        catch (err) {
            // Cannot asymmetrically decrypt, may be the certificate used by the other party to encrypt
            // this package is wrong
            return this._report_error(node_opcua_transport_1.StatusCodes2.BadTcpInternalError, "Cannot decrypt OPN package " + err.message);
        }
        /* istanbul ignore next */
        if (doDebug) {
            debugLog(chalk_1.default.cyan("DE-----------------------------"));
            // debugLog(hexDump(binaryStream.buffer));
            debugLog(chalk_1.default.cyan("-------------------------------"));
            const thumbprint = (0, web_1.makeSHA1Thumbprint)(asymmetricAlgorithmSecurityHeader.senderCertificate);
            debugLog("Certificate thumbprint:", thumbprint.toString("hex"));
        }
    }
    else {
        if (this.securityMode !== node_opcua_service_secure_channel_1.MessageSecurityMode.None) {
            return this._report_error(node_opcua_transport_1.StatusCodes2.BadTcpInternalError, "Expecting a encrypted OpenSecureChannel message as securityMode is not None");
        }
    }
    const chunk = binaryStream.buffer;
    const { signatureLength, signatureIsOK } = (0, security_policy_1.asymmetricVerifyChunk)(cryptoFactory, chunk, asymmetricAlgorithmSecurityHeader.senderCertificate);
    if (!signatureIsOK) {
        /* istanbul ignore next */
        if (doDebug) {
            debugLog((0, node_opcua_debug_1.hexDump)(binaryStream.buffer));
        }
        return this._report_error(node_opcua_transport_1.StatusCodes2.BadTcpInternalError, "Sign and Encrypt asymmetricVerify : Invalid packet signature");
    }
    // remove signature
    binaryStream.buffer = (0, web_1.reduceLength)(binaryStream.buffer, signatureLength);
    // remove padding
    if (asymmetricAlgorithmSecurityHeader.receiverCertificateThumbprint) {
        binaryStream.buffer = (0, web_1.removePadding)(binaryStream.buffer);
    }
    return true; // success
}, _MessageBuilder__decrypt_MSG = function _MessageBuilder__decrypt_MSG(binaryStream) {
    // istanbul ignore next
    if (!(this.securityHeader instanceof secure_channel_service_1.SymmetricAlgorithmSecurityHeader)) {
        throw new Error("Internal error : expecting a SymmetricAlgorithmSecurityHeader");
    }
    (0, node_opcua_assert_1.assert)(this.securityMode !== node_opcua_service_secure_channel_1.MessageSecurityMode.None);
    (0, node_opcua_assert_1.assert)(this.securityMode !== node_opcua_service_secure_channel_1.MessageSecurityMode.Invalid);
    (0, node_opcua_assert_1.assert)(this.securityPolicy !== security_policy_1.SecurityPolicy.None);
    (0, node_opcua_assert_1.assert)(this.securityPolicy !== security_policy_1.SecurityPolicy.Invalid);
    const symmetricAlgorithmSecurityHeader = this.securityHeader;
    // Check  security token
    // securityToken may have been renewed
    const derivedKeys = __classPrivateFieldGet(this, _MessageBuilder_derivedKeyProvider, "f").getDerivedKey(symmetricAlgorithmSecurityHeader.tokenId);
    // istanbul ignore next
    if (!derivedKeys || derivedKeys.signatureLength === 0) {
        __classPrivateFieldGet(this, _MessageBuilder_derivedKeyProvider, "f").getDerivedKey(symmetricAlgorithmSecurityHeader.tokenId);
        return this._report_error(node_opcua_transport_1.StatusCodes2.BadSecureChannelTokenUnknown, "Security token data for token " + symmetricAlgorithmSecurityHeader.tokenId + " doesn't exist");
    }
    // We shall decrypt it with the receiver private key.
    const buf = binaryStream.buffer.subarray(binaryStream.length);
    if (this.securityMode === node_opcua_service_secure_channel_1.MessageSecurityMode.SignAndEncrypt) {
        const decryptedBuffer = (0, web_1.decryptBufferWithDerivedKeys)(buf, derivedKeys);
        // replace decrypted buffer in initial buffer
        decryptedBuffer.copy(binaryStream.buffer, binaryStream.length);
        // adjust length
        binaryStream.buffer = binaryStream.buffer.subarray(0, binaryStream.length + decryptedBuffer.length);
        /* istanbul ignore next */
        if (doDebug) {
            debugLog(chalk_1.default.cyan("DE-----------------------------"));
            debugLog((0, node_opcua_debug_1.hexDump)(binaryStream.buffer));
            debugLog(chalk_1.default.cyan("-------------------------------"));
        }
    }
    // now check signature ....
    const chunk = binaryStream.buffer;
    const signatureIsOK = (0, web_1.verifyChunkSignatureWithDerivedKeys)(chunk, derivedKeys);
    if (!signatureIsOK) {
        return this._report_error(node_opcua_transport_1.StatusCodes2.BadTcpInternalError, "_decrypt_MSG : Sign and Encrypt (derived keys) : Invalid packet signature");
    }
    // remove signature
    binaryStream.buffer = (0, web_1.reduceLength)(binaryStream.buffer, derivedKeys.signatureLength);
    if (this.securityMode === node_opcua_service_secure_channel_1.MessageSecurityMode.SignAndEncrypt) {
        // remove padding
        binaryStream.buffer = (0, web_1.removePadding)(binaryStream.buffer);
    }
    return true;
}, _MessageBuilder__decrypt = function _MessageBuilder__decrypt(binaryStream) {
    // istanbul ignore next
    if (!this.messageHeader) {
        throw new Error("internal error");
    }
    const msgType = this.messageHeader.msgType;
    // istanbul ignore next
    if (msgType !== "OPN" && this.securityPolicy === security_policy_1.SecurityPolicy.Invalid) {
        throw new Error("internal error : invalid securityPolicy" + this.securityPolicy);
    }
    // note: securityPolicy might still be Invalid when MSGType == OPN
    // check if security is active or not
    if (this.securityPolicy === security_policy_1.SecurityPolicy.None) {
        this.securityMode = node_opcua_service_secure_channel_1.MessageSecurityMode.None;
        (0, node_opcua_assert_1.assert)(this.securityMode === node_opcua_service_secure_channel_1.MessageSecurityMode.None, "expecting securityMode = None when securityPolicy is None");
        return true; // nothing to do
    }
    if (msgType === "OPN") {
        return __classPrivateFieldGet(this, _MessageBuilder_instances, "m", _MessageBuilder__decrypt_OPN).call(this, binaryStream);
    }
    else {
        return __classPrivateFieldGet(this, _MessageBuilder_instances, "m", _MessageBuilder__decrypt_MSG).call(this, binaryStream);
    }
}, _MessageBuilder__safe_decode_message_body = function _MessageBuilder__safe_decode_message_body(fullMessageBody, objMessage, binaryStream) {
    try {
        // de-serialize the object from the binary stream
        const options = __classPrivateFieldGet(this, _MessageBuilder_objectFactory, "f");
        objMessage.decode(binaryStream, options);
    }
    catch (err) {
        if (util_1.types.isNativeError(err)) {
            warningLog("Decode message error : ", err.message);
            // istanbul ignore next
            if (doDebug) {
                debugLog(err.stack);
                debugLog((0, node_opcua_debug_1.hexDump)(fullMessageBody));
                (0, node_opcua_packet_analyzer_1.analyseExtensionObject)(fullMessageBody, 0, 0);
                debugLog(" ---------------- block");
                let i = 0;
                this.messageChunks.forEach((messageChunk) => {
                    debugLog(" ---------------- chunk i=", i++);
                    debugLog((0, node_opcua_debug_1.hexDump)(messageChunk));
                });
            }
        }
        return false;
    }
    return true;
};
//# sourceMappingURL=message_builder.js.map