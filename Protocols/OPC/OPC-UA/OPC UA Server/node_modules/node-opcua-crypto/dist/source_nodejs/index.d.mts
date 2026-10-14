import { C as Certificate, a as PublicKey, P as PrivateKey, d as CertificatePEM, f as PublicKeyPEM, e as PrivateKeyPEM, g as CertificateRevocationList } from '../common-CFr95Map.mjs';
import 'crypto';

/**
 * read a DER or PEM certificate from file
 */
declare function readCertificate(filename: string): Certificate;
/**
 * read a DER or PEM certificate from file
 */
declare function readPublicKey(filename: string): PublicKey;
/**
 * read a DER or PEM certificate from file
 */
declare function readPrivateKey(filename: string): PrivateKey;
declare function readCertificatePEM(filename: string): CertificatePEM;
declare function readPublicKeyPEM(filename: string): PublicKeyPEM;
/**
 *
 * @deprecated
 */
declare function readPrivateKeyPEM(filename: string): PrivateKeyPEM;
declare function setCertificateStore(store: string): string;
declare function getCertificateStore(): string;
/**
 *
 * @param filename
 */
declare function readPrivateRsaKey(filename: string): PrivateKey;
declare function readPublicRsaKey(filename: string): PublicKey;

declare function readCertificateRevocationList(filename: string): Promise<CertificateRevocationList>;

type CertificateSigningRequest = Buffer;
declare function readCertificateSigningRequest(filename: string): Promise<CertificateSigningRequest>;

declare function generatePrivateKeyFile(privateKeyFilename: string, modulusLength: 1024 | 2048 | 3072 | 4096): Promise<void>;
/**
 * alternate function to generate PrivateKeyFile, using jsrsasign.
 *
 * This function is slower than generatePrivateKeyFile
 */
declare function generatePrivateKeyFileAlternate(privateKeyFilename: string, modulusLength: 2048 | 3072 | 4096): Promise<void>;

export { type CertificateSigningRequest, generatePrivateKeyFile, generatePrivateKeyFileAlternate, getCertificateStore, readCertificate, readCertificatePEM, readCertificateRevocationList, readCertificateSigningRequest, readPrivateKey, readPrivateKeyPEM, readPrivateRsaKey, readPublicKey, readPublicKeyPEM, readPublicRsaKey, setCertificateStore };
