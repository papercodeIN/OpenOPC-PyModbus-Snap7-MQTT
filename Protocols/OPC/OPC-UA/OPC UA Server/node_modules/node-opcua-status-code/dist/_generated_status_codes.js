"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCodes = void 0;
/**
 * @module node-opcua-status-codes
 */
// this file has been automatically generated
const opcua_status_code_1 = require("./opcua_status_code");
class StatusCodes {
}
exports.StatusCodes = StatusCodes;
/** The operation succeeded. */
StatusCodes.Good = new opcua_status_code_1.ConstantStatusCode({ name: "Good", value: 0x0, description: "The operation succeeded." });
/** The operation was uncertain. */
StatusCodes.Uncertain = new opcua_status_code_1.ConstantStatusCode({
    name: "Uncertain",
    value: 0x40000000,
    description: "The operation was uncertain."
});
/** The operation failed. */
StatusCodes.Bad = new opcua_status_code_1.ConstantStatusCode({
    name: "Bad",
    value: 0x80000000,
    description: "The operation failed."
});
/** An unexpected error occurred. */
StatusCodes.BadUnexpectedError = new opcua_status_code_1.ConstantStatusCode({
    name: "BadUnexpectedError",
    value: 0x80010000,
    description: "An unexpected error occurred."
});
/** An internal error occurred as a result of a programming or configuration error. */
StatusCodes.BadInternalError = new opcua_status_code_1.ConstantStatusCode({
    name: "BadInternalError",
    value: 0x80020000,
    description: "An internal error occurred as a result of a programming or configuration error."
});
/** Not enough memory to complete the operation. */
StatusCodes.BadOutOfMemory = new opcua_status_code_1.ConstantStatusCode({
    name: "BadOutOfMemory",
    value: 0x80030000,
    description: "Not enough memory to complete the operation."
});
/** An operating system resource is not available. */
StatusCodes.BadResourceUnavailable = new opcua_status_code_1.ConstantStatusCode({
    name: "BadResourceUnavailable",
    value: 0x80040000,
    description: "An operating system resource is not available."
});
/** A low level communication error occurred. */
StatusCodes.BadCommunicationError = new opcua_status_code_1.ConstantStatusCode({
    name: "BadCommunicationError",
    value: 0x80050000,
    description: "A low level communication error occurred."
});
/** Encoding halted because of invalid data in the objects being serialized. */
StatusCodes.BadEncodingError = new opcua_status_code_1.ConstantStatusCode({
    name: "BadEncodingError",
    value: 0x80060000,
    description: "Encoding halted because of invalid data in the objects being serialized."
});
/** Decoding halted because of invalid data in the stream. */
StatusCodes.BadDecodingError = new opcua_status_code_1.ConstantStatusCode({
    name: "BadDecodingError",
    value: 0x80070000,
    description: "Decoding halted because of invalid data in the stream."
});
/** The message encoding/decoding limits imposed by the stack have been exceeded. */
StatusCodes.BadEncodingLimitsExceeded = new opcua_status_code_1.ConstantStatusCode({
    name: "BadEncodingLimitsExceeded",
    value: 0x80080000,
    description: "The message encoding/decoding limits imposed by the stack have been exceeded."
});
/** The request message size exceeds limits set by the server. */
StatusCodes.BadRequestTooLarge = new opcua_status_code_1.ConstantStatusCode({
    name: "BadRequestTooLarge",
    value: 0x80b80000,
    description: "The request message size exceeds limits set by the server."
});
/** The response message size exceeds limits set by the client or server. */
StatusCodes.BadResponseTooLarge = new opcua_status_code_1.ConstantStatusCode({
    name: "BadResponseTooLarge",
    value: 0x80b90000,
    description: "The response message size exceeds limits set by the client or server."
});
/** An unrecognized response was received from the server. */
StatusCodes.BadUnknownResponse = new opcua_status_code_1.ConstantStatusCode({
    name: "BadUnknownResponse",
    value: 0x80090000,
    description: "An unrecognized response was received from the server."
});
/** The operation timed out. */
StatusCodes.BadTimeout = new opcua_status_code_1.ConstantStatusCode({
    name: "BadTimeout",
    value: 0x800a0000,
    description: "The operation timed out."
});
/** The server does not support the requested service. */
StatusCodes.BadServiceUnsupported = new opcua_status_code_1.ConstantStatusCode({
    name: "BadServiceUnsupported",
    value: 0x800b0000,
    description: "The server does not support the requested service."
});
/** The operation was cancelled because the application is shutting down. */
StatusCodes.BadShutdown = new opcua_status_code_1.ConstantStatusCode({
    name: "BadShutdown",
    value: 0x800c0000,
    description: "The operation was cancelled because the application is shutting down."
});
/** The operation could not complete because the client is not connected to the server. */
StatusCodes.BadServerNotConnected = new opcua_status_code_1.ConstantStatusCode({
    name: "BadServerNotConnected",
    value: 0x800d0000,
    description: "The operation could not complete because the client is not connected to the server."
});
/** The server has stopped and cannot process any requests. */
StatusCodes.BadServerHalted = new opcua_status_code_1.ConstantStatusCode({
    name: "BadServerHalted",
    value: 0x800e0000,
    description: "The server has stopped and cannot process any requests."
});
/** No processing could be done because there was nothing to do. */
StatusCodes.BadNothingToDo = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNothingToDo",
    value: 0x800f0000,
    description: "No processing could be done because there was nothing to do."
});
/** The request could not be processed because it specified too many operations. */
StatusCodes.BadTooManyOperations = new opcua_status_code_1.ConstantStatusCode({
    name: "BadTooManyOperations",
    value: 0x80100000,
    description: "The request could not be processed because it specified too many operations."
});
/** The request could not be processed because there are too many monitored items in the subscription. */
StatusCodes.BadTooManyMonitoredItems = new opcua_status_code_1.ConstantStatusCode({
    name: "BadTooManyMonitoredItems",
    value: 0x80db0000,
    description: "The request could not be processed because there are too many monitored items in the subscription."
});
/** The extension object cannot be (de)serialized because the data type id is not recognized. */
StatusCodes.BadDataTypeIdUnknown = new opcua_status_code_1.ConstantStatusCode({
    name: "BadDataTypeIdUnknown",
    value: 0x80110000,
    description: "The extension object cannot be (de)serialized because the data type id is not recognized."
});
/** The certificate provided as a parameter is not valid. */
StatusCodes.BadCertificateInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadCertificateInvalid",
    value: 0x80120000,
    description: "The certificate provided as a parameter is not valid."
});
/** An error occurred verifying security. */
StatusCodes.BadSecurityChecksFailed = new opcua_status_code_1.ConstantStatusCode({
    name: "BadSecurityChecksFailed",
    value: 0x80130000,
    description: "An error occurred verifying security."
});
/** The certificate does not meet the requirements of the security policy. */
StatusCodes.BadCertificatePolicyCheckFailed = new opcua_status_code_1.ConstantStatusCode({
    name: "BadCertificatePolicyCheckFailed",
    value: 0x81140000,
    description: "The certificate does not meet the requirements of the security policy."
});
/** The certificate has expired or is not yet valid. */
StatusCodes.BadCertificateTimeInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadCertificateTimeInvalid",
    value: 0x80140000,
    description: "The certificate has expired or is not yet valid."
});
/** An issuer certificate has expired or is not yet valid. */
StatusCodes.BadCertificateIssuerTimeInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadCertificateIssuerTimeInvalid",
    value: 0x80150000,
    description: "An issuer certificate has expired or is not yet valid."
});
/** The HostName used to connect to a server does not match a HostName in the certificate. */
StatusCodes.BadCertificateHostNameInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadCertificateHostNameInvalid",
    value: 0x80160000,
    description: "The HostName used to connect to a server does not match a HostName in the certificate."
});
/** The URI specified in the ApplicationDescription does not match the URI in the certificate. */
StatusCodes.BadCertificateUriInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadCertificateUriInvalid",
    value: 0x80170000,
    description: "The URI specified in the ApplicationDescription does not match the URI in the certificate."
});
/** The certificate may not be used for the requested operation. */
StatusCodes.BadCertificateUseNotAllowed = new opcua_status_code_1.ConstantStatusCode({
    name: "BadCertificateUseNotAllowed",
    value: 0x80180000,
    description: "The certificate may not be used for the requested operation."
});
/** The issuer certificate may not be used for the requested operation. */
StatusCodes.BadCertificateIssuerUseNotAllowed = new opcua_status_code_1.ConstantStatusCode({
    name: "BadCertificateIssuerUseNotAllowed",
    value: 0x80190000,
    description: "The issuer certificate may not be used for the requested operation."
});
/** The certificate is not trusted. */
StatusCodes.BadCertificateUntrusted = new opcua_status_code_1.ConstantStatusCode({
    name: "BadCertificateUntrusted",
    value: 0x801a0000,
    description: "The certificate is not trusted."
});
/** It was not possible to determine if the certificate has been revoked. */
StatusCodes.BadCertificateRevocationUnknown = new opcua_status_code_1.ConstantStatusCode({
    name: "BadCertificateRevocationUnknown",
    value: 0x801b0000,
    description: "It was not possible to determine if the certificate has been revoked."
});
/** It was not possible to determine if the issuer certificate has been revoked. */
StatusCodes.BadCertificateIssuerRevocationUnknown = new opcua_status_code_1.ConstantStatusCode({
    name: "BadCertificateIssuerRevocationUnknown",
    value: 0x801c0000,
    description: "It was not possible to determine if the issuer certificate has been revoked."
});
/** The certificate has been revoked. */
StatusCodes.BadCertificateRevoked = new opcua_status_code_1.ConstantStatusCode({
    name: "BadCertificateRevoked",
    value: 0x801d0000,
    description: "The certificate has been revoked."
});
/** The issuer certificate has been revoked. */
StatusCodes.BadCertificateIssuerRevoked = new opcua_status_code_1.ConstantStatusCode({
    name: "BadCertificateIssuerRevoked",
    value: 0x801e0000,
    description: "The issuer certificate has been revoked."
});
/** The certificate chain is incomplete. */
StatusCodes.BadCertificateChainIncomplete = new opcua_status_code_1.ConstantStatusCode({
    name: "BadCertificateChainIncomplete",
    value: 0x810d0000,
    description: "The certificate chain is incomplete."
});
/** User does not have permission to perform the requested operation. */
StatusCodes.BadUserAccessDenied = new opcua_status_code_1.ConstantStatusCode({
    name: "BadUserAccessDenied",
    value: 0x801f0000,
    description: "User does not have permission to perform the requested operation."
});
/** The user identity token is not valid. */
StatusCodes.BadIdentityTokenInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadIdentityTokenInvalid",
    value: 0x80200000,
    description: "The user identity token is not valid."
});
/** The user identity token is valid but the server has rejected it. */
StatusCodes.BadIdentityTokenRejected = new opcua_status_code_1.ConstantStatusCode({
    name: "BadIdentityTokenRejected",
    value: 0x80210000,
    description: "The user identity token is valid but the server has rejected it."
});
/** The specified secure channel is no longer valid. */
StatusCodes.BadSecureChannelIdInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadSecureChannelIdInvalid",
    value: 0x80220000,
    description: "The specified secure channel is no longer valid."
});
/** The timestamp is outside the range allowed by the server. */
StatusCodes.BadInvalidTimestamp = new opcua_status_code_1.ConstantStatusCode({
    name: "BadInvalidTimestamp",
    value: 0x80230000,
    description: "The timestamp is outside the range allowed by the server."
});
/** The nonce does appear to be not a random value or it is not the correct length. */
StatusCodes.BadNonceInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNonceInvalid",
    value: 0x80240000,
    description: "The nonce does appear to be not a random value or it is not the correct length."
});
/** The session id is not valid. */
StatusCodes.BadSessionIdInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadSessionIdInvalid",
    value: 0x80250000,
    description: "The session id is not valid."
});
/** The session was closed by the client. */
StatusCodes.BadSessionClosed = new opcua_status_code_1.ConstantStatusCode({
    name: "BadSessionClosed",
    value: 0x80260000,
    description: "The session was closed by the client."
});
/** The session cannot be used because ActivateSession has not been called. */
StatusCodes.BadSessionNotActivated = new opcua_status_code_1.ConstantStatusCode({
    name: "BadSessionNotActivated",
    value: 0x80270000,
    description: "The session cannot be used because ActivateSession has not been called."
});
/** The subscription id is not valid. */
StatusCodes.BadSubscriptionIdInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadSubscriptionIdInvalid",
    value: 0x80280000,
    description: "The subscription id is not valid."
});
/** The header for the request is missing or invalid. */
StatusCodes.BadRequestHeaderInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadRequestHeaderInvalid",
    value: 0x802a0000,
    description: "The header for the request is missing or invalid."
});
/** The timestamps to return parameter is invalid. */
StatusCodes.BadTimestampsToReturnInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadTimestampsToReturnInvalid",
    value: 0x802b0000,
    description: "The timestamps to return parameter is invalid."
});
/** The request was cancelled by the client. */
StatusCodes.BadRequestCancelledByClient = new opcua_status_code_1.ConstantStatusCode({
    name: "BadRequestCancelledByClient",
    value: 0x802c0000,
    description: "The request was cancelled by the client."
});
/** Too many arguments were provided. */
StatusCodes.BadTooManyArguments = new opcua_status_code_1.ConstantStatusCode({
    name: "BadTooManyArguments",
    value: 0x80e50000,
    description: "Too many arguments were provided."
});
/** The server requires a license to operate in general or to perform a service or operation, but existing license is expired. */
StatusCodes.BadLicenseExpired = new opcua_status_code_1.ConstantStatusCode({
    name: "BadLicenseExpired",
    value: 0x810e0000,
    description: "The server requires a license to operate in general or to perform a service or operation, but existing license is expired."
});
/** The server has limits on number of allowed operations / objects, based on installed licenses, and these limits where exceeded. */
StatusCodes.BadLicenseLimitsExceeded = new opcua_status_code_1.ConstantStatusCode({
    name: "BadLicenseLimitsExceeded",
    value: 0x810f0000,
    description: "The server has limits on number of allowed operations / objects, based on installed licenses, and these limits where exceeded."
});
/** The server does not have a license which is required to operate in general or to perform a service or operation. */
StatusCodes.BadLicenseNotAvailable = new opcua_status_code_1.ConstantStatusCode({
    name: "BadLicenseNotAvailable",
    value: 0x81100000,
    description: "The server does not have a license which is required to operate in general or to perform a service or operation."
});
/** The Server does not have the resources to process the request at this time. */
StatusCodes.BadServerTooBusy = new opcua_status_code_1.ConstantStatusCode({
    name: "BadServerTooBusy",
    value: 0x80ee0000,
    description: "The Server does not have the resources to process the request at this time."
});
/** The log-on for the user succeeded but the user is required to change the password. */
StatusCodes.GoodPasswordChangeRequired = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodPasswordChangeRequired",
    value: 0xef0000,
    description: "The log-on for the user succeeded but the user is required to change the password."
});
/** The subscription was transferred to another session. */
StatusCodes.GoodSubscriptionTransferred = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodSubscriptionTransferred",
    value: 0x2d0000,
    description: "The subscription was transferred to another session."
});
/** The processing will complete asynchronously. */
StatusCodes.GoodCompletesAsynchronously = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodCompletesAsynchronously",
    value: 0x2e0000,
    description: "The processing will complete asynchronously."
});
/** Sampling has slowed down due to resource limitations. */
StatusCodes.GoodOverload = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodOverload",
    value: 0x2f0000,
    description: "Sampling has slowed down due to resource limitations."
});
/** The value written was accepted but was clamped. */
StatusCodes.GoodClamped = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodClamped",
    value: 0x300000,
    description: "The value written was accepted but was clamped."
});
/** Communication with the data source is defined, but not established, and there is no last known value available. */
StatusCodes.BadNoCommunication = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNoCommunication",
    value: 0x80310000,
    description: "Communication with the data source is defined, but not established, and there is no last known value available."
});
/** Waiting for the server to obtain values from the underlying data source. */
StatusCodes.BadWaitingForInitialData = new opcua_status_code_1.ConstantStatusCode({
    name: "BadWaitingForInitialData",
    value: 0x80320000,
    description: "Waiting for the server to obtain values from the underlying data source."
});
/** The syntax the node id is not valid or refers to a node that is not valid for the operation. */
StatusCodes.BadNodeIdInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNodeIdInvalid",
    value: 0x80330000,
    description: "The syntax the node id is not valid or refers to a node that is not valid for the operation."
});
/** The node id refers to a node that does not exist in the server address space. */
StatusCodes.BadNodeIdUnknown = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNodeIdUnknown",
    value: 0x80340000,
    description: "The node id refers to a node that does not exist in the server address space."
});
/** The attribute is not supported for the specified Node. */
StatusCodes.BadAttributeIdInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadAttributeIdInvalid",
    value: 0x80350000,
    description: "The attribute is not supported for the specified Node."
});
/** The syntax of the index range parameter is invalid. */
StatusCodes.BadIndexRangeInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadIndexRangeInvalid",
    value: 0x80360000,
    description: "The syntax of the index range parameter is invalid."
});
/** No data exists within the range of indexes specified. */
StatusCodes.BadIndexRangeNoData = new opcua_status_code_1.ConstantStatusCode({
    name: "BadIndexRangeNoData",
    value: 0x80370000,
    description: "No data exists within the range of indexes specified."
});
/** The written data does not match the IndexRange specified. */
StatusCodes.BadIndexRangeDataMismatch = new opcua_status_code_1.ConstantStatusCode({
    name: "BadIndexRangeDataMismatch",
    value: 0x80ea0000,
    description: "The written data does not match the IndexRange specified."
});
/** The data encoding is invalid. */
StatusCodes.BadDataEncodingInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadDataEncodingInvalid",
    value: 0x80380000,
    description: "The data encoding is invalid."
});
/** The server does not support the requested data encoding for the node. */
StatusCodes.BadDataEncodingUnsupported = new opcua_status_code_1.ConstantStatusCode({
    name: "BadDataEncodingUnsupported",
    value: 0x80390000,
    description: "The server does not support the requested data encoding for the node."
});
/** The access level does not allow reading or subscribing to the Node. */
StatusCodes.BadNotReadable = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNotReadable",
    value: 0x803a0000,
    description: "The access level does not allow reading or subscribing to the Node."
});
/** The access level does not allow writing to the Node. */
StatusCodes.BadNotWritable = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNotWritable",
    value: 0x803b0000,
    description: "The access level does not allow writing to the Node."
});
/** The value was out of range. */
StatusCodes.BadOutOfRange = new opcua_status_code_1.ConstantStatusCode({
    name: "BadOutOfRange",
    value: 0x803c0000,
    description: "The value was out of range."
});
/** The requested operation is not supported. */
StatusCodes.BadNotSupported = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNotSupported",
    value: 0x803d0000,
    description: "The requested operation is not supported."
});
/** A requested item was not found or a search operation ended without success. */
StatusCodes.BadNotFound = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNotFound",
    value: 0x803e0000,
    description: "A requested item was not found or a search operation ended without success."
});
/** The object cannot be used because it has been deleted. */
StatusCodes.BadObjectDeleted = new opcua_status_code_1.ConstantStatusCode({
    name: "BadObjectDeleted",
    value: 0x803f0000,
    description: "The object cannot be used because it has been deleted."
});
/** Requested operation is not implemented. */
StatusCodes.BadNotImplemented = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNotImplemented",
    value: 0x80400000,
    description: "Requested operation is not implemented."
});
/** The monitoring mode is invalid. */
StatusCodes.BadMonitoringModeInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadMonitoringModeInvalid",
    value: 0x80410000,
    description: "The monitoring mode is invalid."
});
/** The monitoring item id does not refer to a valid monitored item. */
StatusCodes.BadMonitoredItemIdInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadMonitoredItemIdInvalid",
    value: 0x80420000,
    description: "The monitoring item id does not refer to a valid monitored item."
});
/** The monitored item filter parameter is not valid. */
StatusCodes.BadMonitoredItemFilterInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadMonitoredItemFilterInvalid",
    value: 0x80430000,
    description: "The monitored item filter parameter is not valid."
});
/** The server does not support the requested monitored item filter. */
StatusCodes.BadMonitoredItemFilterUnsupported = new opcua_status_code_1.ConstantStatusCode({
    name: "BadMonitoredItemFilterUnsupported",
    value: 0x80440000,
    description: "The server does not support the requested monitored item filter."
});
/** A monitoring filter cannot be used in combination with the attribute specified. */
StatusCodes.BadFilterNotAllowed = new opcua_status_code_1.ConstantStatusCode({
    name: "BadFilterNotAllowed",
    value: 0x80450000,
    description: "A monitoring filter cannot be used in combination with the attribute specified."
});
/** A mandatory structured parameter was missing or null. */
StatusCodes.BadStructureMissing = new opcua_status_code_1.ConstantStatusCode({
    name: "BadStructureMissing",
    value: 0x80460000,
    description: "A mandatory structured parameter was missing or null."
});
/** The event filter is not valid. */
StatusCodes.BadEventFilterInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadEventFilterInvalid",
    value: 0x80470000,
    description: "The event filter is not valid."
});
/** The content filter is not valid. */
StatusCodes.BadContentFilterInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadContentFilterInvalid",
    value: 0x80480000,
    description: "The content filter is not valid."
});
/** An unrecognized operator was provided in a filter. */
StatusCodes.BadFilterOperatorInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadFilterOperatorInvalid",
    value: 0x80c10000,
    description: "An unrecognized operator was provided in a filter."
});
/** A valid operator was provided, but the server does not provide support for this filter operator. */
StatusCodes.BadFilterOperatorUnsupported = new opcua_status_code_1.ConstantStatusCode({
    name: "BadFilterOperatorUnsupported",
    value: 0x80c20000,
    description: "A valid operator was provided, but the server does not provide support for this filter operator."
});
/** The number of operands provided for the filter operator was less then expected for the operand provided. */
StatusCodes.BadFilterOperandCountMismatch = new opcua_status_code_1.ConstantStatusCode({
    name: "BadFilterOperandCountMismatch",
    value: 0x80c30000,
    description: "The number of operands provided for the filter operator was less then expected for the operand provided."
});
/** The operand used in a content filter is not valid. */
StatusCodes.BadFilterOperandInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadFilterOperandInvalid",
    value: 0x80490000,
    description: "The operand used in a content filter is not valid."
});
/** The referenced element is not a valid element in the content filter. */
StatusCodes.BadFilterElementInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadFilterElementInvalid",
    value: 0x80c40000,
    description: "The referenced element is not a valid element in the content filter."
});
/** The referenced literal is not a valid value. */
StatusCodes.BadFilterLiteralInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadFilterLiteralInvalid",
    value: 0x80c50000,
    description: "The referenced literal is not a valid value."
});
/** The continuation point provide is longer valid. */
StatusCodes.BadContinuationPointInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadContinuationPointInvalid",
    value: 0x804a0000,
    description: "The continuation point provide is longer valid."
});
/** The operation could not be processed because all continuation points have been allocated. */
StatusCodes.BadNoContinuationPoints = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNoContinuationPoints",
    value: 0x804b0000,
    description: "The operation could not be processed because all continuation points have been allocated."
});
/** The reference type id does not refer to a valid reference type node. */
StatusCodes.BadReferenceTypeIdInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadReferenceTypeIdInvalid",
    value: 0x804c0000,
    description: "The reference type id does not refer to a valid reference type node."
});
/** The browse direction is not valid. */
StatusCodes.BadBrowseDirectionInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadBrowseDirectionInvalid",
    value: 0x804d0000,
    description: "The browse direction is not valid."
});
/** The node is not part of the view. */
StatusCodes.BadNodeNotInView = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNodeNotInView",
    value: 0x804e0000,
    description: "The node is not part of the view."
});
/** The number was not accepted because of a numeric overflow. */
StatusCodes.BadNumericOverflow = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNumericOverflow",
    value: 0x81120000,
    description: "The number was not accepted because of a numeric overflow."
});
/** The locale in the requested write operation is not supported. */
StatusCodes.BadLocaleNotSupported = new opcua_status_code_1.ConstantStatusCode({
    name: "BadLocaleNotSupported",
    value: 0x80ed0000,
    description: "The locale in the requested write operation is not supported."
});
/** The variable has no default value and no initial value. */
StatusCodes.BadNoValue = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNoValue",
    value: 0x80f00000,
    description: "The variable has no default value and no initial value."
});
/** The ServerUri is not a valid URI. */
StatusCodes.BadServerUriInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadServerUriInvalid",
    value: 0x804f0000,
    description: "The ServerUri is not a valid URI."
});
/** No ServerName was specified. */
StatusCodes.BadServerNameMissing = new opcua_status_code_1.ConstantStatusCode({
    name: "BadServerNameMissing",
    value: 0x80500000,
    description: "No ServerName was specified."
});
/** No DiscoveryUrl was specified. */
StatusCodes.BadDiscoveryUrlMissing = new opcua_status_code_1.ConstantStatusCode({
    name: "BadDiscoveryUrlMissing",
    value: 0x80510000,
    description: "No DiscoveryUrl was specified."
});
/** The semaphore file specified by the client is not valid. */
StatusCodes.BadSempahoreFileMissing = new opcua_status_code_1.ConstantStatusCode({
    name: "BadSempahoreFileMissing",
    value: 0x80520000,
    description: "The semaphore file specified by the client is not valid."
});
/** The security token request type is not valid. */
StatusCodes.BadRequestTypeInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadRequestTypeInvalid",
    value: 0x80530000,
    description: "The security token request type is not valid."
});
/** The security mode does not meet the requirements set by the server. */
StatusCodes.BadSecurityModeRejected = new opcua_status_code_1.ConstantStatusCode({
    name: "BadSecurityModeRejected",
    value: 0x80540000,
    description: "The security mode does not meet the requirements set by the server."
});
/** The security policy does not meet the requirements set by the server. */
StatusCodes.BadSecurityPolicyRejected = new opcua_status_code_1.ConstantStatusCode({
    name: "BadSecurityPolicyRejected",
    value: 0x80550000,
    description: "The security policy does not meet the requirements set by the server."
});
/** The server has reached its maximum number of sessions. */
StatusCodes.BadTooManySessions = new opcua_status_code_1.ConstantStatusCode({
    name: "BadTooManySessions",
    value: 0x80560000,
    description: "The server has reached its maximum number of sessions."
});
/** The user token signature is missing or invalid. */
StatusCodes.BadUserSignatureInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadUserSignatureInvalid",
    value: 0x80570000,
    description: "The user token signature is missing or invalid."
});
/** The signature generated with the client certificate is missing or invalid. */
StatusCodes.BadApplicationSignatureInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadApplicationSignatureInvalid",
    value: 0x80580000,
    description: "The signature generated with the client certificate is missing or invalid."
});
/** The client did not provide at least one software certificate that is valid and meets the profile requirements for the server. */
StatusCodes.BadNoValidCertificates = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNoValidCertificates",
    value: 0x80590000,
    description: "The client did not provide at least one software certificate that is valid and meets the profile requirements for the server."
});
/** The server does not support changing the user identity assigned to the session. */
StatusCodes.BadIdentityChangeNotSupported = new opcua_status_code_1.ConstantStatusCode({
    name: "BadIdentityChangeNotSupported",
    value: 0x80c60000,
    description: "The server does not support changing the user identity assigned to the session."
});
/** The request was cancelled by the client with the Cancel service. */
StatusCodes.BadRequestCancelledByRequest = new opcua_status_code_1.ConstantStatusCode({
    name: "BadRequestCancelledByRequest",
    value: 0x805a0000,
    description: "The request was cancelled by the client with the Cancel service."
});
/** The parent node id does not to refer to a valid node. */
StatusCodes.BadParentNodeIdInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadParentNodeIdInvalid",
    value: 0x805b0000,
    description: "The parent node id does not to refer to a valid node."
});
/** The reference could not be created because it violates constraints imposed by the data model. */
StatusCodes.BadReferenceNotAllowed = new opcua_status_code_1.ConstantStatusCode({
    name: "BadReferenceNotAllowed",
    value: 0x805c0000,
    description: "The reference could not be created because it violates constraints imposed by the data model."
});
/** The requested node id was reject because it was either invalid or server does not allow node ids to be specified by the client. */
StatusCodes.BadNodeIdRejected = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNodeIdRejected",
    value: 0x805d0000,
    description: "The requested node id was reject because it was either invalid or server does not allow node ids to be specified by the client."
});
/** The requested node id is already used by another node. */
StatusCodes.BadNodeIdExists = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNodeIdExists",
    value: 0x805e0000,
    description: "The requested node id is already used by another node."
});
/** The node class is not valid. */
StatusCodes.BadNodeClassInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNodeClassInvalid",
    value: 0x805f0000,
    description: "The node class is not valid."
});
/** The browse name is invalid. */
StatusCodes.BadBrowseNameInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadBrowseNameInvalid",
    value: 0x80600000,
    description: "The browse name is invalid."
});
/** The browse name is not unique among nodes that share the same relationship with the parent. */
StatusCodes.BadBrowseNameDuplicated = new opcua_status_code_1.ConstantStatusCode({
    name: "BadBrowseNameDuplicated",
    value: 0x80610000,
    description: "The browse name is not unique among nodes that share the same relationship with the parent."
});
/** The node attributes are not valid for the node class. */
StatusCodes.BadNodeAttributesInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNodeAttributesInvalid",
    value: 0x80620000,
    description: "The node attributes are not valid for the node class."
});
/** The type definition node id does not reference an appropriate type node. */
StatusCodes.BadTypeDefinitionInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadTypeDefinitionInvalid",
    value: 0x80630000,
    description: "The type definition node id does not reference an appropriate type node."
});
/** The source node id does not reference a valid node. */
StatusCodes.BadSourceNodeIdInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadSourceNodeIdInvalid",
    value: 0x80640000,
    description: "The source node id does not reference a valid node."
});
/** The target node id does not reference a valid node. */
StatusCodes.BadTargetNodeIdInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadTargetNodeIdInvalid",
    value: 0x80650000,
    description: "The target node id does not reference a valid node."
});
/** The reference type between the nodes is already defined. */
StatusCodes.BadDuplicateReferenceNotAllowed = new opcua_status_code_1.ConstantStatusCode({
    name: "BadDuplicateReferenceNotAllowed",
    value: 0x80660000,
    description: "The reference type between the nodes is already defined."
});
/** The server does not allow this type of self reference on this node. */
StatusCodes.BadInvalidSelfReference = new opcua_status_code_1.ConstantStatusCode({
    name: "BadInvalidSelfReference",
    value: 0x80670000,
    description: "The server does not allow this type of self reference on this node."
});
/** The reference type is not valid for a reference to a remote server. */
StatusCodes.BadReferenceLocalOnly = new opcua_status_code_1.ConstantStatusCode({
    name: "BadReferenceLocalOnly",
    value: 0x80680000,
    description: "The reference type is not valid for a reference to a remote server."
});
/** The server will not allow the node to be deleted. */
StatusCodes.BadNoDeleteRights = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNoDeleteRights",
    value: 0x80690000,
    description: "The server will not allow the node to be deleted."
});
/** The server was not able to delete all target references. */
StatusCodes.UncertainReferenceNotDeleted = new opcua_status_code_1.ConstantStatusCode({
    name: "UncertainReferenceNotDeleted",
    value: 0x40bc0000,
    description: "The server was not able to delete all target references."
});
/** The server index is not valid. */
StatusCodes.BadServerIndexInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadServerIndexInvalid",
    value: 0x806a0000,
    description: "The server index is not valid."
});
/** The view id does not refer to a valid view node. */
StatusCodes.BadViewIdUnknown = new opcua_status_code_1.ConstantStatusCode({
    name: "BadViewIdUnknown",
    value: 0x806b0000,
    description: "The view id does not refer to a valid view node."
});
/** The view timestamp is not available or not supported. */
StatusCodes.BadViewTimestampInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadViewTimestampInvalid",
    value: 0x80c90000,
    description: "The view timestamp is not available or not supported."
});
/** The view parameters are not consistent with each other. */
StatusCodes.BadViewParameterMismatch = new opcua_status_code_1.ConstantStatusCode({
    name: "BadViewParameterMismatch",
    value: 0x80ca0000,
    description: "The view parameters are not consistent with each other."
});
/** The view version is not available or not supported. */
StatusCodes.BadViewVersionInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadViewVersionInvalid",
    value: 0x80cb0000,
    description: "The view version is not available or not supported."
});
/** The list of references may not be complete because the underlying system is not available. */
StatusCodes.UncertainNotAllNodesAvailable = new opcua_status_code_1.ConstantStatusCode({
    name: "UncertainNotAllNodesAvailable",
    value: 0x40c00000,
    description: "The list of references may not be complete because the underlying system is not available."
});
/** The server should have followed a reference to a node in a remote server but did not. The result set may be incomplete. */
StatusCodes.GoodResultsMayBeIncomplete = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodResultsMayBeIncomplete",
    value: 0xba0000,
    description: "The server should have followed a reference to a node in a remote server but did not. The result set may be incomplete."
});
/** The provided Nodeid was not a type definition nodeid. */
StatusCodes.BadNotTypeDefinition = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNotTypeDefinition",
    value: 0x80c80000,
    description: "The provided Nodeid was not a type definition nodeid."
});
/** One of the references to follow in the relative path references to a node in the address space in another server. */
StatusCodes.UncertainReferenceOutOfServer = new opcua_status_code_1.ConstantStatusCode({
    name: "UncertainReferenceOutOfServer",
    value: 0x406c0000,
    description: "One of the references to follow in the relative path references to a node in the address space in another server."
});
/** The requested operation has too many matches to return. */
StatusCodes.BadTooManyMatches = new opcua_status_code_1.ConstantStatusCode({
    name: "BadTooManyMatches",
    value: 0x806d0000,
    description: "The requested operation has too many matches to return."
});
/** The requested operation requires too many resources in the server. */
StatusCodes.BadQueryTooComplex = new opcua_status_code_1.ConstantStatusCode({
    name: "BadQueryTooComplex",
    value: 0x806e0000,
    description: "The requested operation requires too many resources in the server."
});
/** The requested operation has no match to return. */
StatusCodes.BadNoMatch = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNoMatch",
    value: 0x806f0000,
    description: "The requested operation has no match to return."
});
/** The max age parameter is invalid. */
StatusCodes.BadMaxAgeInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadMaxAgeInvalid",
    value: 0x80700000,
    description: "The max age parameter is invalid."
});
/** The operation is not permitted over the current secure channel. */
StatusCodes.BadSecurityModeInsufficient = new opcua_status_code_1.ConstantStatusCode({
    name: "BadSecurityModeInsufficient",
    value: 0x80e60000,
    description: "The operation is not permitted over the current secure channel."
});
/** The history details parameter is not valid. */
StatusCodes.BadHistoryOperationInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadHistoryOperationInvalid",
    value: 0x80710000,
    description: "The history details parameter is not valid."
});
/** The server does not support the requested operation. */
StatusCodes.BadHistoryOperationUnsupported = new opcua_status_code_1.ConstantStatusCode({
    name: "BadHistoryOperationUnsupported",
    value: 0x80720000,
    description: "The server does not support the requested operation."
});
/** The defined timestamp to return was invalid. */
StatusCodes.BadInvalidTimestampArgument = new opcua_status_code_1.ConstantStatusCode({
    name: "BadInvalidTimestampArgument",
    value: 0x80bd0000,
    description: "The defined timestamp to return was invalid."
});
/** The server does not support writing the combination of value, status and timestamps provided. */
StatusCodes.BadWriteNotSupported = new opcua_status_code_1.ConstantStatusCode({
    name: "BadWriteNotSupported",
    value: 0x80730000,
    description: "The server does not support writing the combination of value, status and timestamps provided."
});
/** The value supplied for the attribute is not of the same type as the attribute's value. */
StatusCodes.BadTypeMismatch = new opcua_status_code_1.ConstantStatusCode({
    name: "BadTypeMismatch",
    value: 0x80740000,
    description: "The value supplied for the attribute is not of the same type as the attribute's value."
});
/** The method id does not refer to a method for the specified object. */
StatusCodes.BadMethodInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadMethodInvalid",
    value: 0x80750000,
    description: "The method id does not refer to a method for the specified object."
});
/** The client did not specify all of the input arguments for the method. */
StatusCodes.BadArgumentsMissing = new opcua_status_code_1.ConstantStatusCode({
    name: "BadArgumentsMissing",
    value: 0x80760000,
    description: "The client did not specify all of the input arguments for the method."
});
/** The executable attribute does not allow the execution of the method. */
StatusCodes.BadNotExecutable = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNotExecutable",
    value: 0x81110000,
    description: "The executable attribute does not allow the execution of the method."
});
/** The server has reached its maximum number of subscriptions. */
StatusCodes.BadTooManySubscriptions = new opcua_status_code_1.ConstantStatusCode({
    name: "BadTooManySubscriptions",
    value: 0x80770000,
    description: "The server has reached its maximum number of subscriptions."
});
/** The server has reached the maximum number of queued publish requests. */
StatusCodes.BadTooManyPublishRequests = new opcua_status_code_1.ConstantStatusCode({
    name: "BadTooManyPublishRequests",
    value: 0x80780000,
    description: "The server has reached the maximum number of queued publish requests."
});
/** There is no subscription available for this session. */
StatusCodes.BadNoSubscription = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNoSubscription",
    value: 0x80790000,
    description: "There is no subscription available for this session."
});
/** The sequence number is unknown to the server. */
StatusCodes.BadSequenceNumberUnknown = new opcua_status_code_1.ConstantStatusCode({
    name: "BadSequenceNumberUnknown",
    value: 0x807a0000,
    description: "The sequence number is unknown to the server."
});
/** The Server does not support retransmission queue and acknowledgement of sequence numbers is not available. */
StatusCodes.GoodRetransmissionQueueNotSupported = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodRetransmissionQueueNotSupported",
    value: 0xdf0000,
    description: "The Server does not support retransmission queue and acknowledgement of sequence numbers is not available."
});
/** The requested notification message is no longer available. */
StatusCodes.BadMessageNotAvailable = new opcua_status_code_1.ConstantStatusCode({
    name: "BadMessageNotAvailable",
    value: 0x807b0000,
    description: "The requested notification message is no longer available."
});
/** The client of the current session does not support one or more Profiles that are necessary for the subscription. */
StatusCodes.BadInsufficientClientProfile = new opcua_status_code_1.ConstantStatusCode({
    name: "BadInsufficientClientProfile",
    value: 0x807c0000,
    description: "The client of the current session does not support one or more Profiles that are necessary for the subscription."
});
/** The sub-state machine is not currently active. */
StatusCodes.BadStateNotActive = new opcua_status_code_1.ConstantStatusCode({
    name: "BadStateNotActive",
    value: 0x80bf0000,
    description: "The sub-state machine is not currently active."
});
/** An equivalent rule already exists. */
StatusCodes.BadAlreadyExists = new opcua_status_code_1.ConstantStatusCode({
    name: "BadAlreadyExists",
    value: 0x81150000,
    description: "An equivalent rule already exists."
});
/** The server cannot process the request because it is too busy. */
StatusCodes.BadTcpServerTooBusy = new opcua_status_code_1.ConstantStatusCode({
    name: "BadTcpServerTooBusy",
    value: 0x807d0000,
    description: "The server cannot process the request because it is too busy."
});
/** The type of the message specified in the header invalid. */
StatusCodes.BadTcpMessageTypeInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadTcpMessageTypeInvalid",
    value: 0x807e0000,
    description: "The type of the message specified in the header invalid."
});
/** The SecureChannelId and/or TokenId are not currently in use. */
StatusCodes.BadTcpSecureChannelUnknown = new opcua_status_code_1.ConstantStatusCode({
    name: "BadTcpSecureChannelUnknown",
    value: 0x807f0000,
    description: "The SecureChannelId and/or TokenId are not currently in use."
});
/** The size of the message chunk specified in the header is too large. */
StatusCodes.BadTcpMessageTooLarge = new opcua_status_code_1.ConstantStatusCode({
    name: "BadTcpMessageTooLarge",
    value: 0x80800000,
    description: "The size of the message chunk specified in the header is too large."
});
/** There are not enough resources to process the request. */
StatusCodes.BadTcpNotEnoughResources = new opcua_status_code_1.ConstantStatusCode({
    name: "BadTcpNotEnoughResources",
    value: 0x80810000,
    description: "There are not enough resources to process the request."
});
/** An internal error occurred. */
StatusCodes.BadTcpInternalError = new opcua_status_code_1.ConstantStatusCode({
    name: "BadTcpInternalError",
    value: 0x80820000,
    description: "An internal error occurred."
});
/** The server does not recognize the QueryString specified. */
StatusCodes.BadTcpEndpointUrlInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadTcpEndpointUrlInvalid",
    value: 0x80830000,
    description: "The server does not recognize the QueryString specified."
});
/** The request could not be sent because of a network interruption. */
StatusCodes.BadRequestInterrupted = new opcua_status_code_1.ConstantStatusCode({
    name: "BadRequestInterrupted",
    value: 0x80840000,
    description: "The request could not be sent because of a network interruption."
});
/** Timeout occurred while processing the request. */
StatusCodes.BadRequestTimeout = new opcua_status_code_1.ConstantStatusCode({
    name: "BadRequestTimeout",
    value: 0x80850000,
    description: "Timeout occurred while processing the request."
});
/** The secure channel has been closed. */
StatusCodes.BadSecureChannelClosed = new opcua_status_code_1.ConstantStatusCode({
    name: "BadSecureChannelClosed",
    value: 0x80860000,
    description: "The secure channel has been closed."
});
/** The token has expired or is not recognized. */
StatusCodes.BadSecureChannelTokenUnknown = new opcua_status_code_1.ConstantStatusCode({
    name: "BadSecureChannelTokenUnknown",
    value: 0x80870000,
    description: "The token has expired or is not recognized."
});
/** The sequence number is not valid. */
StatusCodes.BadSequenceNumberInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadSequenceNumberInvalid",
    value: 0x80880000,
    description: "The sequence number is not valid."
});
/** The applications do not have compatible protocol versions. */
StatusCodes.BadProtocolVersionUnsupported = new opcua_status_code_1.ConstantStatusCode({
    name: "BadProtocolVersionUnsupported",
    value: 0x80be0000,
    description: "The applications do not have compatible protocol versions."
});
/** There is a problem with the configuration that affects the usefulness of the value. */
StatusCodes.BadConfigurationError = new opcua_status_code_1.ConstantStatusCode({
    name: "BadConfigurationError",
    value: 0x80890000,
    description: "There is a problem with the configuration that affects the usefulness of the value."
});
/** The variable should receive its value from another variable, but has never been configured to do so. */
StatusCodes.BadNotConnected = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNotConnected",
    value: 0x808a0000,
    description: "The variable should receive its value from another variable, but has never been configured to do so."
});
/** There has been a failure in the device/data source that generates the value that has affected the value. */
StatusCodes.BadDeviceFailure = new opcua_status_code_1.ConstantStatusCode({
    name: "BadDeviceFailure",
    value: 0x808b0000,
    description: "There has been a failure in the device/data source that generates the value that has affected the value."
});
/** There has been a failure in the sensor from which the value is derived by the device/data source. */
StatusCodes.BadSensorFailure = new opcua_status_code_1.ConstantStatusCode({
    name: "BadSensorFailure",
    value: 0x808c0000,
    description: "There has been a failure in the sensor from which the value is derived by the device/data source."
});
/** The source of the data is not operational. */
StatusCodes.BadOutOfService = new opcua_status_code_1.ConstantStatusCode({
    name: "BadOutOfService",
    value: 0x808d0000,
    description: "The source of the data is not operational."
});
/** The deadband filter is not valid. */
StatusCodes.BadDeadbandFilterInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadDeadbandFilterInvalid",
    value: 0x808e0000,
    description: "The deadband filter is not valid."
});
/** Communication to the data source has failed. The variable value is the last value that had a good quality. */
StatusCodes.UncertainNoCommunicationLastUsableValue = new opcua_status_code_1.ConstantStatusCode({
    name: "UncertainNoCommunicationLastUsableValue",
    value: 0x408f0000,
    description: "Communication to the data source has failed. The variable value is the last value that had a good quality."
});
/** Whatever was updating this value has stopped doing so. */
StatusCodes.UncertainLastUsableValue = new opcua_status_code_1.ConstantStatusCode({
    name: "UncertainLastUsableValue",
    value: 0x40900000,
    description: "Whatever was updating this value has stopped doing so."
});
/** The value is an operational value that was manually overwritten. */
StatusCodes.UncertainSubstituteValue = new opcua_status_code_1.ConstantStatusCode({
    name: "UncertainSubstituteValue",
    value: 0x40910000,
    description: "The value is an operational value that was manually overwritten."
});
/** The value is an initial value for a variable that normally receives its value from another variable. */
StatusCodes.UncertainInitialValue = new opcua_status_code_1.ConstantStatusCode({
    name: "UncertainInitialValue",
    value: 0x40920000,
    description: "The value is an initial value for a variable that normally receives its value from another variable."
});
/** The value is at one of the sensor limits. */
StatusCodes.UncertainSensorNotAccurate = new opcua_status_code_1.ConstantStatusCode({
    name: "UncertainSensorNotAccurate",
    value: 0x40930000,
    description: "The value is at one of the sensor limits."
});
/** The value is outside of the range of values defined for this parameter. */
StatusCodes.UncertainEngineeringUnitsExceeded = new opcua_status_code_1.ConstantStatusCode({
    name: "UncertainEngineeringUnitsExceeded",
    value: 0x40940000,
    description: "The value is outside of the range of values defined for this parameter."
});
/** The data value is derived from multiple sources and has less than the required number of Good sources. */
StatusCodes.UncertainSubNormal = new opcua_status_code_1.ConstantStatusCode({
    name: "UncertainSubNormal",
    value: 0x40950000,
    description: "The data value is derived from multiple sources and has less than the required number of Good sources."
});
/** The value has been overridden. */
StatusCodes.GoodLocalOverride = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodLocalOverride",
    value: 0x960000,
    description: "The value has been overridden."
});
/** The value is derived from multiple sources and has the required number of Good sources, but less than the full number of Good sources. */
StatusCodes.GoodSubNormal = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodSubNormal",
    value: 0xeb0000,
    description: "The value is derived from multiple sources and has the required number of Good sources, but less than the full number of Good sources."
});
/** This Condition refresh failed, a Condition refresh operation is already in progress. */
StatusCodes.BadRefreshInProgress = new opcua_status_code_1.ConstantStatusCode({
    name: "BadRefreshInProgress",
    value: 0x80970000,
    description: "This Condition refresh failed, a Condition refresh operation is already in progress."
});
/** This condition has already been disabled. */
StatusCodes.BadConditionAlreadyDisabled = new opcua_status_code_1.ConstantStatusCode({
    name: "BadConditionAlreadyDisabled",
    value: 0x80980000,
    description: "This condition has already been disabled."
});
/** This condition has already been enabled. */
StatusCodes.BadConditionAlreadyEnabled = new opcua_status_code_1.ConstantStatusCode({
    name: "BadConditionAlreadyEnabled",
    value: 0x80cc0000,
    description: "This condition has already been enabled."
});
/** Property not available, this condition is disabled. */
StatusCodes.BadConditionDisabled = new opcua_status_code_1.ConstantStatusCode({
    name: "BadConditionDisabled",
    value: 0x80990000,
    description: "Property not available, this condition is disabled."
});
/** The specified event id is not recognized. */
StatusCodes.BadEventIdUnknown = new opcua_status_code_1.ConstantStatusCode({
    name: "BadEventIdUnknown",
    value: 0x809a0000,
    description: "The specified event id is not recognized."
});
/** The event cannot be acknowledged. */
StatusCodes.BadEventNotAcknowledgeable = new opcua_status_code_1.ConstantStatusCode({
    name: "BadEventNotAcknowledgeable",
    value: 0x80bb0000,
    description: "The event cannot be acknowledged."
});
/** The dialog condition is not active. */
StatusCodes.BadDialogNotActive = new opcua_status_code_1.ConstantStatusCode({
    name: "BadDialogNotActive",
    value: 0x80cd0000,
    description: "The dialog condition is not active."
});
/** The response is not valid for the dialog. */
StatusCodes.BadDialogResponseInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadDialogResponseInvalid",
    value: 0x80ce0000,
    description: "The response is not valid for the dialog."
});
/** The condition branch has already been acknowledged. */
StatusCodes.BadConditionBranchAlreadyAcked = new opcua_status_code_1.ConstantStatusCode({
    name: "BadConditionBranchAlreadyAcked",
    value: 0x80cf0000,
    description: "The condition branch has already been acknowledged."
});
/** The condition branch has already been confirmed. */
StatusCodes.BadConditionBranchAlreadyConfirmed = new opcua_status_code_1.ConstantStatusCode({
    name: "BadConditionBranchAlreadyConfirmed",
    value: 0x80d00000,
    description: "The condition branch has already been confirmed."
});
/** The condition has already been shelved. */
StatusCodes.BadConditionAlreadyShelved = new opcua_status_code_1.ConstantStatusCode({
    name: "BadConditionAlreadyShelved",
    value: 0x80d10000,
    description: "The condition has already been shelved."
});
/** The condition is not currently shelved. */
StatusCodes.BadConditionNotShelved = new opcua_status_code_1.ConstantStatusCode({
    name: "BadConditionNotShelved",
    value: 0x80d20000,
    description: "The condition is not currently shelved."
});
/** The shelving time not within an acceptable range. */
StatusCodes.BadShelvingTimeOutOfRange = new opcua_status_code_1.ConstantStatusCode({
    name: "BadShelvingTimeOutOfRange",
    value: 0x80d30000,
    description: "The shelving time not within an acceptable range."
});
/** No data exists for the requested time range or event filter. */
StatusCodes.BadNoData = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNoData",
    value: 0x809b0000,
    description: "No data exists for the requested time range or event filter."
});
/** No data found to provide upper or lower bound value. */
StatusCodes.BadBoundNotFound = new opcua_status_code_1.ConstantStatusCode({
    name: "BadBoundNotFound",
    value: 0x80d70000,
    description: "No data found to provide upper or lower bound value."
});
/** The server cannot retrieve a bound for the variable. */
StatusCodes.BadBoundNotSupported = new opcua_status_code_1.ConstantStatusCode({
    name: "BadBoundNotSupported",
    value: 0x80d80000,
    description: "The server cannot retrieve a bound for the variable."
});
/** Data is missing due to collection started/stopped/lost. */
StatusCodes.BadDataLost = new opcua_status_code_1.ConstantStatusCode({
    name: "BadDataLost",
    value: 0x809d0000,
    description: "Data is missing due to collection started/stopped/lost."
});
/** Expected data is unavailable for the requested time range due to an un-mounted volume, an off-line archive or tape, or similar reason for temporary unavailability. */
StatusCodes.BadDataUnavailable = new opcua_status_code_1.ConstantStatusCode({
    name: "BadDataUnavailable",
    value: 0x809e0000,
    description: "Expected data is unavailable for the requested time range due to an un-mounted volume, an off-line archive or tape, or similar reason for temporary unavailability."
});
/** The data or event was not successfully inserted because a matching entry exists. */
StatusCodes.BadEntryExists = new opcua_status_code_1.ConstantStatusCode({
    name: "BadEntryExists",
    value: 0x809f0000,
    description: "The data or event was not successfully inserted because a matching entry exists."
});
/** The data or event was not successfully updated because no matching entry exists. */
StatusCodes.BadNoEntryExists = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNoEntryExists",
    value: 0x80a00000,
    description: "The data or event was not successfully updated because no matching entry exists."
});
/** The Client requested history using a TimestampsToReturn the Server does not support. */
StatusCodes.BadTimestampNotSupported = new opcua_status_code_1.ConstantStatusCode({
    name: "BadTimestampNotSupported",
    value: 0x80a10000,
    description: "The Client requested history using a TimestampsToReturn the Server does not support."
});
/** The data or event was successfully inserted into the historical database. */
StatusCodes.GoodEntryInserted = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodEntryInserted",
    value: 0xa20000,
    description: "The data or event was successfully inserted into the historical database."
});
/** The data or event field was successfully replaced in the historical database. */
StatusCodes.GoodEntryReplaced = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodEntryReplaced",
    value: 0xa30000,
    description: "The data or event field was successfully replaced in the historical database."
});
/** The aggregate value is derived from multiple values and has less than the required number of Good values. */
StatusCodes.UncertainDataSubNormal = new opcua_status_code_1.ConstantStatusCode({
    name: "UncertainDataSubNormal",
    value: 0x40a40000,
    description: "The aggregate value is derived from multiple values and has less than the required number of Good values."
});
/** No data exists for the requested time range or event filter. */
StatusCodes.GoodNoData = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodNoData",
    value: 0xa50000,
    description: "No data exists for the requested time range or event filter."
});
/** More data is available in the time range beyond the number of values requested. */
StatusCodes.GoodMoreData = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodMoreData",
    value: 0xa60000,
    description: "More data is available in the time range beyond the number of values requested."
});
/** The requested number of Aggregates does not match the requested number of NodeIds. */
StatusCodes.BadAggregateListMismatch = new opcua_status_code_1.ConstantStatusCode({
    name: "BadAggregateListMismatch",
    value: 0x80d40000,
    description: "The requested number of Aggregates does not match the requested number of NodeIds."
});
/** The requested Aggregate is not support by the server. */
StatusCodes.BadAggregateNotSupported = new opcua_status_code_1.ConstantStatusCode({
    name: "BadAggregateNotSupported",
    value: 0x80d50000,
    description: "The requested Aggregate is not support by the server."
});
/** The aggregate value could not be derived due to invalid data inputs. */
StatusCodes.BadAggregateInvalidInputs = new opcua_status_code_1.ConstantStatusCode({
    name: "BadAggregateInvalidInputs",
    value: 0x80d60000,
    description: "The aggregate value could not be derived due to invalid data inputs."
});
/** The aggregate configuration is not valid for specified node. */
StatusCodes.BadAggregateConfigurationRejected = new opcua_status_code_1.ConstantStatusCode({
    name: "BadAggregateConfigurationRejected",
    value: 0x80da0000,
    description: "The aggregate configuration is not valid for specified node."
});
/** The request specifies fields which are not valid for the EventType or cannot be saved by the historian. */
StatusCodes.GoodDataIgnored = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodDataIgnored",
    value: 0xd90000,
    description: "The request specifies fields which are not valid for the EventType or cannot be saved by the historian."
});
/** The request was rejected by the server because it did not meet the criteria set by the server. */
StatusCodes.BadRequestNotAllowed = new opcua_status_code_1.ConstantStatusCode({
    name: "BadRequestNotAllowed",
    value: 0x80e40000,
    description: "The request was rejected by the server because it did not meet the criteria set by the server."
});
/** The request has not been processed by the server yet. */
StatusCodes.BadRequestNotComplete = new opcua_status_code_1.ConstantStatusCode({
    name: "BadRequestNotComplete",
    value: 0x81130000,
    description: "The request has not been processed by the server yet."
});
/** The operation is not allowed because a transaction is in progress. */
StatusCodes.BadTransactionPending = new opcua_status_code_1.ConstantStatusCode({
    name: "BadTransactionPending",
    value: 0x80e80000,
    description: "The operation is not allowed because a transaction is in progress."
});
/** The device identity needs a ticket before it can be accepted. */
StatusCodes.BadTicketRequired = new opcua_status_code_1.ConstantStatusCode({
    name: "BadTicketRequired",
    value: 0x811f0000,
    description: "The device identity needs a ticket before it can be accepted."
});
/** The device identity needs a ticket before it can be accepted. */
StatusCodes.BadTicketInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadTicketInvalid",
    value: 0x81200000,
    description: "The device identity needs a ticket before it can be accepted."
});
/** The requested operation is not allowed, because the Node is locked by a different application. */
StatusCodes.BadLocked = new opcua_status_code_1.ConstantStatusCode({
    name: "BadLocked",
    value: 0x80e90000,
    description: "The requested operation is not allowed, because the Node is locked by a different application."
});
/** The requested operation is not allowed, because the Node is not locked by the application. */
StatusCodes.BadRequiresLock = new opcua_status_code_1.ConstantStatusCode({
    name: "BadRequiresLock",
    value: 0x80ec0000,
    description: "The requested operation is not allowed, because the Node is not locked by the application."
});
/** The value does not come from the real source and has been edited by the server. */
StatusCodes.GoodEdited = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodEdited",
    value: 0xdc0000,
    description: "The value does not come from the real source and has been edited by the server."
});
/** There was an error in execution of these post-actions. */
StatusCodes.GoodPostActionFailed = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodPostActionFailed",
    value: 0xdd0000,
    description: "There was an error in execution of these post-actions."
});
/** The related EngineeringUnit has been changed but the Variable Value is still provided based on the previous unit. */
StatusCodes.UncertainDominantValueChanged = new opcua_status_code_1.ConstantStatusCode({
    name: "UncertainDominantValueChanged",
    value: 0x40de0000,
    description: "The related EngineeringUnit has been changed but the Variable Value is still provided based on the previous unit."
});
/** A dependent value has been changed but the change has not been applied to the device. */
StatusCodes.GoodDependentValueChanged = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodDependentValueChanged",
    value: 0xe00000,
    description: "A dependent value has been changed but the change has not been applied to the device."
});
/** The related EngineeringUnit has been changed but this change has not been applied to the device. The Variable Value is still dependent on the previous unit but its status is currently Bad. */
StatusCodes.BadDominantValueChanged = new opcua_status_code_1.ConstantStatusCode({
    name: "BadDominantValueChanged",
    value: 0x80e10000,
    description: "The related EngineeringUnit has been changed but this change has not been applied to the device. The Variable Value is still dependent on the previous unit but its status is currently Bad."
});
/** A dependent value has been changed but the change has not been applied to the device. The quality of the dominant variable is uncertain. */
StatusCodes.UncertainDependentValueChanged = new opcua_status_code_1.ConstantStatusCode({
    name: "UncertainDependentValueChanged",
    value: 0x40e20000,
    description: "A dependent value has been changed but the change has not been applied to the device. The quality of the dominant variable is uncertain."
});
/** A dependent value has been changed but the change has not been applied to the device. The quality of the dominant variable is Bad. */
StatusCodes.BadDependentValueChanged = new opcua_status_code_1.ConstantStatusCode({
    name: "BadDependentValueChanged",
    value: 0x80e30000,
    description: "A dependent value has been changed but the change has not been applied to the device. The quality of the dominant variable is Bad."
});
/** It is delivered with a dominant Variable value when a dependent Variable has changed but the change has not been applied. */
StatusCodes.GoodEdited_DependentValueChanged = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodEdited_DependentValueChanged",
    value: 0x1160000,
    description: "It is delivered with a dominant Variable value when a dependent Variable has changed but the change has not been applied."
});
/** It is delivered with a dependent Variable value when a dominant Variable has changed but the change has not been applied. */
StatusCodes.GoodEdited_DominantValueChanged = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodEdited_DominantValueChanged",
    value: 0x1170000,
    description: "It is delivered with a dependent Variable value when a dominant Variable has changed but the change has not been applied."
});
/** It is delivered with a dependent Variable value when a dominant or dependent Variable has changed but change has not been applied. */
StatusCodes.GoodEdited_DominantValueChanged_DependentValueChanged = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodEdited_DominantValueChanged_DependentValueChanged",
    value: 0x1180000,
    description: "It is delivered with a dependent Variable value when a dominant or dependent Variable has changed but change has not been applied."
});
/** It is delivered with a Variable value when Variable has changed but the value is not legal. */
StatusCodes.BadEdited_OutOfRange = new opcua_status_code_1.ConstantStatusCode({
    name: "BadEdited_OutOfRange",
    value: 0x81190000,
    description: "It is delivered with a Variable value when Variable has changed but the value is not legal."
});
/** It is delivered with a Variable value when a source Variable has changed but the value is not legal. */
StatusCodes.BadInitialValue_OutOfRange = new opcua_status_code_1.ConstantStatusCode({
    name: "BadInitialValue_OutOfRange",
    value: 0x811a0000,
    description: "It is delivered with a Variable value when a source Variable has changed but the value is not legal."
});
/** It is delivered with a dependent Variable value when a dominant Variable has changed and the value is not legal. */
StatusCodes.BadOutOfRange_DominantValueChanged = new opcua_status_code_1.ConstantStatusCode({
    name: "BadOutOfRange_DominantValueChanged",
    value: 0x811b0000,
    description: "It is delivered with a dependent Variable value when a dominant Variable has changed and the value is not legal."
});
/** It is delivered with a dependent Variable value when a dominant Variable has changed, the value is not legal and the change has not been applied. */
StatusCodes.BadEdited_OutOfRange_DominantValueChanged = new opcua_status_code_1.ConstantStatusCode({
    name: "BadEdited_OutOfRange_DominantValueChanged",
    value: 0x811c0000,
    description: "It is delivered with a dependent Variable value when a dominant Variable has changed, the value is not legal and the change has not been applied."
});
/** It is delivered with a dependent Variable value when a dominant or dependent Variable has changed and the value is not legal. */
StatusCodes.BadOutOfRange_DominantValueChanged_DependentValueChanged = new opcua_status_code_1.ConstantStatusCode({
    name: "BadOutOfRange_DominantValueChanged_DependentValueChanged",
    value: 0x811d0000,
    description: "It is delivered with a dependent Variable value when a dominant or dependent Variable has changed and the value is not legal."
});
/** It is delivered with a dependent Variable value when a dominant or dependent Variable has changed, the value is not legal and the change has not been applied. */
StatusCodes.BadEdited_OutOfRange_DominantValueChanged_DependentValueChanged = new opcua_status_code_1.ConstantStatusCode({
    name: "BadEdited_OutOfRange_DominantValueChanged_DependentValueChanged",
    value: 0x811e0000,
    description: "It is delivered with a dependent Variable value when a dominant or dependent Variable has changed, the value is not legal and the change has not been applied."
});
/** The communication layer has raised an event. */
StatusCodes.GoodCommunicationEvent = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodCommunicationEvent",
    value: 0xa70000,
    description: "The communication layer has raised an event."
});
/** The system is shutting down. */
StatusCodes.GoodShutdownEvent = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodShutdownEvent",
    value: 0xa80000,
    description: "The system is shutting down."
});
/** The operation is not finished and needs to be called again. */
StatusCodes.GoodCallAgain = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodCallAgain",
    value: 0xa90000,
    description: "The operation is not finished and needs to be called again."
});
/** A non-critical timeout occurred. */
StatusCodes.GoodNonCriticalTimeout = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodNonCriticalTimeout",
    value: 0xaa0000,
    description: "A non-critical timeout occurred."
});
/** One or more arguments are invalid. */
StatusCodes.BadInvalidArgument = new opcua_status_code_1.ConstantStatusCode({
    name: "BadInvalidArgument",
    value: 0x80ab0000,
    description: "One or more arguments are invalid."
});
/** Could not establish a network connection to remote server. */
StatusCodes.BadConnectionRejected = new opcua_status_code_1.ConstantStatusCode({
    name: "BadConnectionRejected",
    value: 0x80ac0000,
    description: "Could not establish a network connection to remote server."
});
/** The server has disconnected from the client. */
StatusCodes.BadDisconnect = new opcua_status_code_1.ConstantStatusCode({
    name: "BadDisconnect",
    value: 0x80ad0000,
    description: "The server has disconnected from the client."
});
/** The network connection has been closed. */
StatusCodes.BadConnectionClosed = new opcua_status_code_1.ConstantStatusCode({
    name: "BadConnectionClosed",
    value: 0x80ae0000,
    description: "The network connection has been closed."
});
/** The operation cannot be completed because the object is closed, uninitialized or in some other invalid state. */
StatusCodes.BadInvalidState = new opcua_status_code_1.ConstantStatusCode({
    name: "BadInvalidState",
    value: 0x80af0000,
    description: "The operation cannot be completed because the object is closed, uninitialized or in some other invalid state."
});
/** Cannot move beyond end of the stream. */
StatusCodes.BadEndOfStream = new opcua_status_code_1.ConstantStatusCode({
    name: "BadEndOfStream",
    value: 0x80b00000,
    description: "Cannot move beyond end of the stream."
});
/** No data is currently available for reading from a non-blocking stream. */
StatusCodes.BadNoDataAvailable = new opcua_status_code_1.ConstantStatusCode({
    name: "BadNoDataAvailable",
    value: 0x80b10000,
    description: "No data is currently available for reading from a non-blocking stream."
});
/** The asynchronous operation is waiting for a response. */
StatusCodes.BadWaitingForResponse = new opcua_status_code_1.ConstantStatusCode({
    name: "BadWaitingForResponse",
    value: 0x80b20000,
    description: "The asynchronous operation is waiting for a response."
});
/** The asynchronous operation was abandoned by the caller. */
StatusCodes.BadOperationAbandoned = new opcua_status_code_1.ConstantStatusCode({
    name: "BadOperationAbandoned",
    value: 0x80b30000,
    description: "The asynchronous operation was abandoned by the caller."
});
/** The stream did not return all data requested (possibly because it is a non-blocking stream). */
StatusCodes.BadExpectedStreamToBlock = new opcua_status_code_1.ConstantStatusCode({
    name: "BadExpectedStreamToBlock",
    value: 0x80b40000,
    description: "The stream did not return all data requested (possibly because it is a non-blocking stream)."
});
/** Non blocking behaviour is required and the operation would block. */
StatusCodes.BadWouldBlock = new opcua_status_code_1.ConstantStatusCode({
    name: "BadWouldBlock",
    value: 0x80b50000,
    description: "Non blocking behaviour is required and the operation would block."
});
/** A value had an invalid syntax. */
StatusCodes.BadSyntaxError = new opcua_status_code_1.ConstantStatusCode({
    name: "BadSyntaxError",
    value: 0x80b60000,
    description: "A value had an invalid syntax."
});
/** The operation could not be finished because all available connections are in use. */
StatusCodes.BadMaxConnectionsReached = new opcua_status_code_1.ConstantStatusCode({
    name: "BadMaxConnectionsReached",
    value: 0x80b70000,
    description: "The operation could not be finished because all available connections are in use."
});
/** The value may not be accurate because the transducer is in manual mode. */
StatusCodes.UncertainTransducerInManual = new opcua_status_code_1.ConstantStatusCode({
    name: "UncertainTransducerInManual",
    value: 0x42080000,
    description: "The value may not be accurate because the transducer is in manual mode."
});
/** The value is simulated. */
StatusCodes.UncertainSimulatedValue = new opcua_status_code_1.ConstantStatusCode({
    name: "UncertainSimulatedValue",
    value: 0x42090000,
    description: "The value is simulated."
});
/** The value may not be accurate due to a sensor calibration fault. */
StatusCodes.UncertainSensorCalibration = new opcua_status_code_1.ConstantStatusCode({
    name: "UncertainSensorCalibration",
    value: 0x420a0000,
    description: "The value may not be accurate due to a sensor calibration fault."
});
/** The value may not be accurate due to a configuration issue. */
StatusCodes.UncertainConfigurationError = new opcua_status_code_1.ConstantStatusCode({
    name: "UncertainConfigurationError",
    value: 0x420f0000,
    description: "The value may not be accurate due to a configuration issue."
});
/** The value source supports cascade handshaking and the value has been Initialized based on an initialization request from a cascade secondary. */
StatusCodes.GoodCascadeInitializationAcknowledged = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodCascadeInitializationAcknowledged",
    value: 0x4010000,
    description: "The value source supports cascade handshaking and the value has been Initialized based on an initialization request from a cascade secondary."
});
/** The value source supports cascade handshaking and is requesting initialization of a cascade primary. */
StatusCodes.GoodCascadeInitializationRequest = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodCascadeInitializationRequest",
    value: 0x4020000,
    description: "The value source supports cascade handshaking and is requesting initialization of a cascade primary."
});
/** The value source supports cascade handshaking, however, the source’s current state does not allow for cascade. */
StatusCodes.GoodCascadeNotInvited = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodCascadeNotInvited",
    value: 0x4030000,
    description: "The value source supports cascade handshaking, however, the source’s current state does not allow for cascade."
});
/** The value source supports cascade handshaking, however, the source has not selected the corresponding cascade primary for use. */
StatusCodes.GoodCascadeNotSelected = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodCascadeNotSelected",
    value: 0x4040000,
    description: "The value source supports cascade handshaking, however, the source has not selected the corresponding cascade primary for use."
});
/** There is a fault state condition active in the value source. */
StatusCodes.GoodFaultStateActive = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodFaultStateActive",
    value: 0x4070000,
    description: "There is a fault state condition active in the value source."
});
/** A fault state condition is being requested of the destination. */
StatusCodes.GoodInitiateFaultState = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodInitiateFaultState",
    value: 0x4080000,
    description: "A fault state condition is being requested of the destination."
});
/** The value is accurate, and the signal source supports cascade handshaking. */
StatusCodes.GoodCascade = new opcua_status_code_1.ConstantStatusCode({
    name: "GoodCascade",
    value: 0x4090000,
    description: "The value is accurate, and the signal source supports cascade handshaking."
});
/** The DataSet specified for the DataSetWriter creation is invalid. */
StatusCodes.BadDataSetIdInvalid = new opcua_status_code_1.ConstantStatusCode({
    name: "BadDataSetIdInvalid",
    value: 0x80e70000,
    description: "The DataSet specified for the DataSetWriter creation is invalid."
});
StatusCodes.GoodWithOverflowBit = opcua_status_code_1.StatusCode.makeStatusCode(StatusCodes.Good, `Overflow | InfoTypeDataValue`);
//# sourceMappingURL=_generated_status_codes.js.map