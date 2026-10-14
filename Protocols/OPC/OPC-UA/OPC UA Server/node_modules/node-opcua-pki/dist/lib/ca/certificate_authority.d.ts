import { Subject, SubjectOptions } from "node-opcua-crypto";
import { Filename, KeySize, Params } from "../toolbox";
export declare const defaultSubject = "/C=FR/ST=IDF/L=Paris/O=Local NODE-OPCUA Certificate Authority/CN=NodeOPCUA-CA";
export declare const configurationFileTemplate: string;
export interface CertificateAuthorityOptions {
    keySize: KeySize;
    location: string;
    subject?: string | SubjectOptions;
}
export declare class CertificateAuthority {
    readonly keySize: KeySize;
    readonly location: string;
    readonly subject: Subject;
    constructor(options: CertificateAuthorityOptions);
    get rootDir(): string;
    get configFile(): string;
    get caCertificate(): string;
    /**
     * the file name where  the current Certificate Revocation List is stored (in DER format)
     */
    get revocationListDER(): string;
    /**
     * the file name where  the current Certificate Revocation List is stored (in PEM format)
     */
    get revocationList(): string;
    get caCertificateWithCrl(): string;
    initialize(): Promise<void>;
    constructCACertificateWithCRL(): Promise<void>;
    constructCertificateChain(certificate: Filename): Promise<void>;
    createSelfSignedCertificate(certificateFile: Filename, privateKey: Filename, params: Params): Promise<void>;
    /**
     * revoke a certificate and update the CRL
     *
     * @method revokeCertificate
     * @param certificate -  the certificate to revoke
     * @param params
     * @param [params.reason = "keyCompromise" {String}]
     * @async
     */
    revokeCertificate(certificate: Filename, params: Params): Promise<void>;
    /**
     *
     * @param certificate            - the certificate filename to generate
     * @param certificateSigningRequestFilename   - the certificate signing request
     * @param params                 - parameters
     * @param params.applicationUri  - the applicationUri
     * @param params.startDate       - startDate of the certificate
     * @param params.validity        - number of day of validity of the certificate
     */
    signCertificateRequest(certificate: Filename, certificateSigningRequestFilename: Filename, params1: Params): Promise<Filename>;
    verifyCertificate(certificate: Filename): Promise<void>;
}
