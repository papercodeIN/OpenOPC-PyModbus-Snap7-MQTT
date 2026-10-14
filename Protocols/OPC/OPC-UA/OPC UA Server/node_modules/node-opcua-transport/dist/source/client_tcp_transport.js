"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientTCP_transport = void 0;
/**
 * @module node-opcua-transport
 */
const os_1 = __importDefault(require("os"));
const net_1 = require("net");
const util_1 = require("util");
const chalk_1 = __importDefault(require("chalk"));
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_binary_stream_1 = require("node-opcua-binary-stream");
const node_opcua_chunkmanager_1 = require("node-opcua-chunkmanager");
const node_opcua_debug_1 = require("node-opcua-debug");
const tcp_transport_1 = require("./tcp_transport");
const tools_1 = require("./tools");
const AcknowledgeMessage_1 = require("./AcknowledgeMessage");
const HelloMessage_1 = require("./HelloMessage");
const TCPErrorMessage_1 = require("./TCPErrorMessage");
const utils_1 = require("./utils");
const doDebug = (0, node_opcua_debug_1.checkDebugFlag)(__filename);
const debugLog = (0, node_opcua_debug_1.make_debugLog)(__filename);
const warningLog = (0, node_opcua_debug_1.make_warningLog)(__filename);
const errorLog = (0, node_opcua_debug_1.make_errorLog)(__filename);
const gHostname = os_1.default.hostname();
function createClientSocket(endpointUrl, timeout) {
    // create a socket based on Url
    const ep = (0, tools_1.parseEndpointUrl)(endpointUrl);
    const port = parseInt(ep.port, 10);
    const hostname = ep.hostname;
    let socket;
    switch (ep.protocol) {
        case "opc.tcp:":
            socket = (0, net_1.createConnection)({ host: hostname, port, timeout }, () => {
                doDebug && debugLog(`connected to server! ${hostname}:${port} timeout:${timeout} `);
            });
            socket.setNoDelay(false);
            socket.setKeepAlive(true, timeout >> 1);
            return socket;
        case "fake:":
            (0, node_opcua_assert_1.assert)(ep.protocol === "fake:", " Unsupported transport protocol");
            socket = (0, tcp_transport_1.getFakeTransport)();
            return socket;
        case "websocket:":
        case "http:":
        case "https:":
        default: {
            const msg = "[NODE-OPCUA-E05] this transport protocol is not supported :" + ep.protocol;
            errorLog(msg);
            throw new Error(msg);
        }
    }
}
/**
 * a ClientTCP_transport connects to a remote server socket and
 * initiates a communication with a HEL/ACK transaction.
 * It negotiates the communication parameters with the other end.

 * @example
 *
 *    ```javascript
 *    const transport = ClientTCP_transport(url);
 *
 *    transport.timeout = 10000;
 *
 *    transport.connect(function (err)) {
 *         if (err) {
 *            // cannot connect
 *         } else {
 *            // connected
 *
 *         }
 *    });
 *    ....
 *
 *    transport.write(message_chunk, 'F');
 *
 *    ....
 *
 *    transport.on("chunk", function (message_chunk) {
 *        // do something with chunk from server...
 *    });
 *
 *
 * ```
 *
 *
 */
