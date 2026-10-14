import { C as Certificate, P as PrivateKey, d as CertificatePEM, b as PEM, D as DER, f as PublicKeyPEM, S as Signature, K as KeyObject, e as PrivateKeyPEM, a as PublicKey, N as Nonce, g as CertificateRevocationList, h as CertificatePurpose } from '../common-CFr95Map.js';
export { c as createPrivateKeyFromNodeJSCrypto, i as isKeyObject } from '../common-CFr95Map.js';
import { KeyLike } from 'crypto';
import * as x509 from '@peculiar/x509';

declare function publicKeyAndPrivateKeyMatches(certificate: Certificate, privateKey: PrivateKey): boolean;
declare function certificateMatchesPrivateKey(certificate: Certificate, privateKey: PrivateKey): boolean;

interface DirectoryName {
    stateOrProvinceName?: string;
    localityName?: string;
    organizationName?: string;
    organizationUnitName?: string;
    commonName?: string;
    countryName?: string;
}
declare function readDirectoryName(buffer: Buffer, block: BlockInfo): DirectoryName;

declare enum TagType {
    BOOLEAN = 1,
    INTEGER = 2,
    BIT_STRING = 3,
    OCTET_STRING = 4,
    NULL = 5,
    OBJECT_IDENTIFIER = 6,
    UTF8String = 12,
    NumericString = 18,
    PrintableString = 19,
    TeletexString = 20,
    IA5String = 22,
    UTCTime = 23,
    GeneralizedTime = 24,
    GraphicString = 25,
    VisibleString = 26,
    GeneralString = 27,
    UniversalString = 28,
    BMPString = 30,
    SEQUENCE = 48,
    SET = 49,
    CONTEXT_SPECIFIC0 = 160,
    CONTEXT_SPECIFIC1 = 161,
    CONTEXT_SPECIFIC2 = 162,
    CONTEXT_SPECIFIC3 = 163,
    A4 = 164
}
interface BlockInfo {
    tag: TagType | number;
    position: number;
    length: number;
    start: number;
}
declare function readTag(buf: Buffer, pos: number): BlockInfo;
declare function readStruct(buf: Buffer, blockInfo: BlockInfo): BlockInfo[];
interface AlgorithmIdentifier {
    identifier: string;
}
declare function readAlgorithmIdentifier(buffer: Buffer, block: BlockInfo): AlgorithmIdentifier;
type SignatureValue = string;
declare function readSignatureValueBin(buffer: Buffer, block: BlockInfo): Buffer;

type PublicKeyLength = 64 | 96 | 128 | 256 | 384 | 512;
/**
 * A structure exposing useful information about a certificate
 */
interface CertificateInfo {
    /** the public key length in bits */
    publicKeyLength: PublicKeyLength;
    /** the date at which the certificate starts to be valid */
    notBefore: Date;
    /** the date after which the certificate is not valid any more */
    notAfter: Date;
    /** info about certificate owner */
    subject: DirectoryName;
    /** public key */
    publicKey: SubjectPublicKey;
}
declare function coerceCertificate(certificate: Certificate | CertificatePEM): Certificate;
/**
 * @method exploreCertificateInfo
 * returns useful information about the certificate such as public key length, start date and end of validity date,
 * and CN
 * @param certificate the certificate to explore
 */
declare function exploreCertificateInfo(certificate: Certificate | CertificatePEM): CertificateInfo;

/**
 * @module node_opcua_crypto
 */

