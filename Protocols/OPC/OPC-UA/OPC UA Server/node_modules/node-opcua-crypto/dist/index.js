"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var index_exports = {};
__export(index_exports, {
  CertificatePurpose: () => CertificatePurpose,
  PaddingAlgorithm: () => PaddingAlgorithm,
  RSA_PKCS1_OAEP_PADDING: () => RSA_PKCS1_OAEP_PADDING,
  RSA_PKCS1_PADDING: () => RSA_PKCS1_PADDING,
  Subject: () => Subject,
  _coercePrivateKey: () => _coercePrivateKey,
  asn1: () => asn1,
  certificateMatchesPrivateKey: () => certificateMatchesPrivateKey,
  coerceCertificate: () => coerceCertificate,
  coerceCertificatePem: () => coerceCertificatePem,
  coercePEMorDerToPrivateKey: () => coercePEMorDerToPrivateKey,
  coercePrivateKeyPem: () => coercePrivateKeyPem,
  coercePublicKeyPem: () => coercePublicKeyPem,
  coerceRsaPublicKeyPem: () => coerceRsaPublicKeyPem,
  combine_der: () => combine_der,
  computeDerivedKeys: () => computeDerivedKeys,
  computePaddingFooter: () => computePaddingFooter,
  convertPEMtoDER: () => convertPEMtoDER,
  createCertificateSigningRequest: () => createCertificateSigningRequest,
  createPrivateKeyFromNodeJSCrypto: () => createPrivateKeyFromNodeJSCrypto,
  createSelfSignedCertificate: () => createSelfSignedCertificate,
  decryptBufferWithDerivedKeys: () => decryptBufferWithDerivedKeys,
  derToPrivateKey: () => derToPrivateKey,
  encryptBufferWithDerivedKeys: () => encryptBufferWithDerivedKeys,
  exploreAsn1: () => exploreAsn1,
  exploreCertificate: () => exploreCertificate,
  exploreCertificateInfo: () => exploreCertificateInfo,
  exploreCertificateRevocationList: () => exploreCertificateRevocationList,
  exploreCertificateSigningRequest: () => exploreCertificateSigningRequest,
  explorePrivateKey: () => explorePrivateKey,
  extractPublicKeyFromCertificate: () => extractPublicKeyFromCertificate,
  extractPublicKeyFromCertificateSync: () => extractPublicKeyFromCertificateSync,
  generateKeyPair: () => generateKeyPair,
  generatePrivateKey: () => generatePrivateKey,
  generatePrivateKeyFile: () => generatePrivateKeyFile,
  generatePrivateKeyFileAlternate: () => generatePrivateKeyFileAlternate,
  getCertificateStore: () => getCertificateStore,
  hexDump: () => hexDump,
  identifyPemType: () => identifyPemType,
  isKeyObject: () => isKeyObject,
  makeMessageChunkSignature: () => makeMessageChunkSignature,
  makeMessageChunkSignatureWithDerivedKeys: () => makeMessageChunkSignatureWithDerivedKeys,
  makePrivateKeyFromPem: () => makePrivateKeyFromPem,
  makePrivateKeyThumbPrint: () => makePrivateKeyThumbPrint,
  makePseudoRandomBuffer: () => makePseudoRandomBuffer,
  makeSHA1Thumbprint: () => makeSHA1Thumbprint,
  pemToPrivateKey: () => pemToPrivateKey,
  privateDecrypt: () => privateDecrypt,
  privateDecrypt_long: () => privateDecrypt_long,
  privateDecrypt_native: () => privateDecrypt_native,
  privateKeyToPEM: () => privateKeyToPEM,
  publicEncrypt: () => publicEncrypt,
  publicEncrypt_long: () => publicEncrypt_long,
  publicEncrypt_native: () => publicEncrypt_native,
  publicKeyAndPrivateKeyMatches: () => publicKeyAndPrivateKeyMatches,
  readCertificate: () => readCertificate,
  readCertificatePEM: () => readCertificatePEM,
  readCertificateRevocationList: () => readCertificateRevocationList,
  readCertificateSigningRequest: () => readCertificateSigningRequest,
  readCertificationRequestInfo: () => readCertificationRequestInfo,
  readExtension: () => readExtension,
  readNameForCrl: () => readNameForCrl,
  readPrivateKey: () => readPrivateKey,
  readPrivateKeyPEM: () => readPrivateKeyPEM,
  readPrivateRsaKey: () => readPrivateRsaKey,
  readPublicKey: () => readPublicKey,
  readPublicKeyPEM: () => readPublicKeyPEM,
  readPublicRsaKey: () => readPublicRsaKey,
  readTbsCertificate: () => readTbsCertificate,
  reduceLength: () => reduceLength,
  removePadding: () => removePadding,
  removeTrailingLF: () => removeTrailingLF,
  rsaLengthPrivateKey: () => rsaLengthPrivateKey,
  rsaLengthPublicKey: () => rsaLengthPublicKey,
  rsaLengthRsaPublicKey: () => rsaLengthRsaPublicKey,
  setCertificateStore: () => setCertificateStore,
  split_der: () => split_der,
  toPem: () => toPem,
  toPem2: () => toPem2,
  verifyCertificateChain: () => verifyCertificateChain,
  verifyCertificateOrClrSignature: () => verifyCertificateOrClrSignature,
  verifyCertificateRevocationListSignature: () => verifyCertificateRevocationListSignature,
  verifyCertificateSignature: () => verifyCertificateSignature,
  verifyChunkSignature: () => verifyChunkSignature,
  verifyChunkSignatureWithDerivedKeys: () => verifyChunkSignatureWithDerivedKeys,
  verifyMessageChunkSignature: () => verifyMessageChunkSignature
});
module.exports = __toCommonJS(index_exports);

// source/asn1.ts
var import_assert = __toESM(require("assert"));

// source/oid_map.ts
var oid_map = {
  "0.9.2342.19200300.100.1.1": { d: "userID", c: "Some oddball X.500 attribute collection" },
  "0.9.2342.19200300.100.1.3": { d: "rfc822Mailbox", c: "Some oddball X.500 attribute collection" },
  "0.9.2342.19200300.100.1.25": { d: "domainComponent", c: "Men are from Mars, this OID is from Pluto" },
  "1.2.840.10045.2": { d: "publicKeyType", c: "ANSI X9.62" },
  "1.2.840.10045.2.1": { d: "ecPublicKey", c: "ANSI X9.62 public key type" },
  "1.2.840.10045.3.0.1": { d: "c2pnb163v1", c: "ANSI X9.62 named elliptic curve" },
  "1.2.840.10045.3.0.2": { d: "c2pnb163v2", c: "ANSI X9.62 named elliptic curve" },
  "1.2.840.10045.3.0.3": { d: "c2pnb163v3", c: "ANSI X9.62 named elliptic curve" },
  "1.2.840.10045.3.0.5": { d: "c2tnb191v1", c: "ANSI X9.62 named elliptic curve" },
  "1.2.840.10045.3.0.6": { d: "c2tnb191v2", c: "ANSI X9.62 named elliptic curve" },
  "1.2.840.10045.3.0.7": { d: "c2tnb191v3", c: "ANSI X9.62 named elliptic curve" },
  "1.2.840.10045.3.0.10": { d: "c2pnb208w1", c: "ANSI X9.62 named elliptic curve" },
  "1.2.840.10045.3.0.11": { d: "c2tnb239v1", c: "ANSI X9.62 named elliptic curve" },
  "1.2.840.10045.3.0.12": { d: "c2tnb239v2", c: "ANSI X9.62 named elliptic curve" },
  "1.2.840.10045.3.0.13": { d: "c2tnb239v3", c: "ANSI X9.62 named elliptic curve" },
  "1.2.840.10045.3.0.16": { d: "c2pnb272w1", c: "ANSI X9.62 named elliptic curve" },
  "1.2.840.10045.3.0.18": { d: "c2tnb359v1", c: "ANSI X9.62 named elliptic curve" },
  "1.2.840.10045.3.0.19": { d: "c2pnb368w1", c: "ANSI X9.62 named elliptic curve" },
  "1.2.840.10045.3.0.20": { d: "c2tnb431r1", c: "ANSI X9.62 named elliptic curve" },
  "1.2.840.10045.3.1.1": { d: "prime192v1", c: "ANSI X9.62 named elliptic curve" },
  "1.2.840.10045.3.1.2": { d: "prime192v2", c: "ANSI X9.62 named elliptic curve" },
  "1.2.840.10045.3.1.3": { d: "prime192v3", c: "ANSI X9.62 named elliptic curve" },
  "1.2.840.10045.3.1.4": { d: "prime239v1", c: "ANSI X9.62 named elliptic curve" },
  "1.2.840.10045.3.1.5": { d: "prime239v2", c: "ANSI X9.62 named elliptic curve" },
  "1.2.840.10045.3.1.6": { d: "prime239v3", c: "ANSI X9.62 named elliptic curve" },
  "1.2.840.10045.3.1.7": { d: "prime256v1", c: "ANSI X9.62 named elliptic curve" },
  "1.2.840.113549.1.1": { d: "pkcs-1", c: "", w: false },
  "1.2.840.113549.1.1.1": { d: "rsaEncryption", c: "PKCS #1", w: false },
  "1.2.840.113549.1.1.2": { d: "md2WithRSAEncryption", c: "PKCS #1", w: false },
  "1.2.840.113549.1.1.3": { d: "md4WithRSAEncryption", c: "PKCS #1", w: false },
  "1.2.840.113549.1.1.4": { d: "md5WithRSAEncryption", c: "PKCS #1", w: false },
  "1.2.840.113549.1.1.5": { d: "sha1WithRSAEncryption", c: "PKCS #1", w: false },
  "1.2.840.113549.1.1.7": { d: "rsaOAEP", c: "PKCS #1", w: false },
  "1.2.840.113549.1.1.8": { d: "pkcs1-MGF", c: "PKCS #1", w: false },
  "1.2.840.113549.1.1.9": { d: "rsaOAEP-pSpecified", c: "PKCS #1", w: false },
  "1.2.840.113549.1.1.10": { d: "rsaPSS", c: "PKCS #1", w: false },
  "1.2.840.113549.1.1.11": { d: "sha256WithRSAEncryption", c: "PKCS #1", w: false },
  "1.2.840.113549.1.1.12": { d: "sha384WithRSAEncryption", c: "PKCS #1", w: false },
  "1.2.840.113549.1.1.13": { d: "sha512WithRSAEncryption", c: "PKCS #1", w: false },
  "1.2.840.113549.1.1.14": { d: "sha224WithRSAEncryption", c: "PKCS #1", w: false },
  "1.2.840.113549.1.9.1": {
    d: "emailAddress",
    c: "PKCS #9. Deprecated, use an altName extension instead",
    w: false
  },
  "1.2.840.113549.1.9.2": { d: "unstructuredName", c: "PKCS #9", w: false },
  "1.2.840.113549.1.9.3": { d: "contentType", c: "PKCS #9", w: false },
  "1.2.840.113549.1.9.4": { d: "messageDigest", c: "PKCS #9", w: false },
  "1.2.840.113549.1.9.5": { d: "signingTime", c: "PKCS #9", w: false },
  "1.2.840.113549.1.9.6": { d: "countersignature", c: "PKCS #9", w: false },
  "1.2.840.113549.1.9.7": { d: "challengePassword", c: "PKCS #9", w: false },
  "1.2.840.113549.1.9.8": { d: "unstructuredAddress", c: "PKCS #9", w: false },
  "1.2.840.113549.1.9.9": { d: "extendedCertificateAttributes", c: "PKCS #9", w: false },
  "1.2.840.113549.1.9.10": { d: "issuerAndSerialNumber", c: "PKCS #9 experimental", w: true },
  "1.2.840.113549.1.9.11": { d: "passwordCheck", c: "PKCS #9 experimental", w: true },
  "1.2.840.113549.1.9.12": { d: "publicKey", c: "PKCS #9 experimental", w: true },
  "1.2.840.113549.1.9.13": { d: "signingDescription", c: "PKCS #9", w: false },
  "1.2.840.113549.1.9.14": { d: "extensionRequest", c: "PKCS #9 via CRMF", w: false },
  "1.3.6.1.4.1.311.2.1.21": { d: "1.3.6.1.4.1.311.2.1.21", c: "SPC_INDIVIDUAL_SP_KEY_PURPOSE_OBJID" },
  "1.3.6.1.4.1.311.2.1.22": { d: "1.3.6.1.4.1.311.2.1.22", c: "SPC_COMMERCIAL_SP_KEY_PURPOSE_OBJID" },
  "1.3.6.1.4.1.311.10.3.1": { d: "1.3.6.1.4.1.311.10.3.1", c: "Signer of CTLs -- szOID_KP_CTL_USAGE_SIGNING" },
  "1.3.6.1.4.1.311.10.3.4": { d: "1.3.6.1.4.1.311.10.3.4", c: "szOID_EFS_RECOVERY (Encryption File System)" },
  "1.3.6.1.4.1.311.20.2.3": { d: "1.3.6.1.4.1.311.20.2.3", c: "id-on-personalData" },
  "1.3.6.1.5.5.7.3.17": { d: "1.3.6.1.5.5.7.3.17", c: "Internet Key Exchange (IKE)" },
  "1.3.6.1.5.5.7.3.1": { d: "serverAuth", c: "PKIX key purpose" },
  "1.3.6.1.5.5.7.3.2": { d: "clientAuth", c: "PKIX key purpose" },
  "1.3.6.1.5.5.7.3.3": { d: "codeSigning", c: "PKIX key purpose" },
  "1.3.6.1.5.5.7.3.4": { d: "emailProtection", c: "PKIX key purpose" },
  "1.3.6.1.5.5.7.3.5": { d: "ipsecEndSystem", c: "PKIX key purpose" },
  "1.3.6.1.5.5.7.3.6": { d: "ipsecTunnel", c: "PKIX key purpose" },
  "1.3.6.1.5.5.7.3.7": { d: "ipsecUser", c: "PKIX key purpose" },
  "1.3.6.1.5.5.7.3.8": { d: "timeStamping", c: "PKIX key purpose" },
  "1.3.6.1.5.5.7.3.9": { d: "ocspSigning", c: "PKIX key purpose" },
  "1.3.6.1.5.5.7.3.10": { d: "dvcs", c: "PKIX key purpose" },
  "1.3.6.1.5.5.7.3.11": { d: "sbgpCertAAServerAuth", c: "PKIX key purpose" },
  "1.3.6.1.5.5.7.3.13": { d: "eapOverPPP", c: "PKIX key purpose" },
  "1.3.6.1.5.5.7.3.14": { d: "eapOverLAN", c: "PKIX key purpose" },
  "1.3.36.3.3.2.8.1.1.1": { d: "brainpoolP160r1", c: "ECC Brainpool Standard Curves and Curve Generation" },
  "1.3.36.3.3.2.8.1.1.2": { d: "brainpoolP160t1", c: "ECC Brainpool Standard Curves and Curve Generation" },
  "1.3.36.3.3.2.8.1.1.3": { d: "brainpoolP192r1", c: "ECC Brainpool Standard Curves and Curve Generation" },
  "1.3.36.3.3.2.8.1.1.4": { d: "brainpoolP192t1", c: "ECC Brainpool Standard Curves and Curve Generation" },
  "1.3.36.3.3.2.8.1.1.5": { d: "brainpoolP224r1", c: "ECC Brainpool Standard Curves and Curve Generation" },
  "1.3.36.3.3.2.8.1.1.6": { d: "brainpoolP224t1", c: "ECC Brainpool Standard Curves and Curve Generation" },
  "1.3.36.3.3.2.8.1.1.7": { d: "brainpoolP256r1", c: "ECC Brainpool Standard Curves and Curve Generation" },
  "1.3.36.3.3.2.8.1.1.8": { d: "brainpoolP256t1", c: "ECC Brainpool Standard Curves and Curve Generation" },
  "1.3.36.3.3.2.8.1.1.9": { d: "brainpoolP320r1", c: "ECC Brainpool Standard Curves and Curve Generation" },
  "1.3.36.3.3.2.8.1.1.10": { d: "brainpoolP320t1", c: "ECC Brainpool Standard Curves and Curve Generation" },
  "1.3.36.3.3.2.8.1.1.11": { d: "brainpoolP384r1", c: "ECC Brainpool Standard Curves and Curve Generation" },
  "1.3.36.3.3.2.8.1.1.12": { d: "brainpoolP384t1", c: "ECC Brainpool Standard Curves and Curve Generation" },
  "1.3.36.3.3.2.8.1.1.13": { d: "brainpoolP512r1", c: "ECC Brainpool Standard Curves and Curve Generation" },
  "1.3.36.3.3.2.8.1.1.14": { d: "brainpoolP512t1", c: "ECC Brainpool Standard Curves and Curve Generation" },
  "2.5.4.0": { d: "objectClass", c: "X.520 DN component", w: false },
  "2.5.4.1": { d: "aliasedEntryName", c: "X.520 DN component", w: false },
  "2.5.4.2": { d: "knowledgeInformation", c: "X.520 DN component", w: false },
  "2.5.4.3": { d: "commonName", c: "X.520 DN component", w: false },
  "2.5.4.4": { d: "surname", c: "X.520 DN component", w: false },
  "2.5.4.5": { d: "serialNumber", c: "X.520 DN component", w: false },
  "2.5.4.6": { d: "countryName", c: "X.520 DN component", w: false },
  "2.5.4.7": { d: "localityName", c: "X.520 DN component", w: false },
  "2.5.4.7.1": { d: "collectiveLocalityName", c: "X.520 DN component", w: false },
  "2.5.4.8": { d: "stateOrProvinceName", c: "X.520 DN component", w: false },
  "2.5.4.8.1": { d: "collectiveStateOrProvinceName", c: "X.520 DN component", w: false },
  "2.5.4.9": { d: "streetAddress", c: "X.520 DN component", w: false },
  "2.5.4.9.1": { d: "collectiveStreetAddress", c: "X.520 DN component", w: false },
  "2.5.4.10": { d: "organizationName", c: "X.520 DN component", w: false },
  "2.5.4.10.1": { d: "collectiveOrganizationName", c: "X.520 DN component", w: false },
  "2.5.4.11": { d: "organizationalUnitName", c: "X.520 DN component", w: false },
  "2.5.4.11.1": { d: "collectiveOrganizationalUnitName", c: "X.520 DN component", w: false },
  "2.5.4.12": { d: "title", c: "X.520 DN component", w: false },
  "2.5.4.13": { d: "description", c: "X.520 DN component", w: false },
  "2.5.4.14": { d: "searchGuide", c: "X.520 DN component", w: false },
  "2.5.4.15": { d: "businessCategory", c: "X.520 DN component", w: false },
  "2.5.4.16": { d: "postalAddress", c: "X.520 DN component", w: false },
  "2.5.4.16.1": { d: "collectivePostalAddress", c: "X.520 DN component", w: false },
  "2.5.4.17": { d: "postalCode", c: "X.520 DN component", w: false },
  "2.5.4.17.1": { d: "collectivePostalCode", c: "X.520 DN component", w: false },
  "2.5.4.18": { d: "postOfficeBox", c: "X.520 DN component", w: false },
  "2.5.4.18.1": { d: "collectivePostOfficeBox", c: "X.520 DN component", w: false },
  "2.5.4.19": { d: "physicalDeliveryOfficeName", c: "X.520 DN component", w: false },
  "2.5.4.19.1": { d: "collectivePhysicalDeliveryOfficeName", c: "X.520 DN component", w: false },
  "2.5.4.20": { d: "telephoneNumber", c: "X.520 DN component", w: false },
  "2.5.4.20.1": { d: "collectiveTelephoneNumber", c: "X.520 DN component", w: false },
  "2.5.4.21": { d: "telexNumber", c: "X.520 DN component", w: false },
  "2.5.4.21.1": { d: "collectiveTelexNumber", c: "X.520 DN component", w: false },
  "2.5.4.22": { d: "teletexTerminalIdentifier", c: "X.520 DN component", w: false },
  "2.5.4.22.1": { d: "collectiveTeletexTerminalIdentifier", c: "X.520 DN component", w: false },
  "2.5.4.23": { d: "facsimileTelephoneNumber", c: "X.520 DN component", w: false },
  "2.5.4.23.1": { d: "collectiveFacsimileTelephoneNumber", c: "X.520 DN component", w: false },
  "2.5.4.24": { d: "x121Address", c: "X.520 DN component", w: false },
  "2.5.4.25": { d: "internationalISDNNumber", c: "X.520 DN component", w: false },
  "2.5.4.25.1": { d: "collectiveInternationalISDNNumber", c: "X.520 DN component", w: false },
  "2.5.4.26": { d: "registeredAddress", c: "X.520 DN component", w: false },
  "2.5.4.27": { d: "destinationIndicator", c: "X.520 DN component", w: false },
  "2.5.4.28": { d: "preferredDeliveryMehtod", c: "X.520 DN component", w: false },
  "2.5.4.29": { d: "presentationAddress", c: "X.520 DN component", w: false },
  "2.5.4.30": { d: "supportedApplicationContext", c: "X.520 DN component", w: false },
  "2.5.4.31": { d: "member", c: "X.520 DN component", w: false },
  "2.5.4.32": { d: "owner", c: "X.520 DN component", w: false },
  "2.5.4.33": { d: "roleOccupant", c: "X.520 DN component", w: false },
  "2.5.4.34": { d: "seeAlso", c: "X.520 DN component", w: false },
  "2.5.4.35": { d: "userPassword", c: "X.520 DN component", w: false },
  "2.5.4.36": { d: "userCertificate", c: "X.520 DN component", w: false },
  "2.5.4.37": { d: "caCertificate", c: "X.520 DN component", w: false },
  "2.5.4.38": { d: "authorityRevocationList", c: "X.520 DN component", w: false },
  "2.5.4.39": { d: "certificateRevocationList", c: "X.520 DN component", w: false },
  "2.5.4.40": { d: "crossCertificatePair", c: "X.520 DN component", w: false },
  "2.5.4.41": { d: "name", c: "X.520 DN component", w: false },
  "2.5.4.42": { d: "givenName", c: "X.520 DN component", w: false },
  "2.5.4.43": { d: "initials", c: "X.520 DN component", w: false },
  "2.5.4.44": { d: "generationQualifier", c: "X.520 DN component", w: false },
  "2.5.4.45": { d: "uniqueIdentifier", c: "X.520 DN component", w: false },
  "2.5.4.46": { d: "dnQualifier", c: "X.520 DN component", w: false },
  "2.5.4.47": { d: "enhancedSearchGuide", c: "X.520 DN component", w: false },
  "2.5.4.48": { d: "protocolInformation", c: "X.520 DN component", w: false },
  "2.5.4.49": { d: "distinguishedName", c: "X.520 DN component", w: false },
  "2.5.4.50": { d: "uniqueMember", c: "X.520 DN component", w: false },
  "2.5.4.51": { d: "houseIdentifier", c: "X.520 DN component", w: false },
  "2.5.4.52": { d: "supportedAlgorithms", c: "X.520 DN component", w: false },
  "2.5.4.53": { d: "deltaRevocationList", c: "X.520 DN component", w: false },
  "2.5.4.54": { d: "dmdName", c: "X.520 DN component", w: false },
  "2.5.4.55": { d: "clearance", c: "X.520 DN component", w: false },
  "2.5.4.56": { d: "defaultDirQop", c: "X.520 DN component", w: false },
  "2.5.4.57": { d: "attributeIntegrityInfo", c: "X.520 DN component", w: false },
  "2.5.4.58": { d: "attributeCertificate", c: "X.520 DN component", w: false },
  "2.5.4.59": { d: "attributeCertificateRevocationList", c: "X.520 DN component", w: false },
  "2.5.4.60": { d: "confKeyInfo", c: "X.520 DN component", w: false },
  "2.5.4.61": { d: "aACertificate", c: "X.520 DN component", w: false },
  "2.5.4.62": { d: "attributeDescriptorCertificate", c: "X.520 DN component", w: false },
  "2.5.4.63": { d: "attributeAuthorityRevocationList", c: "X.520 DN component", w: false },
  "2.5.4.64": { d: "familyInformation", c: "X.520 DN component", w: false },
  "2.5.4.65": { d: "pseudonym", c: "X.520 DN component", w: false },
  "2.5.4.66": { d: "communicationsService", c: "X.520 DN component", w: false },
  "2.5.4.67": { d: "communicationsNetwork", c: "X.520 DN component", w: false },
  "2.5.4.68": { d: "certificationPracticeStmt", c: "X.520 DN component", w: false },
  "2.5.4.69": { d: "certificatePolicy", c: "X.520 DN component", w: false },
  "2.5.4.70": { d: "pkiPath", c: "X.520 DN component", w: false },
  "2.5.4.71": { d: "privPolicy", c: "X.520 DN component", w: false },
  "2.5.4.72": { d: "role", c: "X.520 DN component", w: false },
  "2.5.4.73": { d: "delegationPath", c: "X.520 DN component", w: false },
  "2.5.4.74": { d: "protPrivPolicy", c: "X.520 DN component", w: false },
  "2.5.4.75": { d: "xMLPrivilegeInfo", c: "X.520 DN component", w: false },
  "2.5.4.76": { d: "xmlPrivPolicy", c: "X.520 DN component", w: false },
  "2.5.4.82": { d: "permission", c: "X.520 DN component", w: false },
  "2.5.6.0": { d: "top", c: "X.520 objectClass", w: false },
  "2.5.6.1": { d: "alias", c: "X.520 objectClass", w: false },
  "2.5.6.2": { d: "country", c: "X.520 objectClass", w: false },
  "2.5.6.3": { d: "locality", c: "X.520 objectClass", w: false },
  "2.5.6.4": { d: "organization", c: "X.520 objectClass", w: false },
  "2.5.6.5": { d: "organizationalUnit", c: "X.520 objectClass", w: false },
  "2.5.6.6": { d: "person", c: "X.520 objectClass", w: false },
  "2.5.6.7": { d: "organizationalPerson", c: "X.520 objectClass", w: false },
  "2.5.6.8": { d: "organizationalRole", c: "X.520 objectClass", w: false },
  "2.5.6.9": { d: "groupOfNames", c: "X.520 objectClass", w: false },
  "2.5.6.10": { d: "residentialPerson", c: "X.520 objectClass", w: false },
  "2.5.6.11": { d: "applicationProcess", c: "X.520 objectClass", w: false },
  "2.5.6.12": { d: "applicationEntity", c: "X.520 objectClass", w: false },
  "2.5.6.13": { d: "dSA", c: "X.520 objectClass", w: false },
  "2.5.6.14": { d: "device", c: "X.520 objectClass", w: false },
  "2.5.6.15": { d: "strongAuthenticationUser", c: "X.520 objectClass", w: false },
  "2.5.6.16": { d: "certificateAuthority", c: "X.520 objectClass", w: false },
  "2.5.6.17": { d: "groupOfUniqueNames", c: "X.520 objectClass", w: false },
  "2.5.6.21": { d: "pkiUser", c: "X.520 objectClass", w: false },
  "2.5.6.22": { d: "pkiCA", c: "X.520 objectClass", w: false },
  "2.5.29.1": { d: "authorityKeyIdentifier", c: "X.509 extension. Deprecated, use 2 5 29 35 instead", w: true },
  "2.5.29.2": { d: "keyAttributes", c: "X.509 extension. Obsolete, use keyUsage/extKeyUsage instead", w: true },
  "2.5.29.3": { d: "certificatePolicies", c: "X.509 extension. Deprecated, use 2 5 29 32 instead", w: true },
  "2.5.29.4": {
    d: "keyUsageRestriction",
    c: "X.509 extension. Obsolete, use keyUsage/extKeyUsage instead",
    w: true
  },
  "2.5.29.5": { d: "policyMapping", c: "X.509 extension. Deprecated, use 2 5 29 33 instead", w: true },
  "2.5.29.6": { d: "subtreesConstraint", c: "X.509 extension. Obsolete, use nameConstraints instead", w: true },
  "2.5.29.7": { d: "subjectAltName", c: "X.509 extension. Deprecated, use 2 5 29 17 instead", w: true },
  "2.5.29.8": { d: "issuerAltName", c: "X.509 extension. Deprecated, use 2 5 29 18 instead", w: true },
  "2.5.29.9": { d: "subjectDirectoryAttributes", c: "X.509 extension", w: false },
  "2.5.29.10": { d: "basicConstraints", c: "X.509 extension. Deprecated, use 2 5 29 19 instead", w: true },
  "2.5.29.11": { d: "nameConstraints", c: "X.509 extension. Deprecated, use 2 5 29 30 instead", w: true },
  "2.5.29.12": { d: "policyConstraints", c: "X.509 extension. Deprecated, use 2 5 29 36 instead", w: true },
  "2.5.29.13": { d: "basicConstraints", c: "X.509 extension. Deprecated, use 2 5 29 19 instead", w: true },
  "2.5.29.14": { d: "subjectKeyIdentifier", c: "X.509 extension", w: false },
  "2.5.29.15": { d: "keyUsage", c: "X.509 extension", w: false },
  "2.5.29.16": { d: "privateKeyUsagePeriod", c: "X.509 extension", w: false },
  "2.5.29.17": { d: "subjectAltName", c: "X.509 extension", w: false },
  "2.5.29.18": { d: "issuerAltName", c: "X.509 extension", w: false },
  "2.5.29.19": { d: "basicConstraints", c: "X.509 extension", w: false },
  "2.5.29.20": { d: "cRLNumber", c: "X.509 extension", w: false },
  "2.5.29.21": { d: "cRLReason", c: "X.509 extension", w: false },
  "2.5.29.22": { d: "expirationDate", c: "X.509 extension. Deprecated, alternative OID uncertain", w: true },
  "2.5.29.23": { d: "instructionCode", c: "X.509 extension", w: false },
  "2.5.29.24": { d: "invalidityDate", c: "X.509 extension", w: false },
  "2.5.29.25": { d: "cRLDistributionPoints", c: "X.509 extension. Deprecated, use 2 5 29 31 instead", w: true },
  "2.5.29.26": {
    d: "issuingDistributionPoint",
    c: "X.509 extension. Deprecated, use 2 5 29 28 instead",
    w: true
  },
  "2.5.29.27": { d: "deltaCRLIndicator", c: "X.509 extension", w: false },
  "2.5.29.28": { d: "issuingDistributionPoint", c: "X.509 extension", w: false },
  "2.5.29.29": { d: "certificateIssuer", c: "X.509 extension", w: false },
  "2.5.29.30": { d: "nameConstraints", c: "X.509 extension", w: false },
  "2.5.29.31": { d: "cRLDistributionPoints", c: "X.509 extension", w: false },
  "2.5.29.32": { d: "certificatePolicies", c: "X.509 extension", w: false },
  "2.5.29.32.0": { d: "anyPolicy", c: "X.509 certificate policy", w: false },
  "2.5.29.33": { d: "policyMappings", c: "X.509 extension", w: false },
  "2.5.29.34": { d: "policyConstraints", c: "X.509 extension. Deprecated, use 2 5 29 36 instead", w: true },
  "2.5.29.35": { d: "authorityKeyIdentifier", c: "X.509 extension", w: false },
  "2.5.29.36": { d: "policyConstraints", c: "X.509 extension", w: false },
  "2.5.29.37": { d: "extKeyUsage", c: "X.509 extension", w: false },
  "2.5.29.37.0": { d: "anyExtendedKeyUsage", c: "X.509 extended key usage", w: false },
  "2.5.29.38": { d: "authorityAttributeIdentifier", c: "X.509 extension", w: false },
  "2.5.29.39": { d: "roleSpecCertIdentifier", c: "X.509 extension", w: false },
  "2.5.29.40": { d: "cRLStreamIdentifier", c: "X.509 extension", w: false },
  "2.5.29.41": { d: "basicAttConstraints", c: "X.509 extension", w: false },
  "2.5.29.42": { d: "delegatedNameConstraints", c: "X.509 extension", w: false },
  "2.5.29.43": { d: "timeSpecification", c: "X.509 extension", w: false },
  "2.5.29.44": { d: "cRLScope", c: "X.509 extension", w: false },
  "2.5.29.45": { d: "statusReferrals", c: "X.509 extension", w: false },
  "2.5.29.46": { d: "freshestCRL", c: "X.509 extension", w: false },
  "2.5.29.47": { d: "orderedList", c: "X.509 extension", w: false },
  "2.5.29.48": { d: "attributeDescriptor", c: "X.509 extension", w: false },
  "2.5.29.49": { d: "userNotice", c: "X.509 extension", w: false },
  "2.5.29.50": { d: "sOAIdentifier", c: "X.509 extension", w: false },
  "2.5.29.51": { d: "baseUpdateTime", c: "X.509 extension", w: false },
  "2.5.29.52": { d: "acceptableCertPolicies", c: "X.509 extension", w: false },
  "2.5.29.53": { d: "deltaInfo", c: "X.509 extension", w: false },
  "2.5.29.54": { d: "inhibitAnyPolicy", c: "X.509 extension", w: false },
  "2.5.29.55": { d: "targetInformation", c: "X.509 extension", w: false },
  "2.5.29.56": { d: "noRevAvail", c: "X.509 extension", w: false },
  "2.5.29.57": { d: "acceptablePrivilegePolicies", c: "X.509 extension", w: false },
  "2.5.29.58": { d: "toBeRevoked", c: "X.509 extension", w: false },
  "2.5.29.59": { d: "revokedGroups", c: "X.509 extension", w: false },
  "2.5.29.60": { d: "expiredCertsOnCRL", c: "X.509 extension", w: false },
  "2.5.29.61": { d: "indirectIssuer", c: "X.509 extension", w: false },
  "2.5.29.62": { d: "noAssertion", c: "X.509 extension", w: false },
  "2.5.29.63": { d: "aAissuingDistributionPoint", c: "X.509 extension", w: false },
  "2.5.29.64": { d: "issuedOnBehalfOf", c: "X.509 extension", w: false },
  "2.5.29.65": { d: "singleUse", c: "X.509 extension", w: false },
  "2.5.29.66": { d: "groupAC", c: "X.509 extension", w: false },
  "2.5.29.67": { d: "allowedAttAss", c: "X.509 extension", w: false },
  "2.5.29.68": { d: "attributeMappings", c: "X.509 extension", w: false },
  "2.5.29.69": { d: "holderNameConstraints", c: "X.509 extension", w: false },
  // Netscape certificate type
  // An X.509 v3 certificate extension used to identify whether
  // the certificate subject is an SSL client, …
  "2.16.840.1.113730.1": { d: "certExtension", c: "Netscape" },
  "2.16.840.1.113730.1.1": { d: "netscapeCertType", c: "Netscape certificate extension" },
  "2.16.840.1.113730.1.2": { d: "netscapeBaseUrl", c: "Netscape certificate extension" },
  "2.16.840.1.113730.1.3": { d: "netscapeRevocationUrl", c: "Netscape certificate extension" },
  "2.16.840.1.113730.1.4": { d: "netscapeCaRevocationUrl", c: "Netscape certificate extension" },
  "2.16.840.1.113730.1.7": { d: "netscapeCertRenewalUrl", c: "Netscape certificate extension" },
  "2.16.840.1.113730.1.8": { d: "netscapeCaPolicyUrl", c: "Netscape certificate extension" },
  "2.16.840.1.113730.1.9": { d: "HomePageUrl", c: "Netscape certificate extension" },
  "2.16.840.1.113730.1.10": { d: "EntityLogo", c: "Netscape certificate extension" },
  "2.16.840.1.113730.1.11": { d: "UserPicture", c: "Netscape certificate extension" },
  "2.16.840.1.113730.1.12": { d: "netscapeSslServerName", c: "Netscape certificate extension" },
  "2.16.840.1.113730.1.13": { d: "netscapeComment", c: "Netscape certificate extension" },
  done: { d: "", c: "" }
};

