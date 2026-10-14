import { __decorate } from "tslib";
import { AsnTypeTypes, AsnType } from "@peculiar/asn1-schema";
import { Time } from "@peculiar/asn1-x509";
import { SignerInfo } from "./signer_info";
let SigningTime = class SigningTime extends Time {
};
SigningTime = __decorate([
    AsnType({ type: AsnTypeTypes.Choice })
], SigningTime);
export { SigningTime };
let CounterSignature = class CounterSignature extends SignerInfo {
};
CounterSignature = __decorate([
    AsnType({ type: AsnTypeTypes.Sequence })
], CounterSignature);
export { CounterSignature };
