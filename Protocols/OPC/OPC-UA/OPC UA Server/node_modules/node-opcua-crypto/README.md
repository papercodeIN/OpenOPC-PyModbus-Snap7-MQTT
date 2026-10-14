# node-opcua-crypto

NodeOPCUA Crypto is a powerful JavaScript module for handling security and cryptography for OPCUA. It's written in TypeScript and runs smoothly on Node.js and in the browser.

[![NPM download](https://img.shields.io/npm/dm/node-opcua-crypto.svg)](https://www.npmtrends.com/node-opcua-crypto)
[![NPM version](https://img.shields.io/npm/v/node-opcua-crypto)](https://www.npmjs.com/package/node-opcua-crypto?activeTab=versions)
[![Build Status](https://github.com/node-opcua/node-opcua-crypto/actions/workflows/main.yml/badge.svg)](https://github.com/node-opcua/node-opcua-crypto/actions/workflows/main.yml)
[![Code Climate](https://codeclimate.com/github/node-opcua/node-opcua-crypto/badges/gpa.svg)](https://codeclimate.com/github/node-opcua/node-opcua-crypto)
[![Coverage Status](https://coveralls.io/repos/github/node-opcua/node-opcua-crypto/badge.svg?branch=master)](https://coveralls.io/github/node-opcua/node-opcua-crypto?branch=master)
[![install size](https://packagephobia.com/badge?p=node-opcua-crypto)](https://packagephobia.com/result?p=node-opcua-crypto)
[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B20248%2Fgithub.com%2Fnode-opcua%2Fnode-opcua-crypto.svg?type=shield)](https://app.fossa.com/projects/custom%2B20248%2Fgithub.com%2Fnode-opcua%2Fnode-opcua-crypto?ref=badge_shield)

<!-- [![Test Coverage](https://codeclimate.com/github/node-opcua/node-opcua-crypto/badges/coverage.svg)](https://codeclimate.com/github/node-opcua/node-opcua-crypto/coverage) -->

## Features

-   a comprehensive set of cryptographic functionalities.
-   supports both Node.js and browser environments.
-   compatible with TypeScript for robust, type-safe coding.
-   implements advanced security standards for OPCUA.

## Getting Started

To use NodeOPCUA Crypto in your project, follow these steps:

#### Installation

```bash
npm install nodeopcua-crypto
```

### Usage

```bash

import { generatePrivateKey, privateKeyToPEM, CertificatePurpose, createSelfSignedCertificate } from "./node-opcua-crypto.js";

async function demonstratePrivateKeyAndSelfSignedCertificateCreation() {

    // create the Private Key
    const privateKey = await generatePrivateKey();

    // convert the private key to a PEM format
    const { privPem } = await privateKeyToPEM(privateKey);

    console.log(privPem);

    // create a self-sign certificate
    const { cert } = await createSelfSignedCertificate({
        privateKey,
        notAfter: new Date(2025, 1, 1),
        notBefore: new Date(2019, 1, 1),
        subject: "CN=Test",
        dns: ["DNS1", "DNS2"],
        ip: ["192.168.1.1"],
        applicationUri: "urn:HOSTNAME:ServerDescription",
        purpose: CertificatePurpose.ForApplication,
    });
    console.log(cert);
}
demonstratePrivateKeyAndSelfSignedCertificateCreation();


```

Please refer to the examples directory for more specific use cases and comprehensive samples.

## Support

Sterfive provides this module free of charge, "as is," with the hope that it will be useful to you. However, any support requests, bug fixes, or enhancements are handled exclusively through our paid services. We believe strongly that independent open-source companies should be fairly compensated for their contributions to the community.

We highly recommend subscribing to our support program to ensure your requests are addressed and resolved. Please note that we only consider requests from members of our support program or sponsors.

### Getting professional support

NodeOPCUA Crypto is developed and maintained by sterfive.com.

To get professional support, consider subscribing to the node-opcua membership community:

[![Professional Support](https://img.shields.io/static/v1?style=for-the-badge&label=Professional&message=Support&labelColor=blue&color=green&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ5MS41MiA0OTEuNTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ5MS41MiA0OTEuNTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxnPg0KCQk8cGF0aCBkPSJNNDg3Ljk4OSwzODkuNzU1bC05My4xMDktOTIuOTc2Yy00LjgxMy00LjgwNi0xMi42NDItNC42NzQtMTcuMjczLDAuMzA3Yy03LjE0OCw3LjY4OS0xNC42NCwxNS41NTQtMjEuNzMsMjIuNjM0ICAgIGMtMC4yNzEsMC4yNy0wLjUwMSwwLjQ5My0wLjc2MywwLjc1NUw0NjcuMyw0MzIuNTA0YzguOTEtMTAuNjE0LDE2LjY1Ny0yMC40MSwyMS43My0yNi45NyAgICBDNDkyLjcyLDQwMC43NjIsNDkyLjI1NywzOTQuMDE5LDQ4Ny45ODksMzg5Ljc1NXoiLz4NCgk8L2c+DQo8L2c+DQo8Zz4NCgk8Zz4NCgkJPHBhdGggZD0iTTMzNC4zLDMzNy42NjFjLTM0LjMwNCwxMS4zNzktNzcuNTYsMC40MTMtMTE0LjU1NC0yOS41NDJjLTQ5LjAyMS0zOS42OTMtNzUuOTcyLTEwMi42NDItNjUuODM4LTE1MC41OTNMMzcuNjM0LDQxLjQxOCAgICBDMTcuNjUzLDU5LjQyNCwwLDc4LjU0NSwwLDkwYzAsMTQxLjc1MSwyNjAuMzQ0LDQxNS44OTYsNDAxLjUwMyw0MDAuOTMxYzExLjI5Ni0xLjE5OCwzMC4xNzYtMTguNjUxLDQ4LjA2Mi0zOC4xNjdMMzM0LjMsMzM3LjY2MSAgICB6Ii8+DQoJPC9nPg0KPC9nPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0xOTMuODU0LDk2LjA0MUwxMDEuMjEzLDMuNTNjLTQuMjI1LTQuMjItMTAuODgyLTQuNzI0LTE1LjY2NC0xLjE0NWMtNi42NTQsNC45ODMtMTYuNjQ4LDEyLjY1MS0yNy40NTMsMjEuNDk4ICAgIGwxMTEuOTQ1LDExMS43ODVjMC4wNjEtMC4wNiwwLjExMS0wLjExMywwLjE3Mi0wLjE3NGM3LjIzOC03LjIyOCwxNS4zNTUtMTQuODg1LDIzLjI5MS0yMi4xNjcgICAgQzE5OC41MzQsMTA4LjcxMywxOTguNjg0LDEwMC44NjMsMTkzLjg1NCw5Ni4wNDF6Ii8+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+)](https://support.sterfive.com)

or contact [sterfive](https://www.sterfive.com) for dedicated consulting and more advanced support.

## Contributing

We appreciate contributions from the community. To contribute:

-   Fork the repository.
-   Create a new branch.
-   Commit your changes.
-   Submit a pull request.
-   Sign the CLA (Contributor Licence Agreement) form

For more detailed instructions, refer to the CONTRIBUTING.md file.

## License

NodeOPCUA Crypto is MIT licensed. See the LICENSE file for full license details.

Copyright © 2023-2024 Sterfive.com.

## Disclaimer

NodeOPCUA Crypto is provided as-is, and while we strive to ensure its quality and security, Sterfive.com cannot be held liable for any damage caused directly or indirectly by the usage of this module.

Please report any issues or vulnerabilities you find via the issue tracker.

Thank you for considering NodeOPCUA Crypto for your OPCUA cryptography needs. We look forward to seeing what you build with i

## Supporting the development effort - Sponsors & Backers

If you like `node-opcua-crypto` and if you are relying on it in one of your projects, please consider becoming a backer and [sponsoring us](https://opencollective.com/node-opcua), this will help us to maintain a high-quality stack and constant evolution of this module.

If your company would like to participate and influence the development of future versions of `node-opcua` and its components, please contact [sterfive](mailto:contact@sterfive.com).