// source/asn1.ts
var TagType = /* @__PURE__ */ ((TagType2) => {
  TagType2[TagType2["BOOLEAN"] = 1] = "BOOLEAN";
  TagType2[TagType2["INTEGER"] = 2] = "INTEGER";
  TagType2[TagType2["BIT_STRING"] = 3] = "BIT_STRING";
  TagType2[TagType2["OCTET_STRING"] = 4] = "OCTET_STRING";
  TagType2[TagType2["NULL"] = 5] = "NULL";
  TagType2[TagType2["OBJECT_IDENTIFIER"] = 6] = "OBJECT_IDENTIFIER";
  TagType2[TagType2["UTF8String"] = 12] = "UTF8String";
  TagType2[TagType2["NumericString"] = 18] = "NumericString";
  TagType2[TagType2["PrintableString"] = 19] = "PrintableString";
  TagType2[TagType2["TeletexString"] = 20] = "TeletexString";
  TagType2[TagType2["IA5String"] = 22] = "IA5String";
  TagType2[TagType2["UTCTime"] = 23] = "UTCTime";
  TagType2[TagType2["GeneralizedTime"] = 24] = "GeneralizedTime";
  TagType2[TagType2["GraphicString"] = 25] = "GraphicString";
  TagType2[TagType2["VisibleString"] = 26] = "VisibleString";
  TagType2[TagType2["GeneralString"] = 27] = "GeneralString";
  TagType2[TagType2["UniversalString"] = 28] = "UniversalString";
  TagType2[TagType2["BMPString"] = 30] = "BMPString";
  TagType2[TagType2["SEQUENCE"] = 48] = "SEQUENCE";
  TagType2[TagType2["SET"] = 49] = "SET";
  TagType2[TagType2["CONTEXT_SPECIFIC0"] = 160] = "CONTEXT_SPECIFIC0";
  TagType2[TagType2["CONTEXT_SPECIFIC1"] = 161] = "CONTEXT_SPECIFIC1";
  TagType2[TagType2["CONTEXT_SPECIFIC2"] = 162] = "CONTEXT_SPECIFIC2";
  TagType2[TagType2["CONTEXT_SPECIFIC3"] = 163] = "CONTEXT_SPECIFIC3";
  TagType2[TagType2["A4"] = 164] = "A4";
  return TagType2;
})(TagType || {});
function readTag(buf, pos) {
  const start = pos;
  if (buf.length <= pos) {
    throw new Error("Invalid position : buf.length=" + buf.length + " pos =" + pos);
  }
  const tag = buf.readUInt8(pos);
  pos += 1;
  let length = buf.readUInt8(pos);
  pos += 1;
  if (length > 127) {
    const nbBytes = length & 127;
    length = 0;
    for (let i = 0; i < nbBytes; i++) {
      length = length * 256 + buf.readUInt8(pos);
      pos += 1;
    }
  }
  return { start, tag, position: pos, length };
}
function readStruct(buf, blockInfo) {
  const length = blockInfo.length;
  let cursor = blockInfo.position;
  const end = blockInfo.position + length;
  const blocks = [];
  while (cursor < end) {
    const inner = readTag(buf, cursor);
    cursor = inner.position + inner.length;
    blocks.push(inner);
  }
  return blocks;
}
function parseBitString(buffer, start, end, maxLength) {
  const unusedBit = buffer.readUInt8(start), lenBit = (end - start - 1 << 3) - unusedBit, intro = "(" + lenBit + " bit)\n";
  let s = "", skip = unusedBit;
  for (let i = end - 1; i > start; --i) {
    const b = buffer.readUInt8(i);
    for (let j = skip; j < 8; ++j) {
      s += b >> j & 1 ? "1" : "0";
    }
    skip = 0;
    (0, import_assert.default)(s.length <= maxLength);
  }
  return intro + s;
}
function readBitString(buffer, block) {
  (0, import_assert.default)(block.tag === 3 /* BIT_STRING */);
  const data = getBlock(buffer, block);
  const ignore_bits = data.readUInt8(0);
  return {
    lengthInBits: data.length * 8 - ignore_bits,
    lengthInBytes: data.length - 1,
    data: data.subarray(1),
    debug: parseBitString(buffer, block.position, block.length + block.position, 4 * 16 * 1024)
  };
}
function formatBuffer2DigitHexWithColum(buffer) {
  const value = [];
  for (let i = 0; i < buffer.length; i++) {
    value.push(("00" + buffer.readUInt8(i).toString(16)).substr(-2, 2));
  }
  return value.join(":").toUpperCase().replace(/^(00:)*/, "");
}
function readOctetString(buffer, block) {
  (0, import_assert.default)(block.tag === 4 /* OCTET_STRING */);
  const tag = readTag(buffer, block.position);
  (0, import_assert.default)(tag.tag === 4 /* OCTET_STRING */);
  const nbBytes = tag.length;
  const pos = tag.position;
  const b = buffer.subarray(pos, pos + nbBytes);
  return b;
}
function getBlock(buffer, block) {
  const start = block.position;
  const end = block.position + block.length;
  return buffer.subarray(start, end);
}
function readIntegerAsByteString(buffer, block) {
  return getBlock(buffer, block);
}
function readListOfInteger(buffer) {
  const block = readTag(buffer, 0);
  const inner_blocks = readStruct(buffer, block);
  return inner_blocks.map((innerBlock) => {
    return readIntegerAsByteString(buffer, innerBlock);
  });
}
function parseOID(buffer, start, end) {
  let s = "", n = 0, bits = 0;
  for (let i = start; i < end; ++i) {
    const v = buffer.readUInt8(i);
    n = n * 128 + (v & 127);
    bits += 7;
    if (!(v & 128)) {
      if (s === "") {
        const m = n < 80 ? n < 40 ? 0 : 1 : 2;
        s = m + "." + (n - m * 40);
      } else {
        s += "." + n.toString();
      }
      n = 0;
      bits = 0;
    }
  }
  (0, import_assert.default)(bits === 0);
  return s;
}
function readObjectIdentifier(buffer, block) {
  (0, import_assert.default)(block.tag === 6 /* OBJECT_IDENTIFIER */);
  const b = buffer.subarray(block.position, block.position + block.length);
  const oid = parseOID(b, 0, block.length);
  return {
    oid,
    name: oid_map[oid] ? oid_map[oid].d : oid
  };
}
function readAlgorithmIdentifier(buffer, block) {
  const inner_blocks = readStruct(buffer, block);
  return {
    identifier: readObjectIdentifier(buffer, inner_blocks[0]).name
  };
}
function readECCAlgorithmIdentifier(buffer, block) {
  const inner_blocks = readStruct(buffer, block);
  return {
    identifier: readObjectIdentifier(buffer, inner_blocks[1]).name
    // difference with RSA as algorithm is second element of nested block
  };
}
function readSignatureValueBin(buffer, block) {
  return readBitString(buffer, block).data;
}
function readSignatureValue(buffer, block) {
  return readSignatureValueBin(buffer, block).toString("hex");
}
function readLongIntegerValue(buffer, block) {
  (0, import_assert.default)(block.tag === 2 /* INTEGER */, "expecting a INTEGER tag");
  const pos = block.position;
  const nbBytes = block.length;
  const buf = buffer.subarray(pos, pos + nbBytes);
  return buf;
}
function readIntegerValue(buffer, block) {
  (0, import_assert.default)(block.tag === 2 /* INTEGER */, "expecting a INTEGER tag");
  let pos = block.position;
  const nbBytes = block.length;
  (0, import_assert.default)(nbBytes < 4);
  let value = 0;
  for (let i = 0; i < nbBytes; i++) {
    value = value * 256 + buffer.readUInt8(pos);
    pos += 1;
  }
  return value;
}
function readBooleanValue(buffer, block) {
  (0, import_assert.default)(block.tag === 1 /* BOOLEAN */, "expecting a BOOLEAN tag. got " + TagType[block.tag]);
  const pos = block.position;
  const nbBytes = block.length;
  (0, import_assert.default)(nbBytes < 4);
  const value = buffer.readUInt8(pos) ? true : false;
  return value;
}
function readVersionValue(buffer, block) {
  block = readTag(buffer, block.position);
  return readIntegerValue(buffer, block);
}
function convertGeneralizedTime(str) {
  const year = parseInt(str.substr(0, 4), 10);
  const month = parseInt(str.substr(4, 2), 10) - 1;
  const day = parseInt(str.substr(6, 2), 10);
  const hours = parseInt(str.substr(8, 2), 10);
  const mins = parseInt(str.substr(10, 2), 10);
  const secs = parseInt(str.substr(12, 2), 10);
  return new Date(Date.UTC(year, month, day, hours, mins, secs));
}
function _readBMPString(buffer, block) {
  const strBuff = getBlock(buffer, block);
  let str = "";
  for (let i = 0; i < strBuff.length; i += 2) {
    const word = strBuff.readUInt16BE(i);
    str += String.fromCharCode(word);
  }
  return str;
}
function convertUTCTime(str) {
  let year = parseInt(str.substr(0, 2), 10);
  const month = parseInt(str.substr(2, 2), 10) - 1;
  const day = parseInt(str.substr(4, 2), 10);
  const hours = parseInt(str.substr(6, 2), 10);
  const mins = parseInt(str.substr(8, 2), 10);
  const secs = parseInt(str.substr(10, 2), 10);
  year += year >= 50 ? 1900 : 2e3;
  return new Date(Date.UTC(year, month, day, hours, mins, secs));
}
function readValue(buffer, block) {
  switch (block.tag) {
    case 1 /* BOOLEAN */:
      return readBooleanValue(buffer, block);
    case 30 /* BMPString */:
      return _readBMPString(buffer, block);
    case 19 /* PrintableString */:
    case 20 /* TeletexString */:
    case 12 /* UTF8String */:
    case 18 /* NumericString */:
    case 22 /* IA5String */:
      return getBlock(buffer, block).toString("ascii");
    case 23 /* UTCTime */:
      return convertUTCTime(getBlock(buffer, block).toString("ascii"));
    case 24 /* GeneralizedTime */:
      return convertGeneralizedTime(getBlock(buffer, block).toString("ascii"));
    default:
      throw new Error("Invalid tag 0x" + block.tag.toString(16));
  }
}
function findBlockAtIndex(blocks, index) {
  const tmp = blocks.filter((b) => b.tag === 160 + index || b.tag === 128 + index);
  if (tmp.length === 0) {
    return null;
  }
  return tmp[0];
}
function readTime(buffer, block) {
  return readValue(buffer, block);
}

// source/crypto_utils.ts
var import_constants = __toESM(require("constants"));
var import_assert4 = __toESM(require("assert"));
var import_crypto = require("crypto");
var import_hexy = __toESM(require("hexy"));

// source/buffer_utils.ts
var createFastUninitializedBuffer = Buffer.allocUnsafe ? Buffer.allocUnsafe : (size) => {
  return new Buffer(size);
};

// source/crypto_explore_certificate.ts
var import_assert3 = __toESM(require("assert"));

// source/directory_name.ts
var import_assert2 = __toESM(require("assert"));
function readDirectoryName(buffer, block) {
  const set_blocks = readStruct(buffer, block);
  const names = {};
  for (const set_block of set_blocks) {
    (0, import_assert2.default)(set_block.tag === 49);
    const blocks = readStruct(buffer, set_block);
    (0, import_assert2.default)(blocks.length === 1);
    (0, import_assert2.default)(blocks[0].tag === 48);
    const sequenceBlock = readStruct(buffer, blocks[0]);
    (0, import_assert2.default)(sequenceBlock.length === 2);
    const type = readObjectIdentifier(buffer, sequenceBlock[0]);
    names[type.name] = readValue(buffer, sequenceBlock[1]);
  }
  return names;
}

// source/crypto_explore_certificate.ts
var doDebug = false;
function _readAttributeTypeAndValue(buffer, block) {
  let inner_blocks = readStruct(buffer, block);
  inner_blocks = readStruct(buffer, inner_blocks[0]);
  const data = {
    identifier: readObjectIdentifier(buffer, inner_blocks[0]).name,
    value: readValue(buffer, inner_blocks[1])
  };
  const result = {};
  for (const [key, value] of Object.entries(data)) {
    result[key] = value;
  }
  return result;
}
function _readRelativeDistinguishedName(buffer, block) {
  const inner_blocks = readStruct(buffer, block);
  const data = inner_blocks.map((block2) => _readAttributeTypeAndValue(buffer, block2));
  const result = {};
  for (const e of data) {
    result[e.identifier] = e.value;
  }
  return result;
}
function _readName(buffer, block) {
  return _readRelativeDistinguishedName(buffer, block);
}
function _readValidity(buffer, block) {
  const inner_blocks = readStruct(buffer, block);
  return {
    notBefore: readTime(buffer, inner_blocks[0]),
    notAfter: readTime(buffer, inner_blocks[1])
  };
}
function _readAuthorityKeyIdentifier(buffer) {
  const block_info = readTag(buffer, 0);
  const blocks = readStruct(buffer, block_info);
  const keyIdentifier_block = findBlockAtIndex(blocks, 0);
  const authorityCertIssuer_block = findBlockAtIndex(blocks, 1);
  const authorityCertSerialNumber_block = findBlockAtIndex(blocks, 2);
  function _readAuthorityCertIssuer(block) {
    const inner_blocks = readStruct(buffer, block);
    const directoryName_block = findBlockAtIndex(inner_blocks, 4);
    if (directoryName_block) {
      const a = readStruct(buffer, directoryName_block);
      return readDirectoryName(buffer, a[0]);
    } else {
      throw new Error("Invalid _readAuthorityCertIssuer");
    }
  }
  function _readAuthorityCertIssuerFingerPrint(block) {
    const inner_blocks = readStruct(buffer, block);
    const directoryName_block = findBlockAtIndex(inner_blocks, 4);
    if (!directoryName_block) {
      return "";
    }
    const a = readStruct(buffer, directoryName_block);
    if (a.length < 1) {
      return "";
    }
    return directoryName_block ? formatBuffer2DigitHexWithColum(makeSHA1Thumbprint(getBlock(buffer, a[0]))) : "";
  }
  const authorityCertIssuer = authorityCertIssuer_block ? _readAuthorityCertIssuer(authorityCertIssuer_block) : null;
  const authorityCertIssuerFingerPrint = authorityCertIssuer_block ? _readAuthorityCertIssuerFingerPrint(authorityCertIssuer_block) : "";
  return {
    authorityCertIssuer,
    authorityCertIssuerFingerPrint,
    serial: authorityCertSerialNumber_block ? formatBuffer2DigitHexWithColum(getBlock(buffer, authorityCertSerialNumber_block)) : null,
    // can be null for self-signed cert
    keyIdentifier: keyIdentifier_block ? formatBuffer2DigitHexWithColum(getBlock(buffer, keyIdentifier_block)) : null
    // can be null for self-signed certf
  };
}
function readBasicConstraint2_5_29_19(buffer, block) {
  const block_info = readTag(buffer, 0);
  const inner_blocks = readStruct(buffer, block_info).slice(0, 2);
  let cA = false;
  let pathLengthConstraint = 0;
  let breakControl = 0;
  for (const inner_block of inner_blocks) {
    switch (inner_block.tag) {
      case 1 /* BOOLEAN */:
        cA = readBooleanValue(buffer, inner_block);
        break;
      case 2 /* INTEGER */:
        pathLengthConstraint = readIntegerValue(buffer, inner_block);
        breakControl = 1;
        break;
    }
    if (breakControl) {
      break;
    }
  }
  return { critical: true, cA, pathLengthConstraint };
}
function _readGeneralNames(buffer, block) {
  const _data = {
    1: { name: "rfc822Name", type: "IA5String" },
    2: { name: "dNSName", type: "IA5String" },
    3: { name: "x400Address", type: "ORAddress" },
    4: { name: "directoryName", type: "Name" },
    5: { name: "ediPartyName", type: "EDIPartyName" },
    6: { name: "uniformResourceIdentifier", type: "IA5String" },
    7: { name: "iPAddress", type: "OCTET_STRING" },
    8: { name: "registeredID", type: "OBJECT_IDENTIFIER" },
    32: { name: "otherName", type: "AnotherName" }
  };
  const blocks = readStruct(buffer, block);
  function _readFromType(buffer2, block2, type) {
    switch (type) {
      case "IA5String":
        return buffer2.subarray(block2.position, block2.position + block2.length).toString("ascii");
      default:
        return buffer2.subarray(block2.position, block2.position + block2.length).toString("hex");
    }
  }
  const n = {};
  for (const block2 of blocks) {
    (0, import_assert3.default)((block2.tag & 128) === 128);
    const t2 = block2.tag & 127;
    const type = _data[t2];
    if (!type) {
      console.log("_readGeneralNames: INVALID TYPE => " + t2 + " 0x" + t2.toString(16));
      continue;
    }
    if (t2 == 32) {
      n[type.name] = n[type.name] || [];
      const blocks2 = readStruct(buffer, block2);
      const name = readObjectIdentifier(buffer, blocks2[0]).name;
      const buf = getBlock(buffer, blocks2[1]);
      const b = readTag(buf, 0);
      const nn = readValue(buf, b);
      const data = {
        identifier: name,
        value: nn
      };
      n[type.name].push(data.value);
    } else {
      n[type.name] = n[type.name] || [];
      n[type.name].push(_readFromType(buffer, block2, type.type));
    }
  }
  return n;
}
function _readSubjectAltNames(buffer) {
  const block_info = readTag(buffer, 0);
  return _readGeneralNames(buffer, block_info);
}
function readKeyUsage(oid, buffer) {
  const block_info = readTag(buffer, 0);
  let b2 = 0;
  let b3 = 0;
  if (block_info.length > 1) {
    b2 = buffer[block_info.position + 1];
    b3 = block_info.length > 2 ? buffer[block_info.position + 2] : 0;
  }
  return {
    // tslint:disable-next-line: no-bitwise
    digitalSignature: (b2 & 128) === 128,
    // tslint:disable-next-line: no-bitwise
    nonRepudiation: (b2 & 64) === 64,
    // tslint:disable-next-line: no-bitwise
    keyEncipherment: (b2 & 32) === 32,
    // tslint:disable-next-line: no-bitwise
    dataEncipherment: (b2 & 16) === 16,
    // tslint:disable-next-line: no-bitwise
    keyAgreement: (b2 & 8) === 8,
    // tslint:disable-next-line: no-bitwise
    keyCertSign: (b2 & 4) === 4,
    // tslint:disable-next-line: no-bitwise
    cRLSign: (b2 & 2) === 2,
    // tslint:disable-next-line: no-bitwise
    encipherOnly: (b2 & 1) === 1,
    // tslint:disable-next-line: no-bitwise
    decipherOnly: (b3 & 128) === 128
  };
}
function readExtKeyUsage(oid, buffer) {
  (0, import_assert3.default)(oid === "2.5.29.37");
  const block_info = readTag(buffer, 0);
  const inner_blocks = readStruct(buffer, block_info);
  const extKeyUsage = {
    serverAuth: false,
    clientAuth: false,
    codeSigning: false,
    emailProtection: false,
    timeStamping: false,
    ipsecEndSystem: false,
    ipsecTunnel: false,
    ipsecUser: false,
    ocspSigning: false
  };
  for (const block of inner_blocks) {
    const identifier = readObjectIdentifier(buffer, block);
    extKeyUsage[identifier.name] = true;
  }
  return extKeyUsage;
}
function _readSubjectPublicKey(buffer) {
  const block_info = readTag(buffer, 0);
  const blocks = readStruct(buffer, block_info);
  return {
    modulus: buffer.subarray(blocks[0].position + 1, blocks[0].position + blocks[0].length)
  };
}
function readExtension(buffer, block) {
  const inner_blocks = readStruct(buffer, block);
  if (inner_blocks.length === 3) {
    (0, import_assert3.default)(inner_blocks[1].tag === 1 /* BOOLEAN */);
    inner_blocks[1] = inner_blocks[2];
  }
  const identifier = readObjectIdentifier(buffer, inner_blocks[0]);
  const buf = getBlock(buffer, inner_blocks[1]);
  let value = null;
  switch (identifier.name) {
    case "subjectKeyIdentifier":
      value = formatBuffer2DigitHexWithColum(readOctetString(buffer, inner_blocks[1]));
      break;
    case "subjectAltName":
      value = _readSubjectAltNames(buf);
      break;
    case "authorityKeyIdentifier":
      value = _readAuthorityKeyIdentifier(buf);
      break;
    case "basicConstraints":
      value = readBasicConstraint2_5_29_19(buf, inner_blocks[1]);
      break;
    case "certExtension":
      value = "basicConstraints ( not implemented yet) " + buf.toString("hex");
      break;
    case "extKeyUsage":
      value = readExtKeyUsage(identifier.oid, buf);
      break;
    case "keyUsage":
      value = readKeyUsage(identifier.oid, buf);
      break;
    default:
      value = "Unknown " + identifier.name + buf.toString("hex");
  }
  return {
    identifier,
    value
  };
}
function _readExtensions(buffer, block) {
  (0, import_assert3.default)(block.tag === 163);
  let inner_blocks = readStruct(buffer, block);
  inner_blocks = readStruct(buffer, inner_blocks[0]);
  const extensions = inner_blocks.map((block2) => readExtension(buffer, block2));
  const result = {};
  for (const e of extensions) {
    result[e.identifier.name] = e.value;
  }
  return result;
}
function _readSubjectPublicKeyInfo(buffer, block) {
  const inner_blocks = readStruct(buffer, block);
  const algorithm = readAlgorithmIdentifier(buffer, inner_blocks[0]);
  const subjectPublicKey = readBitString(buffer, inner_blocks[1]);
  const data = subjectPublicKey.data;
  const values = readListOfInteger(data);
  return {
    algorithm: algorithm.identifier,
    keyLength: values[0].length - 1,
    subjectPublicKey: _readSubjectPublicKey(subjectPublicKey.data)
    //xx values: values,
    //xx values_length : values.map(function (a){ return a.length; })
  };
}
function _readSubjectECCPublicKeyInfo(buffer, block) {
  const inner_blocks = readStruct(buffer, block);
  const algorithm = readECCAlgorithmIdentifier(buffer, inner_blocks[0]);
  const subjectPublicKey = readBitString(buffer, inner_blocks[1]);
  const data = subjectPublicKey.data;
  return {
    algorithm: algorithm.identifier,
    keyLength: data.length - 1,
    subjectPublicKey: {
      modulus: data
    }
  };
}
function readTbsCertificate(buffer, block) {
  const blocks = readStruct(buffer, block);
  let version, serialNumber, signature, issuer, validity, subject, subjectFingerPrint, extensions;
  let subjectPublicKeyInfo;
  if (blocks.length === 6) {
    version = 1;
    serialNumber = formatBuffer2DigitHexWithColum(readLongIntegerValue(buffer, blocks[0]));
    signature = readAlgorithmIdentifier(buffer, blocks[1]);
    issuer = _readName(buffer, blocks[2]);
    validity = _readValidity(buffer, blocks[3]);
    subject = _readName(buffer, blocks[4]);
    subjectFingerPrint = formatBuffer2DigitHexWithColum(makeSHA1Thumbprint(getBlock(buffer, blocks[4])));
    subjectPublicKeyInfo = _readSubjectPublicKeyInfo(buffer, blocks[5]);
    extensions = null;
  } else {
    const version_block = findBlockAtIndex(blocks, 0);
    if (!version_block) {
      throw new Error("cannot find version block");
    }
    version = readVersionValue(buffer, version_block) + 1;
    serialNumber = formatBuffer2DigitHexWithColum(readLongIntegerValue(buffer, blocks[1]));
    signature = readAlgorithmIdentifier(buffer, blocks[2]);
    issuer = _readName(buffer, blocks[3]);
    validity = _readValidity(buffer, blocks[4]);
    subject = _readName(buffer, blocks[5]);
    subjectFingerPrint = formatBuffer2DigitHexWithColum(makeSHA1Thumbprint(getBlock(buffer, blocks[5])));
    const inner_block = readStruct(buffer, blocks[6]);
    const what_type = readAlgorithmIdentifier(buffer, inner_block[0]).identifier;
    switch (what_type) {
      case "rsaEncryption": {
        subjectPublicKeyInfo = _readSubjectPublicKeyInfo(buffer, blocks[6]);
        break;
      }
      case "ecPublicKey":
      default: {
        subjectPublicKeyInfo = _readSubjectECCPublicKeyInfo(buffer, blocks[6]);
        break;
      }
    }
    const extensionBlock = findBlockAtIndex(blocks, 3);
    if (!extensionBlock) {
      doDebug && console.log("X509 certificate is invalid : cannot find extension block version =" + version_block);
      extensions = null;
    } else {
      extensions = _readExtensions(buffer, extensionBlock);
    }
  }
  return {
    version,
    serialNumber,
    signature,
    issuer,
    validity,
    subject,
    subjectFingerPrint,
    subjectPublicKeyInfo,
    extensions
  };
}
function exploreCertificate(certificate) {
  (0, import_assert3.default)(Buffer.isBuffer(certificate));
  if (!certificate._exploreCertificate_cache) {
    const block_info = readTag(certificate, 0);
    const blocks = readStruct(certificate, block_info);
    certificate._exploreCertificate_cache = {
      tbsCertificate: readTbsCertificate(certificate, blocks[0]),
      signatureAlgorithm: readAlgorithmIdentifier(certificate, blocks[1]),
      signatureValue: readSignatureValue(certificate, blocks[2])
    };
  }
  return certificate._exploreCertificate_cache;
}
function split_der(certificateChain) {
  const certificate_chain = [];
  do {
    const block_info = readTag(certificateChain, 0);
    const length = block_info.position + block_info.length;
    const der_certificate = certificateChain.subarray(0, length);
    certificate_chain.push(der_certificate);
    certificateChain = certificateChain.subarray(length);
  } while (certificateChain.length > 0);
  return certificate_chain;
}
function combine_der(certificates) {
  for (const cert of certificates) {
    const b = split_der(cert);
    let sum = 0;
    b.forEach((block) => {
      const block_info = readTag(block, 0);
      (0, import_assert3.default)(block_info.position + block_info.length === block.length);
      sum += block.length;
    });
    (0, import_assert3.default)(sum === cert.length);
  }
  return Buffer.concat(certificates);
}

