import { Certificate, CertificateRevocationList, DER } from "node-opcua-crypto";
import { SubjectOptions } from "../misc/subject";
import { CertificateStatus, Filename, KeySize } from "../toolbox/common";
import { CreateSelfSignCertificateParam } from "../toolbox/common";
export interface CertificateManagerOptions {
    keySize?: KeySize;
    location: string;
}
export interface CreateSelfSignCertificateParam1 extends CreateSelfSignCertificateParam {
    outputFile?: Filename;
    subject: SubjectOptions | string;
    applicationUri: string;
    dns: string[];
    startDate: Date;
    validity: number;
}
export interface VerifyCertificateOptions {
    acceptOutdatedCertificate?: boolean;
    acceptOutDatedIssuerCertificate?: boolean;
    ignoreMissingRevocationList?: boolean;
    acceptPendingCertificate?: boolean;
}
export declare enum VerificationStatus {
    /** The certificate provided as a parameter is not valid. */
    BadCertificateInvalid = "BadCertificateInvalid",
    /** An error occurred verifying security. */
    BadSecurityChecksFailed = "BadSecurityChecksFailed",
    /** The certificate does not meet the requirements of the security policy. */
    BadCertificatePolicyCheckFailed = "BadCertificatePolicyCheckFailed",
    /** The certificate has expired or is not yet valid. */
    BadCertificateTimeInvalid = "BadCertificateTimeInvalid",
    /** An issuer certificate has expired or is not yet valid. */
    BadCertificateIssuerTimeInvalid = "BadCertificateIssuerTimeInvalid",
    /** The HostName used to connect to a server does not match a HostName in the certificate. */
    BadCertificateHostNameInvalid = "BadCertificateHostNameInvalid",
    /** The URI specified in the ApplicationDescription does not match the URI in the certificate. */
    BadCertificateUriInvalid = "BadCertificateUriInvalid",
    /** The certificate may not be used for the requested operation. */
    BadCertificateUseNotAllowed = "BadCertificateUseNotAllowed",
    /** The issuer certificate may not be used for the requested operation. */
    BadCertificateIssuerUseNotAllowed = "BadCertificateIssuerUseNotAllowed",
    /** The certificate is not trusted. */
    BadCertificateUntrusted = "BadCertificateUntrusted",
    /** It was not possible to determine if the certificate has been revoked. */
    BadCertificateRevocationUnknown = "BadCertificateRevocationUnknown",
    /** It was not possible to determine if the issuer certificate has been revoked. */
    BadCertificateIssuerRevocationUnknown = "BadCertificateIssuerRevocationUnknown",
    /** The certificate has been revoked. */
    BadCertificateRevoked = "BadCertificateRevoked",
    /** The issuer certificate has been revoked. */
    BadCertificateIssuerRevoked = "BadCertificateIssuerRevoked",
    /** The certificate chain is incomplete. */
    BadCertificateChainIncomplete = "BadCertificateChainIncomplete",
    /** Validation OK. */
    Good = "Good"
}
export declare function findIssuerCertificateInChain(certificate: Certificate, chain: Certificate[]): Certificate | null;
export declare enum CertificateManagerState {
    Uninitialized = 0,
    Initializing = 1,
    Initialized = 2,
    Disposing = 3,
    Disposed = 4
}
export declare class CertificateManager {
    untrustUnknownCertificate: boolean;
    state: CertificateManagerState;
    folderPoolingInterval: number;
    private readonly keySize;
    private readonly location;
    private readonly _watchers;
    private _readCertificatesCalled;
    private readonly _filenameToHash;
    private readonly _thumbs;
    constructor(options: CertificateManagerOptions);
    get configFile(): string;
    get rootDir(): string;
    get privateKey(): string;
    get randomFile(): string;
    /**
     * returns the certificate status trusted/rejected
     * @param certificate
     */
    getCertificateStatus(certificate: Buffer): Promise<CertificateStatus>;
    rejectCertificate(certificate: Certificate): Promise<void>;
    trustCertificate(certificate: Certificate): Promise<void>;
    get rejectedFolder(): string;
    get trustedFolder(): string;
    get crlFolder(): string;
    get issuersCertFolder(): string;
    get issuersCrlFolder(): string;
    isCertificateTrusted(certificate: Certificate): Promise<string>;
    _innerVerifyCertificateAsync(certificate: Certificate, isIssuer: boolean, level: number, options: VerifyCertificateOptions): Promise<VerificationStatus>;
    protected verifyCertificateAsync(certificate: Certificate, options: VerifyCertificateOptions): Promise<VerificationStatus>;
    /**
     * Verify certificate validity
     * @method verifyCertificate
     * @param certificate
     */
    verifyCertificate(certificate: Certificate, options?: VerifyCertificateOptions): Promise<VerificationStatus>;
    initialize(): Promise<void>;
    private _initialize;
    dispose(): Promise<void>;
    protected withLock2<T>(action: () => Promise<T>): Promise<T>;
    /**
     *
     * create a self-signed certificate for the CertificateManager private key
     *
     */
    createSelfSignedCertificate(params: CreateSelfSignCertificateParam1): Promise<void>;
    createCertificateRequest(params: CreateSelfSignCertificateParam): Promise<Filename>;
    addIssuer(certificate: DER, validate?: boolean, addInTrustList?: boolean): Promise<VerificationStatus>;
    addRevocationList(crl: CertificateRevocationList): Promise<VerificationStatus>;
    /**
     *  find the issuer certificate among the trusted  issuer certificates.
     *
     *  The findIssuerCertificate method is an asynchronous method that attempts to find
     *  the issuer certificate for a given certificate from the list of issuer certificate declared in the PKI
     *
     *  - If the certificate is self-signed, it returns the certificate itself.
     *
     *  - If the certificate has no extension 3, it is assumed to be generated by an old system, and a null value is returned.
     *
     *  - the method checks both issuer and trusted certificates and returns the appropriate issuercertificate,
     *    if found. If multiple matching certificates are found, a warning is logged to the console.
     *
     */
    findIssuerCertificate(certificate: Certificate): Promise<Certificate | null>;
    /**
     * @internal
     * @private
     */
    _checkRejectedOrTrusted(certificate: Buffer): Promise<CertificateStatus>;
    private _moveCertificate;
    private _findAssociatedCRLs;
    isCertificateRevoked(certificate: Certificate, issuerCertificate?: Certificate | null): Promise<VerificationStatus>;
    private _pending_crl_to_process;
    private _on_crl_process?;
    private queue;
    private _on_crl_file_added;
    private _process_next_crl;
    private _readCertificates;
    private waitAndCheckCRLProcessingStatus;
}
