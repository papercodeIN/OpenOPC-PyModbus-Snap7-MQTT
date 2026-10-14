"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readMessageHeader = readMessageHeader;
function readMessageHeader(stream) {
    const msgType = String.fromCharCode(stream.readUInt8()) + String.fromCharCode(stream.readUInt8()) + String.fromCharCode(stream.readUInt8());
    const isFinal = String.fromCharCode(stream.readUInt8());
    const length = stream.readUInt32();
    return { msgType, isFinal, length };
}
//# sourceMappingURL=read_message_header.js.map