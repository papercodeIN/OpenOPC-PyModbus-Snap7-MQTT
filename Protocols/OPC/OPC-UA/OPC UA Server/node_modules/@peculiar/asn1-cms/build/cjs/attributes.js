"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterSignature = exports.SigningTime = void 0;
const tslib_1 = require("tslib");
const asn1_schema_1 = require("@peculiar/asn1-schema");
const asn1_x509_1 = require("@peculiar/asn1-x509");
const signer_info_1 = require("./signer_info");
let SigningTime = class SigningTime extends asn1_x509_1.Time {
};
SigningTime = tslib_1.__decorate([
    (0, asn1_schema_1.AsnType)({ type: asn1_schema_1.AsnTypeTypes.Choice })
], SigningTime);
exports.SigningTime = SigningTime;
let CounterSignature = class CounterSignature extends signer_info_1.SignerInfo {
};
CounterSignature = tslib_1.__decorate([
    (0, asn1_schema_1.AsnType)({ type: asn1_schema_1.AsnTypeTypes.Sequence })
], CounterSignature);
exports.CounterSignature = CounterSignature;
