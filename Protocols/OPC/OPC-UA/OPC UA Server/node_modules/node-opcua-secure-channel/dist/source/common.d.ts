import { CommonInterface } from "node-opcua-factory";
import { CloseSecureChannelRequest, MessageSecurityMode, RequestHeader, ResponseHeader } from "node-opcua-service-secure-channel";
import { ServiceFault } from "./services";
export interface IResponseBase {
    responseHeader: ResponseHeader;
    schema: CommonInterface;
}
export type Response = IResponseBase | ServiceFault;
export interface IRequestBase {
    requestHeader: RequestHeader;
    schema: CommonInterface;
    securityMode: MessageSecurityMode;
}
export type Request = IRequestBase | CloseSecureChannelRequest;
export { ICertificateKeyPairProvider } from "node-opcua-common";
export declare function extractFirstCertificateInChain(certificateChain?: Buffer | null): Buffer | null;
export declare function getThumbprint(certificateChain: Buffer | null): Buffer | null;
