"use strict";
// ----- this file has been automatically generated - do not edit
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumNegotiationStatus = void 0;
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |NegotiationStatus                                           |
 * | isAbstract|false                                                       |
 */
var EnumNegotiationStatus;
(function (EnumNegotiationStatus) {
    /**
     * The auto-negotiation protocol is running and
     * negotiation is currently in-progress.
     */
    EnumNegotiationStatus[EnumNegotiationStatus["InProgress"] = 0] = "InProgress";
    /**
     * The auto-negotiation protocol has completed
     * successfully.
     */
    EnumNegotiationStatus[EnumNegotiationStatus["Complete"] = 1] = "Complete";
    /**
     * The auto-negotiation protocol has failed.
     */
    EnumNegotiationStatus[EnumNegotiationStatus["Failed"] = 2] = "Failed";
    /**
     * The auto-negotiation status is not currently
     * known, this could be because it is still
     * negotiating or the protocol cannot run (e.g., if
     * no medium is present).
     */
    EnumNegotiationStatus[EnumNegotiationStatus["Unknown"] = 3] = "Unknown";
    /**
     * No auto-negotiation is executed. The
     * auto-negotiation function is either not supported
     * on this interface or has not been enabled.
     */
    EnumNegotiationStatus[EnumNegotiationStatus["NoNegotiation"] = 4] = "NoNegotiation";
})(EnumNegotiationStatus || (exports.EnumNegotiationStatus = EnumNegotiationStatus = {}));
//# sourceMappingURL=enum_negotiation_status.js.map