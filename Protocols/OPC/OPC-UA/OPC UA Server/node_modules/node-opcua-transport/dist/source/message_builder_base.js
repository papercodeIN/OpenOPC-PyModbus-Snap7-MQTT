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
var _MessageBuilderBase_instances, _MessageBuilderBase__packetAssembler, _MessageBuilderBase__securityDefeated, _MessageBuilderBase__hasReceivedError, _MessageBuilderBase_blocks, _MessageBuilderBase__expectedChannelId, _MessageBuilderBase_offsetBodyStart, _MessageBuilderBase__init_new, _MessageBuilderBase__append, _MessageBuilderBase__feed_messageChunk;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBuilderBase = void 0;
exports.readRawMessageHeader = readRawMessageHeader;
/**
 * @module node-opcua-transport
 */
const events_1 = require("events");
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_basic_types_1 = require("node-opcua-basic-types");
const node_opcua_binary_stream_1 = require("node-opcua-binary-stream");
const node_opcua_buffer_utils_1 = require("node-opcua-buffer-utils");
const node_opcua_chunkmanager_1 = require("node-opcua-chunkmanager");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_packet_assembler_1 = require("node-opcua-packet-assembler");
const node_opcua_utils_1 = require("node-opcua-utils");
const status_codes_1 = require("./status_codes");
const doPerfMonitoring = process.env.NODEOPCUADEBUG && process.env.NODEOPCUADEBUG.indexOf("PERF") >= 0;
const errorLog = (0, node_opcua_debug_1.make_errorLog)("MessageBuilder");
const debugLog = (0, node_opcua_debug_1.make_debugLog)("MessageBuilder");
const warningLog = (0, node_opcua_debug_1.make_warningLog)("MessageBuilder");
function readRawMessageHeader(data) {
    const messageHeader = (0, node_opcua_chunkmanager_1.readMessageHeader)(new node_opcua_binary_stream_1.BinaryStream(data));
    return {
        extra: "",
        length: messageHeader.length,
        messageHeader
    };
}
/**
 *
 */