// source/crypto_utils.ts
var import_jsrsasign = __toESM(require("jsrsasign"));
var { hexy } = import_hexy.default;
var PEM_REGEX = /^(-----BEGIN (.*)-----\r?\n([/+=a-zA-Z0-9\r\n]*)\r?\n-----END \2-----\r?\n?)/gm;
var PEM_TYPE_REGEX = /^(-----BEGIN (.*)-----)/m;
function identifyPemType(rawKey) {
  if (Buffer.isBuffer(rawKey)) {
    rawKey = rawKey.toString("utf8");
  }
  const match = PEM_TYPE_REGEX.exec(rawKey);
  return !match ? void 0 : match[2];
}
function removeTrailingLF(str) {
  const tmp = str.replace(/(\r|\n)+$/m, "").replace(/\r\n/gm, "\n");
  return tmp;
}
function toPem(raw_key, pem) {
  (0, import_assert4.default)(raw_key, "expecting a key");
  (0, import_assert4.default)(typeof pem === "string");
  let pemType = identifyPemType(raw_key);
  if (pemType) {
    return Buffer.isBuffer(raw_key) ? removeTrailingLF(raw_key.toString("utf8")) : removeTrailingLF(raw_key);
  } else {
    pemType = pem;
    (0, import_assert4.default)(["CERTIFICATE REQUEST", "CERTIFICATE", "RSA PRIVATE KEY", "PUBLIC KEY", "X509 CRL"].indexOf(pemType) >= 0);
    let b = raw_key.toString("base64");
    let str = "-----BEGIN " + pemType + "-----\n";
    while (b.length) {
      str += b.substring(0, 64) + "\n";
      b = b.substring(64);
    }
    str += "-----END " + pemType + "-----";
    return str;
  }
}
function convertPEMtoDER(raw_key) {
  let match;
  let pemType;
  let base64str;
  const parts = [];
  PEM_REGEX.lastIndex = 0;
  while ((match = PEM_REGEX.exec(raw_key)) !== null) {
    pemType = match[2];
    base64str = match[3];
    base64str = base64str.replace(/\r?\n/g, "");
    parts.push(Buffer.from(base64str, "base64"));
  }
  return combine_der(parts);
}
function hexDump(buffer, width) {
  if (!buffer) {
    return "<>";
  }
  width = width || 32;
  if (buffer.length > 1024) {
    return hexy(buffer.subarray(0, 1024), { width, format: "twos" }) + "\n .... ( " + buffer.length + ")";
  } else {
    return hexy(buffer, { width, format: "twos" });
  }
}
function makeMessageChunkSignature(chunk, options) {
  const signer = (0, import_crypto.createSign)(options.algorithm);
  signer.update(chunk);
  const signature = signer.sign(options.privateKey.hidden);
  (0, import_assert4.default)(!options.signatureLength || signature.length === options.signatureLength);
  return signature;
}
function verifyMessageChunkSignature(blockToVerify, signature, options) {
  const verify = (0, import_crypto.createVerify)(options.algorithm);
  verify.update(blockToVerify);
  return verify.verify(options.publicKey, signature);
}
function makeSHA1Thumbprint(buffer) {
  return (0, import_crypto.createHash)("sha1").update(buffer).digest();
}
var RSA_PKCS1_OAEP_PADDING = import_constants.default.RSA_PKCS1_OAEP_PADDING;
var RSA_PKCS1_PADDING = import_constants.default.RSA_PKCS1_PADDING;
var PaddingAlgorithm = /* @__PURE__ */ ((PaddingAlgorithm2) => {
  PaddingAlgorithm2[PaddingAlgorithm2["RSA_PKCS1_OAEP_PADDING"] = 4] = "RSA_PKCS1_OAEP_PADDING";
  PaddingAlgorithm2[PaddingAlgorithm2["RSA_PKCS1_PADDING"] = 1] = "RSA_PKCS1_PADDING";
  return PaddingAlgorithm2;
})(PaddingAlgorithm || {});
(0, import_assert4.default)(4 /* RSA_PKCS1_OAEP_PADDING */ === import_constants.default.RSA_PKCS1_OAEP_PADDING);
(0, import_assert4.default)(1 /* RSA_PKCS1_PADDING */ === import_constants.default.RSA_PKCS1_PADDING);
function publicEncrypt_native(buffer, publicKey, algorithm) {
  if (algorithm === void 0) {
    algorithm = 4 /* RSA_PKCS1_OAEP_PADDING */;
  }
  return (0, import_crypto.publicEncrypt)(
    {
      key: publicKey,
      padding: algorithm
    },
    buffer
  );
}
function privateDecrypt_native(buffer, privateKey, algorithm) {
  if (algorithm === void 0) {
    algorithm = 4 /* RSA_PKCS1_OAEP_PADDING */;
  }
  try {
    return (0, import_crypto.privateDecrypt)(
      {
        key: privateKey.hidden,
        padding: algorithm
      },
      buffer
    );
  } catch (err) {
    return Buffer.alloc(1);
  }
}
var publicEncrypt = publicEncrypt_native;
var privateDecrypt = privateDecrypt_native;
function publicEncrypt_long(buffer, publicKey, blockSize, padding, paddingAlgorithm) {
  if (paddingAlgorithm === void 0) {
    paddingAlgorithm = 4 /* RSA_PKCS1_OAEP_PADDING */;
  }
  if (paddingAlgorithm === RSA_PKCS1_PADDING) {
    padding = padding || 11;
    if (padding !== 11) throw new Error("padding should be 11");
  } else if (paddingAlgorithm === RSA_PKCS1_OAEP_PADDING) {
    padding = padding || 42;
    if (padding !== 42) throw new Error("padding should be 42");
  } else {
    throw new Error("Invalid padding algorithm " + paddingAlgorithm);
  }
  const chunk_size = blockSize - padding;
  const nbBlocks = Math.ceil(buffer.length / chunk_size);
  const outputBuffer = createFastUninitializedBuffer(nbBlocks * blockSize);
  for (let i = 0; i < nbBlocks; i++) {
    const currentBlock = buffer.subarray(chunk_size * i, chunk_size * (i + 1));
    const encrypted_chunk = publicEncrypt(currentBlock, publicKey, paddingAlgorithm);
    if (encrypted_chunk.length !== blockSize) {
      throw new Error(`publicEncrypt_long unexpected chunk length ${encrypted_chunk.length}  expecting ${blockSize}`);
    }
    encrypted_chunk.copy(outputBuffer, i * blockSize);
  }
  return outputBuffer;
}
function privateDecrypt_long(buffer, privateKey, blockSize, paddingAlgorithm) {
  paddingAlgorithm = paddingAlgorithm || RSA_PKCS1_OAEP_PADDING;
  if (paddingAlgorithm !== RSA_PKCS1_PADDING && paddingAlgorithm !== RSA_PKCS1_OAEP_PADDING) {
    throw new Error("Invalid padding algorithm " + paddingAlgorithm);
  }
  const nbBlocks = Math.ceil(buffer.length / blockSize);
  const outputBuffer = createFastUninitializedBuffer(nbBlocks * blockSize);
  let total_length = 0;
  for (let i = 0; i < nbBlocks; i++) {
    const currentBlock = buffer.subarray(blockSize * i, Math.min(blockSize * (i + 1), buffer.length));
    const decrypted_buf = privateDecrypt(currentBlock, privateKey, paddingAlgorithm);
    decrypted_buf.copy(outputBuffer, total_length);
    total_length += decrypted_buf.length;
  }
  return outputBuffer.subarray(0, total_length);
}
function coerceCertificatePem(certificate) {
  if (Buffer.isBuffer(certificate)) {
    certificate = toPem(certificate, "CERTIFICATE");
  }
  (0, import_assert4.default)(typeof certificate === "string");
  return certificate;
}
function extractPublicKeyFromCertificateSync(certificate) {
  certificate = coerceCertificatePem(certificate);
  const key = import_jsrsasign.default.KEYUTIL.getKey(certificate);
  const publicKeyAsPem = import_jsrsasign.default.KEYUTIL.getPEM(key);
  (0, import_assert4.default)(typeof publicKeyAsPem === "string");
  return publicKeyAsPem;
}
function extractPublicKeyFromCertificate(certificate, callback) {
  let err1 = null;
  let keyPem;
  try {
    keyPem = extractPublicKeyFromCertificateSync(certificate);
  } catch (err) {
    err1 = err;
  }
  setImmediate(() => {
    callback(err1, keyPem);
  });
}

// source/explore_private_key.ts
function f(buffer, b) {
  return buffer.subarray(b.position + 1, b.position + b.length);
}
var doDebug2 = !!process.env.DEBUG;
function explorePrivateKey(privateKey2) {
  const privateKey1 = privateKey2.hidden;
  const privateKey = typeof privateKey1 === "string" ? convertPEMtoDER(privateKey1) : privateKey1.export({ format: "der", type: "pkcs1" });
  const block_info = readTag(privateKey, 0);
  const blocks = readStruct(privateKey, block_info);
  if (blocks.length === 9) {
    const version2 = f(privateKey, blocks[0]);
    const modulus2 = f(privateKey, blocks[1]);
    const publicExponent2 = f(privateKey, blocks[2]);
    const privateExponent2 = f(privateKey, blocks[3]);
    const prime12 = f(privateKey, blocks[4]);
    const prime22 = f(privateKey, blocks[5]);
    const exponent12 = f(privateKey, blocks[6]);
    const exponent22 = f(privateKey, blocks[7]);
    return {
      version: version2,
      modulus: modulus2,
      publicExponent: publicExponent2,
      privateExponent: privateExponent2,
      prime1: prime12,
      prime2: prime22,
      exponent1: exponent12,
      exponent2: exponent22
    };
  }
  if (doDebug2) {
    console.log("-------------------- private key:");
    console.log(block_info);
    console.log(
      blocks.map((b2) => ({
        tag: TagType[b2.tag] + " 0x" + b2.tag.toString(16),
        l: b2.length,
        p: b2.position,
        buff: privateKey.subarray(b2.position, b2.position + b2.length).toString("hex")
      }))
    );
  }
  const b = blocks[2];
  const bb = privateKey.subarray(b.position, b.position + b.length);
  const block_info1 = readTag(bb, 0);
  const blocks1 = readStruct(bb, block_info1);
  if (doDebug2) {
    console.log(
      blocks1.map((b2) => ({
        tag: TagType[b2.tag] + " 0x" + b2.tag.toString(16),
        l: b2.length,
        p: b2.position,
        buff: bb.subarray(b2.position, b2.position + b2.length).toString("hex")
      }))
    );
  }
  const version = f(bb, blocks1[0]);
  const modulus = f(bb, blocks1[1]);
  const publicExponent = f(bb, blocks1[2]);
  const privateExponent = f(bb, blocks1[3]);
  const prime1 = f(bb, blocks1[4]);
  const prime2 = f(bb, blocks1[5]);
  const exponent1 = f(bb, blocks1[6]);
  const exponent2 = f(bb, blocks1[7]);
  return {
    version,
    modulus,
    publicExponent,
    privateExponent,
    prime1,
    prime2,
    exponent1,
    exponent2
  };
}

// source/public_private_match.ts
function publicKeyAndPrivateKeyMatches(certificate, privateKey) {
  const i = exploreCertificate(certificate);
  const j = explorePrivateKey(privateKey);
  const modulus1 = i.tbsCertificate.subjectPublicKeyInfo.subjectPublicKey.modulus;
  const modulus2 = j.modulus;
  if (modulus1.length != modulus2.length) {
    return false;
  }
  return modulus1.toString("hex") === modulus2.toString("hex");
}
function certificateMatchesPrivateKeyPEM(certificate, privateKey, blockSize) {
  const initialBuffer = Buffer.from("Lorem Ipsum");
  const encryptedBuffer = publicEncrypt_long(initialBuffer, certificate, blockSize);
  const decryptedBuffer = privateDecrypt_long(encryptedBuffer, privateKey, blockSize);
  const finalString = decryptedBuffer.toString("utf-8");
  return initialBuffer.toString("utf-8") === finalString;
}
function certificateMatchesPrivateKey(certificate, privateKey) {
  const e = explorePrivateKey(privateKey);
  const blockSize = e.modulus.length;
  const certificatePEM = toPem(certificate, "CERTIFICATE");
  return certificateMatchesPrivateKeyPEM(certificatePEM, privateKey, blockSize);
}

// source/common.ts
var import_crypto2 = __toESM(require("crypto"));
var KeyObjectOrig = import_crypto2.default.KeyObject;
var { createPrivateKey: createPrivateKeyFromNodeJSCrypto } = import_crypto2.default;
function isKeyObject(mayBeKeyObject) {
  if (KeyObjectOrig) {
    return mayBeKeyObject instanceof KeyObjectOrig;
  }
  return typeof mayBeKeyObject === "object" && typeof mayBeKeyObject.type === "string";
}
var CertificatePurpose = /* @__PURE__ */ ((CertificatePurpose2) => {
  CertificatePurpose2[CertificatePurpose2["NotSpecified"] = 0] = "NotSpecified";
  CertificatePurpose2[CertificatePurpose2["ForCertificateAuthority"] = 1] = "ForCertificateAuthority";
  CertificatePurpose2[CertificatePurpose2["ForApplication"] = 2] = "ForApplication";
  CertificatePurpose2[CertificatePurpose2["ForUserAuthentication"] = 3] = "ForUserAuthentication";
  return CertificatePurpose2;
})(CertificatePurpose || {});

// source/crypto_utils2.ts
var import_assert5 = __toESM(require("assert"));
var import_jsrsasign2 = __toESM(require("jsrsasign"));
function rsaLengthPrivateKey(key) {
  const keyPem = typeof key.hidden === "string" ? key.hidden : key.hidden.export({ type: "pkcs1", format: "pem" }).toString();
  const a = import_jsrsasign2.default.KEYUTIL.getKey(keyPem);
  return a.n.toString(16).length / 2;
}
function toPem2(raw_key, pem) {
  if (raw_key.hidden) {
    return toPem2(raw_key.hidden, pem);
  }
  (0, import_assert5.default)(raw_key, "expecting a key");
  (0, import_assert5.default)(typeof pem === "string");
  if (isKeyObject(raw_key)) {
    const _raw_key = raw_key;
    if (pem === "RSA PRIVATE KEY") {
      return removeTrailingLF(_raw_key.export({ format: "pem", type: "pkcs1" }).toString());
    } else if (pem === "PRIVATE KEY") {
      return removeTrailingLF(_raw_key.export({ format: "pem", type: "pkcs8" }).toString());
    } else {
      throw new Error("Unsupported case!");
    }
  }
  return toPem(raw_key, pem);
}
function coercePrivateKeyPem(privateKey) {
  return toPem2(privateKey, "PRIVATE KEY");
}
function coercePublicKeyPem(publicKey) {
  if (isKeyObject(publicKey)) {
    return publicKey.export({ format: "pem", type: "spki" }).toString();
  }
  (0, import_assert5.default)(typeof publicKey === "string");
  return publicKey;
}
function coerceRsaPublicKeyPem(publicKey) {
  if (isKeyObject(publicKey)) {
    return publicKey.export({ format: "pem", type: "spki" }).toString();
  }
  (0, import_assert5.default)(typeof publicKey === "string");
  return publicKey;
}
function rsaLengthPublicKey(key) {
  key = coercePublicKeyPem(key);
  (0, import_assert5.default)(typeof key === "string");
  const a = import_jsrsasign2.default.KEYUTIL.getKey(key);
  return a.n.toString(16).length / 2;
}
function rsaLengthRsaPublicKey(key) {
  key = coerceRsaPublicKeyPem(key);
  (0, import_assert5.default)(typeof key === "string");
  const a = import_jsrsasign2.default.KEYUTIL.getKey(key);
  return a.n.toString(16).length / 2;
}

// source/derived_keys.ts
var import_assert7 = __toESM(require("assert"));
var import_crypto3 = require("crypto");

// source/explore_certificate.ts
var import_assert6 = __toESM(require("assert"));
function coerceCertificate(certificate) {
  if (typeof certificate === "string") {
    certificate = convertPEMtoDER(certificate);
  }
  (0, import_assert6.default)(Buffer.isBuffer(certificate));
  return certificate;
}
function exploreCertificateInfo(certificate) {
  certificate = coerceCertificate(certificate);
  const certInfo = exploreCertificate(certificate);
  const data = {
    publicKeyLength: certInfo.tbsCertificate.subjectPublicKeyInfo.keyLength,
    notBefore: certInfo.tbsCertificate.validity.notBefore,
    notAfter: certInfo.tbsCertificate.validity.notAfter,
    publicKey: certInfo.tbsCertificate.subjectPublicKeyInfo.subjectPublicKey,
    subject: certInfo.tbsCertificate.subject
  };
  if (!(data.publicKeyLength === 512 || data.publicKeyLength === 384 || data.publicKeyLength === 256 || data.publicKeyLength === 128)) {
    throw new Error("Invalid public key length (expecting 128,256,384 or 512)" + data.publicKeyLength);
  }
  return data;
}

// source/derived_keys.ts
function HMAC_HASH(sha1or256, secret, message) {
  return (0, import_crypto3.createHmac)(sha1or256, secret).update(message).digest();
}
function plus(buf1, buf2) {
  return Buffer.concat([buf1, buf2]);
}
function makePseudoRandomBuffer(secret, seed, minLength, sha1or256) {
  (0, import_assert7.default)(Buffer.isBuffer(seed));
  (0, import_assert7.default)(sha1or256 === "SHA1" || sha1or256 === "SHA256");
  const a = [];
  a[0] = seed;
  let index = 1;
  let p_hash = createFastUninitializedBuffer(0);
  while (p_hash.length <= minLength) {
    a[index] = HMAC_HASH(sha1or256, secret, a[index - 1]);
    p_hash = plus(p_hash, HMAC_HASH(sha1or256, secret, plus(a[index], seed)));
    index += 1;
  }
  return p_hash.subarray(0, minLength);
}
function computeDerivedKeys(secret, seed, options) {
  (0, import_assert7.default)(Number.isFinite(options.signatureLength));
  (0, import_assert7.default)(Number.isFinite(options.encryptingKeyLength));
  (0, import_assert7.default)(Number.isFinite(options.encryptingBlockSize));
  (0, import_assert7.default)(typeof options.algorithm === "string");
  options.sha1or256 = options.sha1or256 || "SHA1";
  (0, import_assert7.default)(typeof options.sha1or256 === "string");
  const offset1 = options.signingKeyLength;
  const offset2 = offset1 + options.encryptingKeyLength;
  const minLength = offset2 + options.encryptingBlockSize;
  const buf = makePseudoRandomBuffer(secret, seed, minLength, options.sha1or256);
  return {
    signatureLength: options.signatureLength,
    signingKeyLength: options.signingKeyLength,
    encryptingKeyLength: options.encryptingKeyLength,
    encryptingBlockSize: options.encryptingBlockSize,
    algorithm: options.algorithm,
    sha1or256: options.sha1or256,
    signingKey: buf.subarray(0, offset1),
    encryptingKey: buf.subarray(offset1, offset2),
    initializationVector: buf.subarray(offset2, minLength)
  };
}
function reduceLength(buffer, byteToRemove) {
  return buffer.subarray(0, buffer.length - byteToRemove);
}
function removePadding(buffer) {
  const nbPaddingBytes = buffer.readUInt8(buffer.length - 1) + 1;
  return reduceLength(buffer, nbPaddingBytes);
}
function verifyChunkSignature(chunk, options) {
  (0, import_assert7.default)(Buffer.isBuffer(chunk));
  let signatureLength = options.signatureLength || 0;
  if (signatureLength === 0) {
    const cert = exploreCertificateInfo(options.publicKey);
    signatureLength = cert.publicKeyLength || 0;
  }
  const block_to_verify = chunk.subarray(0, chunk.length - signatureLength);
  const signature = chunk.subarray(chunk.length - signatureLength);
  return verifyMessageChunkSignature(block_to_verify, signature, options);
}
function computePaddingFooter(buffer, derivedKeys) {
  (0, import_assert7.default)(Object.prototype.hasOwnProperty.call(derivedKeys, "encryptingBlockSize"));
  const paddingSize = derivedKeys.encryptingBlockSize - (buffer.length + 1) % derivedKeys.encryptingBlockSize;
  const padding = createFastUninitializedBuffer(paddingSize + 1);
  padding.fill(paddingSize);
  return padding;
}
function derivedKeys_algorithm(derivedKeys) {
  (0, import_assert7.default)(Object.prototype.hasOwnProperty.call(derivedKeys, "algorithm"));
  const algorithm = derivedKeys.algorithm || "aes-128-cbc";
  (0, import_assert7.default)(algorithm === "aes-128-cbc" || algorithm === "aes-256-cbc");
  return algorithm;
}
function encryptBufferWithDerivedKeys(buffer, derivedKeys) {
  const algorithm = derivedKeys_algorithm(derivedKeys);
  const key = derivedKeys.encryptingKey;
  const initVector = derivedKeys.initializationVector;
  const cipher = (0, import_crypto3.createCipheriv)(algorithm, key, initVector);
  cipher.setAutoPadding(false);
  const encrypted_chunks = [];
  encrypted_chunks.push(cipher.update(buffer));
  encrypted_chunks.push(cipher.final());
  return Buffer.concat(encrypted_chunks);
}
function decryptBufferWithDerivedKeys(buffer, derivedKeys) {
  const algorithm = derivedKeys_algorithm(derivedKeys);
  const key = derivedKeys.encryptingKey;
  const initVector = derivedKeys.initializationVector;
  const cipher = (0, import_crypto3.createDecipheriv)(algorithm, key, initVector);
  cipher.setAutoPadding(false);
  const decrypted_chunks = [];
  decrypted_chunks.push(cipher.update(buffer));
  decrypted_chunks.push(cipher.final());
  return Buffer.concat(decrypted_chunks);
}
function makeMessageChunkSignatureWithDerivedKeys(message, derivedKeys) {
  (0, import_assert7.default)(Buffer.isBuffer(message));
  (0, import_assert7.default)(Buffer.isBuffer(derivedKeys.signingKey));
  (0, import_assert7.default)(typeof derivedKeys.sha1or256 === "string");
  (0, import_assert7.default)(derivedKeys.sha1or256 === "SHA1" || derivedKeys.sha1or256 === "SHA256");
  const signature = (0, import_crypto3.createHmac)(derivedKeys.sha1or256, derivedKeys.signingKey).update(message).digest();
  (0, import_assert7.default)(signature.length === derivedKeys.signatureLength);
  return signature;
}
function verifyChunkSignatureWithDerivedKeys(chunk, derivedKeys) {
  const message = chunk.subarray(0, chunk.length - derivedKeys.signatureLength);
  const expectedSignature = chunk.subarray(chunk.length - derivedKeys.signatureLength);
  const computedSignature = makeMessageChunkSignatureWithDerivedKeys(message, derivedKeys);
  return computedSignature.toString("hex") === expectedSignature.toString("hex");
}

// source/explore_asn1.ts
function t(tag) {
  return TagType[tag];
}
function bi(blockInfo, depth) {
  const indent = "  ".repeat(depth);
  const hl = blockInfo.position - blockInfo.start;
  return `${blockInfo.start.toString().padStart(5, " ")}:d=${depth} hl=${hl.toString().padEnd(3, " ")}  l=${blockInfo.length.toString().padStart(6, " ")} ${blockInfo.tag.toString(16).padEnd(2, " ")} ${indent} ${t(blockInfo.tag)}`;
}
function exploreAsn1(buffer) {
  console.log(hexDump(buffer));
  function dump(offset, depth) {
    const blockInfo = readTag(buffer, offset);
    dumpBlock(blockInfo, depth);
    function dumpBlock(blockInfo2, depth2) {
      console.log(bi(blockInfo2, depth2));
      if (blockInfo2.tag === 48 /* SEQUENCE */ || blockInfo2.tag === 49 /* SET */ || blockInfo2.tag >= 160 /* CONTEXT_SPECIFIC0 */) {
        const blocks = readStruct(buffer, blockInfo2);
        for (const block of blocks) {
          dumpBlock(block, depth2 + 1);
        }
      }
    }
  }
  dump(0, 0);
}

// source/explore_certificate_revocation_list.ts
function readNameForCrl(buffer, block) {
  return readDirectoryName(buffer, block);
}
function _readTbsCertList(buffer, blockInfo) {
  const blocks = readStruct(buffer, blockInfo);
  const hasOptionalVersion = blocks[0].tag === 2 /* INTEGER */;
  if (hasOptionalVersion) {
    const version = readIntegerValue(buffer, blocks[0]);
    const signature = readAlgorithmIdentifier(buffer, blocks[1]);
    const issuer = readNameForCrl(buffer, blocks[2]);
    const issuerFingerprint = formatBuffer2DigitHexWithColum(makeSHA1Thumbprint(getBlock(buffer, blocks[2])));
    const thisUpdate = readTime(buffer, blocks[3]);
    const nextUpdate = readTime(buffer, blocks[4]);
    const revokedCertificates = [];
    if (blocks[5] && blocks[5].tag < 128) {
      const list = readStruct(buffer, blocks[5]);
      for (const r of list) {
        const rr = readStruct(buffer, r);
        const userCertificate = formatBuffer2DigitHexWithColum(readLongIntegerValue(buffer, rr[0]));
        const revocationDate = readTime(buffer, rr[1]);
        revokedCertificates.push({
          revocationDate,
          userCertificate
        });
      }
    }
    const ext0 = findBlockAtIndex(blocks, 0);
    return { issuer, issuerFingerprint, thisUpdate, nextUpdate, signature, revokedCertificates };
  } else {
    const signature = readAlgorithmIdentifier(buffer, blocks[0]);
    const issuer = readNameForCrl(buffer, blocks[1]);
    const issuerFingerprint = formatBuffer2DigitHexWithColum(makeSHA1Thumbprint(getBlock(buffer, blocks[1])));
    const thisUpdate = readTime(buffer, blocks[2]);
    const nextUpdate = readTime(buffer, blocks[3]);
    const revokedCertificates = [];
    if (blocks[4] && blocks[4].tag < 128) {
      const list = readStruct(buffer, blocks[4]);
      for (const r of list) {
        const rr = readStruct(buffer, r);
        const userCertificate = formatBuffer2DigitHexWithColum(readLongIntegerValue(buffer, rr[0]));
        const revocationDate = readTime(buffer, rr[1]);
        revokedCertificates.push({
          revocationDate,
          userCertificate
        });
      }
    }
    return { issuer, issuerFingerprint, thisUpdate, nextUpdate, signature, revokedCertificates };
  }
}
function exploreCertificateRevocationList(crl) {
  const blockInfo = readTag(crl, 0);
  const blocks = readStruct(crl, blockInfo);
  const tbsCertList = _readTbsCertList(crl, blocks[0]);
  const signatureAlgorithm = readAlgorithmIdentifier(crl, blocks[1]);
  const signatureValue = readSignatureValueBin(crl, blocks[2]);
  return { tbsCertList, signatureAlgorithm, signatureValue };
}

// source/explore_certificate_signing_request.ts
function _readExtensionRequest(buffer) {
  const block = readTag(buffer, 0);
  const inner_blocks = readStruct(buffer, block);
  const extensions = inner_blocks.map((block1) => readExtension(buffer, block1));
  const result = {};
  for (const e of extensions) {
    result[e.identifier.name] = e.value;
  }
  const { basicConstraints, keyUsage, subjectAltName } = result;
  return { basicConstraints, keyUsage, subjectAltName };
}
function readCertificationRequestInfo(buffer, block) {
  const blocks = readStruct(buffer, block);
  if (blocks.length === 4) {
    const extensionRequestBlock = findBlockAtIndex(blocks, 0);
    if (!extensionRequestBlock) {
      throw new Error("cannot find extensionRequest block");
    }
    const blocks1 = readStruct(buffer, extensionRequestBlock);
    const blocks2 = readStruct(buffer, blocks1[0]);
    const identifier = readObjectIdentifier(buffer, blocks2[0]);
    if (identifier.name !== "extensionRequest") {
      throw new Error(" Cannot find extension Request in ASN1 block");
    }
    const buf = getBlock(buffer, blocks2[1]);
    const extensionRequest = _readExtensionRequest(buf);
    return { extensionRequest };
  }
  throw new Error("Invalid CSR or ");
}
function exploreCertificateSigningRequest(crl) {
  const blockInfo = readTag(crl, 0);
  const blocks = readStruct(crl, blockInfo);
  const csrInfo = readCertificationRequestInfo(crl, blocks[0]);
  return csrInfo;
}

// source/make_private_key_from_pem.ts
function makePrivateKeyFromPem(privateKeyInPem) {
  return { hidden: privateKeyInPem };
}

// source/make_private_key_thumbprint.ts
function makePrivateKeyThumbPrint(privateKey) {
  return Buffer.alloc(0);
}

