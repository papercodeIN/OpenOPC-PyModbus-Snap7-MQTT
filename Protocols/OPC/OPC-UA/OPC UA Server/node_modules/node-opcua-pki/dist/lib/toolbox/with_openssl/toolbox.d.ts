import { Filename } from "../common";
import { ExecuteOptions } from "./execute_openssl";
export declare function generateStaticConfig(configPath: string, options?: ExecuteOptions): string;
/**
 *   calculate the public key from private key
 *   openssl rsa -pubout -in private_key.pem
 *
 * @method getPublicKeyFromPrivateKey
 * @param privateKeyFilename: the existing file with the private key
 * @param publicKeyFilename: the file where to store the public key
 */
export declare function getPublicKeyFromPrivateKey(privateKeyFilename: string, publicKeyFilename: string): Promise<void>;
/**
 * extract public key from a certificate
 *   openssl x509 -pubkey -in certificate.pem -nottext
 *
 * @method getPublicKeyFromCertificate
 * @param certificateFilename
 * @param publicKeyFilename
 */
export declare function getPublicKeyFromCertificate(certificateFilename: string, publicKeyFilename: string): Promise<void>;
export declare function x509Date(date?: Date): string;
/**
 * @param certificate - the certificate file in PEM format, file must exist
 */
export declare function dumpCertificate(certificate: Filename): Promise<string>;
export declare function toDer(certificatePem: string): Promise<string>;
export declare function fingerprint(certificatePem: string): Promise<string>;
