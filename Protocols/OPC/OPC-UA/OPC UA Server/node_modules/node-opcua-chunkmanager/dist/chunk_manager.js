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
var _ChunkManager_instances, _ChunkManager_signBufferFunc, _ChunkManager_encryptBufferFunc, _ChunkManager_writeSequenceHeaderFunc, _ChunkManager_writeHeaderFunc, _ChunkManager_maxBlock, _ChunkManager_dataOffset, _ChunkManager_chunk, _ChunkManager_cursor, _ChunkManager_pendingChunk, _ChunkManager_dataEnd, _ChunkManager__write_signature, _ChunkManager__encrypt, _ChunkManager__push_pending_chunk, _ChunkManager__write_padding_bytes, _ChunkManager__post_process_current_chunk;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChunkManager = exports.Mode = void 0;
exports.verify_message_chunk = verify_message_chunk;
/***
 * @module node-opcua-chunkmanager
 */
const events_1 = require("events");
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_binary_stream_1 = require("node-opcua-binary-stream");
const node_opcua_buffer_utils_1 = require("node-opcua-buffer-utils");
const read_message_header_1 = require("./read_message_header");
function verify_message_chunk(messageChunk) {
    (0, node_opcua_assert_1.assert)(messageChunk);
    (0, node_opcua_assert_1.assert)(messageChunk instanceof Buffer);
    const header = (0, read_message_header_1.readMessageHeader)(new node_opcua_binary_stream_1.BinaryStream(messageChunk));
    if (messageChunk.length !== header.length) {
        throw new Error(" chunk length = " + messageChunk.length + " message  length " + header.length);
    }
}
var Mode;
(function (Mode) {
    Mode[Mode["None"] = 1] = "None";
    Mode[Mode["Sign"] = 2] = "Sign";
    Mode[Mode["SignAndEncrypt"] = 3] = "SignAndEncrypt";
})(Mode || (exports.Mode = Mode = {}));
class ChunkManager extends events_1.EventEmitter {
    constructor(securityMode, options) {
        super();
        _ChunkManager_instances.add(this);
        _ChunkManager_signBufferFunc.set(this, void 0);
        _ChunkManager_encryptBufferFunc.set(this, void 0);
        _ChunkManager_writeSequenceHeaderFunc.set(this, void 0);
        _ChunkManager_writeHeaderFunc.set(this, void 0);
        // --------------
        _ChunkManager_maxBlock.set(this, void 0);
        _ChunkManager_dataOffset.set(this, void 0);
        _ChunkManager_chunk.set(this, void 0);
        _ChunkManager_cursor.set(this, void 0);
        _ChunkManager_pendingChunk.set(this, void 0);
        _ChunkManager_dataEnd.set(this, void 0);
        this.securityMode = securityMode;
        // { chunkSize : 32, headerSize : 10 ,signatureLength: 32 }
        this.chunkSize = options.chunkSize;
        this.headerSize = options.headerSize || 0;
        if (this.headerSize) {
            __classPrivateFieldSet(this, _ChunkManager_writeHeaderFunc, options.writeHeaderFunc, "f");
            (0, node_opcua_assert_1.assert)(typeof __classPrivateFieldGet(this, _ChunkManager_writeHeaderFunc, "f") === "function");
        }
        this.sequenceHeaderSize = options.sequenceHeaderSize === undefined ? 8 : options.sequenceHeaderSize;
        if (this.sequenceHeaderSize > 0) {
            __classPrivateFieldSet(this, _ChunkManager_writeSequenceHeaderFunc, options.writeSequenceHeaderFunc, "f");
            (0, node_opcua_assert_1.assert)(typeof __classPrivateFieldGet(this, _ChunkManager_writeSequenceHeaderFunc, "f") === "function");
        }
        this.signatureLength = options.signatureLength || 0;
        __classPrivateFieldSet(this, _ChunkManager_signBufferFunc, options.signBufferFunc, "f");
        this.plainBlockSize = options.plainBlockSize || 0; // 256-14;
        this.cipherBlockSize = options.cipherBlockSize || 0; // 256;
        __classPrivateFieldSet(this, _ChunkManager_dataEnd, 0, "f");
        if (this.cipherBlockSize === 0) {
            (0, node_opcua_assert_1.assert)(securityMode === Mode.None || securityMode === Mode.Sign);
            // we don't encrypt,we just sign
            (0, node_opcua_assert_1.assert)(this.plainBlockSize === 0);
            // unencrypted block
            this.maxBodySize = this.chunkSize - this.headerSize - this.signatureLength - this.sequenceHeaderSize;
            __classPrivateFieldSet(this, _ChunkManager_encryptBufferFunc, undefined, "f");
        }
        else {
            (0, node_opcua_assert_1.assert)(securityMode === Mode.SignAndEncrypt || securityMode === Mode.Sign);
            (0, node_opcua_assert_1.assert)(this.plainBlockSize !== 0);
            // During encryption a block with a size equal to  PlainTextBlockSize  is processed to produce a block
            // with size equal to  CipherTextBlockSize. These values depend on the encryption algorithm and may
            // be the same.
            __classPrivateFieldSet(this, _ChunkManager_encryptBufferFunc, options.encryptBufferFunc, "f");
            (0, node_opcua_assert_1.assert)(typeof __classPrivateFieldGet(this, _ChunkManager_encryptBufferFunc, "f") === "function", "an encryptBufferFunc is required");
            // this is the formula proposed  by OPCUA
            this.maxBodySize =
                this.plainBlockSize *
                    Math.floor((this.chunkSize - this.headerSize - this.signatureLength - 1) / this.cipherBlockSize) -
                    this.sequenceHeaderSize;
            // this is the formula proposed  by ERN
            __classPrivateFieldSet(this, _ChunkManager_maxBlock, Math.floor((this.chunkSize - this.headerSize) / this.cipherBlockSize), "f");
            this.maxBodySize = this.plainBlockSize * __classPrivateFieldGet(this, _ChunkManager_maxBlock, "f") - this.sequenceHeaderSize - this.signatureLength - 1;
            if (this.plainBlockSize > 256) {
                this.maxBodySize -= 1;
            }
        }
        (0, node_opcua_assert_1.assert)(this.maxBodySize > 0); // no space left to write data
        // where the data starts in the block
        __classPrivateFieldSet(this, _ChunkManager_dataOffset, this.headerSize + this.sequenceHeaderSize, "f");
        __classPrivateFieldSet(this, _ChunkManager_chunk, null, "f");
        __classPrivateFieldSet(this, _ChunkManager_cursor, 0, "f");
        __classPrivateFieldSet(this, _ChunkManager_pendingChunk, null, "f");
    }
    evaluateTotalLengthAndChunks(bodySize) {
        const chunkCount = Math.ceil(bodySize / this.maxBodySize);
        const totalLength = this.chunkSize * chunkCount;
        return { totalLength, chunkCount };
    }
    write(buffer, length) {
        length = length || buffer.length;
        (0, node_opcua_assert_1.assert)(buffer instanceof Buffer || buffer === null);
        (0, node_opcua_assert_1.assert)(length > 0);
        let l = length;
        let inputCursor = 0;
        while (l > 0) {
            (0, node_opcua_assert_1.assert)(length - inputCursor !== 0);
            if (__classPrivateFieldGet(this, _ChunkManager_cursor, "f") === 0) {
                __classPrivateFieldGet(this, _ChunkManager_instances, "m", _ChunkManager__push_pending_chunk).call(this, false);
            }
            // space left in current chunk
            const spaceLeft = this.maxBodySize - __classPrivateFieldGet(this, _ChunkManager_cursor, "f");
            const nbToWrite = Math.min(length - inputCursor, spaceLeft);
            __classPrivateFieldSet(this, _ChunkManager_chunk, __classPrivateFieldGet(this, _ChunkManager_chunk, "f") || (0, node_opcua_buffer_utils_1.createFastUninitializedBuffer)(this.chunkSize), "f");
            if (buffer) {
                buffer.copy(__classPrivateFieldGet(this, _ChunkManager_chunk, "f"), __classPrivateFieldGet(this, _ChunkManager_cursor, "f") + __classPrivateFieldGet(this, _ChunkManager_dataOffset, "f"), inputCursor, inputCursor + nbToWrite);
            }
            inputCursor += nbToWrite;
            __classPrivateFieldSet(this, _ChunkManager_cursor, __classPrivateFieldGet(this, _ChunkManager_cursor, "f") + nbToWrite, "f");
            if (__classPrivateFieldGet(this, _ChunkManager_cursor, "f") >= this.maxBodySize) {
                __classPrivateFieldGet(this, _ChunkManager_instances, "m", _ChunkManager__post_process_current_chunk).call(this);
            }
            l -= nbToWrite;
        }
    }
    end() {
        if (__classPrivateFieldGet(this, _ChunkManager_cursor, "f") > 0) {
            __classPrivateFieldGet(this, _ChunkManager_instances, "m", _ChunkManager__post_process_current_chunk).call(this);
        }
        __classPrivateFieldGet(this, _ChunkManager_instances, "m", _ChunkManager__push_pending_chunk).call(this, true);
    }
}
exports.ChunkManager = ChunkManager;
_ChunkManager_signBufferFunc = new WeakMap(), _ChunkManager_encryptBufferFunc = new WeakMap(), _ChunkManager_writeSequenceHeaderFunc = new WeakMap(), _ChunkManager_writeHeaderFunc = new WeakMap(), _ChunkManager_maxBlock = new WeakMap(), _ChunkManager_dataOffset = new WeakMap(), _ChunkManager_chunk = new WeakMap(), _ChunkManager_cursor = new WeakMap(), _ChunkManager_pendingChunk = new WeakMap(), _ChunkManager_dataEnd = new WeakMap(), _ChunkManager_instances = new WeakSet(), _ChunkManager__write_signature = function _ChunkManager__write_signature(chunk) {
    if (this.securityMode === Mode.None) {
        (0, node_opcua_assert_1.assert)(this.signatureLength === 0, "expecting NO SIGN");
        return;
    }
    if (__classPrivateFieldGet(this, _ChunkManager_signBufferFunc, "f")) {
        (0, node_opcua_assert_1.assert)(typeof __classPrivateFieldGet(this, _ChunkManager_signBufferFunc, "f") === "function");
        (0, node_opcua_assert_1.assert)(this.signatureLength !== 0);
        const signatureStart = __classPrivateFieldGet(this, _ChunkManager_dataEnd, "f");
        const sectionToSign = chunk.subarray(0, signatureStart);
        const signature = __classPrivateFieldGet(this, _ChunkManager_signBufferFunc, "f").call(this, sectionToSign);
        (0, node_opcua_assert_1.assert)(signature.length === this.signatureLength, "expecting signature length to match");
        signature.copy(chunk, signatureStart);
    }
    else {
        (0, node_opcua_assert_1.assert)(this.signatureLength === 0, "expecting NO SIGN");
    }
}, _ChunkManager__encrypt = function _ChunkManager__encrypt(chunk) {
    if (this.securityMode === Mode.None) {
        // nothing todo
        return;
    }
    if (this.plainBlockSize > 0 && __classPrivateFieldGet(this, _ChunkManager_encryptBufferFunc, "f")) {
        (0, node_opcua_assert_1.assert)(__classPrivateFieldGet(this, _ChunkManager_dataEnd, "f") !== undefined);
        const startEncryptionPos = this.headerSize;
        const endEncryptionPos = __classPrivateFieldGet(this, _ChunkManager_dataEnd, "f") + this.signatureLength;
        const areaToEncrypt = chunk.subarray(startEncryptionPos, endEncryptionPos);
        (0, node_opcua_assert_1.assert)(areaToEncrypt.length % this.plainBlockSize === 0); // padding should have been applied
        const nbBlock = areaToEncrypt.length / this.plainBlockSize;
        const encryptedBuffer = __classPrivateFieldGet(this, _ChunkManager_encryptBufferFunc, "f").call(this, areaToEncrypt);
        (0, node_opcua_assert_1.assert)(encryptedBuffer.length % this.cipherBlockSize === 0);
        (0, node_opcua_assert_1.assert)(encryptedBuffer.length === nbBlock * this.cipherBlockSize);
        encryptedBuffer.copy(chunk, this.headerSize, 0);
    }
}, _ChunkManager__push_pending_chunk = function _ChunkManager__push_pending_chunk(isLast) {
    if (__classPrivateFieldGet(this, _ChunkManager_pendingChunk, "f")) {
        const expectedLength = __classPrivateFieldGet(this, _ChunkManager_pendingChunk, "f").length;
        if (this.headerSize > 0) {
            // Release 1.02  39  OPC Unified Architecture, Part 6:
            // The sequence header ensures that the first  encrypted block of every  Message  sent over
            // a channel will start with different data.
            __classPrivateFieldGet(this, _ChunkManager_writeHeaderFunc, "f").call(this, __classPrivateFieldGet(this, _ChunkManager_pendingChunk, "f").subarray(0, this.headerSize), isLast, expectedLength);
        }
        if (this.sequenceHeaderSize > 0) {
            __classPrivateFieldGet(this, _ChunkManager_writeSequenceHeaderFunc, "f").call(this, __classPrivateFieldGet(this, _ChunkManager_pendingChunk, "f").subarray(this.headerSize, this.headerSize + this.sequenceHeaderSize));
        }
        __classPrivateFieldGet(this, _ChunkManager_instances, "m", _ChunkManager__write_signature).call(this, __classPrivateFieldGet(this, _ChunkManager_pendingChunk, "f"));
        __classPrivateFieldGet(this, _ChunkManager_instances, "m", _ChunkManager__encrypt).call(this, __classPrivateFieldGet(this, _ChunkManager_pendingChunk, "f"));
        /**
         * @event chunk
         * @param chunk {Buffer}
         * @param isLast {Boolean} , true if final chunk
         */
        this.emit("chunk", __classPrivateFieldGet(this, _ChunkManager_pendingChunk, "f"), isLast);
        __classPrivateFieldSet(this, _ChunkManager_pendingChunk, null, "f");
    }
}, _ChunkManager__write_padding_bytes = function _ChunkManager__write_padding_bytes(nbPaddingByteTotal) {
    const nbPaddingByte = nbPaddingByteTotal % 256;
    const extraNbPaddingByte = Math.floor(nbPaddingByteTotal / 256);
    (0, node_opcua_assert_1.assert)(extraNbPaddingByte === 0 || this.plainBlockSize > 256, "extraNbPaddingByte only requested when key size > 2048");
    // write the padding byte
    __classPrivateFieldGet(this, _ChunkManager_chunk, "f").writeUInt8(nbPaddingByte, __classPrivateFieldGet(this, _ChunkManager_cursor, "f") + __classPrivateFieldGet(this, _ChunkManager_dataOffset, "f"));
    __classPrivateFieldSet(this, _ChunkManager_cursor, __classPrivateFieldGet(this, _ChunkManager_cursor, "f") + 1, "f");
    for (let i = 0; i < nbPaddingByteTotal; i++) {
        __classPrivateFieldGet(this, _ChunkManager_chunk, "f").writeUInt8(nbPaddingByte, __classPrivateFieldGet(this, _ChunkManager_cursor, "f") + __classPrivateFieldGet(this, _ChunkManager_dataOffset, "f") + i);
    }
    __classPrivateFieldSet(this, _ChunkManager_cursor, __classPrivateFieldGet(this, _ChunkManager_cursor, "f") + nbPaddingByteTotal, "f");
    if (this.plainBlockSize > 256) {
        __classPrivateFieldGet(this, _ChunkManager_chunk, "f").writeUInt8(extraNbPaddingByte, __classPrivateFieldGet(this, _ChunkManager_cursor, "f") + __classPrivateFieldGet(this, _ChunkManager_dataOffset, "f"));
        __classPrivateFieldSet(this, _ChunkManager_cursor, __classPrivateFieldGet(this, _ChunkManager_cursor, "f") + 1, "f");
    }
}, _ChunkManager__post_process_current_chunk = function _ChunkManager__post_process_current_chunk() {
    let extraEncryptionBytes = 0;
    // add padding bytes if needed
    if (this.plainBlockSize > 0) {
        // write padding ( if encryption )
        // let's calculate curLength = the length of the block to encrypt without padding yet
        // +---------------+---------------+-------------+---------+--------------+------------+
        // |SequenceHeader | data          | paddingByte | padding | extraPadding | signature  |
        // +---------------+---------------+-------------+---------+--------------+------------+
        let curLength = this.sequenceHeaderSize + __classPrivateFieldGet(this, _ChunkManager_cursor, "f") + this.signatureLength;
        if (this.plainBlockSize > 256) {
            curLength += 2; // account for extraPadding Byte Number;
        }
        else {
            curLength += 1;
        }
        // let's calculate the required number of padding bytes
        const n = curLength % this.plainBlockSize;
        const nbPaddingByteTotal = (this.plainBlockSize - n) % this.plainBlockSize;
        __classPrivateFieldGet(this, _ChunkManager_instances, "m", _ChunkManager__write_padding_bytes).call(this, nbPaddingByteTotal);
        const adjustedLength = this.sequenceHeaderSize + __classPrivateFieldGet(this, _ChunkManager_cursor, "f") + this.signatureLength;
        (0, node_opcua_assert_1.assert)(adjustedLength % this.plainBlockSize === 0);
        const nbBlock = adjustedLength / this.plainBlockSize;
        extraEncryptionBytes = nbBlock * (this.cipherBlockSize - this.plainBlockSize);
    }
    __classPrivateFieldSet(this, _ChunkManager_dataEnd, __classPrivateFieldGet(this, _ChunkManager_dataOffset, "f") + __classPrivateFieldGet(this, _ChunkManager_cursor, "f"), "f");
    // calculate the expected length of the chunk, once encrypted if encryption apply
    const expectedLength = __classPrivateFieldGet(this, _ChunkManager_dataEnd, "f") + this.signatureLength + extraEncryptionBytes;
    __classPrivateFieldSet(this, _ChunkManager_pendingChunk, __classPrivateFieldGet(this, _ChunkManager_chunk, "f").subarray(0, expectedLength), "f");
    // note :
    //  - this.pending_chunk has the correct size but is not signed nor encrypted yet
    //    as we don't know what to write in the header yet
    //  - as a result,
    __classPrivateFieldSet(this, _ChunkManager_chunk, null, "f");
    __classPrivateFieldSet(this, _ChunkManager_cursor, 0, "f");
};
//# sourceMappingURL=chunk_manager.js.map