// source/subject.ts
var _keys = {
  C: "country",
  CN: "commonName",
  DC: "domainComponent",
  L: "locality",
  O: "organization",
  OU: "organizationalUnit",
  ST: "state"
};
var enquoteIfNecessary = (str) => {
  str = str.replace(/"/g, "\u201D");
  return str.match(/\/|=/) ? `"${str}"` : str;
};
var unquote = (str) => str.replace(/"/gm, "");
var unquote2 = (str) => {
  if (!str) return str;
  const m = str.match(/^"(.*)"$/);
  return m ? m[1] : str;
};
var Subject = class _Subject {
  constructor(options) {
    if (typeof options === "string") {
      options = _Subject.parse(options);
    }
    this.commonName = unquote2(options.commonName);
    this.organization = unquote2(options.organization);
    this.organizationalUnit = unquote2(options.organizationalUnit);
    this.locality = unquote2(options.locality);
    this.state = unquote2(options.state);
    this.country = unquote2(options.country);
    this.domainComponent = unquote2(options.domainComponent);
  }
  static parse(str) {
    const elements = str.split(/\/(?=[^/]*?=)/);
    const options = {};
    elements.forEach((element) => {
      if (element.length === 0) {
        return;
      }
      const s = element.split("=");
      if (s.length !== 2) {
        throw new Error("invalid format for " + element);
      }
      const longName = _keys[s[0]];
      if (!longName) {
        throw new Error("Invalid field found in subject name " + s[0]);
      }
      const value = s[1];
      options[longName] = unquote(Buffer.from(value, "ascii").toString("utf8"));
    });
    return options;
  }
  toStringInternal(sep) {
    const tmp = [];
    if (this.country) {
      tmp.push("C=" + enquoteIfNecessary(this.country));
    }
    if (this.state) {
      tmp.push("ST=" + enquoteIfNecessary(this.state));
    }
    if (this.locality) {
      tmp.push("L=" + enquoteIfNecessary(this.locality));
    }
    if (this.organization) {
      tmp.push("O=" + enquoteIfNecessary(this.organization));
    }
    if (this.organizationalUnit) {
      tmp.push("OU=" + enquoteIfNecessary(this.organizationalUnit));
    }
    if (this.commonName) {
      tmp.push("CN=" + enquoteIfNecessary(this.commonName));
    }
    if (this.domainComponent) {
      tmp.push("DC=" + enquoteIfNecessary(this.domainComponent));
    }
    return tmp.join(sep);
  }
  toStringForOPCUA() {
    return this.toStringInternal("/");
  }
  toString() {
    const t2 = this.toStringForOPCUA();
    return t2 ? "/" + t2 : t2;
  }
};

// source/verify_certificate_signature.ts
var import_crypto4 = require("crypto");
function verifyCertificateOrClrSignature(certificateOrCrl, parentCertificate) {
  const block_info = readTag(certificateOrCrl, 0);
  const blocks = readStruct(certificateOrCrl, block_info);
  const bufferToBeSigned = certificateOrCrl.subarray(block_info.position, blocks[1].position - 2);
  const signatureAlgorithm = readAlgorithmIdentifier(certificateOrCrl, blocks[1]);
  const signatureValue = readSignatureValueBin(certificateOrCrl, blocks[2]);
  const p = split_der(parentCertificate)[0];
  const certPem = toPem(p, "CERTIFICATE");
  const verify = (0, import_crypto4.createVerify)(signatureAlgorithm.identifier);
  verify.update(bufferToBeSigned);
  verify.end();
  return verify.verify(certPem, signatureValue);
}
function verifyCertificateSignature(certificate, parentCertificate) {
  return verifyCertificateOrClrSignature(certificate, parentCertificate);
}
function verifyCertificateRevocationListSignature(certificateRevocationList, parentCertificate) {
  return verifyCertificateOrClrSignature(certificateRevocationList, parentCertificate);
}
async function verifyCertificateChain(certificateChain) {
  for (let index = 1; index < certificateChain.length; index++) {
    const cert = certificateChain[index - 1];
    const certParent = certificateChain[index];
    const certParentInfo = exploreCertificate(certParent);
    const keyUsage = certParentInfo.tbsCertificate.extensions.keyUsage;
    if (!keyUsage.keyCertSign) {
      return {
        status: "BadCertificateIssuerUseNotAllowed",
        reason: "One of the certificate in the chain has not keyUsage set for Certificate Signing"
      };
    }
    const parentSignChild = verifyCertificateSignature(cert, certParent);
    if (!parentSignChild) {
      return {
        status: "BadCertificateInvalid",
        reason: "One of the certificate in the chain is not signing the previous certificate"
      };
    }
    const certInfo = exploreCertificate(cert);
    if (!certInfo.tbsCertificate.extensions) {
      return {
        status: "BadCertificateInvalid",
        reason: "Cannot find X409 Extension 3 in certificate"
      };
    }
    if (!certParentInfo.tbsCertificate.extensions || !certInfo.tbsCertificate.extensions.authorityKeyIdentifier) {
      return {
        status: "BadCertificateInvalid",
        reason: "Cannot find X409 Extension 3 in certificate (parent)"
      };
    }
    if (certParentInfo.tbsCertificate.extensions.subjectKeyIdentifier !== certInfo.tbsCertificate.extensions.authorityKeyIdentifier.keyIdentifier) {
      return {
        status: "BadCertificateInvalid",
        reason: "subjectKeyIdentifier authorityKeyIdentifier in child certificate do not match subjectKeyIdentifier of parent certificate"
      };
    }
  }
  return {
    status: "Good",
    reason: `certificate chain is valid(length = ${certificateChain.length})`
  };
}

// source/x509/_crypto.ts
var x509 = __toESM(require("@peculiar/x509"));
var import_webcrypto = require("@peculiar/webcrypto");
var import_crypto5 = __toESM(require("crypto"));
var x5092 = __toESM(require("@peculiar/x509"));
var doDebug3 = false;
var _crypto;
var ignoreCrypto = process.env.IGNORE_SUBTLE_FROM_CRYPTO;
if (typeof window === "undefined") {
  _crypto = import_crypto5.default;
  if (!_crypto?.subtle || ignoreCrypto) {
    _crypto = new import_webcrypto.Crypto();
    doDebug3 && console.warn("using @peculiar/webcrypto");
  } else {
    doDebug3 && console.warn("using nodejs crypto (native)");
  }
  x509.cryptoProvider.set(_crypto);
} else {
  doDebug3 && console.warn("using browser crypto (native)");
  _crypto = crypto;
  x509.cryptoProvider.set(crypto);
}
function getCrypto() {
  return _crypto || crypto || require("crypto");
}

// source/x509/create_key_pair.ts
async function generateKeyPair(modulusLength = 2048) {
  const crypto3 = getCrypto();
  const alg = {
    name: "RSASSA-PKCS1-v1_5",
    hash: { name: "SHA-256" },
    publicExponent: new Uint8Array([1, 0, 1]),
    modulusLength
  };
  const keys = await crypto3.subtle.generateKey(alg, true, ["sign", "verify"]);
  return keys;
}
async function generatePrivateKey(modulusLength = 2048) {
  return (await generateKeyPair(modulusLength)).privateKey;
}
async function privateKeyToPEM(privateKey) {
  const crypto3 = getCrypto();
  const privDer = await crypto3.subtle.exportKey("pkcs8", privateKey);
  const privPem = x5092.PemConverter.encode(privDer, "PRIVATE KEY");
  return { privPem, privDer };
}
async function derToPrivateKey(privDer) {
  const crypto3 = getCrypto();
  return await crypto3.subtle.importKey(
    "pkcs8",
    privDer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: { name: "SHA-256" }
    },
    true,
    [
      "sign"
      // "encrypt",
      // "decrypt",
      // "verify",
      //    "wrapKey",
      //    "unwrapKey",
      //    "deriveKey",
      //    "deriveBits"
    ]
  );
}
async function pemToPrivateKey(pem) {
  const privDer = x5092.PemConverter.decode(pem);
  return derToPrivateKey(privDer[0]);
}

// source/x509/coerce_private_key.ts
var crypto2 = getCrypto();
var doDebug4 = false;
function coercePEMorDerToPrivateKey(privateKeyInDerOrPem) {
  if (typeof privateKeyInDerOrPem === "string") {
    const hidden = createPrivateKeyFromNodeJSCrypto(privateKeyInDerOrPem);
    return { hidden };
  }
  throw new Error("not implemented");
}
async function _coercePrivateKey(privateKey) {
  const KeyObject4 = crypto2.KeyObject;
  if (Buffer.isBuffer(privateKey)) {
    const privateKey1 = await derToPrivateKey(privateKey);
    return KeyObject4.from(privateKey1);
  } else if (typeof privateKey === "string") {
    try {
      const privateKey1 = await pemToPrivateKey(privateKey);
      return KeyObject4.from(privateKey1);
    } catch (err) {
      doDebug4 && console.log(privateKey);
      throw err;
    }
  } else if (privateKey instanceof KeyObject4) {
    return privateKey;
  }
  throw new Error("Invalid privateKey");
}

// source/x509/_get_attributes.ts
var keyUsageApplication = x5092.KeyUsageFlags.keyEncipherment | x5092.KeyUsageFlags.nonRepudiation | x5092.KeyUsageFlags.dataEncipherment | x5092.KeyUsageFlags.keyCertSign | x5092.KeyUsageFlags.digitalSignature;
var keyUsageCA = x5092.KeyUsageFlags.keyCertSign | x5092.KeyUsageFlags.cRLSign;
function getAttributes(purpose) {
  let basicConstraints;
  let keyUsageExtension = [];
  let usages;
  let nsComment;
  let extension;
  switch (purpose) {
    case 1 /* ForCertificateAuthority */:
      extension = "v3_ca";
      basicConstraints = new x5092.BasicConstraintsExtension(true, void 0, false);
      usages = keyUsageCA;
      keyUsageExtension = [];
      nsComment = "Self-signed certificate for CA generated by Node-OPCUA Certificate utility V2";
      break;
    case 2 /* ForApplication */:
    case 3 /* ForUserAuthentication */:
    default:
      extension = "v3_selfsigned";
      basicConstraints = new x5092.BasicConstraintsExtension(false, void 0, true);
      usages = keyUsageApplication;
      keyUsageExtension = [x5092.ExtendedKeyUsage.serverAuth, x5092.ExtendedKeyUsage.clientAuth];
      nsComment = "Self-signed certificate generated by Node-OPCUA Certificate utility V2";
      break;
  }
  return { nsComment, basicConstraints, keyUsageExtension, usages };
}

// source/x509/_build_public_key.ts
async function buildPublicKey(privateKey) {
  const crypto3 = getCrypto();
  const jwk = await crypto3.subtle.exportKey("jwk", privateKey);
  delete jwk.d;
  delete jwk.dp;
  delete jwk.dq;
  delete jwk.q;
  delete jwk.qi;
  jwk.key_ops = [
    "encrypt",
    "sign"
    // "wrapKey"
  ];
  const publicKey = await crypto3.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } }, true, [
    //   "encrypt",
    //     "sign",
    // "wrapKey",
  ]);
  return publicKey;
}

// source/x509/create_certificate_signing_request.ts
async function createCertificateSigningRequest({
  privateKey,
  subject,
  dns,
  ip,
  applicationUri,
  purpose
}) {
  const crypto3 = getCrypto();
  const modulusLength = 2048;
  const alg = {
    name: "RSASSA-PKCS1-v1_5",
    hash: { name: "SHA-256" },
    publicExponent: new Uint8Array([1, 0, 1]),
    modulusLength
  };
  const publicKey = await buildPublicKey(privateKey);
  const keys = {
    privateKey,
    publicKey
  };
  const alternativeNameExtensions = [];
  dns && dns.forEach((d) => alternativeNameExtensions.push({ type: "dns", value: d }));
  ip && ip.forEach((d) => alternativeNameExtensions.push({ type: "ip", value: d }));
  applicationUri && alternativeNameExtensions.push({ type: "url", value: applicationUri });
  const { basicConstraints, usages } = getAttributes(purpose);
  const s = new Subject(subject || "");
  const s1 = s.toStringInternal(", ");
  const name = s1;
  const csr = await x5092.Pkcs10CertificateRequestGenerator.create(
    {
      name,
      keys,
      signingAlgorithm: alg,
      extensions: [
        basicConstraints,
        new x5092.KeyUsagesExtension(usages, true),
        new x5092.SubjectAlternativeNameExtension(alternativeNameExtensions)
      ]
    },
    crypto3
  );
  return { csr: csr.toString("pem"), der: csr };
}

// ../../node_modules/asn1js/build/index.es.js
var index_es_exports = {};
__export(index_es_exports, {
  Any: () => Any,
  BaseBlock: () => BaseBlock,
  BaseStringBlock: () => BaseStringBlock,
  BitString: () => BitString,
  BmpString: () => BmpString,
  Boolean: () => Boolean,
  CharacterString: () => CharacterString,
  Choice: () => Choice,
  Constructed: () => Constructed,
  DATE: () => DATE,
  DateTime: () => DateTime,
  Duration: () => Duration,
  EndOfContent: () => EndOfContent,
  Enumerated: () => Enumerated,
  GeneralString: () => GeneralString,
  GeneralizedTime: () => GeneralizedTime,
  GraphicString: () => GraphicString,
  HexBlock: () => HexBlock,
  IA5String: () => IA5String,
  Integer: () => Integer,
  Null: () => Null,
  NumericString: () => NumericString,
  ObjectIdentifier: () => ObjectIdentifier,
  OctetString: () => OctetString,
  Primitive: () => Primitive,
  PrintableString: () => PrintableString,
  RawData: () => RawData,
  RelativeObjectIdentifier: () => RelativeObjectIdentifier,
  Repeated: () => Repeated,
  Sequence: () => Sequence,
  Set: () => Set,
  TIME: () => TIME,
  TeletexString: () => TeletexString,
  TimeOfDay: () => TimeOfDay,
  UTCTime: () => UTCTime,
  UniversalString: () => UniversalString,
  Utf8String: () => Utf8String,
  ValueBlock: () => ValueBlock,
  VideotexString: () => VideotexString,
  ViewWriter: () => ViewWriter,
  VisibleString: () => VisibleString,
  compareSchema: () => compareSchema,
  fromBER: () => fromBER,
  verifySchema: () => verifySchema
});

