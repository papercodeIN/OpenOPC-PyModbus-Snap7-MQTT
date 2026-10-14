"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerTCP_transport = void 0;
exports.adjustLimitsWithParameters = adjustLimitsWithParameters;
/**
 * @module node-opcua-transport
 */
// tslint:disable:class-name
// system
const util_1 = require("util");
const chalk_1 = __importDefault(require("chalk"));
const node_opcua_assert_1 = require("node-opcua-assert");
// opcua requires
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_binary_stream_1 = require("node-opcua-binary-stream");
const node_opcua_chunkmanager_1 = require("node-opcua-chunkmanager");
const node_opcua_status_code_1 = require("node-opcua-status-code");
// this package requires
const AcknowledgeMessage_1 = require("./AcknowledgeMessage");
const HelloMessage_1 = require("./HelloMessage");
const tcp_transport_1 = require("./tcp_transport");
const tools_1 = require("./tools");
const utils_1 = require("./utils");
const debugLog = (0, node_opcua_debug_1.make_debugLog)("TRANSPORT");
const errorLog = (0, node_opcua_debug_1.make_errorLog)("TRANSPORT");
const warningLog = (0, node_opcua_debug_1.make_warningLog)("TRANSPORT");
const doDebug = (0, node_opcua_debug_1.checkDebugFlag)("TRANSPORT");
function clamp_value(value, minVal, maxVal) {
    (0, node_opcua_assert_1.assert)(minVal <= maxVal);
    if (value === 0) {
        return maxVal;
    }
    if (value < minVal) {
        return minVal;
    }
    /* istanbul ignore next*/
    if (value >= maxVal) {
        return maxVal;
    }
    return value;
}
const minimumBufferSize = 8192;
const defaultTransportParameters = {
    minBufferSize: 8192,
    maxBufferSize: 8 * 64 * 1024,
    minMaxMessageSize: 128 * 1024,
    defaultMaxMessageSize: 16 * 1024 * 1024,
    maxMaxMessageSize: 128 * 1024 * 1024,
    minMaxChunkCount: 1,
    defaultMaxChunkCount: Math.ceil((128 * 1024 * 1024) / (8 * 64 * 1024)),
    maxMaxChunkCount: 9000
};
function adjustLimitsWithParameters(helloMessage, params) {
    const defaultReceiveBufferSize = 64 * 1024;
    const defaultSendBufferSize = 64 * 1024;
    const receiveBufferSize = clamp_value(helloMessage.receiveBufferSize || defaultReceiveBufferSize, params.minBufferSize, params.maxBufferSize);
    const sendBufferSize = clamp_value(helloMessage.sendBufferSize || defaultSendBufferSize, params.minBufferSize, params.maxBufferSize);
    const maxMessageSize = clamp_value(helloMessage.maxMessageSize || params.defaultMaxMessageSize, params.minMaxMessageSize, params.maxMaxMessageSize);
    if (!helloMessage.maxChunkCount && sendBufferSize) {
        helloMessage.maxChunkCount = Math.ceil(helloMessage.maxMessageSize / Math.min(sendBufferSize, receiveBufferSize));
    }
    const maxChunkCount = clamp_value(helloMessage.maxChunkCount || params.defaultMaxChunkCount, params.minMaxChunkCount, params.maxMaxChunkCount);
    return {
        receiveBufferSize,
        sendBufferSize,
        maxMessageSize,
        maxChunkCount
    };
}
const defaultAdjustLimits = (hello) => adjustLimitsWithParameters(hello, defaultTransportParameters);
/**
 * @private
 */
