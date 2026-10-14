/**
 * @module node-opcua-status-codes
 */
import { ConstantStatusCode, StatusCode } from "./opcua_status_code";
export declare class StatusCodes {
    /** The operation succeeded. */
    static Good: ConstantStatusCode;
    /** The operation was uncertain. */
    static Uncertain: ConstantStatusCode;
    /** The operation failed. */
    static Bad: ConstantStatusCode;
    /** An unexpected error occurred. */
    static BadUnexpectedError: ConstantStatusCode;
    /** An internal error occurred as a result of a programming or configuration error. */
    static BadInternalError: ConstantStatusCode;
    /** Not enough memory to complete the operation. */
    static BadOutOfMemory: ConstantStatusCode;
    /** An operating system resource is not available. */
    static BadResourceUnavailable: ConstantStatusCode;
    /** A low level communication error occurred. */
    static BadCommunicationError: ConstantStatusCode;
    /** Encoding halted because of invalid data in the objects being serialized. */
    static BadEncodingError: ConstantStatusCode;
    /** Decoding halted because of invalid data in the stream. */
    static BadDecodingError: ConstantStatusCode;
    /** The message encoding/decoding limits imposed by the stack have been exceeded. */
    static BadEncodingLimitsExceeded: ConstantStatusCode;
    /** The request message size exceeds limits set by the server. */
    static BadRequestTooLarge: ConstantStatusCode;
    /** The response message size exceeds limits set by the client or server. */
    static BadResponseTooLarge: ConstantStatusCode;
    /** An unrecognized response was received from the server. */
    static BadUnknownResponse: ConstantStatusCode;
    /** The operation timed out. */
    static BadTimeout: ConstantStatusCode;
    /** The server does not support the requested service. */
    static BadServiceUnsupported: ConstantStatusCode;
    /** The operation was cancelled because the application is shutting down. */
    static BadShutdown: ConstantStatusCode;
    /** The operation could not complete because the client is not connected to the server. */
    static BadServerNotConnected: ConstantStatusCode;
    /** The server has stopped and cannot process any requests. */
    static BadServerHalted: ConstantStatusCode;
    /** No processing could be done because there was nothing to do. */
    static BadNothingToDo: ConstantStatusCode;
    /** The request could not be processed because it specified too many operations. */
    static BadTooManyOperations: ConstantStatusCode;
    /** The request could not be processed because there are too many monitored items in the subscription. */
    static BadTooManyMonitoredItems: ConstantStatusCode;
    /** The extension object cannot be (de)serialized because the data type id is not recognized. */
    static BadDataTypeIdUnknown: ConstantStatusCode;
    /** The certificate provided as a parameter is not valid. */
    static BadCertificateInvalid: ConstantStatusCode;
    /** An error occurred verifying security. */
    static BadSecurityChecksFailed: ConstantStatusCode;
    /** The certificate does not meet the requirements of the security policy. */
    static BadCertificatePolicyCheckFailed: ConstantStatusCode;
    /** The certificate has expired or is not yet valid. */
    static BadCertificateTimeInvalid: ConstantStatusCode;
    /** An issuer certificate has expired or is not yet valid. */
    static BadCertificateIssuerTimeInvalid: ConstantStatusCode;
    /** The HostName used to connect to a server does not match a HostName in the certificate. */
    static BadCertificateHostNameInvalid: ConstantStatusCode;
    /** The URI specified in the ApplicationDescription does not match the URI in the certificate. */
    static BadCertificateUriInvalid: ConstantStatusCode;
    /** The certificate may not be used for the requested operation. */
    static BadCertificateUseNotAllowed: ConstantStatusCode;
    /** The issuer certificate may not be used for the requested operation. */
    static BadCertificateIssuerUseNotAllowed: ConstantStatusCode;
    /** The certificate is not trusted. */
    static BadCertificateUntrusted: ConstantStatusCode;
    /** It was not possible to determine if the certificate has been revoked. */
    static BadCertificateRevocationUnknown: ConstantStatusCode;
    /** It was not possible to determine if the issuer certificate has been revoked. */
    static BadCertificateIssuerRevocationUnknown: ConstantStatusCode;
    /** The certificate has been revoked. */
    static BadCertificateRevoked: ConstantStatusCode;
    /** The issuer certificate has been revoked. */
    static BadCertificateIssuerRevoked: ConstantStatusCode;
    /** The certificate chain is incomplete. */
    static BadCertificateChainIncomplete: ConstantStatusCode;
    /** User does not have permission to perform the requested operation. */
    static BadUserAccessDenied: ConstantStatusCode;
    /** The user identity token is not valid. */
    static BadIdentityTokenInvalid: ConstantStatusCode;
    /** The user identity token is valid but the server has rejected it. */
    static BadIdentityTokenRejected: ConstantStatusCode;
    /** The specified secure channel is no longer valid. */
    static BadSecureChannelIdInvalid: ConstantStatusCode;
    /** The timestamp is outside the range allowed by the server. */
    static BadInvalidTimestamp: ConstantStatusCode;
    /** The nonce does appear to be not a random value or it is not the correct length. */
    static BadNonceInvalid: ConstantStatusCode;
    /** The session id is not valid. */
    static BadSessionIdInvalid: ConstantStatusCode;
    /** The session was closed by the client. */
    static BadSessionClosed: ConstantStatusCode;
    /** The session cannot be used because ActivateSession has not been called. */
    static BadSessionNotActivated: ConstantStatusCode;
    /** The subscription id is not valid. */
    static BadSubscriptionIdInvalid: ConstantStatusCode;
    /** The header for the request is missing or invalid. */
    static BadRequestHeaderInvalid: ConstantStatusCode;
    /** The timestamps to return parameter is invalid. */
    static BadTimestampsToReturnInvalid: ConstantStatusCode;
    /** The request was cancelled by the client. */
    static BadRequestCancelledByClient: ConstantStatusCode;
    /** Too many arguments were provided. */
    static BadTooManyArguments: ConstantStatusCode;
    /** The server requires a license to operate in general or to perform a service or operation, but existing license is expired. */
    static BadLicenseExpired: ConstantStatusCode;
    /** The server has limits on number of allowed operations / objects, based on installed licenses, and these limits where exceeded. */
    static BadLicenseLimitsExceeded: ConstantStatusCode;
    /** The server does not have a license which is required to operate in general or to perform a service or operation. */
    static BadLicenseNotAvailable: ConstantStatusCode;
    /** The Server does not have the resources to process the request at this time. */
    static BadServerTooBusy: ConstantStatusCode;
    /** The log-on for the user succeeded but the user is required to change the password. */
    static GoodPasswordChangeRequired: ConstantStatusCode;
    /** The subscription was transferred to another session. */
    static GoodSubscriptionTransferred: ConstantStatusCode;
    /** The processing will complete asynchronously. */
    static GoodCompletesAsynchronously: ConstantStatusCode;
    /** Sampling has slowed down due to resource limitations. */
    static GoodOverload: ConstantStatusCode;
    /** The value written was accepted but was clamped. */
    static GoodClamped: ConstantStatusCode;
    /** Communication with the data source is defined, but not established, and there is no last known value available. */
    static BadNoCommunication: ConstantStatusCode;
    /** Waiting for the server to obtain values from the underlying data source. */
    static BadWaitingForInitialData: ConstantStatusCode;
    /** The syntax the node id is not valid or refers to a node that is not valid for the operation. */
    static BadNodeIdInvalid: ConstantStatusCode;
    /** The node id refers to a node that does not exist in the server address space. */
    static BadNodeIdUnknown: ConstantStatusCode;
    /** The attribute is not supported for the specified Node. */
    static BadAttributeIdInvalid: ConstantStatusCode;
    /** The syntax of the index range parameter is invalid. */
    static BadIndexRangeInvalid: ConstantStatusCode;
    /** No data exists within the range of indexes specified. */
    static BadIndexRangeNoData: ConstantStatusCode;
    /** The written data does not match the IndexRange specified. */
    static BadIndexRangeDataMismatch: ConstantStatusCode;
    /** The data encoding is invalid. */
    static BadDataEncodingInvalid: ConstantStatusCode;
    /** The server does not support the requested data encoding for the node. */
    static BadDataEncodingUnsupported: ConstantStatusCode;
    /** The access level does not allow reading or subscribing to the Node. */
    static BadNotReadable: ConstantStatusCode;
    /** The access level does not allow writing to the Node. */
    static BadNotWritable: ConstantStatusCode;
    /** The value was out of range. */
    static BadOutOfRange: ConstantStatusCode;
    /** The requested operation is not supported. */
    static BadNotSupported: ConstantStatusCode;
    /** A requested item was not found or a search operation ended without success. */
    static BadNotFound: ConstantStatusCode;
    /** The object cannot be used because it has been deleted. */
    static BadObjectDeleted: ConstantStatusCode;
    /** Requested operation is not implemented. */
    static BadNotImplemented: ConstantStatusCode;
    /** The monitoring mode is invalid. */
    static BadMonitoringModeInvalid: ConstantStatusCode;
    /** The monitoring item id does not refer to a valid monitored item. */
    static BadMonitoredItemIdInvalid: ConstantStatusCode;
    /** The monitored item filter parameter is not valid. */
    static BadMonitoredItemFilterInvalid: ConstantStatusCode;
    /** The server does not support the requested monitored item filter. */
    static BadMonitoredItemFilterUnsupported: ConstantStatusCode;
    /** A monitoring filter cannot be used in combination with the attribute specified. */
    static BadFilterNotAllowed: ConstantStatusCode;
    /** A mandatory structured parameter was missing or null. */
    static BadStructureMissing: ConstantStatusCode;
    /** The event filter is not valid. */
    static BadEventFilterInvalid: ConstantStatusCode;
    /** The content filter is not valid. */
    static BadContentFilterInvalid: ConstantStatusCode;
    /** An unrecognized operator was provided in a filter. */
    static BadFilterOperatorInvalid: ConstantStatusCode;
    /** A valid operator was provided, but the server does not provide support for this filter operator. */
    static BadFilterOperatorUnsupported: ConstantStatusCode;
    /** The number of operands provided for the filter operator was less then expected for the operand provided. */
    static BadFilterOperandCountMismatch: ConstantStatusCode;
    /** The operand used in a content filter is not valid. */
    static BadFilterOperandInvalid: ConstantStatusCode;
    /** The referenced element is not a valid element in the content filter. */
    static BadFilterElementInvalid: ConstantStatusCode;
    /** The referenced literal is not a valid value. */
    static BadFilterLiteralInvalid: ConstantStatusCode;
    /** The continuation point provide is longer valid. */
    static BadContinuationPointInvalid: ConstantStatusCode;
    /** The operation could not be processed because all continuation points have been allocated. */
    static BadNoContinuationPoints: ConstantStatusCode;
    /** The reference type id does not refer to a valid reference type node. */
    static BadReferenceTypeIdInvalid: ConstantStatusCode;
    /** The browse direction is not valid. */
    static BadBrowseDirectionInvalid: ConstantStatusCode;
    /** The node is not part of the view. */
    static BadNodeNotInView: ConstantStatusCode;
    /** The number was not accepted because of a numeric overflow. */
    static BadNumericOverflow: ConstantStatusCode;
    /** The locale in the requested write operation is not supported. */
    static BadLocaleNotSupported: ConstantStatusCode;
    /** The variable has no default value and no initial value. */
    static BadNoValue: ConstantStatusCode;
    /** The ServerUri is not a valid URI. */
    static BadServerUriInvalid: ConstantStatusCode;
    /** No ServerName was specified. */
    static BadServerNameMissing: ConstantStatusCode;
    /** No DiscoveryUrl was specified. */
    static BadDiscoveryUrlMissing: ConstantStatusCode;
    /** The semaphore file specified by the client is not valid. */
    static BadSempahoreFileMissing: ConstantStatusCode;
    /** The security token request type is not valid. */
    static BadRequestTypeInvalid: ConstantStatusCode;
    /** The security mode does not meet the requirements set by the server. */
    static BadSecurityModeRejected: ConstantStatusCode;
    /** The security policy does not meet the requirements set by the server. */
    static BadSecurityPolicyRejected: ConstantStatusCode;
    /** The server has reached its maximum number of sessions. */
    static BadTooManySessions: ConstantStatusCode;
    /** The user token signature is missing or invalid. */
    static BadUserSignatureInvalid: ConstantStatusCode;
    /** The signature generated with the client certificate is missing or invalid. */
    static BadApplicationSignatureInvalid: ConstantStatusCode;
    /** The client did not provide at least one software certificate that is valid and meets the profile requirements for the server. */
    static BadNoValidCertificates: ConstantStatusCode;
    /** The server does not support changing the user identity assigned to the session. */
    static BadIdentityChangeNotSupported: ConstantStatusCode;
    /** The request was cancelled by the client with the Cancel service. */
    static BadRequestCancelledByRequest: ConstantStatusCode;
    /** The parent node id does not to refer to a valid node. */
    static BadParentNodeIdInvalid: ConstantStatusCode;
    /** The reference could not be created because it violates constraints imposed by the data model. */
    static BadReferenceNotAllowed: ConstantStatusCode;
    /** The requested node id was reject because it was either invalid or server does not allow node ids to be specified by the client. */
    static BadNodeIdRejected: ConstantStatusCode;
    /** The requested node id is already used by another node. */
    static BadNodeIdExists: ConstantStatusCode;
    /** The node class is not valid. */
    static BadNodeClassInvalid: ConstantStatusCode;
    /** The browse name is invalid. */
    static BadBrowseNameInvalid: ConstantStatusCode;
    /** The browse name is not unique among nodes that share the same relationship with the parent. */
    static BadBrowseNameDuplicated: ConstantStatusCode;
    /** The node attributes are not valid for the node class. */
    static BadNodeAttributesInvalid: ConstantStatusCode;
    /** The type definition node id does not reference an appropriate type node. */
    static BadTypeDefinitionInvalid: ConstantStatusCode;
    /** The source node id does not reference a valid node. */
    static BadSourceNodeIdInvalid: ConstantStatusCode;
    /** The target node id does not reference a valid node. */
    static BadTargetNodeIdInvalid: ConstantStatusCode;
    /** The reference type between the nodes is already defined. */
    static BadDuplicateReferenceNotAllowed: ConstantStatusCode;
    /** The server does not allow this type of self reference on this node. */
    static BadInvalidSelfReference: ConstantStatusCode;
    /** The reference type is not valid for a reference to a remote server. */
    static BadReferenceLocalOnly: ConstantStatusCode;
    /** The server will not allow the node to be deleted. */
    static BadNoDeleteRights: ConstantStatusCode;
    /** The server was not able to delete all target references. */
    static UncertainReferenceNotDeleted: ConstantStatusCode;
    /** The server index is not valid. */
    static BadServerIndexInvalid: ConstantStatusCode;
    /** The view id does not refer to a valid view node. */
    static BadViewIdUnknown: ConstantStatusCode;
    /** The view timestamp is not available or not supported. */
    static BadViewTimestampInvalid: ConstantStatusCode;
    /** The view parameters are not consistent with each other. */
    static BadViewParameterMismatch: ConstantStatusCode;
    /** The view version is not available or not supported. */
    static BadViewVersionInvalid: ConstantStatusCode;
    /** The list of references may not be complete because the underlying system is not available. */
    static UncertainNotAllNodesAvailable: ConstantStatusCode;
    /** The server should have followed a reference to a node in a remote server but did not. The result set may be incomplete. */
    static GoodResultsMayBeIncomplete: ConstantStatusCode;
    /** The provided Nodeid was not a type definition nodeid. */
    static BadNotTypeDefinition: ConstantStatusCode;
    /** One of the references to follow in the relative path references to a node in the address space in another server. */
    static UncertainReferenceOutOfServer: ConstantStatusCode;
    /** The requested operation has too many matches to return. */
    static BadTooManyMatches: ConstantStatusCode;
    /** The requested operation requires too many resources in the server. */
    static BadQueryTooComplex: ConstantStatusCode;
    /** The requested operation has no match to return. */
    static BadNoMatch: ConstantStatusCode;
    /** The max age parameter is invalid. */
    static BadMaxAgeInvalid: ConstantStatusCode;
    /** The operation is not permitted over the current secure channel. */
    static BadSecurityModeInsufficient: ConstantStatusCode;
    /** The history details parameter is not valid. */
    static BadHistoryOperationInvalid: ConstantStatusCode;
    /** The server does not support the requested operation. */
    static BadHistoryOperationUnsupported: ConstantStatusCode;
    /** The defined timestamp to return was invalid. */
    static BadInvalidTimestampArgument: ConstantStatusCode;
    /** The server does not support writing the combination of value, status and timestamps provided. */
    static BadWriteNotSupported: ConstantStatusCode;
    /** The value supplied for the attribute is not of the same type as the attribute's value. */
    static BadTypeMismatch: ConstantStatusCode;
    /** The method id does not refer to a method for the specified object. */
    static BadMethodInvalid: ConstantStatusCode;
    /** The client did not specify all of the input arguments for the method. */
    static BadArgumentsMissing: ConstantStatusCode;
    /** The executable attribute does not allow the execution of the method. */
    static BadNotExecutable: ConstantStatusCode;
    /** The server has reached its maximum number of subscriptions. */
    static BadTooManySubscriptions: ConstantStatusCode;
    /** The server has reached the maximum number of queued publish requests. */
    static BadTooManyPublishRequests: ConstantStatusCode;
    /** There is no subscription available for this session. */
    static BadNoSubscription: ConstantStatusCode;
    /** The sequence number is unknown to the server. */
    static BadSequenceNumberUnknown: ConstantStatusCode;
    /** The Server does not support retransmission queue and acknowledgement of sequence numbers is not available. */
    static GoodRetransmissionQueueNotSupported: ConstantStatusCode;
    /** The requested notification message is no longer available. */
    static BadMessageNotAvailable: ConstantStatusCode;
    /** The client of the current session does not support one or more Profiles that are necessary for the subscription. */
    static BadInsufficientClientProfile: ConstantStatusCode;
    /** The sub-state machine is not currently active. */
    static BadStateNotActive: ConstantStatusCode;
    /** An equivalent rule already exists. */
    static BadAlreadyExists: ConstantStatusCode;
    /** The server cannot process the request because it is too busy. */
    static BadTcpServerTooBusy: ConstantStatusCode;
    /** The type of the message specified in the header invalid. */
    static BadTcpMessageTypeInvalid: ConstantStatusCode;
    /** The SecureChannelId and/or TokenId are not currently in use. */
    static BadTcpSecureChannelUnknown: ConstantStatusCode;
    /** The size of the message chunk specified in the header is too large. */
    static BadTcpMessageTooLarge: ConstantStatusCode;
    /** There are not enough resources to process the request. */
    static BadTcpNotEnoughResources: ConstantStatusCode;
    /** An internal error occurred. */
    static BadTcpInternalError: ConstantStatusCode;
    /** The server does not recognize the QueryString specified. */
    static BadTcpEndpointUrlInvalid: ConstantStatusCode;
    /** The request could not be sent because of a network interruption. */
    static BadRequestInterrupted: ConstantStatusCode;
    /** Timeout occurred while processing the request. */
    static BadRequestTimeout: ConstantStatusCode;
    /** The secure channel has been closed. */
    static BadSecureChannelClosed: ConstantStatusCode;
    /** The token has expired or is not recognized. */
    static BadSecureChannelTokenUnknown: ConstantStatusCode;
    /** The sequence number is not valid. */
    static BadSequenceNumberInvalid: ConstantStatusCode;
    /** The applications do not have compatible protocol versions. */
    static BadProtocolVersionUnsupported: ConstantStatusCode;
    /** There is a problem with the configuration that affects the usefulness of the value. */
    static BadConfigurationError: ConstantStatusCode;
    /** The variable should receive its value from another variable, but has never been configured to do so. */
    static BadNotConnected: ConstantStatusCode;
    /** There has been a failure in the device/data source that generates the value that has affected the value. */
    static BadDeviceFailure: ConstantStatusCode;
    /** There has been a failure in the sensor from which the value is derived by the device/data source. */
    static BadSensorFailure: ConstantStatusCode;
    /** The source of the data is not operational. */
    static BadOutOfService: ConstantStatusCode;
    /** The deadband filter is not valid. */
    static BadDeadbandFilterInvalid: ConstantStatusCode;
    /** Communication to the data source has failed. The variable value is the last value that had a good quality. */
    static UncertainNoCommunicationLastUsableValue: ConstantStatusCode;
    /** Whatever was updating this value has stopped doing so. */
    static UncertainLastUsableValue: ConstantStatusCode;
    /** The value is an operational value that was manually overwritten. */
    static UncertainSubstituteValue: ConstantStatusCode;
    /** The value is an initial value for a variable that normally receives its value from another variable. */
    static UncertainInitialValue: ConstantStatusCode;
    /** The value is at one of the sensor limits. */
    static UncertainSensorNotAccurate: ConstantStatusCode;
    /** The value is outside of the range of values defined for this parameter. */
    static UncertainEngineeringUnitsExceeded: ConstantStatusCode;
    /** The data value is derived from multiple sources and has less than the required number of Good sources. */
    static UncertainSubNormal: ConstantStatusCode;
    /** The value has been overridden. */
    static GoodLocalOverride: ConstantStatusCode;
    /** The value is derived from multiple sources and has the required number of Good sources, but less than the full number of Good sources. */
    static GoodSubNormal: ConstantStatusCode;
    /** This Condition refresh failed, a Condition refresh operation is already in progress. */
    static BadRefreshInProgress: ConstantStatusCode;
    /** This condition has already been disabled. */
    static BadConditionAlreadyDisabled: ConstantStatusCode;
    /** This condition has already been enabled. */
    static BadConditionAlreadyEnabled: ConstantStatusCode;
    /** Property not available, this condition is disabled. */
    static BadConditionDisabled: ConstantStatusCode;
    /** The specified event id is not recognized. */
    static BadEventIdUnknown: ConstantStatusCode;
    /** The event cannot be acknowledged. */
    static BadEventNotAcknowledgeable: ConstantStatusCode;
    /** The dialog condition is not active. */
    static BadDialogNotActive: ConstantStatusCode;
    /** The response is not valid for the dialog. */
    static BadDialogResponseInvalid: ConstantStatusCode;
    /** The condition branch has already been acknowledged. */
    static BadConditionBranchAlreadyAcked: ConstantStatusCode;
    /** The condition branch has already been confirmed. */
    static BadConditionBranchAlreadyConfirmed: ConstantStatusCode;
    /** The condition has already been shelved. */
    static BadConditionAlreadyShelved: ConstantStatusCode;
    /** The condition is not currently shelved. */
    static BadConditionNotShelved: ConstantStatusCode;
    /** The shelving time not within an acceptable range. */
    static BadShelvingTimeOutOfRange: ConstantStatusCode;
    /** No data exists for the requested time range or event filter. */
    static BadNoData: ConstantStatusCode;
    /** No data found to provide upper or lower bound value. */
    static BadBoundNotFound: ConstantStatusCode;
    /** The server cannot retrieve a bound for the variable. */
    static BadBoundNotSupported: ConstantStatusCode;
    /** Data is missing due to collection started/stopped/lost. */
    static BadDataLost: ConstantStatusCode;
    /** Expected data is unavailable for the requested time range due to an un-mounted volume, an off-line archive or tape, or similar reason for temporary unavailability. */
    static BadDataUnavailable: ConstantStatusCode;
    /** The data or event was not successfully inserted because a matching entry exists. */
    static BadEntryExists: ConstantStatusCode;
    /** The data or event was not successfully updated because no matching entry exists. */
    static BadNoEntryExists: ConstantStatusCode;
    /** The Client requested history using a TimestampsToReturn the Server does not support. */
    static BadTimestampNotSupported: ConstantStatusCode;
    /** The data or event was successfully inserted into the historical database. */
    static GoodEntryInserted: ConstantStatusCode;
    /** The data or event field was successfully replaced in the historical database. */
    static GoodEntryReplaced: ConstantStatusCode;
    /** The aggregate value is derived from multiple values and has less than the required number of Good values. */
    static UncertainDataSubNormal: ConstantStatusCode;
    /** No data exists for the requested time range or event filter. */
    static GoodNoData: ConstantStatusCode;
    /** More data is available in the time range beyond the number of values requested. */
    static GoodMoreData: ConstantStatusCode;
    /** The requested number of Aggregates does not match the requested number of NodeIds. */
    static BadAggregateListMismatch: ConstantStatusCode;
    /** The requested Aggregate is not support by the server. */
    static BadAggregateNotSupported: ConstantStatusCode;
    /** The aggregate value could not be derived due to invalid data inputs. */
    static BadAggregateInvalidInputs: ConstantStatusCode;
    /** The aggregate configuration is not valid for specified node. */
    static BadAggregateConfigurationRejected: ConstantStatusCode;
    /** The request specifies fields which are not valid for the EventType or cannot be saved by the historian. */
    static GoodDataIgnored: ConstantStatusCode;
    /** The request was rejected by the server because it did not meet the criteria set by the server. */
    static BadRequestNotAllowed: ConstantStatusCode;
    /** The request has not been processed by the server yet. */
    static BadRequestNotComplete: ConstantStatusCode;
    /** The operation is not allowed because a transaction is in progress. */
    static BadTransactionPending: ConstantStatusCode;
    /** The device identity needs a ticket before it can be accepted. */
    static BadTicketRequired: ConstantStatusCode;
    /** The device identity needs a ticket before it can be accepted. */
    static BadTicketInvalid: ConstantStatusCode;
    /** The requested operation is not allowed, because the Node is locked by a different application. */
    static BadLocked: ConstantStatusCode;
    /** The requested operation is not allowed, because the Node is not locked by the application. */
    static BadRequiresLock: ConstantStatusCode;
    /** The value does not come from the real source and has been edited by the server. */
    static GoodEdited: ConstantStatusCode;
    /** There was an error in execution of these post-actions. */
    static GoodPostActionFailed: ConstantStatusCode;
    /** The related EngineeringUnit has been changed but the Variable Value is still provided based on the previous unit. */
    static UncertainDominantValueChanged: ConstantStatusCode;
    /** A dependent value has been changed but the change has not been applied to the device. */
    static GoodDependentValueChanged: ConstantStatusCode;
    /** The related EngineeringUnit has been changed but this change has not been applied to the device. The Variable Value is still dependent on the previous unit but its status is currently Bad. */
    static BadDominantValueChanged: ConstantStatusCode;
    /** A dependent value has been changed but the change has not been applied to the device. The quality of the dominant variable is uncertain. */
    static UncertainDependentValueChanged: ConstantStatusCode;
    /** A dependent value has been changed but the change has not been applied to the device. The quality of the dominant variable is Bad. */
    static BadDependentValueChanged: ConstantStatusCode;
    /** It is delivered with a dominant Variable value when a dependent Variable has changed but the change has not been applied. */
    static GoodEdited_DependentValueChanged: ConstantStatusCode;
    /** It is delivered with a dependent Variable value when a dominant Variable has changed but the change has not been applied. */
    static GoodEdited_DominantValueChanged: ConstantStatusCode;
    /** It is delivered with a dependent Variable value when a dominant or dependent Variable has changed but change has not been applied. */
    static GoodEdited_DominantValueChanged_DependentValueChanged: ConstantStatusCode;
    /** It is delivered with a Variable value when Variable has changed but the value is not legal. */
    static BadEdited_OutOfRange: ConstantStatusCode;
    /** It is delivered with a Variable value when a source Variable has changed but the value is not legal. */
    static BadInitialValue_OutOfRange: ConstantStatusCode;
    /** It is delivered with a dependent Variable value when a dominant Variable has changed and the value is not legal. */
    static BadOutOfRange_DominantValueChanged: ConstantStatusCode;
    /** It is delivered with a dependent Variable value when a dominant Variable has changed, the value is not legal and the change has not been applied. */
    static BadEdited_OutOfRange_DominantValueChanged: ConstantStatusCode;
    /** It is delivered with a dependent Variable value when a dominant or dependent Variable has changed and the value is not legal. */
    static BadOutOfRange_DominantValueChanged_DependentValueChanged: ConstantStatusCode;
    /** It is delivered with a dependent Variable value when a dominant or dependent Variable has changed, the value is not legal and the change has not been applied. */
    static BadEdited_OutOfRange_DominantValueChanged_DependentValueChanged: ConstantStatusCode;
    /** The communication layer has raised an event. */
    static GoodCommunicationEvent: ConstantStatusCode;
    /** The system is shutting down. */
    static GoodShutdownEvent: ConstantStatusCode;
    /** The operation is not finished and needs to be called again. */
    static GoodCallAgain: ConstantStatusCode;
    /** A non-critical timeout occurred. */
    static GoodNonCriticalTimeout: ConstantStatusCode;
    /** One or more arguments are invalid. */
    static BadInvalidArgument: ConstantStatusCode;
    /** Could not establish a network connection to remote server. */
    static BadConnectionRejected: ConstantStatusCode;
    /** The server has disconnected from the client. */
    static BadDisconnect: ConstantStatusCode;
    /** The network connection has been closed. */
    static BadConnectionClosed: ConstantStatusCode;
    /** The operation cannot be completed because the object is closed, uninitialized or in some other invalid state. */
    static BadInvalidState: ConstantStatusCode;
    /** Cannot move beyond end of the stream. */
    static BadEndOfStream: ConstantStatusCode;
    /** No data is currently available for reading from a non-blocking stream. */
    static BadNoDataAvailable: ConstantStatusCode;
    /** The asynchronous operation is waiting for a response. */
    static BadWaitingForResponse: ConstantStatusCode;
    /** The asynchronous operation was abandoned by the caller. */
    static BadOperationAbandoned: ConstantStatusCode;
    /** The stream did not return all data requested (possibly because it is a non-blocking stream). */
    static BadExpectedStreamToBlock: ConstantStatusCode;
    /** Non blocking behaviour is required and the operation would block. */
    static BadWouldBlock: ConstantStatusCode;
    /** A value had an invalid syntax. */
    static BadSyntaxError: ConstantStatusCode;
    /** The operation could not be finished because all available connections are in use. */
    static BadMaxConnectionsReached: ConstantStatusCode;
    /** The value may not be accurate because the transducer is in manual mode. */
    static UncertainTransducerInManual: ConstantStatusCode;
    /** The value is simulated. */
    static UncertainSimulatedValue: ConstantStatusCode;
    /** The value may not be accurate due to a sensor calibration fault. */
    static UncertainSensorCalibration: ConstantStatusCode;
    /** The value may not be accurate due to a configuration issue. */
    static UncertainConfigurationError: ConstantStatusCode;
    /** The value source supports cascade handshaking and the value has been Initialized based on an initialization request from a cascade secondary. */
    static GoodCascadeInitializationAcknowledged: ConstantStatusCode;
    /** The value source supports cascade handshaking and is requesting initialization of a cascade primary. */
    static GoodCascadeInitializationRequest: ConstantStatusCode;
    /** The value source supports cascade handshaking, however, the source’s current state does not allow for cascade. */
    static GoodCascadeNotInvited: ConstantStatusCode;
    /** The value source supports cascade handshaking, however, the source has not selected the corresponding cascade primary for use. */
    static GoodCascadeNotSelected: ConstantStatusCode;
    /** There is a fault state condition active in the value source. */
    static GoodFaultStateActive: ConstantStatusCode;
    /** A fault state condition is being requested of the destination. */
    static GoodInitiateFaultState: ConstantStatusCode;
    /** The value is accurate, and the signal source supports cascade handshaking. */
    static GoodCascade: ConstantStatusCode;
    /** The DataSet specified for the DataSetWriter creation is invalid. */
    static BadDataSetIdInvalid: ConstantStatusCode;
    static GoodWithOverflowBit: StatusCode;
}