// ../../node_modules/pvtsutils/build/index.es.js
var ARRAY_BUFFER_NAME = "[object ArrayBuffer]";
var BufferSourceConverter = class _BufferSourceConverter {
  static isArrayBuffer(data) {
    return Object.prototype.toString.call(data) === ARRAY_BUFFER_NAME;
  }
  static toArrayBuffer(data) {
    if (this.isArrayBuffer(data)) {
      return data;
    }
    if (data.byteLength === data.buffer.byteLength) {
      return data.buffer;
    }
    if (data.byteOffset === 0 && data.byteLength === data.buffer.byteLength) {
      return data.buffer;
    }
    return this.toUint8Array(data.buffer).slice(data.byteOffset, data.byteOffset + data.byteLength).buffer;
  }
  static toUint8Array(data) {
    return this.toView(data, Uint8Array);
  }
  static toView(data, type) {
    if (data.constructor === type) {
      return data;
    }
    if (this.isArrayBuffer(data)) {
      return new type(data);
    }
    if (this.isArrayBufferView(data)) {
      return new type(data.buffer, data.byteOffset, data.byteLength);
    }
    throw new TypeError("The provided value is not of type '(ArrayBuffer or ArrayBufferView)'");
  }
  static isBufferSource(data) {
    return this.isArrayBufferView(data) || this.isArrayBuffer(data);
  }
  static isArrayBufferView(data) {
    return ArrayBuffer.isView(data) || data && this.isArrayBuffer(data.buffer);
  }
  static isEqual(a, b) {
    const aView = _BufferSourceConverter.toUint8Array(a);
    const bView = _BufferSourceConverter.toUint8Array(b);
    if (aView.length !== bView.byteLength) {
      return false;
    }
    for (let i = 0; i < aView.length; i++) {
      if (aView[i] !== bView[i]) {
        return false;
      }
    }
    return true;
  }
  static concat(...args) {
    let buffers;
    if (Array.isArray(args[0]) && !(args[1] instanceof Function)) {
      buffers = args[0];
    } else if (Array.isArray(args[0]) && args[1] instanceof Function) {
      buffers = args[0];
    } else {
      if (args[args.length - 1] instanceof Function) {
        buffers = args.slice(0, args.length - 1);
      } else {
        buffers = args;
      }
    }
    let size = 0;
    for (const buffer of buffers) {
      size += buffer.byteLength;
    }
    const res = new Uint8Array(size);
    let offset = 0;
    for (const buffer of buffers) {
      const view = this.toUint8Array(buffer);
      res.set(view, offset);
      offset += view.length;
    }
    if (args[args.length - 1] instanceof Function) {
      return this.toView(res, args[args.length - 1]);
    }
    return res.buffer;
  }
};
var STRING_TYPE = "string";
var HEX_REGEX = /^[0-9a-f]+$/i;
var BASE64_REGEX = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
var BASE64URL_REGEX = /^[a-zA-Z0-9-_]+$/;
var Utf8Converter = class {
  static fromString(text) {
    const s = unescape(encodeURIComponent(text));
    const uintArray = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) {
      uintArray[i] = s.charCodeAt(i);
    }
    return uintArray.buffer;
  }
  static toString(buffer) {
    const buf = BufferSourceConverter.toUint8Array(buffer);
    let encodedString = "";
    for (let i = 0; i < buf.length; i++) {
      encodedString += String.fromCharCode(buf[i]);
    }
    const decodedString = decodeURIComponent(escape(encodedString));
    return decodedString;
  }
};
var Utf16Converter = class {
  static toString(buffer, littleEndian = false) {
    const arrayBuffer = BufferSourceConverter.toArrayBuffer(buffer);
    const dataView = new DataView(arrayBuffer);
    let res = "";
    for (let i = 0; i < arrayBuffer.byteLength; i += 2) {
      const code = dataView.getUint16(i, littleEndian);
      res += String.fromCharCode(code);
    }
    return res;
  }
  static fromString(text, littleEndian = false) {
    const res = new ArrayBuffer(text.length * 2);
    const dataView = new DataView(res);
    for (let i = 0; i < text.length; i++) {
      dataView.setUint16(i * 2, text.charCodeAt(i), littleEndian);
    }
    return res;
  }
};
var Convert = class _Convert {
  static isHex(data) {
    return typeof data === STRING_TYPE && HEX_REGEX.test(data);
  }
  static isBase64(data) {
    return typeof data === STRING_TYPE && BASE64_REGEX.test(data);
  }
  static isBase64Url(data) {
    return typeof data === STRING_TYPE && BASE64URL_REGEX.test(data);
  }
  static ToString(buffer, enc = "utf8") {
    const buf = BufferSourceConverter.toUint8Array(buffer);
    switch (enc.toLowerCase()) {
      case "utf8":
        return this.ToUtf8String(buf);
      case "binary":
        return this.ToBinary(buf);
      case "hex":
        return this.ToHex(buf);
      case "base64":
        return this.ToBase64(buf);
      case "base64url":
        return this.ToBase64Url(buf);
      case "utf16le":
        return Utf16Converter.toString(buf, true);
      case "utf16":
      case "utf16be":
        return Utf16Converter.toString(buf);
      default:
        throw new Error(`Unknown type of encoding '${enc}'`);
    }
  }
  static FromString(str, enc = "utf8") {
    if (!str) {
      return new ArrayBuffer(0);
    }
    switch (enc.toLowerCase()) {
      case "utf8":
        return this.FromUtf8String(str);
      case "binary":
        return this.FromBinary(str);
      case "hex":
        return this.FromHex(str);
      case "base64":
        return this.FromBase64(str);
      case "base64url":
        return this.FromBase64Url(str);
      case "utf16le":
        return Utf16Converter.fromString(str, true);
      case "utf16":
      case "utf16be":
        return Utf16Converter.fromString(str);
      default:
        throw new Error(`Unknown type of encoding '${enc}'`);
    }
  }
  static ToBase64(buffer) {
    const buf = BufferSourceConverter.toUint8Array(buffer);
    if (typeof btoa !== "undefined") {
      const binary = this.ToString(buf, "binary");
      return btoa(binary);
    } else {
      return Buffer.from(buf).toString("base64");
    }
  }
  static FromBase64(base64) {
    const formatted = this.formatString(base64);
    if (!formatted) {
      return new ArrayBuffer(0);
    }
    if (!_Convert.isBase64(formatted)) {
      throw new TypeError("Argument 'base64Text' is not Base64 encoded");
    }
    if (typeof atob !== "undefined") {
      return this.FromBinary(atob(formatted));
    } else {
      return new Uint8Array(Buffer.from(formatted, "base64")).buffer;
    }
  }
  static FromBase64Url(base64url) {
    const formatted = this.formatString(base64url);
    if (!formatted) {
      return new ArrayBuffer(0);
    }
    if (!_Convert.isBase64Url(formatted)) {
      throw new TypeError("Argument 'base64url' is not Base64Url encoded");
    }
    return this.FromBase64(this.Base64Padding(formatted.replace(/\-/g, "+").replace(/\_/g, "/")));
  }
  static ToBase64Url(data) {
    return this.ToBase64(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
  }
  static FromUtf8String(text, encoding = _Convert.DEFAULT_UTF8_ENCODING) {
    switch (encoding) {
      case "ascii":
        return this.FromBinary(text);
      case "utf8":
        return Utf8Converter.fromString(text);
      case "utf16":
      case "utf16be":
        return Utf16Converter.fromString(text);
      case "utf16le":
      case "usc2":
        return Utf16Converter.fromString(text, true);
      default:
        throw new Error(`Unknown type of encoding '${encoding}'`);
    }
  }
  static ToUtf8String(buffer, encoding = _Convert.DEFAULT_UTF8_ENCODING) {
    switch (encoding) {
      case "ascii":
        return this.ToBinary(buffer);
      case "utf8":
        return Utf8Converter.toString(buffer);
      case "utf16":
      case "utf16be":
        return Utf16Converter.toString(buffer);
      case "utf16le":
      case "usc2":
        return Utf16Converter.toString(buffer, true);
      default:
        throw new Error(`Unknown type of encoding '${encoding}'`);
    }
  }
  static FromBinary(text) {
    const stringLength = text.length;
    const resultView = new Uint8Array(stringLength);
    for (let i = 0; i < stringLength; i++) {
      resultView[i] = text.charCodeAt(i);
    }
    return resultView.buffer;
  }
  static ToBinary(buffer) {
    const buf = BufferSourceConverter.toUint8Array(buffer);
    let res = "";
    for (let i = 0; i < buf.length; i++) {
      res += String.fromCharCode(buf[i]);
    }
    return res;
  }
  static ToHex(buffer) {
    const buf = BufferSourceConverter.toUint8Array(buffer);
    let result = "";
    const len = buf.length;
    for (let i = 0; i < len; i++) {
      const byte = buf[i];
      if (byte < 16) {
        result += "0";
      }
      result += byte.toString(16);
    }
    return result;
  }
  static FromHex(hexString) {
    let formatted = this.formatString(hexString);
    if (!formatted) {
      return new ArrayBuffer(0);
    }
    if (!_Convert.isHex(formatted)) {
      throw new TypeError("Argument 'hexString' is not HEX encoded");
    }
    if (formatted.length % 2) {
      formatted = `0${formatted}`;
    }
    const res = new Uint8Array(formatted.length / 2);
    for (let i = 0; i < formatted.length; i = i + 2) {
      const c = formatted.slice(i, i + 2);
      res[i / 2] = parseInt(c, 16);
    }
    return res.buffer;
  }
  static ToUtf16String(buffer, littleEndian = false) {
    return Utf16Converter.toString(buffer, littleEndian);
  }
  static FromUtf16String(text, littleEndian = false) {
    return Utf16Converter.fromString(text, littleEndian);
  }
  static Base64Padding(base64) {
    const padCount = 4 - base64.length % 4;
    if (padCount < 4) {
      for (let i = 0; i < padCount; i++) {
        base64 += "=";
      }
    }
    return base64;
  }
  static formatString(data) {
    return (data === null || data === void 0 ? void 0 : data.replace(/[\n\r\t ]/g, "")) || "";
  }
};
Convert.DEFAULT_UTF8_ENCODING = "utf8";

// ../../node_modules/pvutils/build/utils.es.js
function utilFromBase(inputBuffer, inputBase) {
  let result = 0;
  if (inputBuffer.length === 1) {
    return inputBuffer[0];
  }
  for (let i = inputBuffer.length - 1; i >= 0; i--) {
    result += inputBuffer[inputBuffer.length - 1 - i] * Math.pow(2, inputBase * i);
  }
  return result;
}
function utilToBase(value, base, reserved = -1) {
  const internalReserved = reserved;
  let internalValue = value;
  let result = 0;
  let biggest = Math.pow(2, base);
  for (let i = 1; i < 8; i++) {
    if (value < biggest) {
      let retBuf;
      if (internalReserved < 0) {
        retBuf = new ArrayBuffer(i);
        result = i;
      } else {
        if (internalReserved < i) {
          return new ArrayBuffer(0);
        }
        retBuf = new ArrayBuffer(internalReserved);
        result = internalReserved;
      }
      const retView = new Uint8Array(retBuf);
      for (let j = i - 1; j >= 0; j--) {
        const basis = Math.pow(2, j * base);
        retView[result - j - 1] = Math.floor(internalValue / basis);
        internalValue -= retView[result - j - 1] * basis;
      }
      return retBuf;
    }
    biggest *= Math.pow(2, base);
  }
  return new ArrayBuffer(0);
}
function utilConcatView(...views) {
  let outputLength = 0;
  let prevLength = 0;
  for (const view of views) {
    outputLength += view.length;
  }
  const retBuf = new ArrayBuffer(outputLength);
  const retView = new Uint8Array(retBuf);
  for (const view of views) {
    retView.set(view, prevLength);
    prevLength += view.length;
  }
  return retView;
}
function utilDecodeTC() {
  const buf = new Uint8Array(this.valueHex);
  if (this.valueHex.byteLength >= 2) {
    const condition1 = buf[0] === 255 && buf[1] & 128;
    const condition2 = buf[0] === 0 && (buf[1] & 128) === 0;
    if (condition1 || condition2) {
      this.warnings.push("Needlessly long format");
    }
  }
  const bigIntBuffer = new ArrayBuffer(this.valueHex.byteLength);
  const bigIntView = new Uint8Array(bigIntBuffer);
  for (let i = 0; i < this.valueHex.byteLength; i++) {
    bigIntView[i] = 0;
  }
  bigIntView[0] = buf[0] & 128;
  const bigInt = utilFromBase(bigIntView, 8);
  const smallIntBuffer = new ArrayBuffer(this.valueHex.byteLength);
  const smallIntView = new Uint8Array(smallIntBuffer);
  for (let j = 0; j < this.valueHex.byteLength; j++) {
    smallIntView[j] = buf[j];
  }
  smallIntView[0] &= 127;
  const smallInt = utilFromBase(smallIntView, 8);
  return smallInt - bigInt;
}
function utilEncodeTC(value) {
  const modValue = value < 0 ? value * -1 : value;
  let bigInt = 128;
  for (let i = 1; i < 8; i++) {
    if (modValue <= bigInt) {
      if (value < 0) {
        const smallInt = bigInt - modValue;
        const retBuf2 = utilToBase(smallInt, 8, i);
        const retView2 = new Uint8Array(retBuf2);
        retView2[0] |= 128;
        return retBuf2;
      }
      let retBuf = utilToBase(modValue, 8, i);
      let retView = new Uint8Array(retBuf);
      if (retView[0] & 128) {
        const tempBuf = retBuf.slice(0);
        const tempView = new Uint8Array(tempBuf);
        retBuf = new ArrayBuffer(retBuf.byteLength + 1);
        retView = new Uint8Array(retBuf);
        for (let k = 0; k < tempBuf.byteLength; k++) {
          retView[k + 1] = tempView[k];
        }
        retView[0] = 0;
      }
      return retBuf;
    }
    bigInt *= Math.pow(2, 8);
  }
  return new ArrayBuffer(0);
}
function isEqualBuffer(inputBuffer1, inputBuffer2) {
  if (inputBuffer1.byteLength !== inputBuffer2.byteLength) {
    return false;
  }
  const view1 = new Uint8Array(inputBuffer1);
  const view2 = new Uint8Array(inputBuffer2);
  for (let i = 0; i < view1.length; i++) {
    if (view1[i] !== view2[i]) {
      return false;
    }
  }
  return true;
}
function padNumber(inputNumber, fullLength) {
  const str = inputNumber.toString(10);
  if (fullLength < str.length) {
    return "";
  }
  const dif = fullLength - str.length;
  const padding = new Array(dif);
  for (let i = 0; i < dif; i++) {
    padding[i] = "0";
  }
  const paddingString = padding.join("");
  return paddingString.concat(str);
}
var log2 = Math.log(2);

// ../../node_modules/asn1js/build/index.es.js
function assertBigInt() {
  if (typeof BigInt === "undefined") {
    throw new Error("BigInt is not defined. Your environment doesn't implement BigInt.");
  }
}
function concat(buffers) {
  let outputLength = 0;
  let prevLength = 0;
  for (let i = 0; i < buffers.length; i++) {
    const buffer = buffers[i];
    outputLength += buffer.byteLength;
  }
  const retView = new Uint8Array(outputLength);
  for (let i = 0; i < buffers.length; i++) {
    const buffer = buffers[i];
    retView.set(new Uint8Array(buffer), prevLength);
    prevLength += buffer.byteLength;
  }
  return retView.buffer;
}
function checkBufferParams(baseBlock, inputBuffer, inputOffset, inputLength) {
  if (!(inputBuffer instanceof Uint8Array)) {
    baseBlock.error = "Wrong parameter: inputBuffer must be 'Uint8Array'";
    return false;
  }
  if (!inputBuffer.byteLength) {
    baseBlock.error = "Wrong parameter: inputBuffer has zero length";
    return false;
  }
  if (inputOffset < 0) {
    baseBlock.error = "Wrong parameter: inputOffset less than zero";
    return false;
  }
  if (inputLength < 0) {
    baseBlock.error = "Wrong parameter: inputLength less than zero";
    return false;
  }
  if (inputBuffer.byteLength - inputOffset - inputLength < 0) {
    baseBlock.error = "End of input reached before message was fully decoded (inconsistent offset and length values)";
    return false;
  }
  return true;
}
var ViewWriter = class {
  constructor() {
    this.items = [];
  }
  write(buf) {
    this.items.push(buf);
  }
  final() {
    return concat(this.items);
  }
};
var powers2 = [new Uint8Array([1])];
var digitsString = "0123456789";
var NAME = "name";
var VALUE_HEX_VIEW = "valueHexView";
var IS_HEX_ONLY = "isHexOnly";
var ID_BLOCK = "idBlock";
var TAG_CLASS = "tagClass";
var TAG_NUMBER = "tagNumber";
var IS_CONSTRUCTED = "isConstructed";
var FROM_BER = "fromBER";
var TO_BER = "toBER";
var LOCAL = "local";
var EMPTY_STRING = "";
var EMPTY_BUFFER = new ArrayBuffer(0);
var EMPTY_VIEW = new Uint8Array(0);
var END_OF_CONTENT_NAME = "EndOfContent";
var OCTET_STRING_NAME = "OCTET STRING";
var BIT_STRING_NAME = "BIT STRING";
function HexBlock(BaseClass) {
  var _a2;
  return _a2 = class Some extends BaseClass {
    constructor(...args) {
      var _a3;
      super(...args);
      const params = args[0] || {};
      this.isHexOnly = (_a3 = params.isHexOnly) !== null && _a3 !== void 0 ? _a3 : false;
      this.valueHexView = params.valueHex ? BufferSourceConverter.toUint8Array(params.valueHex) : EMPTY_VIEW;
    }
    get valueHex() {
      return this.valueHexView.slice().buffer;
    }
    set valueHex(value) {
      this.valueHexView = new Uint8Array(value);
    }
    fromBER(inputBuffer, inputOffset, inputLength) {
      const view = inputBuffer instanceof ArrayBuffer ? new Uint8Array(inputBuffer) : inputBuffer;
      if (!checkBufferParams(this, view, inputOffset, inputLength)) {
        return -1;
      }
      const endLength = inputOffset + inputLength;
      this.valueHexView = view.subarray(inputOffset, endLength);
      if (!this.valueHexView.length) {
        this.warnings.push("Zero buffer length");
        return inputOffset;
      }
      this.blockLength = inputLength;
      return endLength;
    }
    toBER(sizeOnly = false) {
      if (!this.isHexOnly) {
        this.error = "Flag 'isHexOnly' is not set, abort";
        return EMPTY_BUFFER;
      }
      if (sizeOnly) {
        return new ArrayBuffer(this.valueHexView.byteLength);
      }
      return this.valueHexView.byteLength === this.valueHexView.buffer.byteLength ? this.valueHexView.buffer : this.valueHexView.slice().buffer;
    }
    toJSON() {
      return {
        ...super.toJSON(),
        isHexOnly: this.isHexOnly,
        valueHex: Convert.ToHex(this.valueHexView)
      };
    }
  }, _a2.NAME = "hexBlock", _a2;
}
var LocalBaseBlock = class {
  constructor({ blockLength = 0, error = EMPTY_STRING, warnings = [], valueBeforeDecode = EMPTY_VIEW } = {}) {
    this.blockLength = blockLength;
    this.error = error;
    this.warnings = warnings;
    this.valueBeforeDecodeView = BufferSourceConverter.toUint8Array(valueBeforeDecode);
  }
  static blockName() {
    return this.NAME;
  }
  get valueBeforeDecode() {
    return this.valueBeforeDecodeView.slice().buffer;
  }
  set valueBeforeDecode(value) {
    this.valueBeforeDecodeView = new Uint8Array(value);
  }
  toJSON() {
    return {
      blockName: this.constructor.NAME,
      blockLength: this.blockLength,
      error: this.error,
      warnings: this.warnings,
      valueBeforeDecode: Convert.ToHex(this.valueBeforeDecodeView)
    };
  }
};
LocalBaseBlock.NAME = "baseBlock";
var ValueBlock = class extends LocalBaseBlock {
  fromBER(inputBuffer, inputOffset, inputLength) {
    throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
  }
  toBER(sizeOnly, writer) {
    throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
  }
};
ValueBlock.NAME = "valueBlock";
var LocalIdentificationBlock = class extends HexBlock(LocalBaseBlock) {
  constructor({ idBlock = {} } = {}) {
    var _a2, _b, _c, _d;
    super();
    if (idBlock) {
      this.isHexOnly = (_a2 = idBlock.isHexOnly) !== null && _a2 !== void 0 ? _a2 : false;
      this.valueHexView = idBlock.valueHex ? BufferSourceConverter.toUint8Array(idBlock.valueHex) : EMPTY_VIEW;
      this.tagClass = (_b = idBlock.tagClass) !== null && _b !== void 0 ? _b : -1;
      this.tagNumber = (_c = idBlock.tagNumber) !== null && _c !== void 0 ? _c : -1;
      this.isConstructed = (_d = idBlock.isConstructed) !== null && _d !== void 0 ? _d : false;
    } else {
      this.tagClass = -1;
      this.tagNumber = -1;
      this.isConstructed = false;
    }
  }
  toBER(sizeOnly = false) {
    let firstOctet = 0;
    switch (this.tagClass) {
      case 1:
        firstOctet |= 0;
        break;
      case 2:
        firstOctet |= 64;
        break;
      case 3:
        firstOctet |= 128;
        break;
      case 4:
        firstOctet |= 192;
        break;
      default:
        this.error = "Unknown tag class";
        return EMPTY_BUFFER;
    }
    if (this.isConstructed)
      firstOctet |= 32;
    if (this.tagNumber < 31 && !this.isHexOnly) {
      const retView2 = new Uint8Array(1);
      if (!sizeOnly) {
        let number = this.tagNumber;
        number &= 31;
        firstOctet |= number;
        retView2[0] = firstOctet;
      }
      return retView2.buffer;
    }
    if (!this.isHexOnly) {
      const encodedBuf = utilToBase(this.tagNumber, 7);
      const encodedView = new Uint8Array(encodedBuf);
      const size = encodedBuf.byteLength;
      const retView2 = new Uint8Array(size + 1);
      retView2[0] = firstOctet | 31;
      if (!sizeOnly) {
        for (let i = 0; i < size - 1; i++)
          retView2[i + 1] = encodedView[i] | 128;
        retView2[size] = encodedView[size - 1];
      }
      return retView2.buffer;
    }
    const retView = new Uint8Array(this.valueHexView.byteLength + 1);
    retView[0] = firstOctet | 31;
    if (!sizeOnly) {
      const curView = this.valueHexView;
      for (let i = 0; i < curView.length - 1; i++)
        retView[i + 1] = curView[i] | 128;
      retView[this.valueHexView.byteLength] = curView[curView.length - 1];
    }
    return retView.buffer;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const inputView = BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, inputView, inputOffset, inputLength)) {
      return -1;
    }
    const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
    if (intBuffer.length === 0) {
      this.error = "Zero buffer length";
      return -1;
    }
    const tagClassMask = intBuffer[0] & 192;
    switch (tagClassMask) {
      case 0:
        this.tagClass = 1;
        break;
      case 64:
        this.tagClass = 2;
        break;
      case 128:
        this.tagClass = 3;
        break;
      case 192:
        this.tagClass = 4;
        break;
      default:
        this.error = "Unknown tag class";
        return -1;
    }
    this.isConstructed = (intBuffer[0] & 32) === 32;
    this.isHexOnly = false;
    const tagNumberMask = intBuffer[0] & 31;
    if (tagNumberMask !== 31) {
      this.tagNumber = tagNumberMask;
      this.blockLength = 1;
    } else {
      let count = 1;
      let intTagNumberBuffer = this.valueHexView = new Uint8Array(255);
      let tagNumberBufferMaxLength = 255;
      while (intBuffer[count] & 128) {
        intTagNumberBuffer[count - 1] = intBuffer[count] & 127;
        count++;
        if (count >= intBuffer.length) {
          this.error = "End of input reached before message was fully decoded";
          return -1;
        }
        if (count === tagNumberBufferMaxLength) {
          tagNumberBufferMaxLength += 255;
          const tempBufferView2 = new Uint8Array(tagNumberBufferMaxLength);
          for (let i = 0; i < intTagNumberBuffer.length; i++)
            tempBufferView2[i] = intTagNumberBuffer[i];
          intTagNumberBuffer = this.valueHexView = new Uint8Array(tagNumberBufferMaxLength);
        }
      }
      this.blockLength = count + 1;
      intTagNumberBuffer[count - 1] = intBuffer[count] & 127;
      const tempBufferView = new Uint8Array(count);
      for (let i = 0; i < count; i++)
        tempBufferView[i] = intTagNumberBuffer[i];
      intTagNumberBuffer = this.valueHexView = new Uint8Array(count);
      intTagNumberBuffer.set(tempBufferView);
      if (this.blockLength <= 9)
        this.tagNumber = utilFromBase(intTagNumberBuffer, 7);
      else {
        this.isHexOnly = true;
        this.warnings.push("Tag too long, represented as hex-coded");
      }
    }
    if (this.tagClass === 1 && this.isConstructed) {
      switch (this.tagNumber) {
        case 1:
        case 2:
        case 5:
        case 6:
        case 9:
        case 13:
        case 14:
        case 23:
        case 24:
        case 31:
        case 32:
        case 33:
        case 34:
          this.error = "Constructed encoding used for primitive type";
          return -1;
      }
    }
    return inputOffset + this.blockLength;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      tagClass: this.tagClass,
      tagNumber: this.tagNumber,
      isConstructed: this.isConstructed
    };
  }
};
LocalIdentificationBlock.NAME = "identificationBlock";
var LocalLengthBlock = class extends LocalBaseBlock {
  constructor({ lenBlock = {} } = {}) {
    var _a2, _b, _c;
    super();
    this.isIndefiniteForm = (_a2 = lenBlock.isIndefiniteForm) !== null && _a2 !== void 0 ? _a2 : false;
    this.longFormUsed = (_b = lenBlock.longFormUsed) !== null && _b !== void 0 ? _b : false;
    this.length = (_c = lenBlock.length) !== null && _c !== void 0 ? _c : 0;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const view = BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, view, inputOffset, inputLength)) {
      return -1;
    }
    const intBuffer = view.subarray(inputOffset, inputOffset + inputLength);
    if (intBuffer.length === 0) {
      this.error = "Zero buffer length";
      return -1;
    }
    if (intBuffer[0] === 255) {
      this.error = "Length block 0xFF is reserved by standard";
      return -1;
    }
    this.isIndefiniteForm = intBuffer[0] === 128;
    if (this.isIndefiniteForm) {
      this.blockLength = 1;
      return inputOffset + this.blockLength;
    }
    this.longFormUsed = !!(intBuffer[0] & 128);
    if (this.longFormUsed === false) {
      this.length = intBuffer[0];
      this.blockLength = 1;
      return inputOffset + this.blockLength;
    }
    const count = intBuffer[0] & 127;
    if (count > 8) {
      this.error = "Too big integer";
      return -1;
    }
    if (count + 1 > intBuffer.length) {
      this.error = "End of input reached before message was fully decoded";
      return -1;
    }
    const lenOffset = inputOffset + 1;
    const lengthBufferView = view.subarray(lenOffset, lenOffset + count);
    if (lengthBufferView[count - 1] === 0)
      this.warnings.push("Needlessly long encoded length");
    this.length = utilFromBase(lengthBufferView, 8);
    if (this.longFormUsed && this.length <= 127)
      this.warnings.push("Unnecessary usage of long length form");
    this.blockLength = count + 1;
    return inputOffset + this.blockLength;
  }
  toBER(sizeOnly = false) {
    let retBuf;
    let retView;
    if (this.length > 127)
      this.longFormUsed = true;
    if (this.isIndefiniteForm) {
      retBuf = new ArrayBuffer(1);
      if (sizeOnly === false) {
        retView = new Uint8Array(retBuf);
        retView[0] = 128;
      }
      return retBuf;
    }
    if (this.longFormUsed) {
      const encodedBuf = utilToBase(this.length, 8);
      if (encodedBuf.byteLength > 127) {
        this.error = "Too big length";
        return EMPTY_BUFFER;
      }
      retBuf = new ArrayBuffer(encodedBuf.byteLength + 1);
      if (sizeOnly)
        return retBuf;
      const encodedView = new Uint8Array(encodedBuf);
      retView = new Uint8Array(retBuf);
      retView[0] = encodedBuf.byteLength | 128;
      for (let i = 0; i < encodedBuf.byteLength; i++)
        retView[i + 1] = encodedView[i];
      return retBuf;
    }
    retBuf = new ArrayBuffer(1);
    if (sizeOnly === false) {
      retView = new Uint8Array(retBuf);
      retView[0] = this.length;
    }
    return retBuf;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      isIndefiniteForm: this.isIndefiniteForm,
      longFormUsed: this.longFormUsed,
      length: this.length
    };
  }
};
LocalLengthBlock.NAME = "lengthBlock";
var typeStore = {};
var BaseBlock = class extends LocalBaseBlock {
  constructor({ name = EMPTY_STRING, optional = false, primitiveSchema, ...parameters } = {}, valueBlockType) {
    super(parameters);
    this.name = name;
    this.optional = optional;
    if (primitiveSchema) {
      this.primitiveSchema = primitiveSchema;
    }
    this.idBlock = new LocalIdentificationBlock(parameters);
    this.lenBlock = new LocalLengthBlock(parameters);
    this.valueBlock = valueBlockType ? new valueBlockType(parameters) : new ValueBlock(parameters);
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm ? inputLength : this.lenBlock.length);
    if (resultOffset === -1) {
      this.error = this.valueBlock.error;
      return resultOffset;
    }
    if (!this.idBlock.error.length)
      this.blockLength += this.idBlock.blockLength;
    if (!this.lenBlock.error.length)
      this.blockLength += this.lenBlock.blockLength;
    if (!this.valueBlock.error.length)
      this.blockLength += this.valueBlock.blockLength;
    return resultOffset;
  }
  toBER(sizeOnly, writer) {
    const _writer = writer || new ViewWriter();
    if (!writer) {
      prepareIndefiniteForm(this);
    }
    const idBlockBuf = this.idBlock.toBER(sizeOnly);
    _writer.write(idBlockBuf);
    if (this.lenBlock.isIndefiniteForm) {
      _writer.write(new Uint8Array([128]).buffer);
      this.valueBlock.toBER(sizeOnly, _writer);
      _writer.write(new ArrayBuffer(2));
    } else {
      const valueBlockBuf = this.valueBlock.toBER(sizeOnly);
      this.lenBlock.length = valueBlockBuf.byteLength;
      const lenBlockBuf = this.lenBlock.toBER(sizeOnly);
      _writer.write(lenBlockBuf);
      _writer.write(valueBlockBuf);
    }
    if (!writer) {
      return _writer.final();
    }
    return EMPTY_BUFFER;
  }
  toJSON() {
    const object = {
      ...super.toJSON(),
      idBlock: this.idBlock.toJSON(),
      lenBlock: this.lenBlock.toJSON(),
      valueBlock: this.valueBlock.toJSON(),
      name: this.name,
      optional: this.optional
    };
    if (this.primitiveSchema)
      object.primitiveSchema = this.primitiveSchema.toJSON();
    return object;
  }
  toString(encoding = "ascii") {
    if (encoding === "ascii") {
      return this.onAsciiEncoding();
    }
    return Convert.ToHex(this.toBER());
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${Convert.ToHex(this.valueBlock.valueBeforeDecodeView)}`;
  }
  isEqual(other) {
    if (this === other) {
      return true;
    }
    if (!(other instanceof this.constructor)) {
      return false;
    }
    const thisRaw = this.toBER();
    const otherRaw = other.toBER();
    return isEqualBuffer(thisRaw, otherRaw);
  }
};
BaseBlock.NAME = "BaseBlock";
function prepareIndefiniteForm(baseBlock) {
  if (baseBlock instanceof typeStore.Constructed) {
    for (const value of baseBlock.valueBlock.value) {
      if (prepareIndefiniteForm(value)) {
        baseBlock.lenBlock.isIndefiniteForm = true;
      }
    }
  }
  return !!baseBlock.lenBlock.isIndefiniteForm;
}
var BaseStringBlock = class extends BaseBlock {
  constructor({ value = EMPTY_STRING, ...parameters } = {}, stringValueBlockType) {
    super(parameters, stringValueBlockType);
    if (value) {
      this.fromString(value);
    }
  }
  getValue() {
    return this.valueBlock.value;
  }
  setValue(value) {
    this.valueBlock.value = value;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm ? inputLength : this.lenBlock.length);
    if (resultOffset === -1) {
      this.error = this.valueBlock.error;
      return resultOffset;
    }
    this.fromBuffer(this.valueBlock.valueHexView);
    if (!this.idBlock.error.length)
      this.blockLength += this.idBlock.blockLength;
    if (!this.lenBlock.error.length)
      this.blockLength += this.lenBlock.blockLength;
    if (!this.valueBlock.error.length)
      this.blockLength += this.valueBlock.blockLength;
    return resultOffset;
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : '${this.valueBlock.value}'`;
  }
};
BaseStringBlock.NAME = "BaseStringBlock";
var LocalPrimitiveValueBlock = class extends HexBlock(ValueBlock) {
  constructor({ isHexOnly = true, ...parameters } = {}) {
    super(parameters);
    this.isHexOnly = isHexOnly;
  }
};
LocalPrimitiveValueBlock.NAME = "PrimitiveValueBlock";
var _a$w;
var Primitive = class extends BaseBlock {
  constructor(parameters = {}) {
    super(parameters, LocalPrimitiveValueBlock);
    this.idBlock.isConstructed = false;
  }
};
_a$w = Primitive;
(() => {
  typeStore.Primitive = _a$w;
})();
Primitive.NAME = "PRIMITIVE";
function localChangeType(inputObject, newType) {
  if (inputObject instanceof newType) {
    return inputObject;
  }
  const newObject = new newType();
  newObject.idBlock = inputObject.idBlock;
  newObject.lenBlock = inputObject.lenBlock;
  newObject.warnings = inputObject.warnings;
  newObject.valueBeforeDecodeView = inputObject.valueBeforeDecodeView;
  return newObject;
}
function localFromBER(inputBuffer, inputOffset = 0, inputLength = inputBuffer.length) {
  const incomingOffset = inputOffset;
  let returnObject = new BaseBlock({}, ValueBlock);
  const baseBlock = new LocalBaseBlock();
  if (!checkBufferParams(baseBlock, inputBuffer, inputOffset, inputLength)) {
    returnObject.error = baseBlock.error;
    return {
      offset: -1,
      result: returnObject
    };
  }
  const intBuffer = inputBuffer.subarray(inputOffset, inputOffset + inputLength);
  if (!intBuffer.length) {
    returnObject.error = "Zero buffer length";
    return {
      offset: -1,
      result: returnObject
    };
  }
  let resultOffset = returnObject.idBlock.fromBER(inputBuffer, inputOffset, inputLength);
  if (returnObject.idBlock.warnings.length) {
    returnObject.warnings.concat(returnObject.idBlock.warnings);
  }
  if (resultOffset === -1) {
    returnObject.error = returnObject.idBlock.error;
    return {
      offset: -1,
      result: returnObject
    };
  }
  inputOffset = resultOffset;
  inputLength -= returnObject.idBlock.blockLength;
  resultOffset = returnObject.lenBlock.fromBER(inputBuffer, inputOffset, inputLength);
  if (returnObject.lenBlock.warnings.length) {
    returnObject.warnings.concat(returnObject.lenBlock.warnings);
  }
  if (resultOffset === -1) {
    returnObject.error = returnObject.lenBlock.error;
    return {
      offset: -1,
      result: returnObject
    };
  }
  inputOffset = resultOffset;
  inputLength -= returnObject.lenBlock.blockLength;
  if (!returnObject.idBlock.isConstructed && returnObject.lenBlock.isIndefiniteForm) {
    returnObject.error = "Indefinite length form used for primitive encoding form";
    return {
      offset: -1,
      result: returnObject
    };
  }
  let newASN1Type = BaseBlock;
  switch (returnObject.idBlock.tagClass) {
    case 1:
      if (returnObject.idBlock.tagNumber >= 37 && returnObject.idBlock.isHexOnly === false) {
        returnObject.error = "UNIVERSAL 37 and upper tags are reserved by ASN.1 standard";
        return {
          offset: -1,
          result: returnObject
        };
      }
      switch (returnObject.idBlock.tagNumber) {
        case 0:
          if (returnObject.idBlock.isConstructed && returnObject.lenBlock.length > 0) {
            returnObject.error = "Type [UNIVERSAL 0] is reserved";
            return {
              offset: -1,
              result: returnObject
            };
          }
          newASN1Type = typeStore.EndOfContent;
          break;
        case 1:
          newASN1Type = typeStore.Boolean;
          break;
        case 2:
          newASN1Type = typeStore.Integer;
          break;
        case 3:
          newASN1Type = typeStore.BitString;
          break;
        case 4:
          newASN1Type = typeStore.OctetString;
          break;
        case 5:
          newASN1Type = typeStore.Null;
          break;
        case 6:
          newASN1Type = typeStore.ObjectIdentifier;
          break;
        case 10:
          newASN1Type = typeStore.Enumerated;
          break;
        case 12:
          newASN1Type = typeStore.Utf8String;
          break;
        case 13:
          newASN1Type = typeStore.RelativeObjectIdentifier;
          break;
        case 14:
          newASN1Type = typeStore.TIME;
          break;
        case 15:
          returnObject.error = "[UNIVERSAL 15] is reserved by ASN.1 standard";
          return {
            offset: -1,
            result: returnObject
          };
        case 16:
          newASN1Type = typeStore.Sequence;
          break;
        case 17:
          newASN1Type = typeStore.Set;
          break;
        case 18:
          newASN1Type = typeStore.NumericString;
          break;
        case 19:
          newASN1Type = typeStore.PrintableString;
          break;
        case 20:
          newASN1Type = typeStore.TeletexString;
          break;
        case 21:
          newASN1Type = typeStore.VideotexString;
          break;
        case 22:
          newASN1Type = typeStore.IA5String;
          break;
        case 23:
          newASN1Type = typeStore.UTCTime;
          break;
        case 24:
          newASN1Type = typeStore.GeneralizedTime;
          break;
        case 25:
          newASN1Type = typeStore.GraphicString;
          break;
        case 26:
          newASN1Type = typeStore.VisibleString;
          break;
        case 27:
          newASN1Type = typeStore.GeneralString;
          break;
        case 28:
          newASN1Type = typeStore.UniversalString;
          break;
        case 29:
          newASN1Type = typeStore.CharacterString;
          break;
        case 30:
          newASN1Type = typeStore.BmpString;
          break;
        case 31:
          newASN1Type = typeStore.DATE;
          break;
        case 32:
          newASN1Type = typeStore.TimeOfDay;
          break;
        case 33:
          newASN1Type = typeStore.DateTime;
          break;
        case 34:
          newASN1Type = typeStore.Duration;
          break;
        default: {
          const newObject = returnObject.idBlock.isConstructed ? new typeStore.Constructed() : new typeStore.Primitive();
          newObject.idBlock = returnObject.idBlock;
          newObject.lenBlock = returnObject.lenBlock;
          newObject.warnings = returnObject.warnings;
          returnObject = newObject;
        }
      }
      break;
    case 2:
    case 3:
    case 4:
    default: {
      newASN1Type = returnObject.idBlock.isConstructed ? typeStore.Constructed : typeStore.Primitive;
    }
  }
  returnObject = localChangeType(returnObject, newASN1Type);
  resultOffset = returnObject.fromBER(inputBuffer, inputOffset, returnObject.lenBlock.isIndefiniteForm ? inputLength : returnObject.lenBlock.length);
  returnObject.valueBeforeDecodeView = inputBuffer.subarray(incomingOffset, incomingOffset + returnObject.blockLength);
  return {
    offset: resultOffset,
    result: returnObject
  };
}
function fromBER(inputBuffer) {
  if (!inputBuffer.byteLength) {
    const result = new BaseBlock({}, ValueBlock);
    result.error = "Input buffer has zero length";
    return {
      offset: -1,
      result
    };
  }
  return localFromBER(BufferSourceConverter.toUint8Array(inputBuffer).slice(), 0, inputBuffer.byteLength);
}
function checkLen(indefiniteLength, length) {
  if (indefiniteLength) {
    return 1;
  }
  return length;
}
var LocalConstructedValueBlock = class extends ValueBlock {
  constructor({ value = [], isIndefiniteForm = false, ...parameters } = {}) {
    super(parameters);
    this.value = value;
    this.isIndefiniteForm = isIndefiniteForm;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const view = BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, view, inputOffset, inputLength)) {
      return -1;
    }
    this.valueBeforeDecodeView = view.subarray(inputOffset, inputOffset + inputLength);
    if (this.valueBeforeDecodeView.length === 0) {
      this.warnings.push("Zero buffer length");
      return inputOffset;
    }
    let currentOffset = inputOffset;
    while (checkLen(this.isIndefiniteForm, inputLength) > 0) {
      const returnObject = localFromBER(view, currentOffset, inputLength);
      if (returnObject.offset === -1) {
        this.error = returnObject.result.error;
        this.warnings.concat(returnObject.result.warnings);
        return -1;
      }
      currentOffset = returnObject.offset;
      this.blockLength += returnObject.result.blockLength;
      inputLength -= returnObject.result.blockLength;
      this.value.push(returnObject.result);
      if (this.isIndefiniteForm && returnObject.result.constructor.NAME === END_OF_CONTENT_NAME) {
        break;
      }
    }
    if (this.isIndefiniteForm) {
      if (this.value[this.value.length - 1].constructor.NAME === END_OF_CONTENT_NAME) {
        this.value.pop();
      } else {
        this.warnings.push("No EndOfContent block encoded");
      }
    }
    return currentOffset;
  }
  toBER(sizeOnly, writer) {
    const _writer = writer || new ViewWriter();
    for (let i = 0; i < this.value.length; i++) {
      this.value[i].toBER(sizeOnly, _writer);
    }
    if (!writer) {
      return _writer.final();
    }
    return EMPTY_BUFFER;
  }
  toJSON() {
    const object = {
      ...super.toJSON(),
      isIndefiniteForm: this.isIndefiniteForm,
      value: []
    };
    for (const value of this.value) {
      object.value.push(value.toJSON());
    }
    return object;
  }
};
LocalConstructedValueBlock.NAME = "ConstructedValueBlock";
var _a$v;
var Constructed = class extends BaseBlock {
  constructor(parameters = {}) {
    super(parameters, LocalConstructedValueBlock);
    this.idBlock.isConstructed = true;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
    const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm ? inputLength : this.lenBlock.length);
    if (resultOffset === -1) {
      this.error = this.valueBlock.error;
      return resultOffset;
    }
    if (!this.idBlock.error.length)
      this.blockLength += this.idBlock.blockLength;
    if (!this.lenBlock.error.length)
      this.blockLength += this.lenBlock.blockLength;
    if (!this.valueBlock.error.length)
      this.blockLength += this.valueBlock.blockLength;
    return resultOffset;
  }
  onAsciiEncoding() {
    const values = [];
    for (const value of this.valueBlock.value) {
      values.push(value.toString("ascii").split("\n").map((o) => `  ${o}`).join("\n"));
    }
    const blockName = this.idBlock.tagClass === 3 ? `[${this.idBlock.tagNumber}]` : this.constructor.NAME;
    return values.length ? `${blockName} :
${values.join("\n")}` : `${blockName} :`;
  }
};
_a$v = Constructed;
(() => {
  typeStore.Constructed = _a$v;
})();
Constructed.NAME = "CONSTRUCTED";
var LocalEndOfContentValueBlock = class extends ValueBlock {
  fromBER(inputBuffer, inputOffset, inputLength) {
    return inputOffset;
  }
  toBER(sizeOnly) {
    return EMPTY_BUFFER;
  }
};
LocalEndOfContentValueBlock.override = "EndOfContentValueBlock";
var _a$u;
var EndOfContent = class extends BaseBlock {
  constructor(parameters = {}) {
    super(parameters, LocalEndOfContentValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 0;
  }
};
_a$u = EndOfContent;
(() => {
  typeStore.EndOfContent = _a$u;
})();
EndOfContent.NAME = END_OF_CONTENT_NAME;
var _a$t;
var Null = class extends BaseBlock {
  constructor(parameters = {}) {
    super(parameters, ValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 5;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    if (this.lenBlock.length > 0)
      this.warnings.push("Non-zero length of value block for Null type");
    if (!this.idBlock.error.length)
      this.blockLength += this.idBlock.blockLength;
    if (!this.lenBlock.error.length)
      this.blockLength += this.lenBlock.blockLength;
    this.blockLength += inputLength;
    if (inputOffset + inputLength > inputBuffer.byteLength) {
      this.error = "End of input reached before message was fully decoded (inconsistent offset and length values)";
      return -1;
    }
    return inputOffset + inputLength;
  }
  toBER(sizeOnly, writer) {
    const retBuf = new ArrayBuffer(2);
    if (!sizeOnly) {
      const retView = new Uint8Array(retBuf);
      retView[0] = 5;
      retView[1] = 0;
    }
    if (writer) {
      writer.write(retBuf);
    }
    return retBuf;
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME}`;
  }
};
_a$t = Null;
(() => {
  typeStore.Null = _a$t;
})();
Null.NAME = "NULL";
var LocalBooleanValueBlock = class extends HexBlock(ValueBlock) {
  constructor({ value, ...parameters } = {}) {
    super(parameters);
    if (parameters.valueHex) {
      this.valueHexView = BufferSourceConverter.toUint8Array(parameters.valueHex);
    } else {
      this.valueHexView = new Uint8Array(1);
    }
    if (value) {
      this.value = value;
    }
  }
  get value() {
    for (const octet of this.valueHexView) {
      if (octet > 0) {
        return true;
      }
    }
    return false;
  }
  set value(value) {
    this.valueHexView[0] = value ? 255 : 0;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const inputView = BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, inputView, inputOffset, inputLength)) {
      return -1;
    }
    this.valueHexView = inputView.subarray(inputOffset, inputOffset + inputLength);
    if (inputLength > 1)
      this.warnings.push("Boolean value encoded in more then 1 octet");
    this.isHexOnly = true;
    utilDecodeTC.call(this);
    this.blockLength = inputLength;
    return inputOffset + inputLength;
  }
  toBER() {
    return this.valueHexView.slice();
  }
  toJSON() {
    return {
      ...super.toJSON(),
      value: this.value
    };
  }
};
LocalBooleanValueBlock.NAME = "BooleanValueBlock";
var _a$s;
var Boolean = class extends BaseBlock {
  constructor(parameters = {}) {
    super(parameters, LocalBooleanValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 1;
  }
  getValue() {
    return this.valueBlock.value;
  }
  setValue(value) {
    this.valueBlock.value = value;
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.getValue}`;
  }
};
_a$s = Boolean;
(() => {
  typeStore.Boolean = _a$s;
})();
Boolean.NAME = "BOOLEAN";
var LocalOctetStringValueBlock = class extends HexBlock(LocalConstructedValueBlock) {
  constructor({ isConstructed = false, ...parameters } = {}) {
    super(parameters);
    this.isConstructed = isConstructed;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    let resultOffset = 0;
    if (this.isConstructed) {
      this.isHexOnly = false;
      resultOffset = LocalConstructedValueBlock.prototype.fromBER.call(this, inputBuffer, inputOffset, inputLength);
      if (resultOffset === -1)
        return resultOffset;
      for (let i = 0; i < this.value.length; i++) {
        const currentBlockName = this.value[i].constructor.NAME;
        if (currentBlockName === END_OF_CONTENT_NAME) {
          if (this.isIndefiniteForm)
            break;
          else {
            this.error = "EndOfContent is unexpected, OCTET STRING may consists of OCTET STRINGs only";
            return -1;
          }
        }
        if (currentBlockName !== OCTET_STRING_NAME) {
          this.error = "OCTET STRING may consists of OCTET STRINGs only";
          return -1;
        }
      }
    } else {
      this.isHexOnly = true;
      resultOffset = super.fromBER(inputBuffer, inputOffset, inputLength);
      this.blockLength = inputLength;
    }
    return resultOffset;
  }
  toBER(sizeOnly, writer) {
    if (this.isConstructed)
      return LocalConstructedValueBlock.prototype.toBER.call(this, sizeOnly, writer);
    return sizeOnly ? new ArrayBuffer(this.valueHexView.byteLength) : this.valueHexView.slice().buffer;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      isConstructed: this.isConstructed
    };
  }
};
LocalOctetStringValueBlock.NAME = "OctetStringValueBlock";
var _a$r;
var OctetString = class _OctetString extends BaseBlock {
  constructor({ idBlock = {}, lenBlock = {}, ...parameters } = {}) {
    var _b, _c;
    (_b = parameters.isConstructed) !== null && _b !== void 0 ? _b : parameters.isConstructed = !!((_c = parameters.value) === null || _c === void 0 ? void 0 : _c.length);
    super({
      idBlock: {
        isConstructed: parameters.isConstructed,
        ...idBlock
      },
      lenBlock: {
        ...lenBlock,
        isIndefiniteForm: !!parameters.isIndefiniteForm
      },
      ...parameters
    }, LocalOctetStringValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 4;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    this.valueBlock.isConstructed = this.idBlock.isConstructed;
    this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
    if (inputLength === 0) {
      if (this.idBlock.error.length === 0)
        this.blockLength += this.idBlock.blockLength;
      if (this.lenBlock.error.length === 0)
        this.blockLength += this.lenBlock.blockLength;
      return inputOffset;
    }
    if (!this.valueBlock.isConstructed) {
      const view = inputBuffer instanceof ArrayBuffer ? new Uint8Array(inputBuffer) : inputBuffer;
      const buf = view.subarray(inputOffset, inputOffset + inputLength);
      try {
        if (buf.byteLength) {
          const asn = localFromBER(buf, 0, buf.byteLength);
          if (asn.offset !== -1 && asn.offset === inputLength) {
            this.valueBlock.value = [asn.result];
          }
        }
      } catch (e) {
      }
    }
    return super.fromBER(inputBuffer, inputOffset, inputLength);
  }
  onAsciiEncoding() {
    if (this.valueBlock.isConstructed || this.valueBlock.value && this.valueBlock.value.length) {
      return Constructed.prototype.onAsciiEncoding.call(this);
    }
    return `${this.constructor.NAME} : ${Convert.ToHex(this.valueBlock.valueHexView)}`;
  }
  getValue() {
    if (!this.idBlock.isConstructed) {
      return this.valueBlock.valueHexView.slice().buffer;
    }
    const array = [];
    for (const content of this.valueBlock.value) {
      if (content instanceof _OctetString) {
        array.push(content.valueBlock.valueHexView);
      }
    }
    return BufferSourceConverter.concat(array);
  }
};
_a$r = OctetString;
(() => {
  typeStore.OctetString = _a$r;
})();
OctetString.NAME = OCTET_STRING_NAME;
var LocalBitStringValueBlock = class extends HexBlock(LocalConstructedValueBlock) {
  constructor({ unusedBits = 0, isConstructed = false, ...parameters } = {}) {
    super(parameters);
    this.unusedBits = unusedBits;
    this.isConstructed = isConstructed;
    this.blockLength = this.valueHexView.byteLength;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    if (!inputLength) {
      return inputOffset;
    }
    let resultOffset = -1;
    if (this.isConstructed) {
      resultOffset = LocalConstructedValueBlock.prototype.fromBER.call(this, inputBuffer, inputOffset, inputLength);
      if (resultOffset === -1)
        return resultOffset;
      for (const value of this.value) {
        const currentBlockName = value.constructor.NAME;
        if (currentBlockName === END_OF_CONTENT_NAME) {
          if (this.isIndefiniteForm)
            break;
          else {
            this.error = "EndOfContent is unexpected, BIT STRING may consists of BIT STRINGs only";
            return -1;
          }
        }
        if (currentBlockName !== BIT_STRING_NAME) {
          this.error = "BIT STRING may consists of BIT STRINGs only";
          return -1;
        }
        const valueBlock = value.valueBlock;
        if (this.unusedBits > 0 && valueBlock.unusedBits > 0) {
          this.error = 'Using of "unused bits" inside constructive BIT STRING allowed for least one only';
          return -1;
        }
        this.unusedBits = valueBlock.unusedBits;
      }
      return resultOffset;
    }
    const inputView = BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, inputView, inputOffset, inputLength)) {
      return -1;
    }
    const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
    this.unusedBits = intBuffer[0];
    if (this.unusedBits > 7) {
      this.error = "Unused bits for BitString must be in range 0-7";
      return -1;
    }
    if (!this.unusedBits) {
      const buf = intBuffer.subarray(1);
      try {
        if (buf.byteLength) {
          const asn = localFromBER(buf, 0, buf.byteLength);
          if (asn.offset !== -1 && asn.offset === inputLength - 1) {
            this.value = [asn.result];
          }
        }
      } catch (e) {
      }
    }
    this.valueHexView = intBuffer.subarray(1);
    this.blockLength = intBuffer.length;
    return inputOffset + inputLength;
  }
  toBER(sizeOnly, writer) {
    if (this.isConstructed) {
      return LocalConstructedValueBlock.prototype.toBER.call(this, sizeOnly, writer);
    }
    if (sizeOnly) {
      return new ArrayBuffer(this.valueHexView.byteLength + 1);
    }
    if (!this.valueHexView.byteLength) {
      return EMPTY_BUFFER;
    }
    const retView = new Uint8Array(this.valueHexView.length + 1);
    retView[0] = this.unusedBits;
    retView.set(this.valueHexView, 1);
    return retView.buffer;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      unusedBits: this.unusedBits,
      isConstructed: this.isConstructed
    };
  }
};
LocalBitStringValueBlock.NAME = "BitStringValueBlock";
var _a$q;
var BitString = class extends BaseBlock {
  constructor({ idBlock = {}, lenBlock = {}, ...parameters } = {}) {
    var _b, _c;
    (_b = parameters.isConstructed) !== null && _b !== void 0 ? _b : parameters.isConstructed = !!((_c = parameters.value) === null || _c === void 0 ? void 0 : _c.length);
    super({
      idBlock: {
        isConstructed: parameters.isConstructed,
        ...idBlock
      },
      lenBlock: {
        ...lenBlock,
        isIndefiniteForm: !!parameters.isIndefiniteForm
      },
      ...parameters
    }, LocalBitStringValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 3;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    this.valueBlock.isConstructed = this.idBlock.isConstructed;
    this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
    return super.fromBER(inputBuffer, inputOffset, inputLength);
  }
  onAsciiEncoding() {
    if (this.valueBlock.isConstructed || this.valueBlock.value && this.valueBlock.value.length) {
      return Constructed.prototype.onAsciiEncoding.call(this);
    } else {
      const bits = [];
      const valueHex = this.valueBlock.valueHexView;
      for (const byte of valueHex) {
        bits.push(byte.toString(2).padStart(8, "0"));
      }
      const bitsStr = bits.join("");
      return `${this.constructor.NAME} : ${bitsStr.substring(0, bitsStr.length - this.valueBlock.unusedBits)}`;
    }
  }
};
_a$q = BitString;
(() => {
  typeStore.BitString = _a$q;
})();
BitString.NAME = BIT_STRING_NAME;
var _a$p;
function viewAdd(first, second) {
  const c = new Uint8Array([0]);
  const firstView = new Uint8Array(first);
  const secondView = new Uint8Array(second);
  let firstViewCopy = firstView.slice(0);
  const firstViewCopyLength = firstViewCopy.length - 1;
  const secondViewCopy = secondView.slice(0);
  const secondViewCopyLength = secondViewCopy.length - 1;
  let value = 0;
  const max = secondViewCopyLength < firstViewCopyLength ? firstViewCopyLength : secondViewCopyLength;
  let counter = 0;
  for (let i = max; i >= 0; i--, counter++) {
    switch (true) {
      case counter < secondViewCopy.length:
        value = firstViewCopy[firstViewCopyLength - counter] + secondViewCopy[secondViewCopyLength - counter] + c[0];
        break;
      default:
        value = firstViewCopy[firstViewCopyLength - counter] + c[0];
    }
    c[0] = value / 10;
    switch (true) {
      case counter >= firstViewCopy.length:
        firstViewCopy = utilConcatView(new Uint8Array([value % 10]), firstViewCopy);
        break;
      default:
        firstViewCopy[firstViewCopyLength - counter] = value % 10;
    }
  }
  if (c[0] > 0)
    firstViewCopy = utilConcatView(c, firstViewCopy);
  return firstViewCopy;
}
function power2(n) {
  if (n >= powers2.length) {
    for (let p = powers2.length; p <= n; p++) {
      const c = new Uint8Array([0]);
      let digits = powers2[p - 1].slice(0);
      for (let i = digits.length - 1; i >= 0; i--) {
        const newValue = new Uint8Array([(digits[i] << 1) + c[0]]);
        c[0] = newValue[0] / 10;
        digits[i] = newValue[0] % 10;
      }
      if (c[0] > 0)
        digits = utilConcatView(c, digits);
      powers2.push(digits);
    }
  }
  return powers2[n];
}
function viewSub(first, second) {
  let b = 0;
  const firstView = new Uint8Array(first);
  const secondView = new Uint8Array(second);
  const firstViewCopy = firstView.slice(0);
  const firstViewCopyLength = firstViewCopy.length - 1;
  const secondViewCopy = secondView.slice(0);
  const secondViewCopyLength = secondViewCopy.length - 1;
  let value;
  let counter = 0;
  for (let i = secondViewCopyLength; i >= 0; i--, counter++) {
    value = firstViewCopy[firstViewCopyLength - counter] - secondViewCopy[secondViewCopyLength - counter] - b;
    switch (true) {
      case value < 0:
        b = 1;
        firstViewCopy[firstViewCopyLength - counter] = value + 10;
        break;
      default:
        b = 0;
        firstViewCopy[firstViewCopyLength - counter] = value;
    }
  }
  if (b > 0) {
    for (let i = firstViewCopyLength - secondViewCopyLength + 1; i >= 0; i--, counter++) {
      value = firstViewCopy[firstViewCopyLength - counter] - b;
      if (value < 0) {
        b = 1;
        firstViewCopy[firstViewCopyLength - counter] = value + 10;
      } else {
        b = 0;
        firstViewCopy[firstViewCopyLength - counter] = value;
        break;
      }
    }
  }
  return firstViewCopy.slice();
}
var LocalIntegerValueBlock = class extends HexBlock(ValueBlock) {
  constructor({ value, ...parameters } = {}) {
    super(parameters);
    this._valueDec = 0;
    if (parameters.valueHex) {
      this.setValueHex();
    }
    if (value !== void 0) {
      this.valueDec = value;
    }
  }
  setValueHex() {
    if (this.valueHexView.length >= 4) {
      this.warnings.push("Too big Integer for decoding, hex only");
      this.isHexOnly = true;
      this._valueDec = 0;
    } else {
      this.isHexOnly = false;
      if (this.valueHexView.length > 0) {
        this._valueDec = utilDecodeTC.call(this);
      }
    }
  }
  set valueDec(v) {
    this._valueDec = v;
    this.isHexOnly = false;
    this.valueHexView = new Uint8Array(utilEncodeTC(v));
  }
  get valueDec() {
    return this._valueDec;
  }
  fromDER(inputBuffer, inputOffset, inputLength, expectedLength = 0) {
    const offset = this.fromBER(inputBuffer, inputOffset, inputLength);
    if (offset === -1)
      return offset;
    const view = this.valueHexView;
    if (view[0] === 0 && (view[1] & 128) !== 0) {
      this.valueHexView = view.subarray(1);
    } else {
      if (expectedLength !== 0) {
        if (view.length < expectedLength) {
          if (expectedLength - view.length > 1)
            expectedLength = view.length + 1;
          this.valueHexView = view.subarray(expectedLength - view.length);
        }
      }
    }
    return offset;
  }
  toDER(sizeOnly = false) {
    const view = this.valueHexView;
    switch (true) {
      case (view[0] & 128) !== 0:
        {
          const updatedView = new Uint8Array(this.valueHexView.length + 1);
          updatedView[0] = 0;
          updatedView.set(view, 1);
          this.valueHexView = updatedView;
        }
        break;
      case (view[0] === 0 && (view[1] & 128) === 0):
        {
          this.valueHexView = this.valueHexView.subarray(1);
        }
        break;
    }
    return this.toBER(sizeOnly);
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const resultOffset = super.fromBER(inputBuffer, inputOffset, inputLength);
    if (resultOffset === -1) {
      return resultOffset;
    }
    this.setValueHex();
    return resultOffset;
  }
  toBER(sizeOnly) {
    return sizeOnly ? new ArrayBuffer(this.valueHexView.length) : this.valueHexView.slice().buffer;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      valueDec: this.valueDec
    };
  }
  toString() {
    const firstBit = this.valueHexView.length * 8 - 1;
    let digits = new Uint8Array(this.valueHexView.length * 8 / 3);
    let bitNumber = 0;
    let currentByte;
    const asn1View = this.valueHexView;
    let result = "";
    let flag = false;
    for (let byteNumber = asn1View.byteLength - 1; byteNumber >= 0; byteNumber--) {
      currentByte = asn1View[byteNumber];
      for (let i = 0; i < 8; i++) {
        if ((currentByte & 1) === 1) {
          switch (bitNumber) {
            case firstBit:
              digits = viewSub(power2(bitNumber), digits);
              result = "-";
              break;
            default:
              digits = viewAdd(digits, power2(bitNumber));
          }
        }
        bitNumber++;
        currentByte >>= 1;
      }
    }
    for (let i = 0; i < digits.length; i++) {
      if (digits[i])
        flag = true;
      if (flag)
        result += digitsString.charAt(digits[i]);
    }
    if (flag === false)
      result += digitsString.charAt(0);
    return result;
  }
};
_a$p = LocalIntegerValueBlock;
LocalIntegerValueBlock.NAME = "IntegerValueBlock";
(() => {
  Object.defineProperty(_a$p.prototype, "valueHex", {
    set: function(v) {
      this.valueHexView = new Uint8Array(v);
      this.setValueHex();
    },
    get: function() {
      return this.valueHexView.slice().buffer;
    }
  });
})();
var _a$o;
var Integer = class _Integer extends BaseBlock {
  constructor(parameters = {}) {
    super(parameters, LocalIntegerValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 2;
  }
  toBigInt() {
    assertBigInt();
    return BigInt(this.valueBlock.toString());
  }
  static fromBigInt(value) {
    assertBigInt();
    const bigIntValue = BigInt(value);
    const writer = new ViewWriter();
    const hex = bigIntValue.toString(16).replace(/^-/, "");
    const view = new Uint8Array(Convert.FromHex(hex));
    if (bigIntValue < 0) {
      const first = new Uint8Array(view.length + (view[0] & 128 ? 1 : 0));
      first[0] |= 128;
      const firstInt = BigInt(`0x${Convert.ToHex(first)}`);
      const secondInt = firstInt + bigIntValue;
      const second = BufferSourceConverter.toUint8Array(Convert.FromHex(secondInt.toString(16)));
      second[0] |= 128;
      writer.write(second);
    } else {
      if (view[0] & 128) {
        writer.write(new Uint8Array([0]));
      }
      writer.write(view);
    }
    const res = new _Integer({
      valueHex: writer.final()
    });
    return res;
  }
  convertToDER() {
    const integer = new _Integer({ valueHex: this.valueBlock.valueHexView });
    integer.valueBlock.toDER();
    return integer;
  }
  convertFromDER() {
    return new _Integer({
      valueHex: this.valueBlock.valueHexView[0] === 0 ? this.valueBlock.valueHexView.subarray(1) : this.valueBlock.valueHexView
    });
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.valueBlock.toString()}`;
  }
};
_a$o = Integer;
(() => {
  typeStore.Integer = _a$o;
})();
Integer.NAME = "INTEGER";
var _a$n;
var Enumerated = class extends Integer {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 10;
  }
};
_a$n = Enumerated;
(() => {
  typeStore.Enumerated = _a$n;
})();
Enumerated.NAME = "ENUMERATED";
var LocalSidValueBlock = class extends HexBlock(ValueBlock) {
  constructor({ valueDec = -1, isFirstSid = false, ...parameters } = {}) {
    super(parameters);
    this.valueDec = valueDec;
    this.isFirstSid = isFirstSid;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    if (!inputLength) {
      return inputOffset;
    }
    const inputView = BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, inputView, inputOffset, inputLength)) {
      return -1;
    }
    const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
    this.valueHexView = new Uint8Array(inputLength);
    for (let i = 0; i < inputLength; i++) {
      this.valueHexView[i] = intBuffer[i] & 127;
      this.blockLength++;
      if ((intBuffer[i] & 128) === 0)
        break;
    }
    const tempView = new Uint8Array(this.blockLength);
    for (let i = 0; i < this.blockLength; i++) {
      tempView[i] = this.valueHexView[i];
    }
    this.valueHexView = tempView;
    if ((intBuffer[this.blockLength - 1] & 128) !== 0) {
      this.error = "End of input reached before message was fully decoded";
      return -1;
    }
    if (this.valueHexView[0] === 0)
      this.warnings.push("Needlessly long format of SID encoding");
    if (this.blockLength <= 8)
      this.valueDec = utilFromBase(this.valueHexView, 7);
    else {
      this.isHexOnly = true;
      this.warnings.push("Too big SID for decoding, hex only");
    }
    return inputOffset + this.blockLength;
  }
  set valueBigInt(value) {
    assertBigInt();
    let bits = BigInt(value).toString(2);
    while (bits.length % 7) {
      bits = "0" + bits;
    }
    const bytes = new Uint8Array(bits.length / 7);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(bits.slice(i * 7, i * 7 + 7), 2) + (i + 1 < bytes.length ? 128 : 0);
    }
    this.fromBER(bytes.buffer, 0, bytes.length);
  }
  toBER(sizeOnly) {
    if (this.isHexOnly) {
      if (sizeOnly)
        return new ArrayBuffer(this.valueHexView.byteLength);
      const curView = this.valueHexView;
      const retView2 = new Uint8Array(this.blockLength);
      for (let i = 0; i < this.blockLength - 1; i++)
        retView2[i] = curView[i] | 128;
      retView2[this.blockLength - 1] = curView[this.blockLength - 1];
      return retView2.buffer;
    }
    const encodedBuf = utilToBase(this.valueDec, 7);
    if (encodedBuf.byteLength === 0) {
      this.error = "Error during encoding SID value";
      return EMPTY_BUFFER;
    }
    const retView = new Uint8Array(encodedBuf.byteLength);
    if (!sizeOnly) {
      const encodedView = new Uint8Array(encodedBuf);
      const len = encodedBuf.byteLength - 1;
      for (let i = 0; i < len; i++)
        retView[i] = encodedView[i] | 128;
      retView[len] = encodedView[len];
    }
    return retView;
  }
  toString() {
    let result = "";
    if (this.isHexOnly)
      result = Convert.ToHex(this.valueHexView);
    else {
      if (this.isFirstSid) {
        let sidValue = this.valueDec;
        if (this.valueDec <= 39)
          result = "0.";
        else {
          if (this.valueDec <= 79) {
            result = "1.";
            sidValue -= 40;
          } else {
            result = "2.";
            sidValue -= 80;
          }
        }
        result += sidValue.toString();
      } else
        result = this.valueDec.toString();
    }
    return result;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      valueDec: this.valueDec,
      isFirstSid: this.isFirstSid
    };
  }
};
LocalSidValueBlock.NAME = "sidBlock";
var LocalObjectIdentifierValueBlock = class extends ValueBlock {
  constructor({ value = EMPTY_STRING, ...parameters } = {}) {
    super(parameters);
    this.value = [];
    if (value) {
      this.fromString(value);
    }
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    let resultOffset = inputOffset;
    while (inputLength > 0) {
      const sidBlock = new LocalSidValueBlock();
      resultOffset = sidBlock.fromBER(inputBuffer, resultOffset, inputLength);
      if (resultOffset === -1) {
        this.blockLength = 0;
        this.error = sidBlock.error;
        return resultOffset;
      }
      if (this.value.length === 0)
        sidBlock.isFirstSid = true;
      this.blockLength += sidBlock.blockLength;
      inputLength -= sidBlock.blockLength;
      this.value.push(sidBlock);
    }
    return resultOffset;
  }
  toBER(sizeOnly) {
    const retBuffers = [];
    for (let i = 0; i < this.value.length; i++) {
      const valueBuf = this.value[i].toBER(sizeOnly);
      if (valueBuf.byteLength === 0) {
        this.error = this.value[i].error;
        return EMPTY_BUFFER;
      }
      retBuffers.push(valueBuf);
    }
    return concat(retBuffers);
  }
  fromString(string) {
    this.value = [];
    let pos1 = 0;
    let pos2 = 0;
    let sid = "";
    let flag = false;
    do {
      pos2 = string.indexOf(".", pos1);
      if (pos2 === -1)
        sid = string.substring(pos1);
      else
        sid = string.substring(pos1, pos2);
      pos1 = pos2 + 1;
      if (flag) {
        const sidBlock = this.value[0];
        let plus2 = 0;
        switch (sidBlock.valueDec) {
          case 0:
            break;
          case 1:
            plus2 = 40;
            break;
          case 2:
            plus2 = 80;
            break;
          default:
            this.value = [];
            return;
        }
        const parsedSID = parseInt(sid, 10);
        if (isNaN(parsedSID))
          return;
        sidBlock.valueDec = parsedSID + plus2;
        flag = false;
      } else {
        const sidBlock = new LocalSidValueBlock();
        if (sid > Number.MAX_SAFE_INTEGER) {
          assertBigInt();
          const sidValue = BigInt(sid);
          sidBlock.valueBigInt = sidValue;
        } else {
          sidBlock.valueDec = parseInt(sid, 10);
          if (isNaN(sidBlock.valueDec))
            return;
        }
        if (!this.value.length) {
          sidBlock.isFirstSid = true;
          flag = true;
        }
        this.value.push(sidBlock);
      }
    } while (pos2 !== -1);
  }
  toString() {
    let result = "";
    let isHexOnly = false;
    for (let i = 0; i < this.value.length; i++) {
      isHexOnly = this.value[i].isHexOnly;
      let sidStr = this.value[i].toString();
      if (i !== 0)
        result = `${result}.`;
      if (isHexOnly) {
        sidStr = `{${sidStr}}`;
        if (this.value[i].isFirstSid)
          result = `2.{${sidStr} - 80}`;
        else
          result += sidStr;
      } else
        result += sidStr;
    }
    return result;
  }
  toJSON() {
    const object = {
      ...super.toJSON(),
      value: this.toString(),
      sidArray: []
    };
    for (let i = 0; i < this.value.length; i++) {
      object.sidArray.push(this.value[i].toJSON());
    }
    return object;
  }
};
LocalObjectIdentifierValueBlock.NAME = "ObjectIdentifierValueBlock";
var _a$m;
var ObjectIdentifier = class extends BaseBlock {
  constructor(parameters = {}) {
    super(parameters, LocalObjectIdentifierValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 6;
  }
  getValue() {
    return this.valueBlock.toString();
  }
  setValue(value) {
    this.valueBlock.fromString(value);
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.valueBlock.toString() || "empty"}`;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      value: this.getValue()
    };
  }
};
_a$m = ObjectIdentifier;
(() => {
  typeStore.ObjectIdentifier = _a$m;
})();
ObjectIdentifier.NAME = "OBJECT IDENTIFIER";
var LocalRelativeSidValueBlock = class extends HexBlock(LocalBaseBlock) {
  constructor({ valueDec = 0, ...parameters } = {}) {
    super(parameters);
    this.valueDec = valueDec;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    if (inputLength === 0)
      return inputOffset;
    const inputView = BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, inputView, inputOffset, inputLength))
      return -1;
    const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
    this.valueHexView = new Uint8Array(inputLength);
    for (let i = 0; i < inputLength; i++) {
      this.valueHexView[i] = intBuffer[i] & 127;
      this.blockLength++;
      if ((intBuffer[i] & 128) === 0)
        break;
    }
    const tempView = new Uint8Array(this.blockLength);
    for (let i = 0; i < this.blockLength; i++)
      tempView[i] = this.valueHexView[i];
    this.valueHexView = tempView;
    if ((intBuffer[this.blockLength - 1] & 128) !== 0) {
      this.error = "End of input reached before message was fully decoded";
      return -1;
    }
    if (this.valueHexView[0] === 0)
      this.warnings.push("Needlessly long format of SID encoding");
    if (this.blockLength <= 8)
      this.valueDec = utilFromBase(this.valueHexView, 7);
    else {
      this.isHexOnly = true;
      this.warnings.push("Too big SID for decoding, hex only");
    }
    return inputOffset + this.blockLength;
  }
  toBER(sizeOnly) {
    if (this.isHexOnly) {
      if (sizeOnly)
        return new ArrayBuffer(this.valueHexView.byteLength);
      const curView = this.valueHexView;
      const retView2 = new Uint8Array(this.blockLength);
      for (let i = 0; i < this.blockLength - 1; i++)
        retView2[i] = curView[i] | 128;
      retView2[this.blockLength - 1] = curView[this.blockLength - 1];
      return retView2.buffer;
    }
    const encodedBuf = utilToBase(this.valueDec, 7);
    if (encodedBuf.byteLength === 0) {
      this.error = "Error during encoding SID value";
      return EMPTY_BUFFER;
    }
    const retView = new Uint8Array(encodedBuf.byteLength);
    if (!sizeOnly) {
      const encodedView = new Uint8Array(encodedBuf);
      const len = encodedBuf.byteLength - 1;
      for (let i = 0; i < len; i++)
        retView[i] = encodedView[i] | 128;
      retView[len] = encodedView[len];
    }
    return retView.buffer;
  }
  toString() {
    let result = "";
    if (this.isHexOnly)
      result = Convert.ToHex(this.valueHexView);
    else {
      result = this.valueDec.toString();
    }
    return result;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      valueDec: this.valueDec
    };
  }
};
LocalRelativeSidValueBlock.NAME = "relativeSidBlock";
var LocalRelativeObjectIdentifierValueBlock = class extends ValueBlock {
  constructor({ value = EMPTY_STRING, ...parameters } = {}) {
    super(parameters);
    this.value = [];
    if (value) {
      this.fromString(value);
    }
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    let resultOffset = inputOffset;
    while (inputLength > 0) {
      const sidBlock = new LocalRelativeSidValueBlock();
      resultOffset = sidBlock.fromBER(inputBuffer, resultOffset, inputLength);
      if (resultOffset === -1) {
        this.blockLength = 0;
        this.error = sidBlock.error;
        return resultOffset;
      }
      this.blockLength += sidBlock.blockLength;
      inputLength -= sidBlock.blockLength;
      this.value.push(sidBlock);
    }
    return resultOffset;
  }
  toBER(sizeOnly, writer) {
    const retBuffers = [];
    for (let i = 0; i < this.value.length; i++) {
      const valueBuf = this.value[i].toBER(sizeOnly);
      if (valueBuf.byteLength === 0) {
        this.error = this.value[i].error;
        return EMPTY_BUFFER;
      }
      retBuffers.push(valueBuf);
    }
    return concat(retBuffers);
  }
  fromString(string) {
    this.value = [];
    let pos1 = 0;
    let pos2 = 0;
    let sid = "";
    do {
      pos2 = string.indexOf(".", pos1);
      if (pos2 === -1)
        sid = string.substring(pos1);
      else
        sid = string.substring(pos1, pos2);
      pos1 = pos2 + 1;
      const sidBlock = new LocalRelativeSidValueBlock();
      sidBlock.valueDec = parseInt(sid, 10);
      if (isNaN(sidBlock.valueDec))
        return true;
      this.value.push(sidBlock);
    } while (pos2 !== -1);
    return true;
  }
  toString() {
    let result = "";
    let isHexOnly = false;
    for (let i = 0; i < this.value.length; i++) {
      isHexOnly = this.value[i].isHexOnly;
      let sidStr = this.value[i].toString();
      if (i !== 0)
        result = `${result}.`;
      if (isHexOnly) {
        sidStr = `{${sidStr}}`;
        result += sidStr;
      } else
        result += sidStr;
    }
    return result;
  }
  toJSON() {
    const object = {
      ...super.toJSON(),
      value: this.toString(),
      sidArray: []
    };
    for (let i = 0; i < this.value.length; i++)
      object.sidArray.push(this.value[i].toJSON());
    return object;
  }
};
LocalRelativeObjectIdentifierValueBlock.NAME = "RelativeObjectIdentifierValueBlock";
var _a$l;
var RelativeObjectIdentifier = class extends BaseBlock {
  constructor(parameters = {}) {
    super(parameters, LocalRelativeObjectIdentifierValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 13;
  }
  getValue() {
    return this.valueBlock.toString();
  }
  setValue(value) {
    this.valueBlock.fromString(value);
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.valueBlock.toString() || "empty"}`;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      value: this.getValue()
    };
  }
};
_a$l = RelativeObjectIdentifier;
(() => {
  typeStore.RelativeObjectIdentifier = _a$l;
})();
RelativeObjectIdentifier.NAME = "RelativeObjectIdentifier";
var _a$k;
var Sequence = class extends Constructed {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 16;
  }
};
_a$k = Sequence;
(() => {
  typeStore.Sequence = _a$k;
})();
Sequence.NAME = "SEQUENCE";
var _a$j;
var Set = class extends Constructed {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 17;
  }
};
_a$j = Set;
(() => {
  typeStore.Set = _a$j;
})();
Set.NAME = "SET";
var LocalStringValueBlock = class extends HexBlock(ValueBlock) {
  constructor({ ...parameters } = {}) {
    super(parameters);
    this.isHexOnly = true;
    this.value = EMPTY_STRING;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      value: this.value
    };
  }
};
LocalStringValueBlock.NAME = "StringValueBlock";
var LocalSimpleStringValueBlock = class extends LocalStringValueBlock {
};
LocalSimpleStringValueBlock.NAME = "SimpleStringValueBlock";
var LocalSimpleStringBlock = class extends BaseStringBlock {
  constructor({ ...parameters } = {}) {
    super(parameters, LocalSimpleStringValueBlock);
  }
  fromBuffer(inputBuffer) {
    this.valueBlock.value = String.fromCharCode.apply(null, BufferSourceConverter.toUint8Array(inputBuffer));
  }
  fromString(inputString) {
    const strLen = inputString.length;
    const view = this.valueBlock.valueHexView = new Uint8Array(strLen);
    for (let i = 0; i < strLen; i++)
      view[i] = inputString.charCodeAt(i);
    this.valueBlock.value = inputString;
  }
};
LocalSimpleStringBlock.NAME = "SIMPLE STRING";
var LocalUtf8StringValueBlock = class extends LocalSimpleStringBlock {
  fromBuffer(inputBuffer) {
    this.valueBlock.valueHexView = BufferSourceConverter.toUint8Array(inputBuffer);
    try {
      this.valueBlock.value = Convert.ToUtf8String(inputBuffer);
    } catch (ex) {
      this.warnings.push(`Error during "decodeURIComponent": ${ex}, using raw string`);
      this.valueBlock.value = Convert.ToBinary(inputBuffer);
    }
  }
  fromString(inputString) {
    this.valueBlock.valueHexView = new Uint8Array(Convert.FromUtf8String(inputString));
    this.valueBlock.value = inputString;
  }
};
LocalUtf8StringValueBlock.NAME = "Utf8StringValueBlock";
var _a$i;
var Utf8String = class extends LocalUtf8StringValueBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 12;
  }
};
_a$i = Utf8String;
(() => {
  typeStore.Utf8String = _a$i;
})();
Utf8String.NAME = "UTF8String";
var LocalBmpStringValueBlock = class extends LocalSimpleStringBlock {
  fromBuffer(inputBuffer) {
    this.valueBlock.value = Convert.ToUtf16String(inputBuffer);
    this.valueBlock.valueHexView = BufferSourceConverter.toUint8Array(inputBuffer);
  }
  fromString(inputString) {
    this.valueBlock.value = inputString;
    this.valueBlock.valueHexView = new Uint8Array(Convert.FromUtf16String(inputString));
  }
};
LocalBmpStringValueBlock.NAME = "BmpStringValueBlock";
var _a$h;
var BmpString = class extends LocalBmpStringValueBlock {
  constructor({ ...parameters } = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 30;
  }
};
_a$h = BmpString;
(() => {
  typeStore.BmpString = _a$h;
})();
BmpString.NAME = "BMPString";
var LocalUniversalStringValueBlock = class extends LocalSimpleStringBlock {
  fromBuffer(inputBuffer) {
    const copyBuffer = ArrayBuffer.isView(inputBuffer) ? inputBuffer.slice().buffer : inputBuffer.slice(0);
    const valueView = new Uint8Array(copyBuffer);
    for (let i = 0; i < valueView.length; i += 4) {
      valueView[i] = valueView[i + 3];
      valueView[i + 1] = valueView[i + 2];
      valueView[i + 2] = 0;
      valueView[i + 3] = 0;
    }
    this.valueBlock.value = String.fromCharCode.apply(null, new Uint32Array(copyBuffer));
  }
  fromString(inputString) {
    const strLength = inputString.length;
    const valueHexView = this.valueBlock.valueHexView = new Uint8Array(strLength * 4);
    for (let i = 0; i < strLength; i++) {
      const codeBuf = utilToBase(inputString.charCodeAt(i), 8);
      const codeView = new Uint8Array(codeBuf);
      if (codeView.length > 4)
        continue;
      const dif = 4 - codeView.length;
      for (let j = codeView.length - 1; j >= 0; j--)
        valueHexView[i * 4 + j + dif] = codeView[j];
    }
    this.valueBlock.value = inputString;
  }
};
LocalUniversalStringValueBlock.NAME = "UniversalStringValueBlock";
var _a$g;
var UniversalString = class extends LocalUniversalStringValueBlock {
  constructor({ ...parameters } = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 28;
  }
};
_a$g = UniversalString;
(() => {
  typeStore.UniversalString = _a$g;
})();
UniversalString.NAME = "UniversalString";
var _a$f;
var NumericString = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 18;
  }
};
_a$f = NumericString;
(() => {
  typeStore.NumericString = _a$f;
})();
NumericString.NAME = "NumericString";
var _a$e;
var PrintableString = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 19;
  }
};
_a$e = PrintableString;
(() => {
  typeStore.PrintableString = _a$e;
})();
PrintableString.NAME = "PrintableString";
var _a$d;
var TeletexString = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 20;
  }
};
_a$d = TeletexString;
(() => {
  typeStore.TeletexString = _a$d;
})();
TeletexString.NAME = "TeletexString";
var _a$c;
var VideotexString = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 21;
  }
};
_a$c = VideotexString;
(() => {
  typeStore.VideotexString = _a$c;
})();
VideotexString.NAME = "VideotexString";
var _a$b;
var IA5String = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 22;
  }
};
_a$b = IA5String;
(() => {
  typeStore.IA5String = _a$b;
})();
IA5String.NAME = "IA5String";
var _a$a;
var GraphicString = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 25;
  }
};
_a$a = GraphicString;
(() => {
  typeStore.GraphicString = _a$a;
})();
GraphicString.NAME = "GraphicString";
var _a$9;
var VisibleString = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 26;
  }
};
_a$9 = VisibleString;
(() => {
  typeStore.VisibleString = _a$9;
})();
VisibleString.NAME = "VisibleString";
var _a$8;
var GeneralString = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 27;
  }
};
_a$8 = GeneralString;
(() => {
  typeStore.GeneralString = _a$8;
})();
GeneralString.NAME = "GeneralString";
var _a$7;
var CharacterString = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 29;
  }
};
_a$7 = CharacterString;
(() => {
  typeStore.CharacterString = _a$7;
})();
CharacterString.NAME = "CharacterString";
var _a$6;
var UTCTime = class extends VisibleString {
  constructor({ value, valueDate, ...parameters } = {}) {
    super(parameters);
    this.year = 0;
    this.month = 0;
    this.day = 0;
    this.hour = 0;
    this.minute = 0;
    this.second = 0;
    if (value) {
      this.fromString(value);
      this.valueBlock.valueHexView = new Uint8Array(value.length);
      for (let i = 0; i < value.length; i++)
        this.valueBlock.valueHexView[i] = value.charCodeAt(i);
    }
    if (valueDate) {
      this.fromDate(valueDate);
      this.valueBlock.valueHexView = new Uint8Array(this.toBuffer());
    }
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 23;
  }
  fromBuffer(inputBuffer) {
    this.fromString(String.fromCharCode.apply(null, BufferSourceConverter.toUint8Array(inputBuffer)));
  }
  toBuffer() {
    const str = this.toString();
    const buffer = new ArrayBuffer(str.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < str.length; i++)
      view[i] = str.charCodeAt(i);
    return buffer;
  }
  fromDate(inputDate) {
    this.year = inputDate.getUTCFullYear();
    this.month = inputDate.getUTCMonth() + 1;
    this.day = inputDate.getUTCDate();
    this.hour = inputDate.getUTCHours();
    this.minute = inputDate.getUTCMinutes();
    this.second = inputDate.getUTCSeconds();
  }
  toDate() {
    return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second));
  }
  fromString(inputString) {
    const parser = /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z/ig;
    const parserArray = parser.exec(inputString);
    if (parserArray === null) {
      this.error = "Wrong input string for conversion";
      return;
    }
    const year = parseInt(parserArray[1], 10);
    if (year >= 50)
      this.year = 1900 + year;
    else
      this.year = 2e3 + year;
    this.month = parseInt(parserArray[2], 10);
    this.day = parseInt(parserArray[3], 10);
    this.hour = parseInt(parserArray[4], 10);
    this.minute = parseInt(parserArray[5], 10);
    this.second = parseInt(parserArray[6], 10);
  }
  toString(encoding = "iso") {
    if (encoding === "iso") {
      const outputArray = new Array(7);
      outputArray[0] = padNumber(this.year < 2e3 ? this.year - 1900 : this.year - 2e3, 2);
      outputArray[1] = padNumber(this.month, 2);
      outputArray[2] = padNumber(this.day, 2);
      outputArray[3] = padNumber(this.hour, 2);
      outputArray[4] = padNumber(this.minute, 2);
      outputArray[5] = padNumber(this.second, 2);
      outputArray[6] = "Z";
      return outputArray.join("");
    }
    return super.toString(encoding);
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.toDate().toISOString()}`;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      year: this.year,
      month: this.month,
      day: this.day,
      hour: this.hour,
      minute: this.minute,
      second: this.second
    };
  }
};
_a$6 = UTCTime;
(() => {
  typeStore.UTCTime = _a$6;
})();
UTCTime.NAME = "UTCTime";
var _a$5;
var GeneralizedTime = class extends UTCTime {
  constructor(parameters = {}) {
    var _b;
    super(parameters);
    (_b = this.millisecond) !== null && _b !== void 0 ? _b : this.millisecond = 0;
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 24;
  }
  fromDate(inputDate) {
    super.fromDate(inputDate);
    this.millisecond = inputDate.getUTCMilliseconds();
  }
  toDate() {
    return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.millisecond));
  }
  fromString(inputString) {
    let isUTC = false;
    let timeString = "";
    let dateTimeString = "";
    let fractionPart = 0;
    let parser;
    let hourDifference = 0;
    let minuteDifference = 0;
    if (inputString[inputString.length - 1] === "Z") {
      timeString = inputString.substring(0, inputString.length - 1);
      isUTC = true;
    } else {
      const number = new Number(inputString[inputString.length - 1]);
      if (isNaN(number.valueOf()))
        throw new Error("Wrong input string for conversion");
      timeString = inputString;
    }
    if (isUTC) {
      if (timeString.indexOf("+") !== -1)
        throw new Error("Wrong input string for conversion");
      if (timeString.indexOf("-") !== -1)
        throw new Error("Wrong input string for conversion");
    } else {
      let multiplier = 1;
      let differencePosition = timeString.indexOf("+");
      let differenceString = "";
      if (differencePosition === -1) {
        differencePosition = timeString.indexOf("-");
        multiplier = -1;
      }
      if (differencePosition !== -1) {
        differenceString = timeString.substring(differencePosition + 1);
        timeString = timeString.substring(0, differencePosition);
        if (differenceString.length !== 2 && differenceString.length !== 4)
          throw new Error("Wrong input string for conversion");
        let number = parseInt(differenceString.substring(0, 2), 10);
        if (isNaN(number.valueOf()))
          throw new Error("Wrong input string for conversion");
        hourDifference = multiplier * number;
        if (differenceString.length === 4) {
          number = parseInt(differenceString.substring(2, 4), 10);
          if (isNaN(number.valueOf()))
            throw new Error("Wrong input string for conversion");
          minuteDifference = multiplier * number;
        }
      }
    }
    let fractionPointPosition = timeString.indexOf(".");
    if (fractionPointPosition === -1)
      fractionPointPosition = timeString.indexOf(",");
    if (fractionPointPosition !== -1) {
      const fractionPartCheck = new Number(`0${timeString.substring(fractionPointPosition)}`);
      if (isNaN(fractionPartCheck.valueOf()))
        throw new Error("Wrong input string for conversion");
      fractionPart = fractionPartCheck.valueOf();
      dateTimeString = timeString.substring(0, fractionPointPosition);
    } else
      dateTimeString = timeString;
    switch (true) {
      case dateTimeString.length === 8:
        parser = /(\d{4})(\d{2})(\d{2})/ig;
        if (fractionPointPosition !== -1)
          throw new Error("Wrong input string for conversion");
        break;
      case dateTimeString.length === 10:
        parser = /(\d{4})(\d{2})(\d{2})(\d{2})/ig;
        if (fractionPointPosition !== -1) {
          let fractionResult = 60 * fractionPart;
          this.minute = Math.floor(fractionResult);
          fractionResult = 60 * (fractionResult - this.minute);
          this.second = Math.floor(fractionResult);
          fractionResult = 1e3 * (fractionResult - this.second);
          this.millisecond = Math.floor(fractionResult);
        }
        break;
      case dateTimeString.length === 12:
        parser = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/ig;
        if (fractionPointPosition !== -1) {
          let fractionResult = 60 * fractionPart;
          this.second = Math.floor(fractionResult);
          fractionResult = 1e3 * (fractionResult - this.second);
          this.millisecond = Math.floor(fractionResult);
        }
        break;
      case dateTimeString.length === 14:
        parser = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/ig;
        if (fractionPointPosition !== -1) {
          const fractionResult = 1e3 * fractionPart;
          this.millisecond = Math.floor(fractionResult);
        }
        break;
      default:
        throw new Error("Wrong input string for conversion");
    }
    const parserArray = parser.exec(dateTimeString);
    if (parserArray === null)
      throw new Error("Wrong input string for conversion");
    for (let j = 1; j < parserArray.length; j++) {
      switch (j) {
        case 1:
          this.year = parseInt(parserArray[j], 10);
          break;
        case 2:
          this.month = parseInt(parserArray[j], 10);
          break;
        case 3:
          this.day = parseInt(parserArray[j], 10);
          break;
        case 4:
          this.hour = parseInt(parserArray[j], 10) + hourDifference;
          break;
        case 5:
          this.minute = parseInt(parserArray[j], 10) + minuteDifference;
          break;
        case 6:
          this.second = parseInt(parserArray[j], 10);
          break;
        default:
          throw new Error("Wrong input string for conversion");
      }
    }
    if (isUTC === false) {
      const tempDate = new Date(this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
      this.year = tempDate.getUTCFullYear();
      this.month = tempDate.getUTCMonth();
      this.day = tempDate.getUTCDay();
      this.hour = tempDate.getUTCHours();
      this.minute = tempDate.getUTCMinutes();
      this.second = tempDate.getUTCSeconds();
      this.millisecond = tempDate.getUTCMilliseconds();
    }
  }
  toString(encoding = "iso") {
    if (encoding === "iso") {
      const outputArray = [];
      outputArray.push(padNumber(this.year, 4));
      outputArray.push(padNumber(this.month, 2));
      outputArray.push(padNumber(this.day, 2));
      outputArray.push(padNumber(this.hour, 2));
      outputArray.push(padNumber(this.minute, 2));
      outputArray.push(padNumber(this.second, 2));
      if (this.millisecond !== 0) {
        outputArray.push(".");
        outputArray.push(padNumber(this.millisecond, 3));
      }
      outputArray.push("Z");
      return outputArray.join("");
    }
    return super.toString(encoding);
  }
  toJSON() {
    return {
      ...super.toJSON(),
      millisecond: this.millisecond
    };
  }
};
_a$5 = GeneralizedTime;
(() => {
  typeStore.GeneralizedTime = _a$5;
})();
GeneralizedTime.NAME = "GeneralizedTime";
var _a$4;
var DATE = class extends Utf8String {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 31;
  }
};
_a$4 = DATE;
(() => {
  typeStore.DATE = _a$4;
})();
DATE.NAME = "DATE";
var _a$3;
var TimeOfDay = class extends Utf8String {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 32;
  }
};
_a$3 = TimeOfDay;
(() => {
  typeStore.TimeOfDay = _a$3;
})();
TimeOfDay.NAME = "TimeOfDay";
var _a$2;
var DateTime = class extends Utf8String {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 33;
  }
};
_a$2 = DateTime;
(() => {
  typeStore.DateTime = _a$2;
})();
DateTime.NAME = "DateTime";
var _a$1;
var Duration = class extends Utf8String {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 34;
  }
};
_a$1 = Duration;
(() => {
  typeStore.Duration = _a$1;
})();
Duration.NAME = "Duration";
var _a;
var TIME = class extends Utf8String {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 14;
  }
};
_a = TIME;
(() => {
  typeStore.TIME = _a;
})();
TIME.NAME = "TIME";
var Any = class {
  constructor({ name = EMPTY_STRING, optional = false } = {}) {
    this.name = name;
    this.optional = optional;
  }
};
var Choice = class extends Any {
  constructor({ value = [], ...parameters } = {}) {
    super(parameters);
    this.value = value;
  }
};
var Repeated = class extends Any {
  constructor({ value = new Any(), local = false, ...parameters } = {}) {
    super(parameters);
    this.value = value;
    this.local = local;
  }
};
var RawData = class {
  constructor({ data = EMPTY_VIEW } = {}) {
    this.dataView = BufferSourceConverter.toUint8Array(data);
  }
  get data() {
    return this.dataView.slice().buffer;
  }
  set data(value) {
    this.dataView = BufferSourceConverter.toUint8Array(value);
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const endLength = inputOffset + inputLength;
    this.dataView = BufferSourceConverter.toUint8Array(inputBuffer).subarray(inputOffset, endLength);
    return endLength;
  }
  toBER(sizeOnly) {
    return this.dataView.slice().buffer;
  }
};
function compareSchema(root, inputData, inputSchema) {
  if (inputSchema instanceof Choice) {
    for (let j = 0; j < inputSchema.value.length; j++) {
      const result = compareSchema(root, inputData, inputSchema.value[j]);
      if (result.verified) {
        return {
          verified: true,
          result: root
        };
      }
    }
    {
      const _result = {
        verified: false,
        result: {
          error: "Wrong values for Choice type"
        }
      };
      if (inputSchema.hasOwnProperty(NAME))
        _result.name = inputSchema.name;
      return _result;
    }
  }
  if (inputSchema instanceof Any) {
    if (inputSchema.hasOwnProperty(NAME))
      root[inputSchema.name] = inputData;
    return {
      verified: true,
      result: root
    };
  }
  if (root instanceof Object === false) {
    return {
      verified: false,
      result: { error: "Wrong root object" }
    };
  }
  if (inputData instanceof Object === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 data" }
    };
  }
  if (inputSchema instanceof Object === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema" }
    };
  }
  if (ID_BLOCK in inputSchema === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema" }
    };
  }
  if (FROM_BER in inputSchema.idBlock === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema" }
    };
  }
  if (TO_BER in inputSchema.idBlock === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema" }
    };
  }
  const encodedId = inputSchema.idBlock.toBER(false);
  if (encodedId.byteLength === 0) {
    return {
      verified: false,
      result: { error: "Error encoding idBlock for ASN.1 schema" }
    };
  }
  const decodedOffset = inputSchema.idBlock.fromBER(encodedId, 0, encodedId.byteLength);
  if (decodedOffset === -1) {
    return {
      verified: false,
      result: { error: "Error decoding idBlock for ASN.1 schema" }
    };
  }
  if (inputSchema.idBlock.hasOwnProperty(TAG_CLASS) === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema" }
    };
  }
  if (inputSchema.idBlock.tagClass !== inputData.idBlock.tagClass) {
    return {
      verified: false,
      result: root
    };
  }
  if (inputSchema.idBlock.hasOwnProperty(TAG_NUMBER) === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema" }
    };
  }
  if (inputSchema.idBlock.tagNumber !== inputData.idBlock.tagNumber) {
    return {
      verified: false,
      result: root
    };
  }
  if (inputSchema.idBlock.hasOwnProperty(IS_CONSTRUCTED) === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema" }
    };
  }
  if (inputSchema.idBlock.isConstructed !== inputData.idBlock.isConstructed) {
    return {
      verified: false,
      result: root
    };
  }
  if (!(IS_HEX_ONLY in inputSchema.idBlock)) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema" }
    };
  }
  if (inputSchema.idBlock.isHexOnly !== inputData.idBlock.isHexOnly) {
    return {
      verified: false,
      result: root
    };
  }
  if (inputSchema.idBlock.isHexOnly) {
    if (VALUE_HEX_VIEW in inputSchema.idBlock === false) {
      return {
        verified: false,
        result: { error: "Wrong ASN.1 schema" }
      };
    }
    const schemaView = inputSchema.idBlock.valueHexView;
    const asn1View = inputData.idBlock.valueHexView;
    if (schemaView.length !== asn1View.length) {
      return {
        verified: false,
        result: root
      };
    }
    for (let i = 0; i < schemaView.length; i++) {
      if (schemaView[i] !== asn1View[1]) {
        return {
          verified: false,
          result: root
        };
      }
    }
  }
  if (inputSchema.name) {
    inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
    if (inputSchema.name)
      root[inputSchema.name] = inputData;
  }
  if (inputSchema instanceof typeStore.Constructed) {
    let admission = 0;
    let result = {
      verified: false,
      result: {
        error: "Unknown error"
      }
    };
    let maxLength = inputSchema.valueBlock.value.length;
    if (maxLength > 0) {
      if (inputSchema.valueBlock.value[0] instanceof Repeated) {
        maxLength = inputData.valueBlock.value.length;
      }
    }
    if (maxLength === 0) {
      return {
        verified: true,
        result: root
      };
    }
    if (inputData.valueBlock.value.length === 0 && inputSchema.valueBlock.value.length !== 0) {
      let _optional = true;
      for (let i = 0; i < inputSchema.valueBlock.value.length; i++)
        _optional = _optional && (inputSchema.valueBlock.value[i].optional || false);
      if (_optional) {
        return {
          verified: true,
          result: root
        };
      }
      if (inputSchema.name) {
        inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
        if (inputSchema.name)
          delete root[inputSchema.name];
      }
      root.error = "Inconsistent object length";
      return {
        verified: false,
        result: root
      };
    }
    for (let i = 0; i < maxLength; i++) {
      if (i - admission >= inputData.valueBlock.value.length) {
        if (inputSchema.valueBlock.value[i].optional === false) {
          const _result = {
            verified: false,
            result: root
          };
          root.error = "Inconsistent length between ASN.1 data and schema";
          if (inputSchema.name) {
            inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
            if (inputSchema.name) {
              delete root[inputSchema.name];
              _result.name = inputSchema.name;
            }
          }
          return _result;
        }
      } else {
        if (inputSchema.valueBlock.value[0] instanceof Repeated) {
          result = compareSchema(root, inputData.valueBlock.value[i], inputSchema.valueBlock.value[0].value);
          if (result.verified === false) {
            if (inputSchema.valueBlock.value[0].optional)
              admission++;
            else {
              if (inputSchema.name) {
                inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
                if (inputSchema.name)
                  delete root[inputSchema.name];
              }
              return result;
            }
          }
          if (NAME in inputSchema.valueBlock.value[0] && inputSchema.valueBlock.value[0].name.length > 0) {
            let arrayRoot = {};
            if (LOCAL in inputSchema.valueBlock.value[0] && inputSchema.valueBlock.value[0].local)
              arrayRoot = inputData;
            else
              arrayRoot = root;
            if (typeof arrayRoot[inputSchema.valueBlock.value[0].name] === "undefined")
              arrayRoot[inputSchema.valueBlock.value[0].name] = [];
            arrayRoot[inputSchema.valueBlock.value[0].name].push(inputData.valueBlock.value[i]);
          }
        } else {
          result = compareSchema(root, inputData.valueBlock.value[i - admission], inputSchema.valueBlock.value[i]);
          if (result.verified === false) {
            if (inputSchema.valueBlock.value[i].optional)
              admission++;
            else {
              if (inputSchema.name) {
                inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
                if (inputSchema.name)
                  delete root[inputSchema.name];
              }
              return result;
            }
          }
        }
      }
    }
    if (result.verified === false) {
      const _result = {
        verified: false,
        result: root
      };
      if (inputSchema.name) {
        inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
        if (inputSchema.name) {
          delete root[inputSchema.name];
          _result.name = inputSchema.name;
        }
      }
      return _result;
    }
    return {
      verified: true,
      result: root
    };
  }
  if (inputSchema.primitiveSchema && VALUE_HEX_VIEW in inputData.valueBlock) {
    const asn12 = localFromBER(inputData.valueBlock.valueHexView);
    if (asn12.offset === -1) {
      const _result = {
        verified: false,
        result: asn12.result
      };
      if (inputSchema.name) {
        inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
        if (inputSchema.name) {
          delete root[inputSchema.name];
          _result.name = inputSchema.name;
        }
      }
      return _result;
    }
    return compareSchema(root, asn12.result, inputSchema.primitiveSchema);
  }
  return {
    verified: true,
    result: root
  };
}
function verifySchema(inputBuffer, inputSchema) {
  if (inputSchema instanceof Object === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema type" }
    };
  }
  const asn12 = localFromBER(BufferSourceConverter.toUint8Array(inputBuffer));
  if (asn12.offset === -1) {
    return {
      verified: false,
      result: asn12.result
    };
  }
  return compareSchema(asn12.result, asn12.result, inputSchema);
}

