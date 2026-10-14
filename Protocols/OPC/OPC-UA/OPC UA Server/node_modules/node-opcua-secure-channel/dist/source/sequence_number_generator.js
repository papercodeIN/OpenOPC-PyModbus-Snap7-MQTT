"use strict";
/**
 * @module node-opcua-secure-channel
 */
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
var _SequenceNumberGenerator__counter;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequenceNumberGenerator = void 0;
/**
 * SequenceNumberGenerator manages a monotonically increasing sequence number.
 * @class SequenceNumberGenerator
 *
 * @see OPC Unified Architecture, Part 6 -  $6.4.2 page 36 -
 *
 * The SequenceNumber shall also monotonically increase for all messages and shall not wrap
 * around until it is greater than 4294966271 (UInt32.MaxValue – 1024).
 *
 * The first number after the wrap around shall be less than 1024.
 *
 * Note that this requirement means that SequenceNumbers do not reset when a new TokenId is issued.
 *
 * The SequenceNumber shall be incremented by exactly one for each MessageChunk sent unless
 * the communication channel was interrupted and re-established.
 *
 * Gaps are permitted between the SequenceNumber for the last MessageChunk received before the
 * interruption and the SequenceNumber for first MessageChunk received after communication
 * was re-established.
 */
class SequenceNumberGenerator {
    constructor() {
        _SequenceNumberGenerator__counter.set(this, void 0);
        __classPrivateFieldSet(this, _SequenceNumberGenerator__counter, 0, "f");
        this._set(1);
    }
    next() {
        const current = __classPrivateFieldGet(this, _SequenceNumberGenerator__counter, "f");
        __classPrivateFieldSet(this, _SequenceNumberGenerator__counter, __classPrivateFieldGet(this, _SequenceNumberGenerator__counter, "f") + 1, "f");
        if (__classPrivateFieldGet(this, _SequenceNumberGenerator__counter, "f") > SequenceNumberGenerator.MAXVALUE) {
            this._set(1);
        }
        return current;
    }
    future() {
        return __classPrivateFieldGet(this, _SequenceNumberGenerator__counter, "f");
    }
    /**
     *
     * @param value forced the sequence number to a new value
     * @private
     */
    _set(value) {
        __classPrivateFieldSet(this, _SequenceNumberGenerator__counter, value, "f");
    }
}
exports.SequenceNumberGenerator = SequenceNumberGenerator;
_SequenceNumberGenerator__counter = new WeakMap();
/**
 * **spec Part 3 says**:
 *
 * The same sequence number shall not be reused on a Subscription until over
 * four billion NotificationMessages have been sent.
 * At a continuous rate of one thousand NotificationMessages per second on a given
 * Subscription, it would take roughly fifty days for the same sequence number to be reused.
 * This allows Clients to safely treat sequence numbers as unique.
 */
SequenceNumberGenerator.MAXVALUE = 4294966271;
//# sourceMappingURL=sequence_number_generator.js.map