"use strict";
/**
 * @module node-opcua-secure-channel
 */
// tslint:disable:max-line-length
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MessageChunker_instances, _MessageChunker_sequenceNumberGenerator, _MessageChunker_makeAbandonChunk, _MessageChunker__build_chunk_manager;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageChunker = void 0;
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_basic_types_1 = require("node-opcua-basic-types");
const node_opcua_binary_stream_1 = require("node-opcua-binary-stream");
const node_opcua_service_secure_channel_1 = require("node-opcua-service-secure-channel");
const node_opcua_utils_1 = require("node-opcua-utils");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_chunkmanager_1 = require("node-opcua-chunkmanager");
const secure_message_chunk_manager_1 = require("./secure_message_chunk_manager");
const sequence_number_generator_1 = require("./sequence_number_generator");
const doTraceChunk = process.env.NODEOPCUADEBUG && process.env.NODEOPCUADEBUG.indexOf("CHUNK") >= 0;
const errorLog = (0, node_opcua_debug_1.make_errorLog)("secure_channel");
const warningLog = (0, node_opcua_debug_1.make_warningLog)("secure_channel");
class MessageChunker {
    constructor(options) {
        _MessageChunker_instances.add(this);
        _MessageChunker_sequenceNumberGenerator.set(this, new sequence_number_generator_1.SequenceNumberGenerator());
        options = options || { securityMode: node_opcua_service_secure_channel_1.MessageSecurityMode.Invalid };
        this.securityMode = options.securityMode || node_opcua_service_secure_channel_1.MessageSecurityMode.None;
        this.maxMessageSize = options.maxMessageSize || MessageChunker.defaultMaxMessageSize;
        this.maxChunkCount = options.maxChunkCount === undefined ? MessageChunker.defaultChunkCount : options.maxChunkCount;
    }
    dispose() { }
    prepareChunk(msgType, params, messageLength) {
        // calculate message size ( with its  encodingDefaultBinary)
        try {
            const chunkManager = __classPrivateFieldGet(this, _MessageChunker_instances, "m", _MessageChunker__build_chunk_manager).call(this, msgType, params);
            const { chunkCount, totalLength } = chunkManager.evaluateTotalLengthAndChunks(messageLength);
            if (this.maxChunkCount > 0 && chunkCount > this.maxChunkCount) {
                errorLog(`[NODE-OPCUA-E10] message chunkCount ${chunkCount} exceeds the negotiated maximum chunk count ${this.maxChunkCount}, message current size is ${totalLength}`);
                errorLog(`[NODE-OPCUA-E10] ${messageLength} totalLength = ${totalLength} chunkManager.maxBodySize = ${this.maxMessageSize}`);
                return { statusCode: node_opcua_basic_types_1.StatusCodes.BadTcpMessageTooLarge, chunkManager: null };
            }
            if (this.maxMessageSize > 0 && totalLength > this.maxMessageSize) {
                errorLog(`[NODE-OPCUA-E11] message size ${totalLength} exceeds the negotiated message size ${this.maxMessageSize} nb chunks ${chunkCount}`);
                return { statusCode: node_opcua_basic_types_1.StatusCodes.BadTcpMessageTooLarge, chunkManager: null };
            }
            return { statusCode: node_opcua_basic_types_1.StatusCodes.Good, chunkManager: chunkManager };
        }
        catch (err) {
            return { statusCode: node_opcua_basic_types_1.StatusCodes.BadTcpInternalError, chunkManager: null };
        }
    }
    chunkSecureMessage(msgType, params, message, messageChunkCallback) {
        const calculateMessageLength = (message) => {
            const stream = new node_opcua_binary_stream_1.BinaryStreamSizeCalculator();
            (0, node_opcua_basic_types_1.encodeExpandedNodeId)(message.schema.encodingDefaultBinary, stream);
            message.encode(stream);
            return stream.length;
        };
        // evaluate the message size
        const messageLength = calculateMessageLength(message);
        const { statusCode, chunkManager } = this.prepareChunk(msgType, params, messageLength);
        if (statusCode !== node_opcua_basic_types_1.StatusCodes.Good) {
            return statusCode;
        }
        if (!chunkManager) {
            return node_opcua_basic_types_1.StatusCodes.BadInternalError;
        }
        let nbChunks = 0;
        let totalSize = 0;
        chunkManager.on("chunk", (messageChunk) => {
            nbChunks++;
            totalSize += messageChunk.length;
            messageChunkCallback(messageChunk);
        })
            .on("finished", () => {
            if (doTraceChunk) {
                console.log((0, node_opcua_utils_1.timestamp)(), "   <$$ ", msgType, "nbChunk = " + nbChunks.toString().padStart(3), "totalLength = " + totalSize.toString().padStart(8), "l=", messageLength.toString().padStart(6), "maxChunkCount=", this.maxChunkCount, "maxMessageSize=", this.maxMessageSize);
            }
            messageChunkCallback(null);
        });
        // create buffer to stream 
        const stream = new node_opcua_binary_stream_1.BinaryStream(messageLength);
        (0, node_opcua_basic_types_1.encodeExpandedNodeId)(message.schema.encodingDefaultBinary, stream);
        message.encode(stream);
        // inject buffer to chunk manager
        chunkManager.write(stream.buffer, stream.buffer.length);
        chunkManager.end();
        return node_opcua_basic_types_1.StatusCodes.Good;
    }
}
exports.MessageChunker = MessageChunker;
_MessageChunker_sequenceNumberGenerator = new WeakMap(), _MessageChunker_instances = new WeakSet(), _MessageChunker_makeAbandonChunk = function _MessageChunker_makeAbandonChunk(params) {
    const finalC = "A";
    const msgType = "MSG";
    const buffer = Buffer.alloc(
    // MSGA
    4 +
        // length
        4 +
        // secureChannelId
        4 +
        // tokenId
        4 +
        2 * 4);
    const stream = new node_opcua_binary_stream_1.BinaryStream(buffer);
    // message header --------------------------
    // ---------------------------------------------------------------
    // OPC UA Secure Conversation Message Header : Part 6 page 36
    // MessageType     Byte[3]
    // IsFinal         Byte[1]  C : intermediate, F: Final , A: Final with Error
    // MessageSize     UInt32   The length of the MessageChunk, in bytes. This value includes size of the message header.
    // SecureChannelId UInt32   A unique identifier for the ClientSecureChannelLayer assigned by the server.
    stream.writeUInt8(msgType.charCodeAt(0));
    stream.writeUInt8(msgType.charCodeAt(1));
    stream.writeUInt8(msgType.charCodeAt(2));
    stream.writeUInt8(finalC.charCodeAt(0));
    stream.writeUInt32(0); // will be written later
    stream.writeUInt32(params.channelId || 0); // secure channel id
    const securityHeader = params.securityHeader ||
        new node_opcua_service_secure_channel_1.SymmetricAlgorithmSecurityHeader({
            tokenId: 0
        });
    securityHeader.encode(stream);
    const sequenceHeader = new node_opcua_chunkmanager_1.SequenceHeader({
        sequenceNumber: __classPrivateFieldGet(this, _MessageChunker_sequenceNumberGenerator, "f").next(),
        requestId: params.securityOptions.requestId /// fix me
    });
    sequenceHeader.encode(stream);
    // write chunk length
    const length = stream.length;
    stream.length = 4;
    stream.writeUInt32(length);
    stream.length = length;
    return buffer;
}, _MessageChunker__build_chunk_manager = function _MessageChunker__build_chunk_manager(msgType, params) {
    let securityHeader = params.securityHeader;
    if (msgType === "OPN") {
        (0, node_opcua_assert_1.assert)(securityHeader instanceof node_opcua_service_secure_channel_1.AsymmetricAlgorithmSecurityHeader);
    }
    else if (msgType === "MSG") {
        (0, node_opcua_assert_1.assert)(securityHeader instanceof node_opcua_service_secure_channel_1.SymmetricAlgorithmSecurityHeader);
    }
    const channelId = params.channelId;
    const mode = this.securityMode;
    const chunkManager = new secure_message_chunk_manager_1.SecureMessageChunkManager(mode, msgType, channelId, params.securityOptions, securityHeader, __classPrivateFieldGet(this, _MessageChunker_sequenceNumberGenerator, "f"));
    return chunkManager;
};
MessageChunker.defaultMaxMessageSize = 16 * 1024 * 1024;
MessageChunker.defaultChunkCount = 0; // 0 => no limits
//# sourceMappingURL=message_chunker.js.map