// ../../node_modules/@peculiar/asn1-schema/build/es2015/enums.js
var AsnTypeTypes;
(function(AsnTypeTypes2) {
  AsnTypeTypes2[AsnTypeTypes2["Sequence"] = 0] = "Sequence";
  AsnTypeTypes2[AsnTypeTypes2["Set"] = 1] = "Set";
  AsnTypeTypes2[AsnTypeTypes2["Choice"] = 2] = "Choice";
})(AsnTypeTypes || (AsnTypeTypes = {}));
var AsnPropTypes;
(function(AsnPropTypes2) {
  AsnPropTypes2[AsnPropTypes2["Any"] = 1] = "Any";
  AsnPropTypes2[AsnPropTypes2["Boolean"] = 2] = "Boolean";
  AsnPropTypes2[AsnPropTypes2["OctetString"] = 3] = "OctetString";
  AsnPropTypes2[AsnPropTypes2["BitString"] = 4] = "BitString";
  AsnPropTypes2[AsnPropTypes2["Integer"] = 5] = "Integer";
  AsnPropTypes2[AsnPropTypes2["Enumerated"] = 6] = "Enumerated";
  AsnPropTypes2[AsnPropTypes2["ObjectIdentifier"] = 7] = "ObjectIdentifier";
  AsnPropTypes2[AsnPropTypes2["Utf8String"] = 8] = "Utf8String";
  AsnPropTypes2[AsnPropTypes2["BmpString"] = 9] = "BmpString";
  AsnPropTypes2[AsnPropTypes2["UniversalString"] = 10] = "UniversalString";
  AsnPropTypes2[AsnPropTypes2["NumericString"] = 11] = "NumericString";
  AsnPropTypes2[AsnPropTypes2["PrintableString"] = 12] = "PrintableString";
  AsnPropTypes2[AsnPropTypes2["TeletexString"] = 13] = "TeletexString";
  AsnPropTypes2[AsnPropTypes2["VideotexString"] = 14] = "VideotexString";
  AsnPropTypes2[AsnPropTypes2["IA5String"] = 15] = "IA5String";
  AsnPropTypes2[AsnPropTypes2["GraphicString"] = 16] = "GraphicString";
  AsnPropTypes2[AsnPropTypes2["VisibleString"] = 17] = "VisibleString";
  AsnPropTypes2[AsnPropTypes2["GeneralString"] = 18] = "GeneralString";
  AsnPropTypes2[AsnPropTypes2["CharacterString"] = 19] = "CharacterString";
  AsnPropTypes2[AsnPropTypes2["UTCTime"] = 20] = "UTCTime";
  AsnPropTypes2[AsnPropTypes2["GeneralizedTime"] = 21] = "GeneralizedTime";
  AsnPropTypes2[AsnPropTypes2["DATE"] = 22] = "DATE";
  AsnPropTypes2[AsnPropTypes2["TimeOfDay"] = 23] = "TimeOfDay";
  AsnPropTypes2[AsnPropTypes2["DateTime"] = 24] = "DateTime";
  AsnPropTypes2[AsnPropTypes2["Duration"] = 25] = "Duration";
  AsnPropTypes2[AsnPropTypes2["TIME"] = 26] = "TIME";
  AsnPropTypes2[AsnPropTypes2["Null"] = 27] = "Null";
})(AsnPropTypes || (AsnPropTypes = {}));