interface AttributeTypeAndValue {
    [key: string]: any;
}
interface Validity {
    notBefore: Date;
    notAfter: Date;
}
interface X509KeyUsage {
    digitalSignature: boolean;
    nonRepudiation: boolean;
    keyEncipherment: boolean;
    dataEncipherment: boolean;
    keyAgreement: boolean;
    keyCertSign: boolean;
    cRLSign: boolean;
    encipherOnly: boolean;
    decipherOnly: boolean;
}
interface X509ExtKeyUsage {
    clientAuth: boolean;
    serverAuth: boolean;
    codeSigning: boolean;
    emailProtection: boolean;
    timeStamping: boolean;
    ocspSigning: boolean;
    ipsecEndSystem: boolean;
    ipsecTunnel: boolean;
    ipsecUser: boolean;
}
interface SubjectPublicKey {
    modulus: Buffer;
}
declare function readExtension(buffer: Buffer, block: BlockInfo): {
    identifier: {
        oid: string;
        name: string;
    };
    value: any;
};
interface SubjectPublicKeyInfo {
    algorithm: string;
    keyLength: PublicKeyLength;
    subjectPublicKey: SubjectPublicKey;
}
interface BasicConstraints {
    critical: boolean;
    cA: boolean;
    pathLengthConstraint?: number;
}
interface AuthorityKeyIdentifier {
    keyIdentifier: string | null;
    authorityCertIssuer: DirectoryName | null;
    authorityCertIssuerFingerPrint: string;
    serial: string | null;
}
interface CertificateExtension {
    basicConstraints: BasicConstraints;
    subjectKeyIdentifier?: string;
    authorityKeyIdentifier?: AuthorityKeyIdentifier;
    keyUsage?: X509KeyUsage;
    extKeyUsage?: X509ExtKeyUsage;
    subjectAltName?: any;
}
interface TbsCertificate {
    version: number;
    serialNumber: string;
    issuer: any;
    signature: AlgorithmIdentifier;
    validity: Validity;
    subject: DirectoryName;
    subjectFingerPrint: string;
    subjectPublicKeyInfo: SubjectPublicKeyInfo;
    extensions: CertificateExtension | null;
}
declare function readTbsCertificate(buffer: Buffer, block: BlockInfo): TbsCertificate;
interface CertificateInternals {
    tbsCertificate: TbsCertificate;
    signatureAlgorithm: AlgorithmIdentifier;
    signatureValue: SignatureValue;
}
/**
 * explore a certificate structure
 * @param certificate
 * @returns a json object that exhibits the internal data of the certificate
 */
declare function exploreCertificate(certificate: Certificate): CertificateInternals;
/**
 * @method split_der
 * split a multi chain certificates
 * @param certificateChain  the certificate chain in der (binary) format}
 * @returns an array of Der , each element of the array is one certificate of the chain
 */
declare function split_der(certificateChain: Certificate): Certificate[];
/**
 * @method combine_der
 * combine an array of certificates into a single blob
 * @param certificates a array with the individual DER certificates of the chain
 * @return a concatenated buffer containing the certificates
 */
declare function combine_der(certificates: Certificate[]): Certificate;

declare function identifyPemType(rawKey: Buffer | string): undefined | string;
declare function removeTrailingLF(str: string): string;
declare function toPem(raw_key: Buffer | string, pem: string): string;
declare function convertPEMtoDER(raw_key: PEM): DER;
declare function hexDump(buffer: Buffer, width?: number): string;
interface MakeMessageChunkSignatureOptions {
    signatureLength: number;
    algorithm: string;
    privateKey: PrivateKey;
}
declare function makeMessageChunkSignature(chunk: Buffer, options: MakeMessageChunkSignatureOptions): Buffer;
interface VerifyMessageChunkSignatureOptions {
    signatureLength?: number;
    algorithm: string;
    publicKey: PublicKeyPEM;
}
/**
 * @method verifyMessageChunkSignature
 *
 *     const signer = {
 *           signatureLength : 128,
 *           algorithm : "RSA-SHA256",
 *           publicKey: "qsdqsdqsd"
 *     };
 * @param blockToVerify
 * @param signature
 * @param options
 * @param options.signatureLength
 * @param options.algorithm    for example "RSA-SHA256"
 * @param options.publicKey
 * @return true if the signature is valid
 */
declare function verifyMessageChunkSignature(blockToVerify: Buffer, signature: Signature, options: VerifyMessageChunkSignatureOptions): boolean;
declare function makeSHA1Thumbprint(buffer: Buffer): Signature;
declare const RSA_PKCS1_OAEP_PADDING: number;
declare const RSA_PKCS1_PADDING: number;
declare enum PaddingAlgorithm {
    RSA_PKCS1_OAEP_PADDING = 4,
    RSA_PKCS1_PADDING = 1
}
declare function publicEncrypt_native(buffer: Buffer, publicKey: KeyLike, algorithm?: PaddingAlgorithm): Buffer;
declare function privateDecrypt_native(buffer: Buffer, privateKey: PrivateKey, algorithm?: PaddingAlgorithm): Buffer;
declare const publicEncrypt: typeof publicEncrypt_native;
declare const privateDecrypt: typeof privateDecrypt_native;
declare function publicEncrypt_long(buffer: Buffer, publicKey: KeyLike, blockSize: number, padding?: number, paddingAlgorithm?: PaddingAlgorithm): Buffer;
declare function privateDecrypt_long(buffer: Buffer, privateKey: PrivateKey, blockSize: number, paddingAlgorithm?: number): Buffer;
declare function coerceCertificatePem(certificate: Certificate | CertificatePEM): CertificatePEM;
declare function extractPublicKeyFromCertificateSync(certificate: Certificate | CertificatePEM): PublicKeyPEM;
/**
 * extract the publickey from a certificate
 * @async
 */
