"use strict";
// ----- this file has been automatically generated - do not edit
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumTsnListenerStatus = void 0;
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |TsnListenerStatus                                           |
 * | isAbstract|false                                                       |
 */
var EnumTsnListenerStatus;
(function (EnumTsnListenerStatus) {
    /**
     * No Listener detected.
     */
    EnumTsnListenerStatus[EnumTsnListenerStatus["None"] = 0] = "None";
    /**
     * Listener ready (configured).
     */
    EnumTsnListenerStatus[EnumTsnListenerStatus["Ready"] = 1] = "Ready";
    /**
     * One or more Listeners ready, and one or more
     * Listeners failed.
     */
    EnumTsnListenerStatus[EnumTsnListenerStatus["PartialFailed"] = 2] = "PartialFailed";
    /**
     * Listener failed.
     */
    EnumTsnListenerStatus[EnumTsnListenerStatus["Failed"] = 3] = "Failed";
})(EnumTsnListenerStatus || (exports.EnumTsnListenerStatus = EnumTsnListenerStatus = {}));
//# sourceMappingURL=enum_tsn_listener_status.js.map