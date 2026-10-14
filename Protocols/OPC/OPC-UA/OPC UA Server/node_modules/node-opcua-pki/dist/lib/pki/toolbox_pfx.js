"use strict";
// Convert pfx file to pem file
// Conversion to a combined PEM file
// To convert a PFX file to a PEM file that contains both the certificate and private key,
// the following command needs to be used:
// # openssl pkcs12 -in filename.pfx -out cert.pem -nodes
//
// Conversion to separate PEM files
// We can extract the private key form a PFX to a PEM file with this command:
// # openssl pkcs12 -in filename.pfx -nocerts -out key.pem
//
// Exporting the certificate only:
// # openssl pkcs12 -in filename.pfx -clcerts -nokeys -out cert.pem
//
// Removing the password from the extracted private key:
// # openssl rsa -in key.pem -out server.keys
// convert pem/cert to pfx
// # openssl pkcs12 -inkey bob_key.pem -in bob_cert.cert -export -out bob_pfx.pfx
//# sourceMappingURL=toolbox_pfx.js.map