declare function extractPublicKeyFromCertificate(certificate: CertificatePEM | Certificate, callback: (err: Error | null, publicKeyPEM?: PublicKeyPEM) => void): void;

/***
 * @method rsaLengthPrivateKey
 * A very expensive way to determine the rsa key length ( i.e 2048bits or 1024bits)
 * @param key  a PEM public key or a PEM rsa private key
 * @return the key length in bytes.
 */
declare function rsaLengthPrivateKey(key: PrivateKey): number;
/**
 * @method toPem2
 * @param raw_key
 * @param pem
 *
 *
 * @return a PEM string containing the Private Key
 *
 * Note:  a Pem key can be converted back to a private key object using coercePrivateKey
 *
 */
declare function toPem2(raw_key: Buffer | string | KeyObject | PrivateKey, pem: string): string;
declare function coercePrivateKeyPem(privateKey: PrivateKey): PrivateKeyPEM;
declare function coercePublicKeyPem(publicKey: PublicKey | PublicKeyPEM): PublicKeyPEM;
declare function coerceRsaPublicKeyPem(publicKey: PublicKey | KeyObject | PublicKeyPEM): PublicKeyPEM;
declare function rsaLengthPublicKey(key: PublicKeyPEM | PublicKey): number;
declare function rsaLengthRsaPublicKey(key: PublicKeyPEM | PublicKey): number;

declare function makePseudoRandomBuffer(secret: Nonce, seed: Nonce, minLength: number, sha1or256: "SHA1" | "SHA256"): Buffer;
interface ComputeDerivedKeysOptions {
    signatureLength: number;
    signingKeyLength: number;
    encryptingKeyLength: number;
    encryptingBlockSize: number;
    algorithm: string;
    sha1or256?: "SHA1" | "SHA256";
}
interface DerivedKeys extends ComputeDerivedKeysOptions {
    signatureLength: number;
    signingKeyLength: number;
    encryptingKeyLength: number;
    encryptingBlockSize: number;
    algorithm: string;
    sha1or256: "SHA1" | "SHA256";
    signingKey: Buffer;
    encryptingKey: Buffer;
    initializationVector: Buffer;
}
declare function computeDerivedKeys(secret: Nonce, seed: Nonce, options: ComputeDerivedKeysOptions): DerivedKeys;
/**
 * @method reduceLength
 * @param buffer
 * @param byteToRemove
 * @return buffer
 */
declare function reduceLength(buffer: Buffer, byteToRemove: number): Buffer;
/**
 * @method removePadding
 * @param buffer
 * @return buffer with padding removed
 */
declare function removePadding(buffer: Buffer): Buffer;
type VerifyChunkSignatureOptions = VerifyMessageChunkSignatureOptions;
/**
 * @method verifyChunkSignature
 *
 *     const signer = {
 *           signatureLength : 128,
 *           algorithm : "RSA-SHA256",
 *           public_key: "qsdqsdqsd"
 *     };
 *
 * @param chunk  The message chunk to verify.
 * @param options
 * @param options.signatureLength
 * @param options.algorithm  the algorithm.
 * @param options.publicKey
 * @return {*}
 */
declare function verifyChunkSignature(chunk: Buffer, options: VerifyChunkSignatureOptions): boolean;
declare function computePaddingFooter(buffer: Buffer, derivedKeys: DerivedKeys): Buffer;
declare function encryptBufferWithDerivedKeys(buffer: Buffer, derivedKeys: DerivedKeys): Buffer;
declare function decryptBufferWithDerivedKeys(buffer: Buffer, derivedKeys: DerivedKeys): Buffer;
/**
 * @method makeMessageChunkSignatureWithDerivedKeys
 * @param message
 * @param derivedKeys
 * @return
 */
declare function makeMessageChunkSignatureWithDerivedKeys(message: Buffer, derivedKeys: DerivedKeys): Buffer;
/**
 * @method verifyChunkSignatureWithDerivedKeys
 * @param chunk
 * @param derivedKeys
 * @return
 */
declare function verifyChunkSignatureWithDerivedKeys(chunk: Buffer, derivedKeys: DerivedKeys): boolean;

declare function exploreAsn1(buffer: Buffer): void;

