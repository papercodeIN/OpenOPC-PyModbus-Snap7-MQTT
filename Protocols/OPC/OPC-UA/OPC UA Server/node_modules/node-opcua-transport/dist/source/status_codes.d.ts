export declare const StatusCodes2: {
    /**
     * The Server cannot process the request because it is too busy.
     *
     * It is up to the Server to determine when it needs to return this Message.
     *
     * A Server can control the how frequently a Client reconnects by waiting to return this error.
     */
    BadTcpServerTooBusy: import("node-opcua-status-code").ConstantStatusCode;
    /**
     * The type of the Message specified in the header invalid.
     * Each Message starts with a 4-byte sequence of ASCII values that identifies the Message type.
     * The Server returns this error if the Message type is not accepted.
     * Some of the Message types are defined by the SecureChannel layer.
     */
    BadTcpMessageTypeInvalid: import("node-opcua-status-code").ConstantStatusCode;
    /**
     * The SecureChannelId and/or TokenId are not currently in use.
     * This error is reported by the SecureChannel layer.
     */
    BadTcpSecureChannelUnknown: import("node-opcua-status-code").ConstantStatusCode;
    /**
     * The size of the Message specified in the header is too large.
     * The Server returns this error if the Message size exceeds its maximum buffer size
     * or the receive buffer size negotiated during the Hello/Acknowledge exchange.
     */
    BadTcpMessageTooLarge: import("node-opcua-status-code").ConstantStatusCode;
    /**
     * A timeout occurred while accessing a resource.
     * It is up to the Server to determine when a timeout occurs.
     */
    BadTimeout: import("node-opcua-status-code").ConstantStatusCode;
    /**
     * There are not enough resources to process the request.
     * The Server returns this error when it runs out of memory or encounters similar resource problems.
     * A Server can control the how frequently a Client reconnects by waiting to return this error.
     */
    BadTcpNotEnoughResources: import("node-opcua-status-code").ConstantStatusCode;
    /**
     * An internal error occurred.
     * This should only be returned if an unexpected configuration or programming error occurs.
     */
    BadTcpInternalError: import("node-opcua-status-code").ConstantStatusCode;
    /**
     * The Server does not recognize the EndpointUrl specified.
     */
    BadTcpEndpointUrlInvalid: import("node-opcua-status-code").ConstantStatusCode;
    /**
     * The Message was rejected because it could not be verified.
     */
    BadSecurityChecksFailed: import("node-opcua-status-code").ConstantStatusCode;
    /**
     * The request could not be sent because of a network interruption.
     */
    BadRequestInterrupted: import("node-opcua-status-code").ConstantStatusCode;
    /**
     * Timeout occurred while processing the request.
     */
    BadRequestTimeout: import("node-opcua-status-code").ConstantStatusCode;
    /**
     * The secure channel has been closed.
     */
    BadSecureChannelClosed: import("node-opcua-status-code").ConstantStatusCode;
    /**
     * The SecurityToken has expired or is not recognized. BadSecureChannelTokenUnknown
     */
    BadSecureChannelTokenUnknown: import("node-opcua-status-code").ConstantStatusCode;
    /**
     * The sender Certificate is not trusted by the receiver.
     */
    BadCertificateUntrusted: import("node-opcua-status-code").ConstantStatusCode;
    /**
     * The sender Certificate has expired or is not yet valid.
     */
    BadCertificateTimeInvalid: import("node-opcua-status-code").ConstantStatusCode;
    /**
     * The issuer for the sender Certificate has expired or is not yet valid.
     */
    BadCertificateIssuerTimeInvalid: import("node-opcua-status-code").ConstantStatusCode;
    /**
     * The sender’s Certificate may not be used for establishing a secure channel.
     */
    BadCertificateUseNotAllowed: import("node-opcua-status-code").ConstantStatusCode;
    /**
     * The issuer Certificate may not be used as a Certificate Authority.
     */
    BadCertificateIssuerUseNotAllowed: import("node-opcua-status-code").ConstantStatusCode;
    /**
     * Could not verify the revocation status of the sender’s Certificate.
     */
    BadCertificateRevocationUnknown: import("node-opcua-status-code").ConstantStatusCode;
    /**
     * Could not verify the revocation status of the issuer Certificate.
     */
    BadCertificateIssuerRevocationUnknown: import("node-opcua-status-code").ConstantStatusCode;
    /**
     * The sender Certificate has been revoked by the issuer.
     */
    BadCertificateRevoked: import("node-opcua-status-code").ConstantStatusCode;
};
