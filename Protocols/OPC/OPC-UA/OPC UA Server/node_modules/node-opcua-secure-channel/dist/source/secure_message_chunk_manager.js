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
var _SecureMessageChunkManager_aborted, _SecureMessageChunkManager_sequenceNumberGenerator, _SecureMessageChunkManager_securityHeader, _SecureMessageChunkManager_sequenceHeader, _SecureMessageChunkManager_chunkManager;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecureMessageChunkManager = void 0;
exports.chooseSecurityHeader = chooseSecurityHeader;
/**
 * @module node-opcua-secure-channel
 */
// tslint:disable:max-line-length
const events_1 = require("events");
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_binary_stream_1 = require("node-opcua-binary-stream");
const node_opcua_chunkmanager_1 = require("node-opcua-chunkmanager");
const node_opcua_service_secure_channel_1 = require("node-opcua-service-secure-channel");
function chooseSecurityHeader(msgType) {
    return msgType === "OPN" ? new node_opcua_service_secure_channel_1.AsymmetricAlgorithmSecurityHeader() : new node_opcua_service_secure_channel_1.SymmetricAlgorithmSecurityHeader();
}
class SecureMessageChunkManager extends events_1.EventEmitter {
    constructor(mode, msgType, channelId, options, securityHeader, sequenceNumberGenerator) {
        super();
        _SecureMessageChunkManager_aborted.set(this, void 0);
        _SecureMessageChunkManager_sequenceNumberGenerator.set(this, void 0);
        _SecureMessageChunkManager_securityHeader.set(this, void 0);
        _SecureMessageChunkManager_sequenceHeader.set(this, void 0);
        _SecureMessageChunkManager_chunkManager.set(this, void 0);
        __classPrivateFieldSet(this, _SecureMessageChunkManager_aborted, false, "f");
        this.msgType = msgType || "OPN";
        this.channelId = channelId || 0;
        __classPrivateFieldSet(this, _SecureMessageChunkManager_securityHeader, securityHeader, "f");
        __classPrivateFieldSet(this, _SecureMessageChunkManager_sequenceNumberGenerator, sequenceNumberGenerator, "f");
        // the maximum size of a message chunk:
        // Note: OPCUA requires that chunkSize is at least 8192
        options.chunkSize = options.chunkSize || 8192;
        if (options.chunkSize <= 8192) {
            // debugLog("Warning: chunkSize is too small !!!!", options.chunkSize);
        }
        const requestId = options.requestId;
        (0, node_opcua_assert_1.assert)(requestId > 0, "expecting a valid request ID");
        __classPrivateFieldSet(this, _SecureMessageChunkManager_sequenceHeader, new node_opcua_chunkmanager_1.SequenceHeader({ requestId, sequenceNumber: -1 }), "f");
        const securityHeaderSize = __classPrivateFieldGet(this, _SecureMessageChunkManager_securityHeader, "f").binaryStoreSize();
        const sequenceHeaderSize = __classPrivateFieldGet(this, _SecureMessageChunkManager_sequenceHeader, "f").binaryStoreSize();
        (0, node_opcua_assert_1.assert)(sequenceHeaderSize === 8);
        const headerSize = 12 + securityHeaderSize;
        const params = {
            chunkSize: options.chunkSize,
            headerSize: headerSize,
            writeHeaderFunc: (buffer, isLast, totalLength) => {
                let finalC = isLast ? "F" : "C";
                finalC = __classPrivateFieldGet(this, _SecureMessageChunkManager_aborted, "f") ? "A" : finalC;
                this.write_header(finalC, buffer, totalLength);
            },
            sequenceHeaderSize,
            writeSequenceHeaderFunc: (buffer) => this.writeSequenceHeader(buffer),
            // ---------------------------------------- Signing stuff
            signBufferFunc: options.signBufferFunc,
            signatureLength: options.signatureLength,
            // ---------------------------------------- Encrypting stuff
            cipherBlockSize: options.cipherBlockSize,
            encryptBufferFunc: options.encryptBufferFunc,
            plainBlockSize: options.plainBlockSize
        };
        __classPrivateFieldSet(this, _SecureMessageChunkManager_chunkManager, new node_opcua_chunkmanager_1.ChunkManager(mode, params), "f");
        __classPrivateFieldGet(this, _SecureMessageChunkManager_chunkManager, "f").on("chunk", (chunk, isLast) => {
            /**
             * @event chunk
             */
            this.emit("chunk", chunk, isLast || __classPrivateFieldGet(this, _SecureMessageChunkManager_aborted, "f"));
        });
    }
    evaluateTotalLengthAndChunks(bodySize) {
        return __classPrivateFieldGet(this, _SecureMessageChunkManager_chunkManager, "f").evaluateTotalLengthAndChunks(bodySize);
    }
    write_header(finalC, buffer, length) {
        (0, node_opcua_assert_1.assert)(buffer.length > 12);
        (0, node_opcua_assert_1.assert)(finalC.length === 1);
        (0, node_opcua_assert_1.assert)(buffer instanceof Buffer);
        const stream = new node_opcua_binary_stream_1.BinaryStream(buffer);
        // message header --------------------------
        // ---------------------------------------------------------------
        // OPC UA Secure Conversation Message Header : Part 6 page 36
        // MessageType     Byte[3]
        // IsFinal         Byte[1]  C : intermediate, F: Final , A: Final with Error
        // MessageSize     UInt32   The length of the MessageChunk, in bytes. This value includes size of the message header.
        // SecureChannelId UInt32   A unique identifier for the ClientSecureChannelLayer assigned by the server.
        stream.writeUInt8(this.msgType.charCodeAt(0));
        stream.writeUInt8(this.msgType.charCodeAt(1));
        stream.writeUInt8(this.msgType.charCodeAt(2));
        stream.writeUInt8(finalC.charCodeAt(0));
        stream.writeUInt32(length);
        stream.writeUInt32(this.channelId);
        (0, node_opcua_assert_1.assert)(stream.length === 12);
        // write Security Header -----------------
        __classPrivateFieldGet(this, _SecureMessageChunkManager_securityHeader, "f").encode(stream);
    }
    writeSequenceHeader(buffer) {
        const stream = new node_opcua_binary_stream_1.BinaryStream(buffer);
        // write Sequence Header -----------------
        __classPrivateFieldGet(this, _SecureMessageChunkManager_sequenceHeader, "f").sequenceNumber = __classPrivateFieldGet(this, _SecureMessageChunkManager_sequenceNumberGenerator, "f").next();
        __classPrivateFieldGet(this, _SecureMessageChunkManager_sequenceHeader, "f").encode(stream);
    }
    write(buffer, length) {
        length = length || buffer.length;
        __classPrivateFieldGet(this, _SecureMessageChunkManager_chunkManager, "f").write(buffer, length);
    }
    abort() {
        __classPrivateFieldSet(this, _SecureMessageChunkManager_aborted, true, "f");
        this.end();
    }
    end() {
        __classPrivateFieldGet(this, _SecureMessageChunkManager_chunkManager, "f").end();
        this.emit("finished");
    }
}
exports.SecureMessageChunkManager = SecureMessageChunkManager;
_SecureMessageChunkManager_aborted = new WeakMap(), _SecureMessageChunkManager_sequenceNumberGenerator = new WeakMap(), _SecureMessageChunkManager_securityHeader = new WeakMap(), _SecureMessageChunkManager_sequenceHeader = new WeakMap(), _SecureMessageChunkManager_chunkManager = new WeakMap();
//# sourceMappingURL=secure_message_chunk_manager.js.map