type Version = string;
type Name = string;
type CertificateSerialNumber = string;
type Extensions = Record<string, unknown>;
interface RevokedCertificate {
    userCertificate: CertificateSerialNumber;
    revocationDate: Date;
    crlEntryExtensions?: Extensions;
}
interface TBSCertList {
    version?: Version;
    signature: AlgorithmIdentifier;
    issuer: Name;
    issuerFingerprint: string;
    thisUpdate: Date;
    nextUpdate?: Date;
    revokedCertificates: RevokedCertificate[];
}
interface CertificateRevocationListInfo {
    tbsCertList: TBSCertList;
    signatureAlgorithm: AlgorithmIdentifier;
    signatureValue: Buffer;
}
declare function readNameForCrl(buffer: Buffer, block: BlockInfo): DirectoryName;
declare function exploreCertificateRevocationList(crl: CertificateRevocationList): CertificateRevocationListInfo;

interface ExtensionRequest {
    basicConstraints: BasicConstraints;
    keyUsage: X509KeyUsage;
    subjectAltName: any;
}
interface CertificateSigningRequestInfo {
    extensionRequest: ExtensionRequest;
}
declare function readCertificationRequestInfo(buffer: Buffer, block: BlockInfo): CertificateSigningRequestInfo;
declare function exploreCertificateSigningRequest(crl: Buffer): CertificateSigningRequestInfo;

interface PrivateKeyInternals {
    /***/
    version: Buffer;
    modulus: Buffer;
    publicExponent: Buffer;
    privateExponent: Buffer;
    prime1: Buffer;
    prime2: Buffer;
    exponent1: Buffer;
    exponent2: Buffer;
}
/**
 *
 * @param privateKey RSAPrivateKey ::= SEQUENCE {
 *  version           Version,
 *  modulus           INTEGER,  -- n
 *  publicExponent    INTEGER,  -- e
 *  privateExponent   INTEGER,  -- d
 *  prime1            INTEGER,  -- p
 *  prime2            INTEGER,  -- q
 *  exponent1         INTEGER,  -- d mod (p-1)
 *  exponent2         INTEGER,  -- d mod (q-1)
 *  coefficient       INTEGER,  -- (inverse of q) mod p
 *  otherPrimeInfos   OtherPrimeInfos OPTIONAL
}
 */
declare function explorePrivateKey(privateKey2: PrivateKey): PrivateKeyInternals;

declare function makePrivateKeyFromPem(privateKeyInPem: string): PrivateKey;

declare function makePrivateKeyThumbPrint(privateKey: PrivateKey): Buffer;

interface SubjectOptions {
    commonName?: string;
    organization?: string;
    organizationalUnit?: string;
    locality?: string;
    state?: string;
    country?: string;
    domainComponent?: string;
}
/**
 * subjectName	The subject name to use for the Certificate.
 * If not specified the ApplicationName and/or domainNames are used to create a suitable default value.
 */
declare class Subject implements SubjectOptions {
    readonly commonName?: string;
    readonly organization?: string;
    readonly organizationalUnit?: string;
    readonly locality?: string;
    readonly state?: string;
    readonly country?: string;
    readonly domainComponent?: string;
    constructor(options: SubjectOptions | string);
    static parse(str: string): SubjectOptions;
    toStringInternal(sep: string): string;
    toStringForOPCUA(): string;
    toString(): string;
}

declare function verifyCertificateOrClrSignature(certificateOrCrl: Buffer, parentCertificate: Certificate): boolean;
declare function verifyCertificateSignature(certificate: Certificate, parentCertificate: Certificate): boolean;
declare function verifyCertificateRevocationListSignature(certificateRevocationList: Certificate, parentCertificate: Certificate): boolean;
type _VerifyStatus = "BadCertificateIssuerUseNotAllowed" | "BadCertificateInvalid" | "Good";
declare function verifyCertificateChain(certificateChain: Certificate[]): Promise<{
    status: _VerifyStatus;
    reason: string;
}>;

declare function coercePEMorDerToPrivateKey(privateKeyInDerOrPem: string | Buffer): PrivateKey;
/**
 *
 * @private
 */
declare function _coercePrivateKey(privateKey: any): Promise<KeyObject>;

interface CreateCertificateSigningRequestOptions {
    privateKey: CryptoKey;
    notBefore?: Date;
    notAfter?: Date;
    validity?: number;
    subject?: string;
    dns?: string[];
    ip?: string[];
    applicationUri?: string;
    purpose: CertificatePurpose;
}
declare function createCertificateSigningRequest({ privateKey, subject, dns, ip, applicationUri, purpose, }: CreateCertificateSigningRequestOptions): Promise<{
    csr: string;
    der: x509.Pkcs10CertificateRequest;
}>;

