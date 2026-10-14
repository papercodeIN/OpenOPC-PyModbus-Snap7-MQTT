"use strict";
/**
 * @module node-opcua-secure-channel
 */
// tslint:disable:object-literal-short-hand
// tslint:disable:variable-name
// tslint:disable:max-line-length
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityPolicy = void 0;
exports.fromURI = fromURI;
exports.toURI = toURI;
exports.coerceSecurityPolicy = coerceSecurityPolicy;
exports.RSAPKCS1V15_Decrypt = RSAPKCS1V15_Decrypt;
exports.asymmetricVerifyChunk = asymmetricVerifyChunk;
exports.RSAPKCS1V15_Encrypt = RSAPKCS1V15_Encrypt;
exports.computeDerivedKeys = computeDerivedKeys;
exports.getCryptoFactory = getCryptoFactory;
exports.computeSignature = computeSignature;
exports.verifySignature = verifySignature;
exports.getOptionsForSymmetricSignAndEncrypt = getOptionsForSymmetricSignAndEncrypt;
const crypto_1 = require("crypto");
const crypto_2 = require("crypto");
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_service_secure_channel_1 = require("node-opcua-service-secure-channel");
const web_1 = require("node-opcua-crypto/web");
const node_opcua_debug_1 = require("node-opcua-debug");
// tslint:disable:no-empty
function errorLog(...args) {
    /** */
}
const warningLog = (0, node_opcua_debug_1.make_warningLog)(__filename);
/**
 *
 * OPCUA Spec Release 1.02  page 15    OPC Unified Architecture, Part 7
 *
 * @property Basic128Rsa15    Security Basic 128Rsa15
 * -----------------------
 *  A suite of algorithms that uses RSA15 as
 *  Key-Wrap-algorithm and 128-Bit for  encryption algorithms.
 *    -> SymmetricSignatureAlgorithm   -   HmacSha1 -(http://www.w3.org/2000/09/xmldsig#hmac-sha1).
 *    -> SymmetricEncryptionAlgorithm  -     Aes128 -(http://www.w3.org/2001/04/xmlenc#aes128-cbc).
 *    -> AsymmetricSignatureAlgorithm  -    RsaSha1 -(http://www.w3.org/2000/09/xmldsig#rsa-sha1).
 *    -> AsymmetricKeyWrapAlgorithm    -    KwRsa15 -(http://www.w3.org/2001/04/xmlenc#rsa-1_5).
 *    -> AsymmetricEncryptionAlgorithm -      Rsa15 -(http://www.w3.org/2001/04/xmlenc#rsa-1_5).
 *    -> KeyDerivationAlgorithm        -      PSha1 -(http://docs.oasis-open.org/ws-sx/ws-secureconversation/200512/dk/p_sha1).
 *    -> DerivedSignatureKeyLength     -  128
 *    -> MinAsymmetricKeyLength        - 1024
 *    -> MaxAsymmetricKeyLength        - 2048
 *    -> CertificateSignatureAlgorithm - Sha1
 *
 * @property Basic256 Security Basic 256:
 * -------------------
 * A suite of algorithms that are for 256-Bit encryption, algorithms include:
 *    -> SymmetricSignatureAlgorithm   - HmacSha1 -(http://www.w3.org/2000/09/xmldsig#hmac-sha1).
 *    -> SymmetricEncryptionAlgorithm  -   Aes256 -(http://www.w3.org/2001/04/xmlenc#aes256-cbc).
 *    -> AsymmetricSignatureAlgorithm  -  RsaSha1 -(http://www.w3.org/2000/09/xmldsig#rsa-sha1).
 *    -> AsymmetricKeyWrapAlgorithm    - KwRsaOaep-(http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p).
 *    -> AsymmetricEncryptionAlgorithm -  RsaOaep -(http://www.w3.org/2001/04/xmlenc#rsa-oaep).
 *    -> KeyDerivationAlgorithm        -    PSha1 -(http://docs.oasis-open.org/ws-sx/ws-secureconversation/200512/dk/p_sha1).
 *    -> DerivedSignatureKeyLength     -  192.
 *    -> MinAsymmetricKeyLength        - 1024
 *    -> MaxAsymmetricKeyLength        - 2048
 *    -> CertificateSignatureAlgorithm - Sha1
 *
 * @property Basic256 Security Basic 256 Sha256
 * --------------------------------------------
 * A suite of algorithms that are for 256-Bit encryption, algorithms include.
 *   -> SymmetricSignatureAlgorithm   - Hmac_Sha256 -(http://www.w3.org/2000/09/xmldsig#hmac-sha256).
 *   -> SymmetricEncryptionAlgorithm  -  Aes256_CBC -(http://www.w3.org/2001/04/xmlenc#aes256-cbc).
 *   -> AsymmetricSignatureAlgorithm  -  Rsa_Sha256 -(http://www.w3.org/2001/04/xmldsig-more#rsa-sha256).
 *   -> AsymmetricKeyWrapAlgorithm    -   KwRsaOaep -(http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p).
 *   -> AsymmetricEncryptionAlgorithm -    Rsa_Oaep -(http://www.w3.org/2001/04/xmlenc#rsa-oaep).
 *   -> KeyDerivationAlgorithm        -     PSHA256 -(http://docs.oasis-open.org/ws-sx/ws-secureconversation/200512/dk/p_sha256).
 *   -> DerivedSignatureKeyLength     - 256
 *   -> MinAsymmetricKeyLength        - 2048
 *   -> MaxAsymmetricKeyLength        - 4096
 *   -> CertificateSignatureAlgorithm - Sha256
 *
 *  Support for this security profile may require support for a second application instance certificate, with a larger
 *  key size. Applications shall support multiple Application Instance Certificates if required by supported Security
 *  Polices and use the certificate that is required for a given security endpoint.
 *
 *  * @property Aes128_Sha256_RsaOaep
 *  --------------------------------------------
 *   -> SymmetricSignatureAlgorithm   - HMAC-SHA2-256
 *   -> SymmetricEncryptionAlgorithm  - AES128-CBC
 *   -> AsymmetricSignatureAlgorithm  - RSA-PKCS15-SHA2-256  http://www.w3.org/2001/04/xmldsig-more#rsa-sha256.
 *   -> AsymmetricKeyWrapAlgorithm    - P-SHA2-256
 *   -> AsymmetricEncryptionAlgorithm - RSA-OAEP-SHA1        http://www.w3.org/2001/04/xmlenc#rsa-oaep
 *  ...
 *   -> DerivedSignatureKeyLength     - 256
 *   -> MinAsymmetricKeyLength        - 2048
 *   -> MaxAsymmetricKeyLength        - 4096
 *   -> CertificateSignatureAlgorithm - Sha256
 *
 *
 *  * @property Aes256_Sha256_RsaPss
 *  --------------------------------------------
 *  -> SymmetricSignatureAlgorithm   - HMAC-SHA2-256
 *  -> SymmetricEncryptionAlgorithm  - AES256-CBC
 *  -> AsymmetricSignatureAlgorithm  - RSA-PSS-SHA2-256
 *  -> AsymmetricKeyWrapAlgorithm    - P-SHA2-256
 *  -> AsymmetricEncryptionAlgorithm - RSA-OAEP-SHA2-256
 *
 *  -> DerivedSignatureKeyLength     - 256 bits
 *  -> MinAsymmetricKeyLength        - 2048 bits
 *  -> MaxAsymmetricKeyLength        - 4096 bits
 *  -> CertificateSignatureAlgorithm - RSA-PKCS15-SHA2-256
 *  -> SecureChannelNonceLength      - 32 bytes
 */
