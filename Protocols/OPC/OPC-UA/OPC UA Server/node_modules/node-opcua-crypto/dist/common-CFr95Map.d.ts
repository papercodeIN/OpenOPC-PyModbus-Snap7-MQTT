import __crypto from 'crypto';

declare const createPrivateKeyFromNodeJSCrypto: typeof __crypto.createPrivateKey;
type KeyFormat = "pem" | "der" | "jwk";
type KeyObjectType = "secret" | "public" | "private";
interface KeyExportOptions<T extends KeyFormat> {
    type: "pkcs1" | "spki" | "pkcs8" | "sec1";
    format: T;
    cipher?: string | undefined;
    passphrase?: string | Buffer | undefined;
}
interface JwkKeyExportOptions {
    format: "jwk";
}
interface KeyObject {
    export(options: KeyExportOptions<"pem">): string | Buffer;
    export(options: KeyExportOptions<"der">): Buffer;
    export(options: JwkKeyExportOptions): JsonWebKey;
    type: KeyObjectType;
}
declare function isKeyObject(mayBeKeyObject: any): boolean;
type PrivateKey = {
    hidden: string;
} | {
    hidden: KeyObject;
};
type PublicKey = KeyObject;
type Nonce = Buffer;
type PEM = string;
type DER = Buffer;
type Certificate = DER;
type CertificatePEM = PEM;
type PrivateKeyPEM = PEM;
type PublicKeyPEM = PEM;
type Signature = Buffer;
type CertificateRevocationList = Buffer;
declare enum CertificatePurpose {
    NotSpecified = 0,
    ForCertificateAuthority = 1,
    ForApplication = 2,
    ForUserAuthentication = 3
}

export { type Certificate as C, type DER as D, type KeyObject as K, type Nonce as N, type PrivateKey as P, type Signature as S, type PublicKey as a, type PEM as b, createPrivateKeyFromNodeJSCrypto as c, type CertificatePEM as d, type PrivateKeyPEM as e, type PublicKeyPEM as f, type CertificateRevocationList as g, CertificatePurpose as h, isKeyObject as i };