class ClientTCP_transport extends tcp_transport_1.TCP_transport {
    constructor(transportSettings) {
        super();
        this.endpointUrl = "";
        this.serverUri = "";
        this._counter = 0;
        this.numberOfRetry = 0;
        // initially before HEL/ACK
        this.maxChunkCount = 1;
        this.maxMessageSize = 4 * 1024;
        this.receiveBufferSize = 4 * 1024;
        transportSettings = transportSettings || {};
        this._helloSettings = {
            maxChunkCount: transportSettings.maxChunkCount || ClientTCP_transport.defaultMaxChunk,
            maxMessageSize: transportSettings.maxMessageSize || ClientTCP_transport.defaultMaxMessageSize,
            receiveBufferSize: transportSettings.receiveBufferSize || ClientTCP_transport.defaultReceiveBufferSize,
            sendBufferSize: transportSettings.sendBufferSize || ClientTCP_transport.defaultSendBufferSize
        };
    }
    getTransportSettings() {
        return this._helloSettings;
    }
    dispose() {
        /* istanbul ignore next */
        doDebug && debugLog(" ClientTCP_transport disposed");
        super.dispose();
    }
    connect(endpointUrl, callback) {
        const ep = (0, tools_1.parseEndpointUrl)(endpointUrl);
        this.endpointUrl = endpointUrl;
        this.serverUri = "urn:" + gHostname + ":Sample";
        /* istanbul ignore next */
        doDebug && debugLog(chalk_1.default.cyan("ClientTCP_transport#connect(endpointUrl = " + endpointUrl + ")"));
        let socket = null;
        try {
            socket = createClientSocket(endpointUrl, this.timeout);
            socket.setTimeout(this.timeout >> 1, () => {
                this.forceConnectionBreak();
            });
        }
        catch (err) {
            /* istanbul ignore next */
            doDebug && debugLog("CreateClientSocket has failed");
            return callback(err);
        }
        /**
         *
         */
        const _on_socket_error_after_connection = (err) => {
            /* istanbul ignore next */
            doDebug && debugLog(" _on_socket_error_after_connection ClientTCP_transport Socket Error", err.message);
            // EPIPE : EPIPE (Broken pipe): A write on a pipe, socket, or FIFO for which there is no process to read the
            // data. Commonly encountered at the net and http layers, indicative that the remote side of the stream
            // being written to has been closed.
            // ECONNRESET (Connection reset by peer): A connection was forcibly closed by a peer. This normally results
            // from a loss of the connection on the remote socket due to a timeout or reboot. Commonly encountered
            // via the http and net module
            //  socket termination could happen:
            //   * when the socket times out (lost of connection, network outage, etc...)
            //   * or, when the server abruptly disconnects the socket ( in case of invalid communication for instance)
            if (err.message.match(/ECONNRESET|EPIPE|premature socket termination/)) {
                /**
                 * @event connection_break
                 *
                 */
                warningLog("connection_break", endpointUrl);
                this.emit("connection_break");
            }
        };
        const _on_socket_connect = () => {
            /* istanbul ignore next */
            doDebug && debugLog("entering _on_socket_connect");
            _remove_connect_listeners();
            this._perform_HEL_ACK_transaction((err) => {
                if (!err) {
                    /* istanbul ignore next */
                    if (!this._socket) {
                        return callback(new Error("Abandoned"));
                    }
                    // install error handler to detect connection break
                    this._socket.on("error", _on_socket_error_after_connection);
                    /**
                     * notify the observers that the transport is connected (the socket is connected and the the HEL/ACK
                     * transaction has been done)
                     * @event connect
                     *
                     */
                    this.emit("connect");
                }
                else {
                    debugLog("_perform_HEL_ACK_transaction has failed with err=", err.message);
                }
                callback(err);
            });
        };
        const _on_socket_error_for_connect = (err) => {
            // this handler will catch attempt to connect to an inaccessible address.
            /* istanbul ignore next */
            doDebug && debugLog(chalk_1.default.cyan("ClientTCP_transport#connect - _on_socket_error_for_connect"), err.message);
            (0, node_opcua_assert_1.assert)(util_1.types.isNativeError(err));
            _remove_connect_listeners();
            callback(err);
        };
        const _on_socket_end_for_connect = () => {
            /* istanbul ignore next */
            doDebug &&
                debugLog(chalk_1.default.cyan("ClientTCP_transport#connect -> _on_socket_end_for_connect Socket has been closed by server"));
        };
        const _remove_connect_listeners = () => {
            /* istanbul ignore next */
            if (!this._socket) {
                return;
            }
            this._socket.removeListener("error", _on_socket_error_for_connect);
            this._socket.removeListener("end", _on_socket_end_for_connect);
        };
        this._install_socket(socket);
        this._socket.once("error", _on_socket_error_for_connect);
        this._socket.once("end", _on_socket_end_for_connect);
        this._socket.once("connect", _on_socket_connect);
    }
    _handle_ACK_response(messageChunk, callback) {
        const _stream = new node_opcua_binary_stream_1.BinaryStream(messageChunk);
        const messageHeader = (0, node_opcua_chunkmanager_1.readMessageHeader)(_stream);
        let err;
        /* istanbul ignore next */
        if (messageHeader.isFinal !== "F") {
            err = new Error(" invalid ACK message");
            return callback(err);
        }
        let responseClass;
        let response;
        if (messageHeader.msgType === "ERR") {
            responseClass = TCPErrorMessage_1.TCPErrorMessage;
            _stream.rewind();
            response = (0, tools_1.decodeMessage)(_stream, responseClass);
            err = new Error("ACK: ERR received " + response.statusCode.toString() + " : " + response.reason);
            err.statusCode = response.statusCode;
            // istanbul ignore next
            utils_1.doTraceHelloAck && warningLog("receiving ERR instead of Ack", response.toString());
            callback(err);
        }
        else {
            responseClass = AcknowledgeMessage_1.AcknowledgeMessage;
            _stream.rewind();
            response = (0, tools_1.decodeMessage)(_stream, responseClass);
            this.parameters = response;
            this.setLimits(response);
            // istanbul ignore next
            utils_1.doTraceHelloAck && warningLog("receiving Ack\n", response.toString());
            callback();
        }
    }
    _send_HELLO_request() {
        /* istanbul ignore next */
        doDebug && debugLog("entering _send_HELLO_request");
        (0, node_opcua_assert_1.assert)(this._socket);
        (0, node_opcua_assert_1.assert)(isFinite(this.protocolVersion));
        (0, node_opcua_assert_1.assert)(this.endpointUrl.length > 0, " expecting a valid endpoint url");
        const { maxChunkCount, maxMessageSize, receiveBufferSize, sendBufferSize } = this._helloSettings;
        // Write a message to the socket as soon as the client is connected,
        // the server will receive it as message from the client
        const helloMessage = new HelloMessage_1.HelloMessage({
            endpointUrl: this.endpointUrl,
            protocolVersion: this.protocolVersion,
            maxChunkCount,
            maxMessageSize,
            receiveBufferSize,
            sendBufferSize
        });
        // istanbul ignore next
        utils_1.doTraceHelloAck && warningLog(`sending Hello\n ${helloMessage.toString()} `);
        const messageChunk = (0, tools_1.packTcpMessage)("HEL", helloMessage);
        this._write_chunk(messageChunk);
    }
    _on_ACK_response(externalCallback, err, data) {
        /* istanbul ignore next */
        doDebug && debugLog("entering _on_ACK_response");
        (0, node_opcua_assert_1.assert)(typeof externalCallback === "function");
        (0, node_opcua_assert_1.assert)(this._counter === 0, "Ack response should only be received once !");
        this._counter += 1;
        if (err || !data) {
            externalCallback(err || new Error("no data"));
            if (this._socket) {
                this._socket.end();
            }
        }
        else {
            this._handle_ACK_response(data, externalCallback);
        }
    }
    _perform_HEL_ACK_transaction(callback) {
        /* istanbul ignore next */
        if (!this._socket) {
            return callback(new Error("No socket available to perform HEL/ACK transaction"));
        }
        (0, node_opcua_assert_1.assert)(this._socket, "expecting a valid socket to send a message");
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        this._counter = 0;
        /* istanbul ignore next */
        doDebug && debugLog("entering _perform_HEL_ACK_transaction");
        this._install_one_time_message_receiver((err, data) => {
            /* istanbul ignore next */
            doDebug && debugLog("before  _on_ACK_response ", err ? err.message : "");
            this._on_ACK_response(callback, err, data);
        });
        this._send_HELLO_request();
    }
}
exports.ClientTCP_transport = ClientTCP_transport;
ClientTCP_transport.defaultMaxChunk = 0; // 0 - no limits
ClientTCP_transport.defaultMaxMessageSize = 0; // 0 - no limits
ClientTCP_transport.defaultReceiveBufferSize = 1024 * 64 * 10;
ClientTCP_transport.defaultSendBufferSize = 1024 * 64 * 10; // 8192 min,
//# sourceMappingURL=client_tcp_transport.js.map