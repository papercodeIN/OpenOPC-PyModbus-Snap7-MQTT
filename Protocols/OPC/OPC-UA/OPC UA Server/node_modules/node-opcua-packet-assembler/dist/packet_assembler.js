"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketAssembler = exports.PacketAssemblerErrorCode = void 0;
const events_1 = require("events");
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_debug_1 = require("node-opcua-debug");
const doDebug = false;
const warningLog = (0, node_opcua_debug_1.make_warningLog)("PacketAssembler");
var PacketAssemblerErrorCode;
(function (PacketAssemblerErrorCode) {
    PacketAssemblerErrorCode[PacketAssemblerErrorCode["ChunkSizeExceeded"] = 1] = "ChunkSizeExceeded";
    PacketAssemblerErrorCode[PacketAssemblerErrorCode["ChunkTooSmall"] = 2] = "ChunkTooSmall";
})(PacketAssemblerErrorCode || (exports.PacketAssemblerErrorCode = PacketAssemblerErrorCode = {}));
/**
 * this class is used to assemble partial data from the transport layer
 * into message chunks
 */
class PacketAssembler extends events_1.EventEmitter {
    constructor(options) {
        super();
        this._stack = [];
        this.expectedLength = 0;
        this.currentLength = 0;
        this.readChunkFunc = options.readChunkFunc;
        this.minimumSizeInBytes = options.minimumSizeInBytes || 8;
        (0, node_opcua_assert_1.assert)(typeof this.readChunkFunc === "function", "packet assembler requires a readChunkFunc");
        // istanbul ignore next
        (0, node_opcua_assert_1.assert)(options.maxChunkSize === undefined || options.maxChunkSize !== 0);
        this.maxChunkSize = options.maxChunkSize || PacketAssembler.defaultMaxMessageSize;
        (0, node_opcua_assert_1.assert)(this.maxChunkSize >= this.minimumSizeInBytes);
    }
    feed(data) {
        let messageChunk;
        if (this.expectedLength === 0 && this.currentLength + data.length >= this.minimumSizeInBytes) {
            // we are at a start of a block and there is enough data provided to read the length  of the block
            // let's build the whole data block with previous blocks already read.
            if (this._stack.length > 0) {
                data = this._buildData(data);
                this.currentLength = 0;
            }
            // we can extract the expected length here
            this.packetInfo = this._readPacketInfo(data);
            (0, node_opcua_assert_1.assert)(this.currentLength === 0);
            if (this.packetInfo.length < this.minimumSizeInBytes) {
                this.emit("error", new Error("chunk is too small "), PacketAssemblerErrorCode.ChunkTooSmall);
                return;
            }
            if (this.packetInfo.length > this.maxChunkSize) {
                const message = `maximum chunk size exceeded (maxChunkSize=${this.maxChunkSize} current chunk size = ${this.packetInfo.length})`;
                warningLog(message);
                this.emit("error", new Error(message), PacketAssemblerErrorCode.ChunkSizeExceeded);
                return;
            }
            // we can now emit an event to signal the start of a new packet
            this.emit("startChunk", this.packetInfo, data);
            this.expectedLength = this.packetInfo.length;
        }
        if (this.expectedLength === 0 || this.currentLength + data.length < this.expectedLength) {
            this._stack.push(data);
            this.currentLength += data.length;
            // expecting more data to complete current message chunk
        }
        else if (this.currentLength + data.length === this.expectedLength) {
            this.currentLength += data.length;
            messageChunk = this._buildData(data);
            // istanbul ignore next
            if (doDebug) {
                const packetInfo = this._readPacketInfo(messageChunk);
                (0, node_opcua_assert_1.assert)(this.packetInfo && this.packetInfo.length === packetInfo.length);
                (0, node_opcua_assert_1.assert)(messageChunk.length === packetInfo.length);
            }
            // reset
            this.currentLength = 0;
            this.expectedLength = 0;
            this.emit("chunk", messageChunk);
        }
        else {
            // there is more data in this chunk than expected...
            // the chunk need to be split
            const size1 = this.expectedLength - this.currentLength;
            if (size1 > 0) {
                const chunk1 = data.subarray(0, size1);
                this.feed(chunk1);
            }
            const chunk2 = data.subarray(size1);
            if (chunk2.length > 0) {
                this.feed(chunk2);
            }
        }
    }
    _readPacketInfo(data) {
        return this.readChunkFunc(data);
    }
    _buildData(data) {
        if (data && this._stack.length === 0) {
            return data;
        }
        if (!data && this._stack.length === 1) {
            data = this._stack[0];
            this._stack.length = 0; // empty stack array
            return data;
        }
        this._stack.push(data);
        data = Buffer.concat(this._stack);
        this._stack.length = 0;
        return data;
    }
}
exports.PacketAssembler = PacketAssembler;
PacketAssembler.defaultMaxChunkCount = 777;
PacketAssembler.defaultMaxMessageSize = 1024 * 64 - 7;
//# sourceMappingURL=packet_assembler.js.map