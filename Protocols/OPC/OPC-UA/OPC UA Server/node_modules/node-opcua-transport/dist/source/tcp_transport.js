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
var _TCP_transport_instances, _a, _TCP_transport__closedEmitted, _TCP_transport__timerId, _TCP_transport__theCallback, _TCP_transport__on_error_during_one_time_message_receiver, _TCP_transport_packetAssembler, _TCP_transport__timeout, _TCP_transport__isDisconnecting, _TCP_transport__install_packetAssembler;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TCP_transport = void 0;
exports.setFakeTransport = setFakeTransport;
exports.getFakeTransport = getFakeTransport;
/* eslint-disable @typescript-eslint/ban-types */
/**
 * @module node-opcua-transport
 */
const events_1 = require("events");
const chalk_1 = __importDefault(require("chalk"));
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_object_registry_1 = require("node-opcua-object-registry");
const node_opcua_packet_assembler_1 = require("node-opcua-packet-assembler");
const status_codes_1 = require("./status_codes");
const message_builder_base_1 = require("./message_builder_base");
const utils_1 = require("./utils");
const TCPErrorMessage_1 = require("./TCPErrorMessage");
const tools_1 = require("./tools");
const debugLog = (0, node_opcua_debug_1.make_debugLog)("TRANSPORT");
const doDebug = (0, node_opcua_debug_1.checkDebugFlag)("TRANSPORT");
const errorLog = (0, node_opcua_debug_1.make_errorLog)("TRANSPORT");
const warningLog = (0, node_opcua_debug_1.make_warningLog)("TRANSPORT");
const doDebugFlow = false;
const defaultFakeSocket = {
    invalid: true,
    destroyed: false,
    destroy(err) {
        this.destroyed = true;
        errorLog("MockSocket.destroy");
    },
    end() {
        errorLog("MockSocket.end");
    },
    write(data, callback) {
        /** */
        if (callback) {
            callback();
        }
    },
    setKeepAlive(enable, initialDelay) {
        return this;
    },
    setNoDelay(noDelay) {
        return this;
    },
    setTimeout(timeout, callback) {
        return this;
    }
};
let fakeSocket = defaultFakeSocket;
function setFakeTransport(mockSocket) {
    fakeSocket = mockSocket;
}
function getFakeTransport() {
    if (fakeSocket.invalid) {
        throw new Error("getFakeTransport: setFakeTransport must be called first  - BadProtocolVersionUnsupported");
    }
    process.nextTick(() => fakeSocket.emit("connect"));
    return fakeSocket;
}
let counter = 0;
// tslint:disable:class-name
class TCP_transport extends events_1.EventEmitter {
    constructor() {
        super();
        _TCP_transport_instances.add(this);
        _TCP_transport__closedEmitted.set(this, undefined);
        _TCP_transport__timerId.set(this, void 0);
        _TCP_transport__theCallback.set(this, void 0);
        _TCP_transport__on_error_during_one_time_message_receiver.set(this, void 0);
        _TCP_transport_packetAssembler.set(this, void 0);
        _TCP_transport__timeout.set(this, void 0);
        _TCP_transport__isDisconnecting.set(this, false);
        this._theCloseError = null;
        this.name = this.constructor.name + counter;
        counter += 1;
        this._socket = null;
        __classPrivateFieldSet(this, _TCP_transport__timerId, null, "f");
        __classPrivateFieldSet(this, _TCP_transport__timeout, 5000, "f"); // 5  seconds timeout
        __classPrivateFieldSet(this, _TCP_transport__theCallback, undefined, "f");
        this.maxMessageSize = 0;
        this.maxChunkCount = 0;
        this.receiveBufferSize = 0;
        this.sendBufferSize = 0;
        this.protocolVersion = 0;
        this.bytesWritten = 0;
        this.bytesRead = 0;
        this.chunkWrittenCount = 0;
        this.chunkReadCount = 0;
        _a.registry.register(this);
    }
    toString() {
        let str = "\n";
        str += " name.............. = " + this.name + "\n";
        str += " protocolVersion... = " + this.protocolVersion + "\n";
        str += " maxMessageSize.... = " + this.maxMessageSize + "\n";
        str += " maxChunkCount..... = " + this.maxChunkCount + "\n";
        str += " receiveBufferSize. = " + this.receiveBufferSize + "\n";
        str += " sendBufferSize.... = " + this.sendBufferSize + "\n";
        str += " bytesRead......... = " + this.bytesRead + "\n";
        str += " bytesWritten...... = " + this.bytesWritten + "\n";
        str += " chunkWrittenCount. = " + this.chunkWrittenCount + "\n";
        str += " chunkReadCount.... = " + this.chunkReadCount + "\n";
        str += " closeEmitted ? ....= " + __classPrivateFieldGet(this, _TCP_transport__closedEmitted, "f") + "\n";
        return str;
    }
    setLimits({ receiveBufferSize, sendBufferSize, maxMessageSize, maxChunkCount }) {
        this.receiveBufferSize = receiveBufferSize;
        this.sendBufferSize = sendBufferSize;
        this.maxMessageSize = maxMessageSize;
        this.maxChunkCount = maxChunkCount;
        if (maxChunkCount !== 0) {
            if (maxMessageSize / sendBufferSize > maxChunkCount) {
                const expectedMaxChunkCount = Math.ceil(maxMessageSize / sendBufferSize);
                warningLog(`Warning: maxChunkCount is not big enough : maxMessageSize / sendBufferSize ${expectedMaxChunkCount} > maxChunkCount ${maxChunkCount}`);
            }
            if (maxMessageSize / receiveBufferSize > maxChunkCount) {
                const expectedMaxChunkCount = Math.ceil(maxMessageSize / receiveBufferSize);
                warningLog(`Warning: maxChunkCount is not big enough :maxMessageSize / sendBufferSize ${expectedMaxChunkCount} > maxChunkCount ${maxChunkCount}`);
            }
        }
        // reinstall packetAssembler with correct limits
        __classPrivateFieldGet(this, _TCP_transport_instances, "m", _TCP_transport__install_packetAssembler).call(this);
    }
    get timeout() {
        return __classPrivateFieldGet(this, _TCP_transport__timeout, "f");
    }
    set timeout(value) {
        (0, node_opcua_assert_1.assert)(!__classPrivateFieldGet(this, _TCP_transport__timerId, "f"));
        debugLog("Setting socket " + this.name + " timeout = ", value);
        __classPrivateFieldSet(this, _TCP_transport__timeout, value, "f");
    }
    dispose() {
        this._cleanup_timers();
        (0, node_opcua_assert_1.assert)(!__classPrivateFieldGet(this, _TCP_transport__timerId, "f"));
        if (this._socket) {
            const gracefully = true;
            if (gracefully) {
                // close the connection gracefully
                this._socket.end();
            }
            else {
                // close the connection forcefully
                this._socket.destroy();
            }
            //         this._socket.removeAllListeners();
            this._socket = null;
        }
        _a.registry.unregister(this);
    }
    /**
     * write the message_chunk on the socket.

     * @param messageChunk
     */
    write(messageChunk, callback) {
        const header = (0, message_builder_base_1.readRawMessageHeader)(messageChunk);
        (0, node_opcua_assert_1.assert)(header.length === messageChunk.length);
        const c = header.messageHeader.isFinal;
        (0, node_opcua_assert_1.assert)(c === "F" || c === "C" || c === "A");
        this._write_chunk(messageChunk, (err) => {
            callback && callback(err);
        });
    }
    isDisconnecting() {
        return !this._socket || __classPrivateFieldGet(this, _TCP_transport__isDisconnecting, "f");
    }
    /**
     * disconnect the TCP layer and close the underlying socket.
     * The ```"close"``` event will be emitted to the observers with err=null.
     *
     */
    disconnect(callback) {
        (0, node_opcua_assert_1.assert)(typeof callback === "function", "expecting a callback function, but got " + callback);
        if (!this._socket || __classPrivateFieldGet(this, _TCP_transport__isDisconnecting, "f")) {
            if (!__classPrivateFieldGet(this, _TCP_transport__isDisconnecting, "f")) {
                this.dispose();
            }
            callback();
            return;
        }
        __classPrivateFieldSet(this, _TCP_transport__isDisconnecting, true, "f");
        this._cleanup_timers();
        this._socket.prependOnceListener("close", () => {
            this._emitClose(null);
            setImmediate(() => {
                callback();
            });
        });
        this._socket.end();
        this._socket && this._socket.destroy();
        this._socket = null;
    }
    isValid() {
        return this._socket !== null && !this._socket.destroyed;
    }
    _write_chunk(messageChunk, callback) {
        if (this._socket !== null) {
            this.bytesWritten += messageChunk.length;
            this.chunkWrittenCount++;
            this._socket.write(messageChunk, callback);
        }
        else {
            if (callback) {
                callback();
            }
        }
    }
    _install_socket(socket) {
        // note: it is possible that a transport may be recycled and re-used again after a connection break
        (0, node_opcua_assert_1.assert)(socket);
        (0, node_opcua_assert_1.assert)(!this._socket, "already have a socket");
        this._socket = socket;
        __classPrivateFieldSet(this, _TCP_transport__closedEmitted, undefined, "f");
        this._theCloseError = null;
        (0, node_opcua_assert_1.assert)(__classPrivateFieldGet(this, _TCP_transport__closedEmitted, "f") === undefined, "TCP Transport has already been closed !");
        this._socket.setKeepAlive(true);
        // Setting true for noDelay will immediately fire off data each time socket.write() is called.
        this._socket.setNoDelay(true);
        // set socket timeout
        debugLog("  TCP_transport#install => setting " + this.name + " _socket.setTimeout to ", this.timeout);
        // let use a large timeout here to make sure that we not conflict with our internal timeout
        this._socket.setTimeout(this.timeout, () => {
        });
        // istanbul ignore next
        doDebug && debugLog("  TCP_transport#_install_socket ", this.name);
        __classPrivateFieldGet(this, _TCP_transport_instances, "m", _TCP_transport__install_packetAssembler).call(this);
        this._socket
            .on("data", (data) => this._on_socket_data(data))
            .on("close", (hadError) => this._on_socket_close(hadError))
            .on("end", () => this._on_socket_end())
            .on("error", (err) => this._on_socket_error(err))
            .on("timeout", () => this._on_socket_timeout());
    }
    sendErrorMessage(statusCode, extraErrorDescription) {
        // When the Client receives an Error Message it reports the error to the application and closes the TransportConnection gracefully.
        // If a Client encounters a fatal error, it shall report the error to the application and send a CloseSecureChannel Message.
        /* istanbul ignore next*/
        if (doDebug) {
            debugLog(chalk_1.default.red(" sendErrorMessage        ") + chalk_1.default.cyan(statusCode.toString()));
            debugLog(chalk_1.default.red(" extraErrorDescription   ") + chalk_1.default.cyan(extraErrorDescription));
        }
        const reason = `${statusCode.toString()}:${extraErrorDescription || ""}`;
        const errorResponse = new TCPErrorMessage_1.TCPErrorMessage({
            statusCode,
            reason
        });
        const messageChunk = (0, tools_1.packTcpMessage)("ERR", errorResponse);
        this.write(messageChunk);
    }
    prematureTerminate(err, statusCode) {
        // https://reference.opcfoundation.org/v104/Core/docs/Part6/6.7.3/
        debugLog("prematureTerminate", err ? err.message : "", statusCode.toString(), "has socket = ", !!this._socket);
        doDebugFlow && errorLog("prematureTerminate from", "has socket = ", !!this._socket, new Error().stack);
        if (this._socket) {
            err.message = "premature socket termination " + err.message;
            // we consider this as an error
            const _s = this._socket;
            this._socket = null;
            _s.destroy(err);
            this.dispose();
        }
    }
    forceConnectionBreak() {
        const socket = this._socket;
        if (!socket)
            return;
        socket.end();
        socket.emit("error", new Error("ECONNRESET"));
        socket.destroy(new Error("ECONNRESET"));
    }
    /**

     *
     * install a one time message receiver callback
     *
     * Rules:
     * * TCP_transport will not emit the ```message``` event, while the "one time message receiver" is in operation.
     * * the TCP_transport will wait for the next complete message chunk and call the provided callback func
     *   ```callback(null,messageChunk);```
     *
     * if a messageChunk is not received within ```TCP_transport.timeout``` or if the underlying socket reports
     * an error, the callback function will be called with an Error.
     *
     */
    _install_one_time_message_receiver(callback) {
        (0, node_opcua_assert_1.assert)(!__classPrivateFieldGet(this, _TCP_transport__theCallback, "f"), "callback already set");
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        this._start_one_time_message_receiver(callback);
    }
    _fulfill_pending_promises(err, data) {
        if (!__classPrivateFieldGet(this, _TCP_transport__theCallback, "f"))
            return false;
        doDebugFlow && errorLog("_fulfill_pending_promises from", new Error().stack);
        const callback = __classPrivateFieldGet(this, _TCP_transport__theCallback, "f");
        __classPrivateFieldSet(this, _TCP_transport__theCallback, undefined, "f");
        callback(err, data);
        return true;
    }
    _on_message_chunk_received(messageChunk) {
        if (utils_1.doTraceIncomingChunk) {
            warningLog("Transport", this.name);
            warningLog((0, node_opcua_debug_1.hexDump)(messageChunk));
        }
        const hadCallback = this._fulfill_pending_promises(null, messageChunk);
        this.chunkReadCount++;
        if (!hadCallback) {
            this.emit("chunk", messageChunk);
        }
    }
    _cleanup_timers() {
        if (__classPrivateFieldGet(this, _TCP_transport__timerId, "f")) {
            clearTimeout(__classPrivateFieldGet(this, _TCP_transport__timerId, "f"));
            __classPrivateFieldSet(this, _TCP_transport__timerId, null, "f");
        }
    }
    _start_one_time_message_receiver(callback) {
        (0, node_opcua_assert_1.assert)(!__classPrivateFieldGet(this, _TCP_transport__timerId, "f") && !__classPrivateFieldGet(this, _TCP_transport__on_error_during_one_time_message_receiver, "f"), "timer already started");
        const _cleanUp = () => {
            this._cleanup_timers();
            if (__classPrivateFieldGet(this, _TCP_transport__on_error_during_one_time_message_receiver, "f")) {
                this._socket?.removeListener("close", __classPrivateFieldGet(this, _TCP_transport__on_error_during_one_time_message_receiver, "f"));
                __classPrivateFieldSet(this, _TCP_transport__on_error_during_one_time_message_receiver, undefined, "f");
            }
        };
        const onTimeout = () => {
            _cleanUp();
            this._fulfill_pending_promises(new Error(`Timeout(A) in waiting for data on socket ( timeout was = ${this.timeout} ms)`));
            this.dispose();
        };
        // Setup timeout detection timer ....
        __classPrivateFieldSet(this, _TCP_transport__timerId, setTimeout(() => {
            __classPrivateFieldSet(this, _TCP_transport__timerId, null, "f");
            onTimeout();
        }, this.timeout), "f");
        // also monitored
        if (this._socket) {
            // to do = intercept socket error as well
            __classPrivateFieldSet(this, _TCP_transport__on_error_during_one_time_message_receiver, (hadError) => {
                const err = new Error(`ERROR in waiting for data on socket ( timeout was = ${this.timeout} ms) hadError` + hadError);
                this._emitClose(err);
                this._fulfill_pending_promises(err);
            }, "f");
            this._socket.prependOnceListener("close", __classPrivateFieldGet(this, _TCP_transport__on_error_during_one_time_message_receiver, "f"));
        }
        const _callback = callback;
        __classPrivateFieldSet(this, _TCP_transport__theCallback, (err, data) => {
            _cleanUp();
            __classPrivateFieldSet(this, _TCP_transport__theCallback, undefined, "f");
            _callback(err, data);
        }, "f");
    }
    _on_socket_data(data) {
        // istanbul ignore next
        if (!__classPrivateFieldGet(this, _TCP_transport_packetAssembler, "f")) {
            throw new Error("internal Error");
        }
        this.bytesRead += data.length;
        if (data.length > 0) {
            __classPrivateFieldGet(this, _TCP_transport_packetAssembler, "f").feed(data);
        }
    }
    _on_socket_close(hadError) {
        // istanbul ignore next
        if (doDebug) {
            debugLog(chalk_1.default.red(` SOCKET CLOSE ${this.name}: `), chalk_1.default.yellow("had_error ="), chalk_1.default.cyan(hadError.toString()));
        }
        this.dispose();
        if (__classPrivateFieldGet(this, _TCP_transport__theCallback, "f"))
            return;
        // if (hadError) {
        //     if (this._socket) {
        //         this._socket.destroy();
        //     }
        // }
        this._emitClose();
    }
    _emitClose(err) {
        err = err || this._theCloseError;
        doDebugFlow && warningLog("_emitClose ", err?.message || "", "from", new Error().stack);
        if (!__classPrivateFieldGet(this, _TCP_transport__closedEmitted, "f")) {
            __classPrivateFieldSet(this, _TCP_transport__closedEmitted, err || "noError", "f");
            this.emit("close", err || null);
            // if (this._theCallback) {
            //     const callback = this._theCallback;
            //     this._theCallback = undefined;
            //     callback(err || null);
            // }
        }
        else {
            debugLog("Already emitted close event", __classPrivateFieldGet(this, _TCP_transport__closedEmitted, "f").message);
            debugLog("err = ", err?.message);
            debugLog("");
            debugLog("Already emitted close event", __classPrivateFieldGet(this, _TCP_transport__closedEmitted, "f"));
            debugLog("err = ", err?.message, err);
        }
    }
    _on_socket_end() {
        // istanbul ignore next
        doDebug && debugLog(chalk_1.default.red(` SOCKET END : ${this.name}`), "is disconnecting  ", this.isDisconnecting());
        if (this.isDisconnecting()) {
            return;
        }
        //
        debugLog(chalk_1.default.red(" Transport Connection ended") + " " + this.name);
        const err = new Error(this.name + ": socket has been disconnected by third party");
        debugLog(" bytesRead    = ", this.bytesRead);
        debugLog(" bytesWritten = ", this.bytesWritten);
        this._theCloseError = err;
        this._fulfill_pending_promises(new Error("Connection aborted - ended by server : " + (err ? err.message : "")));
    }
    _on_socket_error(err) {
        // istanbul ignore next
        debugLog(chalk_1.default.red(` _on_socket_error:  ${this.name}`), chalk_1.default.yellow(err.message));
        // node The "close" event will be called directly following this event.
        // this._emitClose(err);
    }
    _on_socket_timeout() {
        const msg = `socket timeout : timeout=${this.timeout}  ${this.name}`;
        doDebug && debugLog(msg);
        this.prematureTerminate(new Error(msg), status_codes_1.StatusCodes2.BadTimeout);
    }
}
exports.TCP_transport = TCP_transport;
_a = TCP_transport, _TCP_transport__closedEmitted = new WeakMap(), _TCP_transport__timerId = new WeakMap(), _TCP_transport__theCallback = new WeakMap(), _TCP_transport__on_error_during_one_time_message_receiver = new WeakMap(), _TCP_transport_packetAssembler = new WeakMap(), _TCP_transport__timeout = new WeakMap(), _TCP_transport__isDisconnecting = new WeakMap(), _TCP_transport_instances = new WeakSet(), _TCP_transport__install_packetAssembler = function _TCP_transport__install_packetAssembler() {
    if (__classPrivateFieldGet(this, _TCP_transport_packetAssembler, "f")) {
        __classPrivateFieldGet(this, _TCP_transport_packetAssembler, "f").removeAllListeners();
        __classPrivateFieldSet(this, _TCP_transport_packetAssembler, undefined, "f");
    }
    // install packet assembler ...
    __classPrivateFieldSet(this, _TCP_transport_packetAssembler, new node_opcua_packet_assembler_1.PacketAssembler({
        readChunkFunc: message_builder_base_1.readRawMessageHeader,
        minimumSizeInBytes: _a.headerSize,
        maxChunkSize: this.receiveBufferSize //Math.max(this.receiveBufferSize, this.sendBufferSize)
    }), "f");
    __classPrivateFieldGet(this, _TCP_transport_packetAssembler, "f").on("chunk", (chunk) => this._on_message_chunk_received(chunk));
    __classPrivateFieldGet(this, _TCP_transport_packetAssembler, "f").on("error", (err, code) => {
        let statusCode = status_codes_1.StatusCodes2.BadTcpMessageTooLarge;
        switch (code) {
            case node_opcua_packet_assembler_1.PacketAssemblerErrorCode.ChunkSizeExceeded:
                statusCode = status_codes_1.StatusCodes2.BadTcpMessageTooLarge;
                break;
            default:
                statusCode = status_codes_1.StatusCodes2.BadTcpInternalError;
        }
        this.sendErrorMessage(statusCode, err.message);
        this.prematureTerminate(new Error("Packet Assembler : " + err.message), statusCode);
    });
};
TCP_transport.registry = new node_opcua_object_registry_1.ObjectRegistry();
/**
 * the size of the header in bytes
 * @default  8
 */
TCP_transport.headerSize = 8;
//# sourceMappingURL=tcp_transport.js.map