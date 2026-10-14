import { OPCUACertificateManager } from "node-opcua-certificate-manager";
import { OPCUASecureObject } from "node-opcua-common";
import { Certificate } from "node-opcua-crypto/web";
export declare function verifyIsOPCUAValidCertificate(certificate: Certificate, certificateFile: string, type: "client" | "server", applicationUri: string): void;
export declare function performCertificateSanityCheck(secureObject: OPCUASecureObject, serverOrClient: "server" | "client", certificateManager: OPCUACertificateManager, applicationUri: string): Promise<void>;
