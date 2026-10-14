"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doTraceIncomingChunk = exports.doTraceChunk = exports.doTraceHelloAck = void 0;
//
const transportFlag = (process.env?.NODEOPCUADEBUG?.match(/TRANSPORT{([^}]*)}/) || [])[1] || "";
exports.doTraceHelloAck = !!transportFlag.match(/HELACK/);
exports.doTraceChunk = !!transportFlag.match(/CHUNK/);
exports.doTraceIncomingChunk = !!transportFlag.match(/FLOW/);
//# sourceMappingURL=utils.js.map