// ../../node_modules/@peculiar/asn1-schema/build/es2015/converters.js
var AsnAnyConverter = {
  fromASN: (value) => value instanceof Null ? null : value.valueBeforeDecodeView,
  toASN: (value) => {
    if (value === null) {
      return new Null();
    }
    const schema = fromBER(value);
    if (schema.result.error) {
      throw new Error(schema.result.error);
    }
    return schema.result;
  }
};
var AsnIntegerConverter = {
  fromASN: (value) => value.valueBlock.valueHexView.byteLength >= 4 ? value.valueBlock.toString() : value.valueBlock.valueDec,
  toASN: (value) => new Integer({ value: +value })
};
var AsnEnumeratedConverter = {
  fromASN: (value) => value.valueBlock.valueDec,
  toASN: (value) => new Enumerated({ value })
};
var AsnBitStringConverter = {
  fromASN: (value) => value.valueBlock.valueHexView,
  toASN: (value) => new BitString({ valueHex: value })
};
var AsnObjectIdentifierConverter = {
  fromASN: (value) => value.valueBlock.toString(),
  toASN: (value) => new ObjectIdentifier({ value })
};
var AsnBooleanConverter = {
  fromASN: (value) => value.valueBlock.value,
  toASN: (value) => new Boolean({ value })
};
var AsnOctetStringConverter = {
  fromASN: (value) => value.valueBlock.valueHexView,
  toASN: (value) => new OctetString({ valueHex: value })
};
function createStringConverter(Asn1Type) {
  return {
    fromASN: (value) => value.valueBlock.value,
    toASN: (value) => new Asn1Type({ value })
  };
}
var AsnUtf8StringConverter = createStringConverter(Utf8String);
var AsnBmpStringConverter = createStringConverter(BmpString);
var AsnUniversalStringConverter = createStringConverter(UniversalString);
var AsnNumericStringConverter = createStringConverter(NumericString);
var AsnPrintableStringConverter = createStringConverter(PrintableString);
var AsnTeletexStringConverter = createStringConverter(TeletexString);
var AsnVideotexStringConverter = createStringConverter(VideotexString);
var AsnIA5StringConverter = createStringConverter(IA5String);
var AsnGraphicStringConverter = createStringConverter(GraphicString);
var AsnVisibleStringConverter = createStringConverter(VisibleString);
var AsnGeneralStringConverter = createStringConverter(GeneralString);
var AsnCharacterStringConverter = createStringConverter(CharacterString);
var AsnUTCTimeConverter = {
  fromASN: (value) => value.toDate(),
  toASN: (value) => new UTCTime({ valueDate: value })
};
var AsnGeneralizedTimeConverter = {
  fromASN: (value) => value.toDate(),
  toASN: (value) => new GeneralizedTime({ valueDate: value })
};
var AsnNullConverter = {
  fromASN: () => null,
  toASN: () => {
    return new Null();
  }
};
function defaultConverter(type) {
  switch (type) {
    case AsnPropTypes.Any:
      return AsnAnyConverter;
    case AsnPropTypes.BitString:
      return AsnBitStringConverter;
    case AsnPropTypes.BmpString:
      return AsnBmpStringConverter;
    case AsnPropTypes.Boolean:
      return AsnBooleanConverter;
    case AsnPropTypes.CharacterString:
      return AsnCharacterStringConverter;
    case AsnPropTypes.Enumerated:
      return AsnEnumeratedConverter;
    case AsnPropTypes.GeneralString:
      return AsnGeneralStringConverter;
    case AsnPropTypes.GeneralizedTime:
      return AsnGeneralizedTimeConverter;
    case AsnPropTypes.GraphicString:
      return AsnGraphicStringConverter;
    case AsnPropTypes.IA5String:
      return AsnIA5StringConverter;
    case AsnPropTypes.Integer:
      return AsnIntegerConverter;
    case AsnPropTypes.Null:
      return AsnNullConverter;
    case AsnPropTypes.NumericString:
      return AsnNumericStringConverter;
    case AsnPropTypes.ObjectIdentifier:
      return AsnObjectIdentifierConverter;
    case AsnPropTypes.OctetString:
      return AsnOctetStringConverter;
    case AsnPropTypes.PrintableString:
      return AsnPrintableStringConverter;
    case AsnPropTypes.TeletexString:
      return AsnTeletexStringConverter;
    case AsnPropTypes.UTCTime:
      return AsnUTCTimeConverter;
    case AsnPropTypes.UniversalString:
      return AsnUniversalStringConverter;
    case AsnPropTypes.Utf8String:
      return AsnUtf8StringConverter;
    case AsnPropTypes.VideotexString:
      return AsnVideotexStringConverter;
    case AsnPropTypes.VisibleString:
      return AsnVisibleStringConverter;
    default:
      return null;
  }
}

