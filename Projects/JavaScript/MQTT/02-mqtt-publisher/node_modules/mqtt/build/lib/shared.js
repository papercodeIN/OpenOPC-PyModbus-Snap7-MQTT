"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MQTTJS_VERSION = exports.nextTick = exports.ErrorWithSubackPacket = exports.ErrorWithReasonCode = void 0;
exports.applyMixin = applyMixin;
class ErrorWithReasonCode extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.code = code;
        Object.setPrototypeOf(this, ErrorWithReasonCode.prototype);
        Object.getPrototypeOf(this).name = 'ErrorWithReasonCode';
    }
}
exports.ErrorWithReasonCode = ErrorWithReasonCode;
class ErrorWithSubackPacket extends Error {
    packet;
    constructor(message, packet) {
        super(message);
        this.packet = packet;
        Object.setPrototypeOf(this, ErrorWithSubackPacket.prototype);
        Object.getPrototypeOf(this).name = 'ErrorWithSubackPacket';
    }
}
exports.ErrorWithSubackPacket = ErrorWithSubackPacket;
function applyMixin(target, mixin, includeConstructor = false) {
    const inheritanceChain = [mixin];
    while (true) {
        const current = inheritanceChain[0];
        const base = Object.getPrototypeOf(current);
        if (base?.prototype) {
            inheritanceChain.unshift(base);
        }
        else {
            break;
        }
    }
    for (const ctor of inheritanceChain) {
        for (const prop of Object.getOwnPropertyNames(ctor.prototype)) {
            if (includeConstructor || prop !== 'constructor') {
                Object.defineProperty(target.prototype, prop, Object.getOwnPropertyDescriptor(ctor.prototype, prop) ??
                    Object.create(null));
            }
        }
    }
}
exports.nextTick = typeof process?.nextTick === 'function'
    ? process.nextTick
    : (callback) => {
        setTimeout(callback, 0);
    };
exports.MQTTJS_VERSION = require('../../package.json').version;
//# sourceMappingURL=shared.js.map