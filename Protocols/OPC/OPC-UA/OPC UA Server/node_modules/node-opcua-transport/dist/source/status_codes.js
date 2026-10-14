"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCodes2 = void 0;
const node_opcua_status_code_1 = require("node-opcua-status-code");
exports.StatusCodes2 = {
    /**
     * The Server cannot process the request because it is too busy.
     *
     * It is up to the Server to determine when it needs to return this Message.
     *
     * A Server can control the how frequently a Client reconnects by waiting to return this error.
     */
    BadTcpServerTooBusy: node_opcua_status_code_1.StatusCodes.BadTcpServerTooBusy,
    /**
     * The type of the Message specified in the header invalid.
     * Each Message starts with a 4-byte sequence of ASCII values that identifies the Message type.
     * The Server returns this error if the Message type is not accepted.
     * Some of the Message types are defined by the SecureChannel layer.
     */
    BadTcpMessageTypeInvalid: node_opcua_status_code_1.StatusCodes.BadTcpMessageTypeInvalid,
    /**
     * The SecureChannelId and/or TokenId are not currently in use.
     * This error is reported by the SecureChannel layer.
     */
    BadTcpSecureChannelUnknown: node_opcua_status_code_1.StatusCodes.BadTcpSecureChannelUnknown,
    /**
     * The size of the Message specified in the header is too large.
     * The Server returns this error if the Message size exceeds its maximum buffer size
     * or the receive buffer size negotiated during the Hello/Acknowledge exchange.
     */
    BadTcpMessageTooLarge: node_opcua_status_code_1.StatusCodes.BadTcpMessageTooLarge,
    /**
     * A timeout occurred while accessing a resource.
     * It is up to the Server to determine when a timeout occurs.
     */
    BadTimeout: node_opcua_status_code_1.StatusCodes.BadTimeout,
    /**
     * There are not enough resources to process the request.
     * The Server returns this error when it runs out of memory or encounters similar resource problems.
     * A Server can control the how frequently a Client reconnects by waiting to return this error.
     */
    BadTcpNotEnoughResources: node_opcua_status_code_1.StatusCodes.BadTcpNotEnoughResources,
    /**
     * An internal error occurred.
     * This should only be returned if an unexpected configuration or programming error occurs.
     */
    BadTcpInternalError: node_opcua_status_code_1.StatusCodes.BadTcpInternalError,
    /**
     * The Server does not recognize the EndpointUrl specified.
     */
    BadTcpEndpointUrlInvalid: node_opcua_status_code_1.StatusCodes.BadTcpEndpointUrlInvalid,
    /**
     * The Message was rejected because it could not be verified.
     */
    BadSecurityChecksFailed: node_opcua_status_code_1.StatusCodes.BadSecurityChecksFailed,
    /**
     * The request could not be sent because of a network interruption.
     */
    BadRequestInterrupted: node_opcua_status_code_1.StatusCodes.BadRequestInterrupted,
    /**
     * Timeout occurred while processing the request.
     */
    BadRequestTimeout: node_opcua_status_code_1.StatusCodes.BadRequestTimeout,
    /**
     * The secure channel has been closed.
     */
    BadSecureChannelClosed: node_opcua_status_code_1.StatusCodes.BadSecureChannelClosed,
    /**
     * The SecurityToken has expired or is not recognized. BadSecureChannelTokenUnknown
     */
    BadSecureChannelTokenUnknown: node_opcua_status_code_1.StatusCodes.BadSecureChannelTokenUnknown,
    /**
     * The sender Certificate is not trusted by the receiver.
     */
    BadCertificateUntrusted: node_opcua_status_code_1.StatusCodes.BadCertificateUntrusted,
    /**
     * The sender Certificate has expired or is not yet valid.
     */
    BadCertificateTimeInvalid: node_opcua_status_code_1.StatusCodes.BadCertificateTimeInvalid,
    /**
     * The issuer for the sender Certificate has expired or is not yet valid.
     */
    BadCertificateIssuerTimeInvalid: node_opcua_status_code_1.StatusCodes.BadCertificateIssuerTimeInvalid,
    /**
     * The sender’s Certificate may not be used for establishing a secure channel.
     */
    BadCertificateUseNotAllowed: node_opcua_status_code_1.StatusCodes.BadCertificateUseNotAllowed,
    /**
     * The issuer Certificate may not be used as a Certificate Authority.
     */
    BadCertificateIssuerUseNotAllowed: node_opcua_status_code_1.StatusCodes.BadCertificateIssuerUseNotAllowed,
    /**
     * Could not verify the revocation status of the sender’s Certificate.
     */
    BadCertificateRevocationUnknown: node_opcua_status_code_1.StatusCodes.BadCertificateRevocationUnknown,
    /**
     * Could not verify the revocation status of the issuer Certificate.
     */
    BadCertificateIssuerRevocationUnknown: node_opcua_status_code_1.StatusCodes.BadCertificateIssuerRevocationUnknown,
    /**
     * The sender Certificate has been revoked by the issuer.
     */
    BadCertificateRevoked: node_opcua_status_code_1.StatusCodes.BadCertificateRevoked
    /**The issuer Certificate has been revoked by its issuer.
     */
    // todo  BadIssuerCertificateRevoked: StatusCodes.BadIssuerCertificateRevoked,
    /** The receiver Certificate thumbprint is not recognized by the receiver.
     */
    // todo .. BadCertificateUnknown: StatusCodes.BadCertificateUnknown
};
//# sourceMappingURL=status_codes.js.map