declare function generateKeyPair(modulusLength?: 1024 | 2048 | 3072 | 4096): Promise<CryptoKeyPair>;
/**
 *  generate a pair of private/public keys of length 1024,2048, 3072, or 4096 bits
 */
declare function generatePrivateKey(modulusLength?: 1024 | 2048 | 3072 | 4096): Promise<CryptoKey>;
/**
 *  convert  a CryptoKey to a PEM string
 */
declare function privateKeyToPEM(privateKey: CryptoKey): Promise<{
    privPem: string;
    privDer: ArrayBuffer;
}>;
declare function derToPrivateKey(privDer: ArrayBuffer): Promise<CryptoKey>;
declare function pemToPrivateKey(pem: string): Promise<CryptoKey>;

interface CreateSelfSignCertificateOptions {
    privateKey: CryptoKey;
    notBefore?: Date;
    notAfter?: Date;
    validity?: number;
    subject?: string;
    dns?: string[];
    ip?: string[];
    applicationUri?: string;
    purpose: CertificatePurpose;
}
/**
 *
 * construct a self-signed certificate
 */
declare function createSelfSignedCertificate({ privateKey, notAfter, notBefore, validity, subject, dns, ip, applicationUri, purpose, }: CreateSelfSignCertificateOptions): Promise<{
    cert: string;
    der: x509.X509Certificate;
}>;

/**
 * @module node_opcua_crypto
 */

declare const asn1: {
    readDirectoryName: typeof readDirectoryName;
    readTag: typeof readTag;
    readStruct: typeof readStruct;
    readAlgorithmIdentifier: typeof readAlgorithmIdentifier;
    readSignatureValueBin: typeof readSignatureValueBin;
};

export { type AttributeTypeAndValue, type AuthorityKeyIdentifier, type BasicConstraints, Certificate, type CertificateExtension, type CertificateInfo, type CertificateInternals, CertificatePEM, CertificatePurpose, CertificateRevocationList, type CertificateRevocationListInfo, type CertificateSerialNumber, type CertificateSigningRequestInfo, type ComputeDerivedKeysOptions, type CreateSelfSignCertificateOptions, DER, type DerivedKeys, type DirectoryName, type ExtensionRequest, type Extensions, KeyObject, type Name, Nonce, PEM, PaddingAlgorithm, PrivateKey, type PrivateKeyInternals, PrivateKeyPEM, PublicKey, type PublicKeyLength, PublicKeyPEM, RSA_PKCS1_OAEP_PADDING, RSA_PKCS1_PADDING, type RevokedCertificate, Signature, Subject, type SubjectOptions, type SubjectPublicKey, type SubjectPublicKeyInfo, type TBSCertList, type TbsCertificate, type Validity, type VerifyChunkSignatureOptions, type VerifyMessageChunkSignatureOptions, type Version, type X509ExtKeyUsage, type X509KeyUsage, type _VerifyStatus, _coercePrivateKey, asn1, certificateMatchesPrivateKey, coerceCertificate, coerceCertificatePem, coercePEMorDerToPrivateKey, coercePrivateKeyPem, coercePublicKeyPem, coerceRsaPublicKeyPem, combine_der, computeDerivedKeys, computePaddingFooter, convertPEMtoDER, createCertificateSigningRequest, createSelfSignedCertificate, decryptBufferWithDerivedKeys, derToPrivateKey, encryptBufferWithDerivedKeys, exploreAsn1, exploreCertificate, exploreCertificateInfo, exploreCertificateRevocationList, exploreCertificateSigningRequest, explorePrivateKey, extractPublicKeyFromCertificate, extractPublicKeyFromCertificateSync, generateKeyPair, generatePrivateKey, hexDump, identifyPemType, makeMessageChunkSignature, makeMessageChunkSignatureWithDerivedKeys, makePrivateKeyFromPem, makePrivateKeyThumbPrint, makePseudoRandomBuffer, makeSHA1Thumbprint, pemToPrivateKey, privateDecrypt, privateDecrypt_long, privateDecrypt_native, privateKeyToPEM, publicEncrypt, publicEncrypt_long, publicEncrypt_native, publicKeyAndPrivateKeyMatches, readCertificationRequestInfo, readExtension, readNameForCrl, readTbsCertificate, reduceLength, removePadding, removeTrailingLF, rsaLengthPrivateKey, rsaLengthPublicKey, rsaLengthRsaPublicKey, split_der, toPem, toPem2, verifyCertificateChain, verifyCertificateOrClrSignature, verifyCertificateRevocationListSignature, verifyCertificateSignature, verifyChunkSignature, verifyChunkSignatureWithDerivedKeys, verifyMessageChunkSignature };
