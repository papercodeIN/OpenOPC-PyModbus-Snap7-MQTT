"use strict";
// ----- this file has been automatically generated - do not edit
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumTsnFailureCode = void 0;
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |TsnFailureCode                                              |
 * | isAbstract|false                                                       |
 */
var EnumTsnFailureCode;
(function (EnumTsnFailureCode) {
    /**
     * No failure
     */
    EnumTsnFailureCode[EnumTsnFailureCode["NoFailure"] = 0] = "NoFailure";
    /**
     * Insufficient bandwidth
     */
    EnumTsnFailureCode[EnumTsnFailureCode["InsufficientBandwidth"] = 1] = "InsufficientBandwidth";
    /**
     * Insufficient bridge resources
     */
    EnumTsnFailureCode[EnumTsnFailureCode["InsufficientResources"] = 2] = "InsufficientResources";
    /**
     * Insufficient bandwidth for Traffic Class
     */
    EnumTsnFailureCode[EnumTsnFailureCode["InsufficientTrafficClassBandwidth"] = 3] = "InsufficientTrafficClassBandwidth";
    /**
     * StreamID in use by another Talker
     */
    EnumTsnFailureCode[EnumTsnFailureCode["StreamIdInUse"] = 4] = "StreamIdInUse";
    /**
     * Stream destination address already in use
     */
    EnumTsnFailureCode[EnumTsnFailureCode["StreamDestinationAddressInUse"] = 5] = "StreamDestinationAddressInUse";
    /**
     * Stream pre-empted by higher rank
     */
    EnumTsnFailureCode[EnumTsnFailureCode["StreamPreemptedByHigherRank"] = 6] = "StreamPreemptedByHigherRank";
    /**
     * Reported latency has changed
     */
    EnumTsnFailureCode[EnumTsnFailureCode["LatencyHasChanged"] = 7] = "LatencyHasChanged";
    /**
     * Egress port is not AVBCapable
     */
    EnumTsnFailureCode[EnumTsnFailureCode["EgressPortNotAvbCapable"] = 8] = "EgressPortNotAvbCapable";
    /**
     * Use a different destination address
     */
    EnumTsnFailureCode[EnumTsnFailureCode["UseDifferentDestinationAddress"] = 9] = "UseDifferentDestinationAddress";
    /**
     * Out of MSRP resources
     */
    EnumTsnFailureCode[EnumTsnFailureCode["OutOfMsrpResources"] = 10] = "OutOfMsrpResources";
    /**
     * Out of MMRP resources
     */
    EnumTsnFailureCode[EnumTsnFailureCode["OutOfMmrpResources"] = 11] = "OutOfMmrpResources";
    /**
     * Cannot store destination address
     */
    EnumTsnFailureCode[EnumTsnFailureCode["CannotStoreDestinationAddress"] = 12] = "CannotStoreDestinationAddress";
    /**
     * Requested priority is not an SR Class priority
     */
    EnumTsnFailureCode[EnumTsnFailureCode["PriorityIsNotAnSrcClass"] = 13] = "PriorityIsNotAnSrcClass";
    /**
     * MaxFrameSize is too large for media
     */
    EnumTsnFailureCode[EnumTsnFailureCode["MaxFrameSizeTooLarge"] = 14] = "MaxFrameSizeTooLarge";
    /**
     * MaxFanInPorts limit has been reached
     */
    EnumTsnFailureCode[EnumTsnFailureCode["MaxFanInPortsLimitReached"] = 15] = "MaxFanInPortsLimitReached";
    /**
     * Changes in FirstValue for a registered StreamID
     */
    EnumTsnFailureCode[EnumTsnFailureCode["FirstValueChangedForStreamId"] = 16] = "FirstValueChangedForStreamId";
    /**
     * VLAN is blocked on this egress port (Registration
     * Forbidden)
     */
    EnumTsnFailureCode[EnumTsnFailureCode["VlanBlockedOnEgress"] = 17] = "VlanBlockedOnEgress";
    /**
     * VLAN tagging is disabled on this egress port
     * (untagged set)
     */
    EnumTsnFailureCode[EnumTsnFailureCode["VlanTaggingDisabledOnEgress"] = 18] = "VlanTaggingDisabledOnEgress";
    /**
     * SR class priority mismatch
     */
    EnumTsnFailureCode[EnumTsnFailureCode["SrClassPriorityMismatch"] = 19] = "SrClassPriorityMismatch";
    /**
     * Enhanced feature cannot be propagated to original
     * Port
     */
    EnumTsnFailureCode[EnumTsnFailureCode["FeatureNotPropagated"] = 20] = "FeatureNotPropagated";
    /**
     * MaxLatency exceeded
     */
    EnumTsnFailureCode[EnumTsnFailureCode["MaxLatencyExceeded"] = 21] = "MaxLatencyExceeded";
    /**
     * Nearest Bridge cannot provide network
     * identification for stream transformation
     */
    EnumTsnFailureCode[EnumTsnFailureCode["BridgeDoesNotProvideNetworkId"] = 22] = "BridgeDoesNotProvideNetworkId";
    /**
     * Stream transformation not supported
     */
    EnumTsnFailureCode[EnumTsnFailureCode["StreamTransformNotSupported"] = 23] = "StreamTransformNotSupported";
    /**
     * Stream identification type not supported for
     * stream transformation
     */
    EnumTsnFailureCode[EnumTsnFailureCode["StreamIdTypeNotSupported"] = 24] = "StreamIdTypeNotSupported";
    /**
     * Enhanced feature cannot be supported without a CNC
     */
    EnumTsnFailureCode[EnumTsnFailureCode["FeatureNotSupported"] = 25] = "FeatureNotSupported";
})(EnumTsnFailureCode || (exports.EnumTsnFailureCode = EnumTsnFailureCode = {}));
//# sourceMappingURL=enum_tsn_failure_code.js.map