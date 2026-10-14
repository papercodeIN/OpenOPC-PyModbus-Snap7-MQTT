import {
  __dirname,
  convertPEMtoDER,
  generateKeyPair,
  identifyPemType,
  privateKeyToPEM,
  removeTrailingLF,
  toPem
} from "./chunk-F5EAPW2U.mjs";

// source_nodejs/read.ts
import assert from "assert";
import fs from "node:fs";
import path from "node:path";
import { createPrivateKey, createPublicKey } from "crypto";
import sshpk from "sshpk";
function _readPemFile(filename) {
  assert(typeof filename === "string");
  return removeTrailingLF(fs.readFileSync(filename, "utf-8"));
}
function _readPemOrDerFileAsDER(filename) {
  if (filename.match(/.*\.der/)) {
    return fs.readFileSync(filename);
  }
  const raw_key = _readPemFile(filename);
  return convertPEMtoDER(raw_key);
}
function readCertificate(filename) {
  return _readPemOrDerFileAsDER(filename);
}
function readPublicKey(filename) {
  if (filename.match(/.*\.der/)) {
    const der = fs.readFileSync(filename);
    return createPublicKey(der);
  } else {
    const raw_key = _readPemFile(filename);
    return createPublicKey(raw_key);
  }
}
function myCreatePrivateKey(rawKey) {
  if (!createPrivateKey || process.env.NO_CREATE_PRIVATEKEY) {
    if (Buffer.isBuffer(rawKey)) {
      const pemKey = toPem(rawKey, "PRIVATE KEY");
      assert(["RSA PRIVATE KEY", "PRIVATE KEY"].indexOf(identifyPemType(pemKey)) >= 0);
      return { hidden: pemKey };
    }
    return { hidden: ensureTrailingLF(rawKey) };
  }
  const backup = process.env.OPENSSL_CONF;
  process.env.OPENSSL_CONF = "/dev/null";
  const retValue = createPrivateKey(rawKey);
  process.env.OPENSSL_CONF = backup;
  return { hidden: retValue };
}
function ensureTrailingLF(str) {
  return str.match(/\n$/) ? str : str + "\n";
}
function readPrivateKey(filename) {
  if (filename.match(/.*\.der/)) {
    const der = fs.readFileSync(filename);
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
    _g_certificate_store = path.join(__dirname, "../../certificates/");
  }
  return _g_certificate_store;
}
function readPrivateRsaKey(filename) {
  if (!createPrivateKey) {
    throw new Error("createPrivateKey is not supported in this environment");
  }
  if (filename.substring(0, 1) !== "." && !fs.existsSync(filename)) {
    filename = path.join(getCertificateStore(), filename);
  }
  const content = fs.readFileSync(filename, "utf8");
  const sshKey = sshpk.parsePrivateKey(content, "auto");
  const key = sshKey.toString("pkcs1");
  const hidden = createPrivateKey({ format: "pem", type: "pkcs1", key });
  return { hidden };
}
function readPublicRsaKey(filename) {
  if (filename.substring(0, 1) !== "." && !fs.existsSync(filename)) {
    filename = path.join(getCertificateStore(), filename);
  }
  const content = fs.readFileSync(filename, "utf-8");
  const sshKey = sshpk.parseKey(content, "ssh");
  const key = sshKey.toString("pkcs1");
  return createPublicKey({ format: "pem", type: "pkcs1", key });
}

// source_nodejs/read_certificate_revocation_list.ts
import fs2 from "node:fs";
async function readCertificateRevocationList(filename) {
  const crl = await fs2.promises.readFile(filename);
  if (crl[0] === 48 && crl[1] === 130) {
    return crl;
  }
  const raw_crl = crl.toString();
  return convertPEMtoDER(raw_crl);
}

// source_nodejs/read_certificate_signing_request.ts
import fs3 from "node:fs";
async function readCertificateSigningRequest(filename) {
  const csr = await fs3.promises.readFile(filename);
  if (csr[0] === 48 && csr[1] === 130) {
    return csr;
  }
  const raw_crl = csr.toString();
  return convertPEMtoDER(raw_crl);
}

// source_nodejs/generate_private_key_filename.ts
import fs4 from "node:fs";
import jsrsasign from "jsrsasign";
async function generatePrivateKeyFile(privateKeyFilename, modulusLength) {
  const keys = await generateKeyPair(modulusLength);
  const privateKeyPem = await privateKeyToPEM(keys.privateKey);
  await fs4.promises.writeFile(privateKeyFilename, privateKeyPem.privPem, "utf-8");
  privateKeyPem.privPem = "";
  privateKeyPem.privDer = new ArrayBuffer(0);
}
async function generatePrivateKeyFileAlternate(privateKeyFilename, modulusLength) {
  const kp = jsrsasign.KEYUTIL.generateKeypair("RSA", modulusLength);
  const prv = kp.prvKeyObj;
  const pub = kp.pubKeyObj;
  const prvpem = jsrsasign.KEYUTIL.getPEM(prv, "PKCS8PRV");
  await fs4.promises.writeFile(privateKeyFilename, prvpem, "utf-8");
}

export {
  readCertificate,
  readPublicKey,
  readPrivateKey,
  readCertificatePEM,
  readPublicKeyPEM,
  readPrivateKeyPEM,
  setCertificateStore,
  getCertificateStore,
  readPrivateRsaKey,
  readPublicRsaKey,
  readCertificateRevocationList,
  readCertificateSigningRequest,
  generatePrivateKeyFile,
  generatePrivateKeyFileAlternate
};
//# sourceMappingURL=chunk-XPM4YIBT.mjs.map