import { ChannelSecurityToken } from "node-opcua-types";
export { ChannelSecurityToken, OpenSecureChannelRequest, OpenSecureChannelResponse, CloseSecureChannelRequest, CloseSecureChannelResponse, ServiceFault, SecurityTokenRequestType, ResponseHeader, RequestHeader, SignatureData, MessageSecurityMode, _enumerationMessageSecurityMode, UserTokenPolicy } from "node-opcua-types";
export { AsymmetricAlgorithmSecurityHeader } from "./AsymmetricAlgorithmSecurityHeader";
export { SymmetricAlgorithmSecurityHeader } from "./SymmetricAlgorithmSecurityHeader";
export * from "./message_security_mode";
export declare function hasTokenExpired(token: ChannelSecurityToken): boolean;
