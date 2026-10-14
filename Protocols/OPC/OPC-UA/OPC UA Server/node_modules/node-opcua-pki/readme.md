### node-opcua-pki

  [![NPM download](https://img.shields.io/npm/dm/node-opcua-pki.svg)](https://www.npmtrends.com/node-opcua-pki)
  [![NPM version](https://img.shields.io/npm/v/node-opcua-pki)](https://www.npmjs.com/package/node-opcua-pki?activeTab=versions)
[![Build Status](https://github.com/node-opcua/node-opcua-pki/actions/workflows/ci.yml/badge.svg)](https://github.com/node-opcua/node-opcua-pki/actions/workflows/ci.yml)
  [![Coverage Status](https://coveralls.io/repos/github/node-opcua/node-opcua-pki/badge.svg?branch=master)](https://coveralls.io/github/node-opcua/node-opcua-pki?branch=master)
  [![install size](https://packagephobia.com/badge?p=node-opcua-pki)](https://packagephobia.com/result?p=node-opcua-pki)
  [![FOSSA Status](https://app.fossa.com/api/projects/custom%2B20248%2Fgithub.com%2Fnode-opcua%2Fnode-opcua-pki.svg?type=shield)](https://app.fossa.com/projects/custom%2B20248%2Fgithub.com%2Fnode-opcua%2Fnode-opcua-pki?ref=badge_shield)
  
## Installation

##### install globally

```
$ npm install -g node-opcua-pki
$ crypto_create_CA --help
```

##### use with npx

```
npx node-opcua-pki --help
npx node-opcua-pki certificate --help
```

Note: see https://reference.opcfoundation.org/GDS/docs/F.1/

# commands

| command     | Help                                            |
| ----------- | ----------------------------------------------- |
| demo        | create default certificate for node-opcua demos |
| createCA    | create a Certificate Authority                  |
| createPKI   | create a Public Key Infrastructure              |
| certificate | create a new certificate                        |
| csr         | create a new certificate signing request(CSR)   |
| sign        | sign a CSR and generate a certificate           |
| revoke      | revoke an existing certificate                  |
| dump        | display a certificate                           |
| toder       | convert a certificate to a DER format           |
| fingerprint | print the certificate fingerprint               |

Options:
--help display help

## create a PKI

```
node-opcua-pki createPKI
```

### Options:

| option                     | description                                        | type      | default                         |
| -------------------------- | -------------------------------------------------- | --------- | ------------------------------- | 
| -r, --root                 | the location of the Certificate folder             | [string]  | [default: "{CWD}/certificates"] |
| --PKIFolder                | the location of the Public Key Infrastructure      | [string]  | [default: "{root}/PKI"]         |
| -k, --keySize, --keyLength | the private key size in bits (1024,2048,3072,4096) | [number]  | [default: 2048]                 |
| -s, --silent               | minimize output                                    | [boolean] | [default: false]                |

The result

```
└─ 📂certificates
    └─📂PKI
       ├─📂issuers
       │ ├─📂certs                 contains known Certificate Authorities' certificates
       │ └─📂crl                   contains Certificate Revocation List associates with the CA Certificates
       ├─📂own
       │ ├─📂certs                 where to store generated public certificates generated for the private key.
       │ └─📂private
       │    └─🔐private_key.pem  the private key in PEM format
       ├─📂rejected                  contains certificates that have been rejected.
       └─📂trusted
         ├─📂certs                 contains the X.509 v3 Certificates that are trusted.
         └─📂crl                   contains the X.509 v3 CRLs for any Certificates in the ./certs directory.
```

## create a Certificate Signing Request (CSR)

Options:
| option              | description                                     | type   | default                                       |
|---------------------|-------------------------------------------------|--------|-----------------------------------------------|
|-a, --applicationUri |the application URI                              |[string]|[default: "urn:{hostname}:Node-OPCUA-Server"]  |
|-o, --output         | the name of the generated signing_request       |[string]|[default: "my_certificate_signing_request.csr"]|
|--dns                | the list of valid domain name (comma separated) |[string]|[default: "{hostname}"]                        |
|--ip                 | the list of valid IPs (comma separated)         |[string]|[default: ""]                                  |
|--subject            | the certificate subject ( for instance /C=FR/ST=Centre/L=Orleans/O=SomeOrganization/CN=Hello )|[string]| [default: "/CN=Certificate"]|
|-r, --root           | the location of the Certificate folder          |[string]|[default: "{CWD}/certificates"]                |
|--PKIFolder          | the location of the Public Key Infrastructure   |[string]|[default: "{root}/PKI"]                        |

## Create a certificate authority

|                                  |                                                  | default value                                                                   |
| -------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------- |
| `--subject`                      | the CA certificate subject                       | "/C=FR/ST=IDF/L=Paris/O=Local NODE-OPCUA Certificate Authority/CN=NodeOPCUA-CA" |
| `--root`, `-r`                   | the location of the Certificate folder           | "{CWD}/certificates"                                                            |
| ` --CAFolder`, `-c`              | the location of the Certificate Authority folder | "{root}/CA"]                                                                    |
| `--keySize`, `-k`, `--keyLength` | the private key size in bits (1024, 2048 ,3072, 4096)| |


The result

```
└─ 📂certificates
    └─📂PKI
       ├─📂CA           Certificate Authority
       ├─📂rejected     The Certificate store contains certificates that have been rejected.
       │ ├─📂certs      Contains the X.509 v3 Certificates which have been rejected.
       ├─📂trusted      The Certificate store contains trusted Certificates.
       │ ├─📂certs      Contains the X.509 v3 Certificates that are trusted.
       │ └─📂crl        Contains the X.509 v3 CRLs for any Certificates in the ./certs directory.
       ├─📂issuers      The Certificate store contains the CA Certificates needed for validation.
       │ ├─📂certs      Contains the X.509 v3 Certificates that are needed for validation.
       │ ├─📂crl        Contains the X.509 v3 CRLs for any Certificates in the ./certs directory.
```

## sign a signing request (requires a CA)

| option         | description                                      | type                | default                                         |
| -------------- | ------------------------------------------------ | ------------------- | ----------------------------------------------- |
| -i, --csr      | the csr                                          | [string] [required] | [default: "my_certificate_signing_request.csr"] |
| -o, --output   | the name of the generated certificate            | [string] [required] | [default: "my_certificate.pem"]                 |
| -v, --validity | the certificate validity in days                 | [number]            | [default: 365]                                  |
| -r, --root     | the location of the Certificate folder           | [string]            | [default: "{CWD}/certificates"]                 |
| -c, --CAFolder | the location of the Certificate Authority folder | [string]            | [default: "{root}/CA"]                          |

## demo command

this command creates a bunch of certificates with various characteristics for demo and testing purposes.

```
crypto_create_CA  demo [--dev] [--silent] [--clean]
```

Options:

|              |                                                                |                    |
| ------------ | -------------------------------------------------------------- | ------------------ |
| --help       | display help                                                   |                    |
| --dev        | create all sort of fancy certificates for dev testing purposes |                    |
| --clean      | Purge existing directory [use with care!]                      |                    |
| --silent, -s | minimize output                                                |                    |
| --root, -r   | the location of the Certificate folder                         | {CWD}/certificates |

Example:

```
$crypto_create_CA  demo --dev
```

##### certificate command

```
$crypto_create_CA certificate --help
```

Options:

|                      |                                                                                                |                                  |
| -------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------- |
| --help               | display help                                                                                   |                                  |
| --applicationUri, -a | the application URI                                                                            | urn:{hostname}:Node-OPCUA-Server |
| --output, -o         | the name of the generated certificate                                                          | my_certificate.pem               |
| --selfSigned, -s     | if true, the certificate will be self-signed                                                   | false                            |
| --validity, -v       | the certificate validity in days                                                               |                                  |
| --silent, -s         | minimize output                                                                                |                                  |
| --root, -r           | the location of the Certificate folder                                                         | {CWD}/certificates               |
| --CAFolder, -c       | the location of the Certificate Authority folder                                               | {root}/CA                        |
| --PKIFolder, -p      | the location of the Public Key Infrastructure                                                  | {root}/PKI                       |
| --privateKey, -p     | optional:the private key to use to generate certificate                                        |                                  |
| --subject            | the certificate subject ( for instance /C=FR/ST=Centre/L=Orleans/O=SomeOrganization/CN=Hello ) |                                  |



###### examples

* create a self-signed certificate

``` 
npx node-opcua-pki certificate --dns=machine1.com,machine2.com --ip="192.1.2.3;192.3.4.5" -a 'urn:{hostname}:My-OPCUA-Server' --selfSigned -o  my_self_signed_certificate.pem
``` 

#### References

-   https://www.entrust.com/wp-content/uploads/2013/05/pathvalidation_wp.pdf
-   https://en.wikipedia.org/wiki/Certification_path_validation_algorithm
-   https://tools.ietf.org/html/rfc5280

#### prerequisite:

This module requires OpenSSL or LibreSSL to be installed.

On Windows, a version of OpenSSL is automatically downloaded and installed at run time, if not present. You will need an internet connection open.

You need to install it on Linux, (or in your docker image), or on macOS

-   on ubuntu/Debian:

```
apt install openssl
```

or alpine:

```
apk add openssl
```

# Support
Sterfive provides this module free of charge, “as is,” with the hope that it will be useful to you. However, any support requests, bug fixes, or enhancements are handled exclusively through our paid services. We believe strongly that independent open-source companies should be fairly compensated for their contributions to the community.

We highly recommend subscribing to our [support program](https://support.sterfive.com) to ensure your requests are addressed and resolved. Please note that we only consider requests from members of our support program or sponsors.


## Getting professional support

NodeOPCUA PKI is developed and maintained by sterfive.com.

To get professional support, consider subscribing to the node-opcua membership community:

[![Professional Support](https://img.shields.io/static/v1?style=for-the-badge&label=Professional&message=Support&labelColor=blue&color=green&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ5MS41MiA0OTEuNTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ5MS41MiA0OTEuNTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxnPg0KCQk8cGF0aCBkPSJNNDg3Ljk4OSwzODkuNzU1bC05My4xMDktOTIuOTc2Yy00LjgxMy00LjgwNi0xMi42NDItNC42NzQtMTcuMjczLDAuMzA3Yy03LjE0OCw3LjY4OS0xNC42NCwxNS41NTQtMjEuNzMsMjIuNjM0ICAgIGMtMC4yNzEsMC4yNy0wLjUwMSwwLjQ5My0wLjc2MywwLjc1NUw0NjcuMyw0MzIuNTA0YzguOTEtMTAuNjE0LDE2LjY1Ny0yMC40MSwyMS43My0yNi45NyAgICBDNDkyLjcyLDQwMC43NjIsNDkyLjI1NywzOTQuMDE5LDQ4Ny45ODksMzg5Ljc1NXoiLz4NCgk8L2c+DQo8L2c+DQo8Zz4NCgk8Zz4NCgkJPHBhdGggZD0iTTMzNC4zLDMzNy42NjFjLTM0LjMwNCwxMS4zNzktNzcuNTYsMC40MTMtMTE0LjU1NC0yOS41NDJjLTQ5LjAyMS0zOS42OTMtNzUuOTcyLTEwMi42NDItNjUuODM4LTE1MC41OTNMMzcuNjM0LDQxLjQxOCAgICBDMTcuNjUzLDU5LjQyNCwwLDc4LjU0NSwwLDkwYzAsMTQxLjc1MSwyNjAuMzQ0LDQxNS44OTYsNDAxLjUwMyw0MDAuOTMxYzExLjI5Ni0xLjE5OCwzMC4xNzYtMTguNjUxLDQ4LjA2Mi0zOC4xNjdMMzM0LjMsMzM3LjY2MSAgICB6Ii8+DQoJPC9nPg0KPC9nPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0xOTMuODU0LDk2LjA0MUwxMDEuMjEzLDMuNTNjLTQuMjI1LTQuMjItMTAuODgyLTQuNzI0LTE1LjY2NC0xLjE0NWMtNi42NTQsNC45ODMtMTYuNjQ4LDEyLjY1MS0yNy40NTMsMjEuNDk4ICAgIGwxMTEuOTQ1LDExMS43ODVjMC4wNjEtMC4wNiwwLjExMS0wLjExMywwLjE3Mi0wLjE3NGM3LjIzOC03LjIyOCwxNS4zNTUtMTQuODg1LDIzLjI5MS0yMi4xNjcgICAgQzE5OC41MzQsMTA4LjcxMywxOTguNjg0LDEwMC44NjMsMTkzLjg1NCw5Ni4wNDF6Ii8+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+)](https://support.sterfive.com)

or contact [sterfive](https://www.sterfive.com) for dedicated consulting and more advanced support.

## :heart: Supporting the development effort - Sponsors & Backers</span>

If you like node-opcua-pki and if you are relying on it in one of your projects, please consider becoming a backer and [sponsoring us](https://github.com/sponsors/node-opcua), this will help us to maintain a high-quality stack and constant evolution of this module.

If your company would like to participate and influence the development of future versions of node-opcua please contact [sterfive](mailto:contact@sterfive.com).