class ServerTCP_transport extends tcp_transport_1.TCP_transport {
    constructor(options) {
        super();
        this._aborted = 0;
        this._helloReceived = false;
        // before HEL/ACK
        this.maxChunkCount = 1;
        this.maxMessageSize = 4 * 1024;
        this.receiveBufferSize = 4 * 1024;
        this.adjustLimits = options?.adjustLimits || defaultAdjustLimits;
    }
    toString() {
        let str = super.toString();
        str += "helloReceived...... = " + this._helloReceived + "\n";
        str += "aborted............ = " + this._aborted + "\n";
        return str;
    }
    _write_chunk(messageChunk) {
        // istanbul ignore next
        if (this.sendBufferSize > 0 && messageChunk.length > this.sendBufferSize) {
            errorLog("write chunk exceed sendBufferSize messageChunk length = ", messageChunk.length, "sendBufferSize = ", this.sendBufferSize);
        }
        super._write_chunk(messageChunk);
    }
    /**
     * Initialize the server transport.
     *
     *
     *  The ServerTCP_transport initialization process starts by waiting for the client to send a "HEL" message.
     *
     *  The  ServerTCP_transport replies with a "ACK" message and then start waiting for further messages of any size.
     *
     *  The callback function received an error:
     *   - if no message from the client is received within the ```self.timeout``` period,
     *   - or, if the connection has dropped within the same interval.
     *   - if the protocol version specified within the HEL message is invalid or is greater
     *     than ```self.protocolVersion```
     *
     *
     */
    init(socket, callback) {
        // istanbul ignore next
        debugLog && debugLog(chalk_1.default.cyan("init socket"));
        (0, node_opcua_assert_1.assert)(!this._socket, "init already called!");
        this._install_socket(socket);
        this._install_HEL_message_receiver(callback);
    }
    _abortWithError(statusCode, extraErrorDescription, callback) {
        // When a fatal error occurs, the Server shall send an Error Message to the Client and
        // closes the TransportConnection gracefully.
        doDebug && debugLog(this.name, chalk_1.default.cyan("_abortWithError", statusCode.toString(), extraErrorDescription));
        /* istanbul ignore next */
        if (this._aborted) {
            errorLog("Internal Er!ror: _abortWithError already called! Should not happen here");
            // already called
            return callback(new Error(statusCode.name));
        }
        this._aborted = 1;
        this._socket?.setTimeout(0);
        const err = new Error(extraErrorDescription + " StatusCode = " + statusCode.name);
        this._theCloseError = err;
        setTimeout(() => {
            // send the error message and close the connection
            this.sendErrorMessage(statusCode, statusCode.description);
            this.prematureTerminate(err, statusCode);
            this._emitClose(err);
            callback(err);
        }, ServerTCP_transport.throttleTime);
    }
    _send_ACK_response(helloMessage) {
        (0, node_opcua_assert_1.assert)(helloMessage.receiveBufferSize >= minimumBufferSize);
        (0, node_opcua_assert_1.assert)(helloMessage.sendBufferSize >= minimumBufferSize);
        const limits = this.adjustLimits(helloMessage);
        this.setLimits(limits);
        // istanbul ignore next
        if (utils_1.doTraceHelloAck) {
            warningLog(`received Hello \n${helloMessage.toString()}`);
            warningLog("Client accepts only message of size => ", this.maxMessageSize);
        }
        // istanbul ignore next
        doDebug && debugLog("Client accepts only message of size => ", this.maxMessageSize);
        const acknowledgeMessage = new AcknowledgeMessage_1.AcknowledgeMessage({
            maxChunkCount: this.maxChunkCount,
            maxMessageSize: this.maxMessageSize,
            protocolVersion: this.protocolVersion,
            receiveBufferSize: this.receiveBufferSize,
            sendBufferSize: this.sendBufferSize
        });
        // istanbul ignore next
        utils_1.doTraceHelloAck && warningLog(`sending Ack \n${acknowledgeMessage.toString()}`);
        const messageChunk = (0, tools_1.packTcpMessage)("ACK", acknowledgeMessage);
        /* istanbul ignore next*/
        if (doDebug) {
            (0, node_opcua_chunkmanager_1.verify_message_chunk)(messageChunk);
            debugLog("server send: " + chalk_1.default.yellow("ACK"));
            debugLog("server send: " + (0, node_opcua_debug_1.hexDump)(messageChunk));
            debugLog("acknowledgeMessage=", acknowledgeMessage);
        }
        // send the ACK reply
        this.write(messageChunk);
    }
    _install_HEL_message_receiver(callback) {
        // istanbul ignore next
        doDebug && debugLog(chalk_1.default.cyan("_install_HEL_message_receiver "));
        this._install_one_time_message_receiver((err, data) => {
            if (err) {
                callback(err);
            }
            else {
                // pass to next stage handle the HEL message
                this._on_HEL_message(data, callback);
            }
        });
    }
    _on_HEL_message(data, callback) {
        // istanbul ignore next
        doDebug && debugLog(chalk_1.default.cyan("_on_HEL_message"));
        (0, node_opcua_assert_1.assert)(!this._helloReceived);
        const stream = new node_opcua_binary_stream_1.BinaryStream(data);
        const msgType = data.subarray(0, 3).toString("utf-8");
        /* istanbul ignore next*/
        if (doDebug) {
            debugLog("SERVER received " + chalk_1.default.yellow(msgType));
            debugLog("SERVER received " + (0, node_opcua_debug_1.hexDump)(data));
        }
        if (msgType === "HEL") {
            try {
                (0, node_opcua_assert_1.assert)(data.length >= 24);
                const helloMessage = (0, tools_1.decodeMessage)(stream, HelloMessage_1.HelloMessage);
                // OPCUA Spec 1.03 part 6 - page 41
                // The Server shall always accept versions greater than what it supports.
                if (helloMessage.protocolVersion !== this.protocolVersion) {
                    // istanbul ignore next
                    doDebug &&
                        debugLog(`warning ! client sent helloMessage.protocolVersion = ` +
                            ` 0x${helloMessage.protocolVersion.toString(16)} ` +
                            `whereas server protocolVersion is 0x${this.protocolVersion.toString(16)}`);
                }
                if (helloMessage.protocolVersion === 0xdeadbeef || helloMessage.protocolVersion < this.protocolVersion) {
                    // Note: 0xDEADBEEF is our special version number to simulate BadProtocolVersionUnsupported in tests
                    // invalid protocol version requested by client
                    return this._abortWithError(node_opcua_status_code_1.StatusCodes.BadProtocolVersionUnsupported, "Protocol Version Error" + this.protocolVersion, callback);
                }
                // OPCUA Spec 1.04 part 6 - page 45
                // UASC is designed to operate with different TransportProtocols that may have limited buffer
                // sizes. For this reason, OPC UA Secure Conversation will break OPC UA Messages into several
                // pieces (called ‘MessageChunks’) that are smaller than the buffer size allowed by the
                // TransportProtocol. UASC requires a TransportProtocol buffer size that is at least 8 192 bytes
                if (helloMessage.receiveBufferSize < minimumBufferSize || helloMessage.sendBufferSize < minimumBufferSize) {
                    return this._abortWithError(node_opcua_status_code_1.StatusCodes.BadConnectionRejected, "Buffer size too small (should be at least " + minimumBufferSize, callback);
                }
                // the helloMessage shall only be received once.
                this._helloReceived = true;
                this._send_ACK_response(helloMessage);
                callback(); // no Error
            }
            catch (err) {
                // connection rejected because of malformed message
                return this._abortWithError(node_opcua_status_code_1.StatusCodes.BadConnectionRejected, util_1.types.isNativeError(err) ? err.message : "", callback);
            }
        }
        else {
            // invalid packet , expecting HEL
            /* istanbul ignore next*/
            doDebug && debugLog(chalk_1.default.red("BadCommunicationError ") + "Expecting 'HEL' message to initiate communication");
            this._abortWithError(node_opcua_status_code_1.StatusCodes.BadCommunicationError, "Expecting 'HEL' message to initiate communication", callback);
        }
    }
}
exports.ServerTCP_transport = ServerTCP_transport;
ServerTCP_transport.throttleTime = 1000;
//# sourceMappingURL=server_tcp_transport.js.map