// ../../node_modules/@peculiar/asn1-schema/build/es2015/helper.js
function isConvertible(target) {
  if (typeof target === "function" && target.prototype) {
    if (target.prototype.toASN && target.prototype.fromASN) {
      return true;
    } else {
      return isConvertible(target.prototype);
    }
  } else {
    return !!(target && typeof target === "object" && "toASN" in target && "fromASN" in target);
  }
}
function isTypeOfArray(target) {
  var _a2;
  if (target) {
    const proto = Object.getPrototypeOf(target);
    if (((_a2 = proto === null || proto === void 0 ? void 0 : proto.prototype) === null || _a2 === void 0 ? void 0 : _a2.constructor) === Array) {
      return true;
    }
    return isTypeOfArray(proto);
  }
  return false;
}
function isArrayEqual(bytes1, bytes2) {
  if (!(bytes1 && bytes2)) {
    return false;
  }
  if (bytes1.byteLength !== bytes2.byteLength) {
    return false;
  }
  const b1 = new Uint8Array(bytes1);
  const b2 = new Uint8Array(bytes2);
  for (let i = 0; i < bytes1.byteLength; i++) {
    if (b1[i] !== b2[i]) {
      return false;
    }
  }
  return true;
}

// ../../node_modules/@peculiar/asn1-schema/build/es2015/schema.js
var AsnSchemaStorage = class {
  constructor() {
    this.items = /* @__PURE__ */ new WeakMap();
  }
  has(target) {
    return this.items.has(target);
  }
  get(target, checkSchema = false) {
    const schema = this.items.get(target);
    if (!schema) {
      throw new Error(`Cannot get schema for '${target.prototype.constructor.name}' target`);
    }
    if (checkSchema && !schema.schema) {
      throw new Error(`Schema '${target.prototype.constructor.name}' doesn't contain ASN.1 schema. Call 'AsnSchemaStorage.cache'.`);
    }
    return schema;
  }
  cache(target) {
    const schema = this.get(target);
    if (!schema.schema) {
      schema.schema = this.create(target, true);
    }
  }
  createDefault(target) {
    const schema = {
      type: AsnTypeTypes.Sequence,
      items: {}
    };
    const parentSchema = this.findParentSchema(target);
    if (parentSchema) {
      Object.assign(schema, parentSchema);
      schema.items = Object.assign({}, schema.items, parentSchema.items);
    }
    return schema;
  }
  create(target, useNames) {
    const schema = this.items.get(target) || this.createDefault(target);
    const asn1Value = [];
    for (const key in schema.items) {
      const item = schema.items[key];
      const name = useNames ? key : "";
      let asn1Item;
      if (typeof item.type === "number") {
        const Asn1TypeName = AsnPropTypes[item.type];
        const Asn1Type = index_es_exports[Asn1TypeName];
        if (!Asn1Type) {
          throw new Error(`Cannot get ASN1 class by name '${Asn1TypeName}'`);
        }
        asn1Item = new Asn1Type({ name });
      } else if (isConvertible(item.type)) {
        const instance = new item.type();
        asn1Item = instance.toSchema(name);
      } else if (item.optional) {
        const itemSchema = this.get(item.type);
        if (itemSchema.type === AsnTypeTypes.Choice) {
          asn1Item = new Any({ name });
        } else {
          asn1Item = this.create(item.type, false);
          asn1Item.name = name;
        }
      } else {
        asn1Item = new Any({ name });
      }
      const optional = !!item.optional || item.defaultValue !== void 0;
      if (item.repeated) {
        asn1Item.name = "";
        const Container = item.repeated === "set" ? Set : Sequence;
        asn1Item = new Container({
          name: "",
          value: [
            new Repeated({
              name,
              value: asn1Item
            })
          ]
        });
      }
      if (item.context !== null && item.context !== void 0) {
        if (item.implicit) {
          if (typeof item.type === "number" || isConvertible(item.type)) {
            const Container = item.repeated ? Constructed : Primitive;
            asn1Value.push(new Container({
              name,
              optional,
              idBlock: {
                tagClass: 3,
                tagNumber: item.context
              }
            }));
          } else {
            this.cache(item.type);
            const isRepeated = !!item.repeated;
            let value = !isRepeated ? this.get(item.type, true).schema : asn1Item;
            value = "valueBlock" in value ? value.valueBlock.value : value.value;
            asn1Value.push(new Constructed({
              name: !isRepeated ? name : "",
              optional,
              idBlock: {
                tagClass: 3,
                tagNumber: item.context
              },
              value
            }));
          }
        } else {
          asn1Value.push(new Constructed({
            optional,
            idBlock: {
              tagClass: 3,
              tagNumber: item.context
            },
            value: [asn1Item]
          }));
        }
      } else {
        asn1Item.optional = optional;
        asn1Value.push(asn1Item);
      }
    }
    switch (schema.type) {
      case AsnTypeTypes.Sequence:
        return new Sequence({ value: asn1Value, name: "" });
      case AsnTypeTypes.Set:
        return new Set({ value: asn1Value, name: "" });
      case AsnTypeTypes.Choice:
        return new Choice({ value: asn1Value, name: "" });
      default:
        throw new Error(`Unsupported ASN1 type in use`);
    }
  }
  set(target, schema) {
    this.items.set(target, schema);
    return this;
  }
  findParentSchema(target) {
    const parent = Object.getPrototypeOf(target);
    if (parent) {
      const schema = this.items.get(parent);
      return schema || this.findParentSchema(parent);
    }
    return null;
  }
};

// ../../node_modules/@peculiar/asn1-schema/build/es2015/storage.js
var schemaStorage = new AsnSchemaStorage();

// ../../node_modules/@peculiar/asn1-schema/build/es2015/errors/schema_validation.js
var AsnSchemaValidationError = class extends Error {
  constructor() {
    super(...arguments);
    this.schemas = [];
  }
};

// ../../node_modules/@peculiar/asn1-schema/build/es2015/parser.js
var AsnParser = class {
  static parse(data, target) {
    const asn1Parsed = fromBER(data);
    if (asn1Parsed.result.error) {
      throw new Error(asn1Parsed.result.error);
    }
    const res = this.fromASN(asn1Parsed.result, target);
    return res;
  }
  static fromASN(asn1Schema, target) {
    var _a2;
    try {
      if (isConvertible(target)) {
        const value = new target();
        return value.fromASN(asn1Schema);
      }
      const schema = schemaStorage.get(target);
      schemaStorage.cache(target);
      let targetSchema = schema.schema;
      if (asn1Schema.constructor === Constructed && schema.type !== AsnTypeTypes.Choice) {
        targetSchema = new Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: asn1Schema.idBlock.tagNumber
          },
          value: schema.schema.valueBlock.value
        });
        for (const key in schema.items) {
          delete asn1Schema[key];
        }
      }
      const asn1ComparedSchema = compareSchema({}, asn1Schema, targetSchema);
      if (!asn1ComparedSchema.verified) {
        throw new AsnSchemaValidationError(`Data does not match to ${target.name} ASN1 schema. ${asn1ComparedSchema.result.error}`);
      }
      const res = new target();
      if (isTypeOfArray(target)) {
        if (!("value" in asn1Schema.valueBlock && Array.isArray(asn1Schema.valueBlock.value))) {
          throw new Error(`Cannot get items from the ASN.1 parsed value. ASN.1 object is not constructed.`);
        }
        const itemType = schema.itemType;
        if (typeof itemType === "number") {
          const converter = defaultConverter(itemType);
          if (!converter) {
            throw new Error(`Cannot get default converter for array item of ${target.name} ASN1 schema`);
          }
          return target.from(asn1Schema.valueBlock.value, (element) => converter.fromASN(element));
        } else {
          return target.from(asn1Schema.valueBlock.value, (element) => this.fromASN(element, itemType));
        }
      }
      for (const key in schema.items) {
        const asn1SchemaValue = asn1ComparedSchema.result[key];
        if (!asn1SchemaValue) {
          continue;
        }
        const schemaItem = schema.items[key];
        const schemaItemType = schemaItem.type;
        if (typeof schemaItemType === "number" || isConvertible(schemaItemType)) {
          const converter = (_a2 = schemaItem.converter) !== null && _a2 !== void 0 ? _a2 : isConvertible(schemaItemType) ? new schemaItemType() : null;
          if (!converter) {
            throw new Error("Converter is empty");
          }
          if (schemaItem.repeated) {
            if (schemaItem.implicit) {
              const Container = schemaItem.repeated === "sequence" ? Sequence : Set;
              const newItem = new Container();
              newItem.valueBlock = asn1SchemaValue.valueBlock;
              const newItemAsn = fromBER(newItem.toBER(false));
              if (newItemAsn.offset === -1) {
                throw new Error(`Cannot parse the child item. ${newItemAsn.result.error}`);
              }
              if (!("value" in newItemAsn.result.valueBlock && Array.isArray(newItemAsn.result.valueBlock.value))) {
                throw new Error("Cannot get items from the ASN.1 parsed value. ASN.1 object is not constructed.");
              }
              const value = newItemAsn.result.valueBlock.value;
              res[key] = Array.from(value, (element) => converter.fromASN(element));
            } else {
              res[key] = Array.from(asn1SchemaValue, (element) => converter.fromASN(element));
            }
          } else {
            let value = asn1SchemaValue;
            if (schemaItem.implicit) {
              let newItem;
              if (isConvertible(schemaItemType)) {
                newItem = new schemaItemType().toSchema("");
              } else {
                const Asn1TypeName = AsnPropTypes[schemaItemType];
                const Asn1Type = index_es_exports[Asn1TypeName];
                if (!Asn1Type) {
                  throw new Error(`Cannot get '${Asn1TypeName}' class from asn1js module`);
                }
                newItem = new Asn1Type();
              }
              newItem.valueBlock = value.valueBlock;
              value = fromBER(newItem.toBER(false)).result;
            }
            res[key] = converter.fromASN(value);
          }
        } else {
          if (schemaItem.repeated) {
            if (!Array.isArray(asn1SchemaValue)) {
              throw new Error("Cannot get list of items from the ASN.1 parsed value. ASN.1 value should be iterable.");
            }
            res[key] = Array.from(asn1SchemaValue, (element) => this.fromASN(element, schemaItemType));
          } else {
            res[key] = this.fromASN(asn1SchemaValue, schemaItemType);
          }
        }
      }
      return res;
    } catch (error) {
      if (error instanceof AsnSchemaValidationError) {
        error.schemas.push(target.name);
      }
      throw error;
    }
  }
};

// ../../node_modules/@peculiar/asn1-schema/build/es2015/serializer.js
var AsnSerializer = class _AsnSerializer {
  static serialize(obj) {
    if (obj instanceof BaseBlock) {
      return obj.toBER(false);
    }
    return this.toASN(obj).toBER(false);
  }
  static toASN(obj) {
    if (obj && typeof obj === "object" && isConvertible(obj)) {
      return obj.toASN();
    }
    if (!(obj && typeof obj === "object")) {
      throw new TypeError("Parameter 1 should be type of Object.");
    }
    const target = obj.constructor;
    const schema = schemaStorage.get(target);
    schemaStorage.cache(target);
    let asn1Value = [];
    if (schema.itemType) {
      if (!Array.isArray(obj)) {
        throw new TypeError("Parameter 1 should be type of Array.");
      }
      if (typeof schema.itemType === "number") {
        const converter = defaultConverter(schema.itemType);
        if (!converter) {
          throw new Error(`Cannot get default converter for array item of ${target.name} ASN1 schema`);
        }
        asn1Value = obj.map((o) => converter.toASN(o));
      } else {
        asn1Value = obj.map((o) => this.toAsnItem({ type: schema.itemType }, "[]", target, o));
      }
    } else {
      for (const key in schema.items) {
        const schemaItem = schema.items[key];
        const objProp = obj[key];
        if (objProp === void 0 || schemaItem.defaultValue === objProp || typeof schemaItem.defaultValue === "object" && typeof objProp === "object" && isArrayEqual(this.serialize(schemaItem.defaultValue), this.serialize(objProp))) {
          continue;
        }
        const asn1Item = _AsnSerializer.toAsnItem(schemaItem, key, target, objProp);
        if (typeof schemaItem.context === "number") {
          if (schemaItem.implicit) {
            if (!schemaItem.repeated && (typeof schemaItem.type === "number" || isConvertible(schemaItem.type))) {
              const value = {};
              value.valueHex = asn1Item instanceof Null ? asn1Item.valueBeforeDecodeView : asn1Item.valueBlock.toBER();
              asn1Value.push(new Primitive({
                optional: schemaItem.optional,
                idBlock: {
                  tagClass: 3,
                  tagNumber: schemaItem.context
                },
                ...value
              }));
            } else {
              asn1Value.push(new Constructed({
                optional: schemaItem.optional,
                idBlock: {
                  tagClass: 3,
                  tagNumber: schemaItem.context
                },
                value: asn1Item.valueBlock.value
              }));
            }
          } else {
            asn1Value.push(new Constructed({
              optional: schemaItem.optional,
              idBlock: {
                tagClass: 3,
                tagNumber: schemaItem.context
              },
              value: [asn1Item]
            }));
          }
        } else if (schemaItem.repeated) {
          asn1Value = asn1Value.concat(asn1Item);
        } else {
          asn1Value.push(asn1Item);
        }
      }
    }
    let asnSchema;
    switch (schema.type) {
      case AsnTypeTypes.Sequence:
        asnSchema = new Sequence({ value: asn1Value });
        break;
      case AsnTypeTypes.Set:
        asnSchema = new Set({ value: asn1Value });
        break;
      case AsnTypeTypes.Choice:
        if (!asn1Value[0]) {
          throw new Error(`Schema '${target.name}' has wrong data. Choice cannot be empty.`);
        }
        asnSchema = asn1Value[0];
        break;
    }
    return asnSchema;
  }
  static toAsnItem(schemaItem, key, target, objProp) {
    let asn1Item;
    if (typeof schemaItem.type === "number") {
      const converter = schemaItem.converter;
      if (!converter) {
        throw new Error(`Property '${key}' doesn't have converter for type ${AsnPropTypes[schemaItem.type]} in schema '${target.name}'`);
      }
      if (schemaItem.repeated) {
        if (!Array.isArray(objProp)) {
          throw new TypeError("Parameter 'objProp' should be type of Array.");
        }
        const items = Array.from(objProp, (element) => converter.toASN(element));
        const Container = schemaItem.repeated === "sequence" ? Sequence : Set;
        asn1Item = new Container({
          value: items
        });
      } else {
        asn1Item = converter.toASN(objProp);
      }
    } else {
      if (schemaItem.repeated) {
        if (!Array.isArray(objProp)) {
          throw new TypeError("Parameter 'objProp' should be type of Array.");
        }
        const items = Array.from(objProp, (element) => this.toASN(element));
        const Container = schemaItem.repeated === "sequence" ? Sequence : Set;
        asn1Item = new Container({
          value: items
        });
      } else {
        asn1Item = this.toASN(objProp);
      }
    }
    return asn1Item;
  }
};

// ../../node_modules/@peculiar/asn1-schema/build/es2015/convert.js
var AsnConvert = class _AsnConvert {
  static serialize(obj) {
    return AsnSerializer.serialize(obj);
  }
  static parse(data, target) {
    return AsnParser.parse(data, target);
  }
  static toString(data) {
    const buf = BufferSourceConverter.isBufferSource(data) ? BufferSourceConverter.toArrayBuffer(data) : _AsnConvert.serialize(data);
    const asn = fromBER(buf);
    if (asn.offset === -1) {
      throw new Error(`Cannot decode ASN.1 data. ${asn.result.error}`);
    }
    return asn.result.toString();
  }
};

// source/x509/create_self_signed_certificate.ts
async function createSelfSignedCertificate({
  privateKey,
  notAfter,
  notBefore,
  validity,
  subject,
  dns,
  ip,
  applicationUri,
  purpose
}) {
  const crypto3 = getCrypto();
  const publicKey = await buildPublicKey(privateKey);
  const keys = {
    privateKey,
    publicKey
  };
  const { nsComment, basicConstraints, keyUsageExtension, usages } = getAttributes(purpose);
  notBefore = notBefore || /* @__PURE__ */ new Date();
  validity = validity || 0;
  if (!notAfter) {
    validity = validity || 365;
  }
  notAfter = notAfter || new Date(notBefore.getTime() + validity * 24 * 60 * 60 * 1e3);
  const alternativeNameExtensions = [];
  dns && dns.forEach((d) => alternativeNameExtensions.push({ type: "dns", value: d }));
  ip && ip.forEach((d) => alternativeNameExtensions.push({ type: "ip", value: d }));
  applicationUri && alternativeNameExtensions.push({ type: "url", value: applicationUri });
  const ID_NETSCAPE_COMMENT = "2.16.840.1.113730.1.13";
  const s = new Subject(subject || "");
  const s1 = s.toStringInternal(", ");
  const name = s1;
  const cert = await x5092.X509CertificateGenerator.createSelfSigned(
    {
      serialNumber: Date.now().toString(),
      name,
      notBefore,
      notAfter,
      signingAlgorithm: { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } },
      keys,
      extensions: [
        new x5092.Extension(ID_NETSCAPE_COMMENT, false, AsnConvert.serialize(AsnUtf8StringConverter.toASN(nsComment))),
        // new x509.BasicConstraintsExtension(true, 2, true),
        basicConstraints,
        new x5092.ExtendedKeyUsageExtension(keyUsageExtension, true),
        new x5092.KeyUsagesExtension(usages, true),
        await x5092.SubjectKeyIdentifierExtension.create(keys.publicKey),
        await x5092.AuthorityKeyIdentifierExtension.create(keys.publicKey),
        new x5092.SubjectAlternativeNameExtension(alternativeNameExtensions)
      ]
    },
    crypto3
  );
  return { cert: cert.toString("pem"), der: cert };
}

// source/index_web.ts
var asn1 = { readDirectoryName, readTag, readStruct, readAlgorithmIdentifier, readSignatureValueBin };

// source_nodejs/read.ts
var import_assert8 = __toESM(require("assert"));
var import_node_fs = __toESM(require("fs"));
var import_node_path = __toESM(require("path"));
var import_crypto13 = require("crypto");
var import_sshpk = __toESM(require("sshpk"));
function _readPemFile(filename) {
  (0, import_assert8.default)(typeof filename === "string");
  return removeTrailingLF(import_node_fs.default.readFileSync(filename, "utf-8"));
}
function _readPemOrDerFileAsDER(filename) {
  if (filename.match(/.*\.der/)) {
    return import_node_fs.default.readFileSync(filename);
  }
  const raw_key = _readPemFile(filename);
  return convertPEMtoDER(raw_key);
}
function readCertificate(filename) {
  return _readPemOrDerFileAsDER(filename);
}
function readPublicKey(filename) {
  if (filename.match(/.*\.der/)) {
    const der = import_node_fs.default.readFileSync(filename);
    return (0, import_crypto13.createPublicKey)(der);
  } else {
    const raw_key = _readPemFile(filename);
    return (0, import_crypto13.createPublicKey)(raw_key);
  }
}
function myCreatePrivateKey(rawKey) {
  if (!import_crypto13.createPrivateKey || process.env.NO_CREATE_PRIVATEKEY) {
    if (Buffer.isBuffer(rawKey)) {
      const pemKey = toPem(rawKey, "PRIVATE KEY");
      (0, import_assert8.default)(["RSA PRIVATE KEY", "PRIVATE KEY"].indexOf(identifyPemType(pemKey)) >= 0);
      return { hidden: pemKey };
    }
    return { hidden: ensureTrailingLF(rawKey) };
  }
  const backup = process.env.OPENSSL_CONF;
  process.env.OPENSSL_CONF = "/dev/null";
  const retValue = (0, import_crypto13.createPrivateKey)(rawKey);
  process.env.OPENSSL_CONF = backup;
  return { hidden: retValue };
}
function ensureTrailingLF(str) {
  return str.match(/\n$/) ? str : str + "\n";
}
function readPrivateKey(filename) {
  if (filename.match(/.*\.der/)) {
    const der = import_node_fs.default.readFileSync(filename);
    return myCreatePrivateKey(der);
  } else {
    const raw_key = _readPemFile(filename);
    return myCreatePrivateKey(raw_key);
  }
}
function readCertificatePEM(filename) {
  return _readPemFile(filename);
}
function readPublicKeyPEM(filename) {
  return _readPemFile(filename);
}
function readPrivateKeyPEM(filename) {
  return _readPemFile(filename);
}
var _g_certificate_store = "";
function setCertificateStore(store) {
  const old_store = _g_certificate_store;
  _g_certificate_store = store;
  return old_store;
}
function getCertificateStore() {
  if (!_g_certificate_store) {
    _g_certificate_store = import_node_path.default.join(__dirname, "../../certificates/");
  }
  return _g_certificate_store;
}
function readPrivateRsaKey(filename) {
  if (!import_crypto13.createPrivateKey) {
    throw new Error("createPrivateKey is not supported in this environment");
  }
  if (filename.substring(0, 1) !== "." && !import_node_fs.default.existsSync(filename)) {
    filename = import_node_path.default.join(getCertificateStore(), filename);
  }
  const content = import_node_fs.default.readFileSync(filename, "utf8");
  const sshKey = import_sshpk.default.parsePrivateKey(content, "auto");
  const key = sshKey.toString("pkcs1");
  const hidden = (0, import_crypto13.createPrivateKey)({ format: "pem", type: "pkcs1", key });
  return { hidden };
}
function readPublicRsaKey(filename) {
  if (filename.substring(0, 1) !== "." && !import_node_fs.default.existsSync(filename)) {
    filename = import_node_path.default.join(getCertificateStore(), filename);
  }
  const content = import_node_fs.default.readFileSync(filename, "utf-8");
  const sshKey = import_sshpk.default.parseKey(content, "ssh");
  const key = sshKey.toString("pkcs1");
  return (0, import_crypto13.createPublicKey)({ format: "pem", type: "pkcs1", key });
}

// source_nodejs/read_certificate_revocation_list.ts
var import_node_fs2 = __toESM(require("fs"));
async function readCertificateRevocationList(filename) {
  const crl = await import_node_fs2.default.promises.readFile(filename);
  if (crl[0] === 48 && crl[1] === 130) {
    return crl;
  }
  const raw_crl = crl.toString();
  return convertPEMtoDER(raw_crl);
}

// source_nodejs/read_certificate_signing_request.ts
var import_node_fs3 = __toESM(require("fs"));
async function readCertificateSigningRequest(filename) {
  const csr = await import_node_fs3.default.promises.readFile(filename);
  if (csr[0] === 48 && csr[1] === 130) {
    return csr;
  }
  const raw_crl = csr.toString();
  return convertPEMtoDER(raw_crl);
}

// source_nodejs/generate_private_key_filename.ts
var import_node_fs4 = __toESM(require("fs"));
var import_jsrsasign3 = __toESM(require("jsrsasign"));
async function generatePrivateKeyFile(privateKeyFilename, modulusLength) {
  const keys = await generateKeyPair(modulusLength);
  const privateKeyPem = await privateKeyToPEM(keys.privateKey);
  await import_node_fs4.default.promises.writeFile(privateKeyFilename, privateKeyPem.privPem, "utf-8");
  privateKeyPem.privPem = "";
  privateKeyPem.privDer = new ArrayBuffer(0);
}
async function generatePrivateKeyFileAlternate(privateKeyFilename, modulusLength) {
  const kp = import_jsrsasign3.default.KEYUTIL.generateKeypair("RSA", modulusLength);
  const prv = kp.prvKeyObj;
  const pub = kp.pubKeyObj;
  const prvpem = import_jsrsasign3.default.KEYUTIL.getPEM(prv, "PKCS8PRV");
  await import_node_fs4.default.promises.writeFile(privateKeyFilename, prvpem, "utf-8");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CertificatePurpose,
  PaddingAlgorithm,
  RSA_PKCS1_OAEP_PADDING,
  RSA_PKCS1_PADDING,
  Subject,
  _coercePrivateKey,
  asn1,
  certificateMatchesPrivateKey,
  coerceCertificate,
  coerceCertificatePem,
  coercePEMorDerToPrivateKey,
  coercePrivateKeyPem,
  coercePublicKeyPem,
  coerceRsaPublicKeyPem,
  combine_der,
  computeDerivedKeys,
  computePaddingFooter,
  convertPEMtoDER,
  createCertificateSigningRequest,
  createPrivateKeyFromNodeJSCrypto,
  createSelfSignedCertificate,
  decryptBufferWithDerivedKeys,
  derToPrivateKey,
  encryptBufferWithDerivedKeys,
  exploreAsn1,
  exploreCertificate,
  exploreCertificateInfo,
  exploreCertificateRevocationList,
  exploreCertificateSigningRequest,
  explorePrivateKey,
  extractPublicKeyFromCertificate,
  extractPublicKeyFromCertificateSync,
  generateKeyPair,
  generatePrivateKey,
  generatePrivateKeyFile,
  generatePrivateKeyFileAlternate,
  getCertificateStore,
  hexDump,
  identifyPemType,
  isKeyObject,
  makeMessageChunkSignature,
  makeMessageChunkSignatureWithDerivedKeys,
  makePrivateKeyFromPem,
  makePrivateKeyThumbPrint,
  makePseudoRandomBuffer,
  makeSHA1Thumbprint,
  pemToPrivateKey,
  privateDecrypt,
  privateDecrypt_long,
  privateDecrypt_native,
  privateKeyToPEM,
  publicEncrypt,
  publicEncrypt_long,
  publicEncrypt_native,
  publicKeyAndPrivateKeyMatches,
  readCertificate,
  readCertificatePEM,
  readCertificateRevocationList,
  readCertificateSigningRequest,
  readCertificationRequestInfo,
  readExtension,
  readNameForCrl,
  readPrivateKey,
  readPrivateKeyPEM,
  readPrivateRsaKey,
  readPublicKey,
  readPublicKeyPEM,
  readPublicRsaKey,
  readTbsCertificate,
  reduceLength,
  removePadding,
  removeTrailingLF,
  rsaLengthPrivateKey,
  rsaLengthPublicKey,
  rsaLengthRsaPublicKey,
  setCertificateStore,
  split_der,
  toPem,
  toPem2,
  verifyCertificateChain,
  verifyCertificateOrClrSignature,
  verifyCertificateRevocationListSignature,
  verifyCertificateSignature,
  verifyChunkSignature,
  verifyChunkSignatureWithDerivedKeys,
  verifyMessageChunkSignature
});
/*! Bundled license information:

pvtsutils/build/index.es.js:
  (*!
   * MIT License
   * 
   * Copyright (c) 2017-2022 Peculiar Ventures, LLC
   * 
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   * 
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   * 
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   * 
   *)

pvutils/build/utils.es.js:
  (*!
   Copyright (c) Peculiar Ventures, LLC
  *)

asn1js/build/index.es.js:
  (*!
   * Copyright (c) 2014, GMO GlobalSign
   * Copyright (c) 2015-2022, Peculiar Ventures
   * All rights reserved.
   * 
   * Author 2014-2019, Yury Strozhevsky
   * 
   * Redistribution and use in source and binary forms, with or without modification,
   * are permitted provided that the following conditions are met:
   * 
   * * Redistributions of source code must retain the above copyright notice, this
   *   list of conditions and the following disclaimer.
   * 
   * * Redistributions in binary form must reproduce the above copyright notice, this
   *   list of conditions and the following disclaimer in the documentation and/or
   *   other materials provided with the distribution.
   * 
   * * Neither the name of the copyright holder nor the names of its
   *   contributors may be used to endorse or promote products derived from
   *   this software without specific prior written permission.
   * 
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
   * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
   * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
   * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
   * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
   * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   * 
   *)
*/
//# sourceMappingURL=index.js.map