class MessageBuilderBase extends events_1.EventEmitter {
    constructor(options) {
        super();
        _MessageBuilderBase_instances.add(this);
        _MessageBuilderBase__packetAssembler.set(this, void 0);
        _MessageBuilderBase__securityDefeated.set(this, void 0);
        _MessageBuilderBase__hasReceivedError.set(this, void 0);
        _MessageBuilderBase_blocks.set(this, void 0);
        _MessageBuilderBase__expectedChannelId.set(this, void 0);
        _MessageBuilderBase_offsetBodyStart.set(this, void 0);
        this.id = "";
        this._tick0 = 0;
        this._tick1 = 0;
        __classPrivateFieldSet(this, _MessageBuilderBase__hasReceivedError, false, "f");
        __classPrivateFieldSet(this, _MessageBuilderBase_blocks, [], "f");
        this.messageChunks = [];
        __classPrivateFieldSet(this, _MessageBuilderBase__expectedChannelId, 0, "f");
        options = options || {
            maxMessageSize: 0,
            maxChunkCount: 0,
            maxChunkSize: 0
        };
        this.signatureLength = options.signatureLength || 0;
        this.maxMessageSize = options.maxMessageSize || MessageBuilderBase.defaultMaxMessageSize;
        this.maxChunkCount = options.maxChunkCount || MessageBuilderBase.defaultMaxChunkCount;
        this.maxChunkSize = options.maxChunkSize || MessageBuilderBase.defaultMaxChunkSize;
        this.options = options;
        __classPrivateFieldSet(this, _MessageBuilderBase__packetAssembler, new node_opcua_packet_assembler_1.PacketAssembler({
            minimumSizeInBytes: 8,
            maxChunkSize: this.maxChunkSize,
            readChunkFunc: readRawMessageHeader
        }), "f");
        __classPrivateFieldGet(this, _MessageBuilderBase__packetAssembler, "f").on("chunk", (messageChunk) => __classPrivateFieldGet(this, _MessageBuilderBase_instances, "m", _MessageBuilderBase__feed_messageChunk).call(this, messageChunk));
        __classPrivateFieldGet(this, _MessageBuilderBase__packetAssembler, "f").on("startChunk", (info, data) => {
            if (doPerfMonitoring) {
                // record tick 0: when the first data is received
                this._tick0 = (0, node_opcua_utils_1.get_clock_tick)();
            }
            this.emit("startChunk", info, data);
        });
        __classPrivateFieldGet(this, _MessageBuilderBase__packetAssembler, "f").on("error", (err) => {
            warningLog("packet assembler ", err.message);
            return this._report_error(status_codes_1.StatusCodes2.BadTcpMessageTooLarge, "packet assembler: " + err.message);
        });
        __classPrivateFieldSet(this, _MessageBuilderBase__securityDefeated, false, "f");
        this.totalBodySize = 0;
        this.totalMessageSize = 0;
        this.channelId = 0;
        __classPrivateFieldSet(this, _MessageBuilderBase_offsetBodyStart, 0, "f");
        this.sequenceHeader = null;
        __classPrivateFieldGet(this, _MessageBuilderBase_instances, "m", _MessageBuilderBase__init_new).call(this);
    }
    dispose() {
        this.removeAllListeners();
    }
    /**
     * Feed message builder with some data

     * @param data
     */
    feed(data) {
        if (!__classPrivateFieldGet(this, _MessageBuilderBase__securityDefeated, "f") && !__classPrivateFieldGet(this, _MessageBuilderBase__hasReceivedError, "f")) {
            __classPrivateFieldGet(this, _MessageBuilderBase__packetAssembler, "f").feed(data);
        }
    }
    _decodeMessageBody(fullMessageBody) {
        return true;
    }
    _read_headers(binaryStream) {
        try {
            this.messageHeader = (0, node_opcua_chunkmanager_1.readMessageHeader)(binaryStream);
            // assert(binaryStream.length === 8, "expecting message header to be 8 bytes");
            this.channelId = binaryStream.readUInt32();
            // assert(binaryStream.length === 12);
            // verifying secure ChannelId
            if (__classPrivateFieldGet(this, _MessageBuilderBase__expectedChannelId, "f") && this.channelId !== __classPrivateFieldGet(this, _MessageBuilderBase__expectedChannelId, "f")) {
                return this._report_error(status_codes_1.StatusCodes2.BadTcpSecureChannelUnknown, "Invalid secure channel Id");
            }
            return true;
        }
        catch (err) {
            return this._report_error(status_codes_1.StatusCodes2.BadTcpInternalError, "_read_headers error " + err.message);
        }
    }
    _report_abandon(channelId, tokenId, sequenceHeader) {
        // the server has not been able to send a complete message and has abandoned the request
        // the connection can probably continue
        __classPrivateFieldSet(this, _MessageBuilderBase__hasReceivedError, false, "f"); ///
        this.emit("abandon", sequenceHeader.requestId);
        return false;
    }
    _report_error(statusCode, errorMessage) {
        __classPrivateFieldSet(this, _MessageBuilderBase__hasReceivedError, true, "f");
        errorLog("Error  ", this.id, errorMessage);
        // xx errorLog(new Error());
        this.emit("error", new Error(errorMessage), statusCode, this.sequenceHeader?.requestId || null);
        return false;
    }
}
exports.MessageBuilderBase = MessageBuilderBase;
_MessageBuilderBase__packetAssembler = new WeakMap(), _MessageBuilderBase__securityDefeated = new WeakMap(), _MessageBuilderBase__hasReceivedError = new WeakMap(), _MessageBuilderBase_blocks = new WeakMap(), _MessageBuilderBase__expectedChannelId = new WeakMap(), _MessageBuilderBase_offsetBodyStart = new WeakMap(), _MessageBuilderBase_instances = new WeakSet(), _MessageBuilderBase__init_new = function _MessageBuilderBase__init_new() {
    __classPrivateFieldSet(this, _MessageBuilderBase__securityDefeated, false, "f");
    __classPrivateFieldSet(this, _MessageBuilderBase__hasReceivedError, false, "f");
    this.totalBodySize = 0;
    this.totalMessageSize = 0;
    __classPrivateFieldSet(this, _MessageBuilderBase_blocks, [], "f");
    this.messageChunks = [];
}, _MessageBuilderBase__append = function _MessageBuilderBase__append(chunk) {
    if (__classPrivateFieldGet(this, _MessageBuilderBase__hasReceivedError, "f")) {
        // the message builder is in error mode and further message chunks should be discarded.
        return false;
    }
    if (this.messageChunks.length + 1 > this.maxChunkCount) {
        return this._report_error(status_codes_1.StatusCodes2.BadTcpMessageTooLarge, `max chunk count exceeded: ${this.maxChunkCount}`);
    }
    this.messageChunks.push(chunk);
    this.totalMessageSize += chunk.length;
    if (this.totalMessageSize > this.maxMessageSize) {
        return this._report_error(status_codes_1.StatusCodes2.BadTcpMessageTooLarge, `max message size exceeded: ${this.maxMessageSize} : total message size ${this.totalMessageSize}`);
    }
    const binaryStream = new node_opcua_binary_stream_1.BinaryStream(chunk);
    if (!this._read_headers(binaryStream)) {
        return false; // error already reported
    }
    (0, node_opcua_assert_1.assert)(binaryStream.length >= 12);
    // verify message chunk length
    if (this.messageHeader.length !== chunk.length) {
        // tslint:disable:max-line-length
        return this._report_error(status_codes_1.StatusCodes2.BadTcpInternalError, `Invalid messageChunk size: the provided chunk is ${chunk.length} bytes long but header specifies ${this.messageHeader.length}`);
    }
    // the start of the message body block
    const offsetBodyStart = binaryStream.length;
    // the end of the message body block
    const offsetBodyEnd = binaryStream.buffer.length;
    this.totalBodySize += offsetBodyEnd - offsetBodyStart;
    __classPrivateFieldSet(this, _MessageBuilderBase_offsetBodyStart, offsetBodyStart, "f");
    // add message body to a queue
    // note : Buffer.slice create a shared memory !
    //        use Buffer.clone
    const sharedBuffer = chunk.subarray(__classPrivateFieldGet(this, _MessageBuilderBase_offsetBodyStart, "f"), offsetBodyEnd);
    const clonedBuffer = (0, node_opcua_buffer_utils_1.createFastUninitializedBuffer)(sharedBuffer.length);
    sharedBuffer.copy(clonedBuffer, 0, 0);
    __classPrivateFieldGet(this, _MessageBuilderBase_blocks, "f").push(clonedBuffer);
    return true;
}, _MessageBuilderBase__feed_messageChunk = function _MessageBuilderBase__feed_messageChunk(chunk) {
    (0, node_opcua_assert_1.assert)(chunk);
    const messageHeader = (0, node_opcua_chunkmanager_1.readMessageHeader)(new node_opcua_binary_stream_1.BinaryStream(chunk));
    this.emit("chunk", chunk);
    if (messageHeader.isFinal === "F") {
        if (messageHeader.msgType === "ERR") {
            const binaryStream = new node_opcua_binary_stream_1.BinaryStream(chunk);
            binaryStream.length = 8;
            const errorCode = (0, node_opcua_basic_types_1.decodeStatusCode)(binaryStream);
            const message = (0, node_opcua_basic_types_1.decodeString)(binaryStream);
            this._report_error(errorCode, message || "Error message not specified");
            return true;
        }
        else {
            __classPrivateFieldGet(this, _MessageBuilderBase_instances, "m", _MessageBuilderBase__append).call(this, chunk);
            // last message
            if (__classPrivateFieldGet(this, _MessageBuilderBase__hasReceivedError, "f")) {
                return false;
            }
            const fullMessageBody = __classPrivateFieldGet(this, _MessageBuilderBase_blocks, "f").length === 1 ? __classPrivateFieldGet(this, _MessageBuilderBase_blocks, "f")[0] : Buffer.concat(__classPrivateFieldGet(this, _MessageBuilderBase_blocks, "f"));
            if (doPerfMonitoring) {
                // record tick 1: when a complete message has been received ( all chunks assembled)
                this._tick1 = (0, node_opcua_utils_1.get_clock_tick)();
            }
            this.emit("full_message_body", fullMessageBody);
            const messageOk = this._decodeMessageBody(fullMessageBody);
            // be ready for next block
            __classPrivateFieldGet(this, _MessageBuilderBase_instances, "m", _MessageBuilderBase__init_new).call(this);
            return messageOk;
        }
    }
    else if (messageHeader.isFinal === "A") {
        try {
            // only valid for MSG, according to spec
            const stream = new node_opcua_binary_stream_1.BinaryStream(chunk);
            (0, node_opcua_chunkmanager_1.readMessageHeader)(stream);
            (0, node_opcua_assert_1.assert)(stream.length === 8);
            // instead of 
            //   const securityHeader = new SymmetricAlgorithmSecurityHeader();
            //   securityHeader.decode(stream);
            const channelId = stream.readUInt32();
            const tokenId = (0, node_opcua_basic_types_1.decodeUInt32)(stream);
            const sequenceHeader = new node_opcua_chunkmanager_1.SequenceHeader();
            sequenceHeader.decode(stream);
            return this._report_abandon(channelId, tokenId, sequenceHeader);
        }
        catch (err) {
            warningLog((0, node_opcua_debug_1.hexDump)(chunk));
            warningLog("Cannot interpret message chunk: ", err.message);
            return this._report_error(status_codes_1.StatusCodes2.BadTcpInternalError, "Error decoding message header " + err.message);
        }
    }
    else if (messageHeader.isFinal === "C") {
        return __classPrivateFieldGet(this, _MessageBuilderBase_instances, "m", _MessageBuilderBase__append).call(this, chunk);
    }
    return false;
};
MessageBuilderBase.defaultMaxChunkCount = 1000;
MessageBuilderBase.defaultMaxMessageSize = 1024 * 64 * 1024; // 64Mo
MessageBuilderBase.defaultMaxChunkSize = 1024 * 8;
//# sourceMappingURL=message_builder_base.js.map