var SecurityPolicy;
(function (SecurityPolicy) {
    SecurityPolicy["Invalid"] = "invalid";
    SecurityPolicy["None"] = "http://opcfoundation.org/UA/SecurityPolicy#None";
    SecurityPolicy["Basic128"] = "http://opcfoundation.org/UA/SecurityPolicy#Basic128";
    SecurityPolicy["Basic192"] = "http://opcfoundation.org/UA/SecurityPolicy#Basic192";
    SecurityPolicy["Basic192Rsa15"] = "http://opcfoundation.org/UA/SecurityPolicy#Basic192Rsa15";
    SecurityPolicy["Basic256Rsa15"] = "http://opcfoundation.org/UA/SecurityPolicy#Basic256Rsa15";
    SecurityPolicy["Basic256Sha256"] = "http://opcfoundation.org/UA/SecurityPolicy#Basic256Sha256";
    // new
    SecurityPolicy["Aes128_Sha256_RsaOaep"] = "http://opcfoundation.org/UA/SecurityPolicy#Aes128_Sha256_RsaOaep";
    SecurityPolicy["Aes256_Sha256_RsaPss"] = "http://opcfoundation.org/UA/SecurityPolicy#Aes256_Sha256_RsaPss";
    SecurityPolicy["PubSub_Aes128_CTR"] = "http://opcfoundation.org/UA/SecurityPolicy#PubSub_Aes128_CTR";
    SecurityPolicy["PubSub_Aes256_CTR"] = "http://opcfoundation.org/UA/SecurityPolicy#PubSub_Aes256_CTR";
    // obsoletes
    SecurityPolicy["Basic128Rsa15"] = "http://opcfoundation.org/UA/SecurityPolicy#Basic128Rsa15";
    SecurityPolicy["Basic256"] = "http://opcfoundation.org/UA/SecurityPolicy#Basic256"; // obsolete
})(SecurityPolicy || (exports.SecurityPolicy = SecurityPolicy = {}));
function fromURI(uri) {
    // istanbul ignore next
    if (typeof uri !== "string") {
        return SecurityPolicy.Invalid;
    }
    const a = uri.split("#");
    // istanbul ignore next
    if (a.length < 2) {
        return SecurityPolicy.Invalid;
    }
    const v = SecurityPolicy[a[1]];
    return v || SecurityPolicy.Invalid;
}
function toURI(value) {
    if (typeof value === "string") {
        const a = value.split("#");
        // istanbul ignore next
        if (a.length < 2) {
            return SecurityPolicy[value];
        }
        return value;
    }
    const securityPolicy = value || SecurityPolicy.Invalid;
    if (securityPolicy === SecurityPolicy.Invalid) {
        throw new Error("trying to convert an invalid Security Policy into a URI: " + value);
    }
    return SecurityPolicy[securityPolicy];
}
function coerceSecurityPolicy(value) {
    if (value === undefined || value === null) {
        return SecurityPolicy.None;
    }
    if (value === "Basic128Rsa15" ||
        value === "Basic256" ||
        value === "Basic192Rsa15" ||
        value === "None" ||
        value === "Basic256Sha256" ||
        value === "Aes128_Sha256_RsaOaep" ||
        value === "Aes256_Sha256_RsaPss" ||
        value === "Basic256Rsa15") {
        return SecurityPolicy[value];
    }
    if (!(value === SecurityPolicy.Basic128Rsa15 ||
        value === SecurityPolicy.Basic256 ||
        value === SecurityPolicy.Basic192Rsa15 ||
        value === SecurityPolicy.Basic256Rsa15 ||
        value === SecurityPolicy.Basic256Sha256 ||
        value === SecurityPolicy.Aes128_Sha256_RsaOaep ||
        value === SecurityPolicy.Aes256_Sha256_RsaPss ||
        value === SecurityPolicy.None)) {
        errorLog("coerceSecurityPolicy: invalid security policy ", value, SecurityPolicy);
    }
    return value;
}
// --------------------
function RSAPKCS1V15_Decrypt(buffer, privateKey) {
    try {
        const blockSize = (0, web_1.rsaLengthPrivateKey)(privateKey);
        return (0, web_1.privateDecrypt_long)(buffer, privateKey, blockSize, web_1.PaddingAlgorithm.RSA_PKCS1_PADDING);
    }
    catch (err) {
        console.log("err = ", err);
        throw err;
    }
}
function RSAOAEP_Decrypt(buffer, privateKey) {
    const blockSize = (0, web_1.rsaLengthPrivateKey)(privateKey);
    return (0, web_1.privateDecrypt_long)(buffer, privateKey, blockSize, web_1.PaddingAlgorithm.RSA_PKCS1_OAEP_PADDING);
}
// --------------------
function asymmetricVerifyChunk(self, chunk, certificate) {
    const cert = (0, web_1.exploreCertificateInfo)(certificate);
    // then verify the signature
    const signatureLength = cert.publicKeyLength; // 1024 bits = 128Bytes or 2048=256Bytes or 3072 or 4096
    if (!(signatureLength === 128 || signatureLength === 256 || signatureLength === 384 || signatureLength === 512)) {
        return { signatureIsOK: false, signatureLength: 0 };
    }
    const leafSenderCertificate = (0, web_1.split_der)(certificate)[0];
    // let's get the signatureLength by checking the size
    // of the certificate's public key
    const blockToVerify = chunk.subarray(0, chunk.length - signatureLength);
    const signature = chunk.subarray(chunk.length - signatureLength);
    // debugLog("XXXXX  SIGNATURE !", signature.toString("hex"));
    const signatureIsOK = self.asymmetricVerify(blockToVerify, signature, leafSenderCertificate);
    return { signatureIsOK, signatureLength };
}
function RSA_PKCS1V15_SHA1_Verify(buffer, signature, certificate) {
    (0, node_opcua_assert_1.assert)(certificate instanceof Buffer);
    (0, node_opcua_assert_1.assert)(signature instanceof Buffer);
    const options = {
        algorithm: "RSA-SHA1",
        publicKey: (0, web_1.toPem)(certificate, "CERTIFICATE"),
        signatureLength: 0
    };
    return (0, web_1.verifyMessageChunkSignature)(buffer, signature, options);
}
const RSA_PKCS1_OAEP_SHA1_Verify = RSA_PKCS1V15_SHA1_Verify;
function RSA_PKCS1_OAEP_SHA256_Verify(buffer, signature, certificate) {
    const options = {
        algorithm: "RSA-SHA256",
        publicKey: (0, web_1.toPem)(certificate, "CERTIFICATE"),
        signatureLength: 0
    };
    return (0, web_1.verifyMessageChunkSignature)(buffer, signature, options);
}
function RSA_PKCS1V15_SHA1_Sign(buffer, privateKey) {
    const params = {
        algorithm: "RSA-SHA1",
        privateKey,
        signatureLength: (0, web_1.rsaLengthPrivateKey)(privateKey)
    };
    return (0, web_1.makeMessageChunkSignature)(buffer, params);
}
function RSA_PKCS1V15_SHA256_Sign(buffer, privateKey) {
    const params = {
        algorithm: "RSA-SHA256",
        privateKey,
        signatureLength: (0, web_1.rsaLengthPrivateKey)(privateKey)
    };
    return (0, web_1.makeMessageChunkSignature)(buffer, params);
}
const RSA_PKCS1_OAEP_SHA1_Sign = RSA_PKCS1V15_SHA1_Sign;
// DEPRECATED in NODEJS 20.11.1 see https://github.com/nodejs/node/commit/7079c062bb SECURITY_REVERT_CVE_2023_46809
// ( node --security-revert=CVE-2023-46809")
function RSAPKCS1V15_Encrypt(buffer, publicKey) {
    try {
        const keyLength = (0, web_1.rsaLengthPublicKey)(publicKey);
        return (0, web_1.publicEncrypt_long)(buffer, publicKey, keyLength, 11, web_1.PaddingAlgorithm.RSA_PKCS1_PADDING);
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}
function RSAOAEP_Encrypt(buffer, publicKey) {
    const keyLength = (0, web_1.rsaLengthPublicKey)(publicKey);
    return (0, web_1.publicEncrypt_long)(buffer, publicKey, keyLength, 42, web_1.PaddingAlgorithm.RSA_PKCS1_OAEP_PADDING);
}
function RSA_PSS_SHA2_256_Sign(buffer, privateKey) {
    const key = privateKey.hidden instanceof crypto_1.KeyObject
        ? privateKey.hidden
        : (0, crypto_1.createPrivateKey)({
            key: privateKey.hidden,
            format: "pem"
        });
    const signer = (0, crypto_1.createSign)("RSA-SHA256");
    signer.update(buffer);
    const signature = signer.sign({
        key: key,
        padding: crypto_2.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto_2.constants.RSA_PSS_SALTLEN_DIGEST
    });
    return signature;
}
function RSA_PSS_SHA2_256_Verify(buffer, signature, certificate) {
    const verify = (0, crypto_1.createVerify)("RSA-SHA256");
    verify.update(buffer);
    return verify.verify({
        key: (0, web_1.toPem)(certificate, "CERTIFICATE"),
        padding: crypto_2.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto_2.constants.RSA_PSS_SALTLEN_DIGEST
    }, signature);
}
function RSA_OAEP_SHA2_256_Encrypt(buffer, publicKey) {
    const blockSize = (0, web_1.rsaLengthPublicKey)(publicKey);
    const padding = _Aes256_Sha256_RsaPss.blockPaddingSize;
    const chunk_size = blockSize - padding;
    const nbBlocks = Math.ceil(buffer.length / chunk_size);
    const options = {
        key: publicKey,
        oaepHash: "sha256",
        padding: crypto_2.constants.RSA_PKCS1_OAEP_PADDING
    };
    const outputBuffer = Buffer.alloc(nbBlocks * blockSize);
    for (let i = 0; i < nbBlocks; i++) {
        const currentBlock = buffer.subarray(chunk_size * i, chunk_size * (i + 1));
        const encrypted_chunk = (0, crypto_2.publicEncrypt)(options, currentBlock);
        // istanbul ignore next
        if (encrypted_chunk.length !== blockSize) {
            throw new Error(`publicEncrypt_long unexpected chunk length ${encrypted_chunk.length}  expecting ${blockSize}`);
        }
        encrypted_chunk.copy(outputBuffer, i * blockSize);
    }
    return outputBuffer;
}
function RSA_OAEP_SHA2_256_Decrypt(buffer, privateKey) {
    const blockSize = (0, web_1.rsaLengthPrivateKey)(privateKey);
    const nbBlocks = Math.ceil(buffer.length / blockSize);
    const key = privateKey.hidden instanceof crypto_1.KeyObject
        ? privateKey.hidden
        : (0, crypto_1.createPrivateKey)({
            key: privateKey.hidden,
            format: "pem"
        });
    const outputBuffer = Buffer.alloc(nbBlocks * blockSize);
    const options = {
        key: key,
        oaepHash: "sha256",
        padding: crypto_2.constants.RSA_PKCS1_OAEP_PADDING
    };
    let total_length = 0;
    for (let i = 0; i < nbBlocks; i++) {
        const currentBlock = buffer.subarray(blockSize * i, Math.min(blockSize * (i + 1), buffer.length));
        const decrypted_buf = (0, crypto_2.privateDecrypt)(options, currentBlock);
        decrypted_buf.copy(outputBuffer, total_length);
        total_length += decrypted_buf.length;
    }
    return outputBuffer.subarray(0, total_length);
}
function computeDerivedKeys(cryptoFactory, serverNonce, clientNonce) {
    // calculate derived keys
    if (clientNonce && serverNonce) {
        const options = {
            algorithm: cryptoFactory.symmetricEncryptionAlgorithm,
            encryptingBlockSize: cryptoFactory.encryptingBlockSize,
            encryptingKeyLength: cryptoFactory.derivedEncryptionKeyLength,
            sha1or256: cryptoFactory.sha1or256,
            signatureLength: cryptoFactory.signatureLength,
            signingKeyLength: cryptoFactory.derivedSignatureKeyLength
        };
        return {
            algorithm: null,
            derivedClientKeys: (0, web_1.computeDerivedKeys)(serverNonce, clientNonce, options),
            derivedServerKeys: (0, web_1.computeDerivedKeys)(clientNonce, serverNonce, options)
        };
    }
    else {
        return { derivedClientKeys: null, derivedServerKeys: null, algorithm: null };
    }
}
const factoryBasic128Rsa15 = {
    derivedEncryptionKeyLength: 16,
    derivedSignatureKeyLength: 16,
    encryptingBlockSize: 16,
    securityPolicy: SecurityPolicy.Basic128Rsa15,
    signatureLength: 20,
    symmetricKeyLength: 16,
    maximumAsymmetricKeyLength: 512,
    minimumAsymmetricKeyLength: 128,
    /* asymmetric signature algorithm */
    asymmetricVerifyChunk,
    asymmetricSign: RSA_PKCS1V15_SHA1_Sign,
    asymmetricVerify: RSA_PKCS1V15_SHA1_Verify,
    asymmetricSignatureAlgorithm: "http://www.w3.org/2000/09/xmldsig#rsa-sha1",
    /* asymmetric encryption algorithm */
    asymmetricEncrypt: RSAPKCS1V15_Encrypt,
    asymmetricDecrypt: RSAPKCS1V15_Decrypt,
    asymmetricEncryptionAlgorithm: "http://www.w3.org/2001/04/xmlenc#rsa-1_5",
    blockPaddingSize: 11,
    symmetricEncryptionAlgorithm: "aes-128-cbc",
    sha1or256: "SHA1"
};
const _Basic256 = {
    securityPolicy: SecurityPolicy.Basic256,
    derivedEncryptionKeyLength: 32,
    derivedSignatureKeyLength: 24,
    encryptingBlockSize: 16,
    signatureLength: 20,
    symmetricKeyLength: 32,
    maximumAsymmetricKeyLength: 512,
    minimumAsymmetricKeyLength: 128,
    asymmetricVerifyChunk,
    asymmetricSign: RSA_PKCS1_OAEP_SHA1_Sign,
    asymmetricVerify: RSA_PKCS1_OAEP_SHA1_Verify,
    asymmetricSignatureAlgorithm: "http://www.w3.org/2000/09/xmldsig#rsa-sha1",
    /* asymmetric encryption algorithm */
    asymmetricEncrypt: RSAOAEP_Encrypt,
    asymmetricDecrypt: RSAOAEP_Decrypt,
    asymmetricEncryptionAlgorithm: "http://www.w3.org/2001/04/xmlenc#rsa-oaep",
    blockPaddingSize: 42,
    // "aes-256-cbc"
    symmetricEncryptionAlgorithm: "aes-256-cbc",
    sha1or256: "SHA1"
};
const _Basic256Sha256 = {
    securityPolicy: SecurityPolicy.Basic256Sha256,
    derivedEncryptionKeyLength: 32,
    derivedSignatureKeyLength: 32,
    encryptingBlockSize: 16,
    signatureLength: 32,
    symmetricKeyLength: 32,
    maximumAsymmetricKeyLength: 4096,
    minimumAsymmetricKeyLength: 2048,
    asymmetricVerifyChunk,
    asymmetricSign: RSA_PKCS1V15_SHA256_Sign,
    asymmetricVerify: RSA_PKCS1_OAEP_SHA256_Verify,
    asymmetricSignatureAlgorithm: "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256",
    /* asymmetric encryption algorithm */
    asymmetricEncrypt: RSAOAEP_Encrypt,
    asymmetricDecrypt: RSAOAEP_Decrypt,
    asymmetricEncryptionAlgorithm: "http://www.w3.org/2001/04/xmlenc#rsa-oaep",
    blockPaddingSize: 42,
    // "aes-256-cbc"
    symmetricEncryptionAlgorithm: "aes-256-cbc",
    sha1or256: "SHA256"
};
const _Aes128_Sha256_RsaOaep = {
    securityPolicy: SecurityPolicy.Aes128_Sha256_RsaOaep,
    derivedEncryptionKeyLength: 16,
    derivedSignatureKeyLength: 32,
    encryptingBlockSize: 16,
    signatureLength: 32,
    symmetricKeyLength: 32,
    maximumAsymmetricKeyLength: 4096,
    minimumAsymmetricKeyLength: 2048,
    asymmetricVerifyChunk,
    asymmetricSign: RSA_PKCS1V15_SHA256_Sign,
    asymmetricVerify: RSA_PKCS1_OAEP_SHA256_Verify,
    asymmetricSignatureAlgorithm: "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256",
    /* asymmetric encryption algorithm */
    asymmetricEncrypt: RSAOAEP_Encrypt,
    asymmetricDecrypt: RSAOAEP_Decrypt,
    asymmetricEncryptionAlgorithm: "http://www.w3.org/2001/04/xmlenc#rsa-oaep",
    blockPaddingSize: 42,
    // "aes-128-cbc" : 128 bits : 16 bytes
    symmetricEncryptionAlgorithm: "aes-128-cbc",
    sha1or256: "SHA256"
};
const _Aes256_Sha256_RsaPss = {
    securityPolicy: SecurityPolicy.Aes256_Sha256_RsaPss,
    derivedEncryptionKeyLength: 32,
    derivedSignatureKeyLength: 32,
    encryptingBlockSize: 16,
    signatureLength: 32,
    symmetricKeyLength: 32,
    maximumAsymmetricKeyLength: 4096,
    minimumAsymmetricKeyLength: 2048,
    asymmetricVerifyChunk,
    asymmetricSign: RSA_PSS_SHA2_256_Sign,
    asymmetricVerify: RSA_PSS_SHA2_256_Verify,
    asymmetricSignatureAlgorithm: "http://www.w3.org/2001/04/xmldsig-more#rsa-pss-sha256",
    /* asymmetric encryption algorithm */
    asymmetricEncrypt: RSA_OAEP_SHA2_256_Encrypt,
    asymmetricDecrypt: RSA_OAEP_SHA2_256_Decrypt,
    asymmetricEncryptionAlgorithm: "http://opcfoundation.org/UA/security/rsa-oaep-sha2-256",
    blockPaddingSize: 66,
    // "aes-256-cbc"
    symmetricEncryptionAlgorithm: "aes-256-cbc",
    sha1or256: "SHA256"
};
function getCryptoFactory(securityPolicy) {
    switch (securityPolicy) {
        case SecurityPolicy.None:
            return null;
        case SecurityPolicy.Basic128Rsa15:
            return factoryBasic128Rsa15;
        case SecurityPolicy.Basic256:
            return _Basic256;
        case SecurityPolicy.Basic256Sha256:
            return _Basic256Sha256;
        case SecurityPolicy.Aes128_Sha256_RsaOaep:
            return _Aes128_Sha256_RsaOaep;
        case SecurityPolicy.Aes256_Sha256_RsaPss:
            return _Aes256_Sha256_RsaPss;
        default: {
            errorLog(" Security policy ", securityPolicy, "is not supported");
            return null;
        }
    }
}
function computeSignature(senderCertificate, senderNonce, receiverPrivateKey, securityPolicy) {
    if (!senderNonce || !senderCertificate || senderCertificate.length === 0 || !receiverPrivateKey) {
        return undefined;
    }
    // Verify that senderCertificate is not a chain
    const chain = (0, web_1.split_der)(senderCertificate);
    const cryptoFactory = getCryptoFactory(securityPolicy);
    if (!cryptoFactory) {
        return undefined;
    }
    // This parameter is calculated by appending the clientNonce to the clientCertificate
    const dataToSign = Buffer.concat([chain[0], senderNonce]);
    // ... and signing the resulting sequence of bytes.
    const signature = cryptoFactory.asymmetricSign(dataToSign, receiverPrivateKey);
    return new node_opcua_service_secure_channel_1.SignatureData({
        // A string containing the URI of the algorithm.
        // The URI string values are defined as part of the security profiles specified in Part 7.
        // (The SignatureAlgorithm shall be the AsymmetricSignatureAlgorithm specified in the
        // SecurityPolicy for the Endpoint)
        // for instance "http://www.w3.org/2000/09/xmldsig#rsa-sha1"
        algorithm: cryptoFactory.asymmetricSignatureAlgorithm,
        // This is a signature generated with the private key associated with a Certificate
        signature
    });
}
function verifySignature(receiverCertificate, receiverNonce, signature, senderCertificate, securityPolicy) {
    if (securityPolicy === SecurityPolicy.None) {
        return true;
    }
    const cryptoFactory = getCryptoFactory(securityPolicy);
    if (!cryptoFactory) {
        return false;
    }
    if (!(signature.signature instanceof Buffer)) {
        // no signature provided
        return false;
    }
    // Verify that senderCertificate is not a chain
    const chain = (0, web_1.split_der)(receiverCertificate);
    (0, node_opcua_assert_1.assert)(signature.signature instanceof Buffer);
    // This parameter is calculated by appending the clientNonce to the clientCertificate
    const dataToVerify = Buffer.concat([chain[0], receiverNonce]);
    try {
        return cryptoFactory.asymmetricVerify(dataToVerify, signature.signature, senderCertificate);
    }
    catch (e) {
        warningLog(`Error when verifying signature of certificate: ${e}`);
        return false;
    }
}
function getOptionsForSymmetricSignAndEncrypt(securityMode, derivedKeys) {
    (0, node_opcua_assert_1.assert)(securityMode !== node_opcua_service_secure_channel_1.MessageSecurityMode.None && securityMode !== node_opcua_service_secure_channel_1.MessageSecurityMode.Invalid);
    let options = {
        // for signing 
        signatureLength: derivedKeys.signatureLength,
        signBufferFunc: (chunk) => (0, web_1.makeMessageChunkSignatureWithDerivedKeys)(chunk, derivedKeys),
        // for encrypting
        cipherBlockSize: derivedKeys.encryptingBlockSize,
        plainBlockSize: derivedKeys.encryptingBlockSize,
        encryptBufferFunc: (chunk) => (0, web_1.encryptBufferWithDerivedKeys)(chunk, derivedKeys),
    };
    if (securityMode === node_opcua_service_secure_channel_1.MessageSecurityMode.Sign) {
        // we don't want to encrypt
        options.plainBlockSize = 0;
        options.cipherBlockSize = 0;
    }
    return options;
}
//# sourceMappingURL=security_policy.js.map