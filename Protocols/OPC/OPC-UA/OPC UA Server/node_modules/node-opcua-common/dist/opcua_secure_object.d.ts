/**
 * @module node-opcua-common
 */
import { EventEmitter } from "events";
import { Certificate, PrivateKey } from "node-opcua-crypto/web";
export interface ICertificateKeyPairProvider {
    getCertificate(): Certificate;
    getCertificateChain(): Certificate;
    getPrivateKey(): PrivateKey;
}
export interface ICertificateKeyPairProviderPriv extends ICertificateKeyPairProvider {
    $$certificate: null | Certificate;
    $$certificateChain: null | Certificate;
    $$privateKey: null | PrivateKey;
}
export declare function getPartialCertificateChain1(certificateChain?: Buffer | null, maxSize?: number): Buffer | undefined;
export declare function getPartialCertificateChain(certificateChain?: Buffer | null, maxSize?: number): Buffer | undefined;
export interface IOPCUASecureObjectOptions {
    certificateFile?: string;
    privateKeyFile?: string;
}
/**
 * an object that provides a certificate and a privateKey
 */
export declare class OPCUASecureObject extends EventEmitter implements ICertificateKeyPairProvider {
    readonly certificateFile: string;
    readonly privateKeyFile: string;
    constructor(options: IOPCUASecureObjectOptions);
    getCertificate(): Certificate;
    getCertificateChain(): Certificate;
    getPrivateKey(): PrivateKey;
}
