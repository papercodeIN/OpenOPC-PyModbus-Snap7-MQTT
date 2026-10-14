export type KeySize = 1024 | 2048 | 3072 | 4096;
export type Thumbprint = string;
export type Filename = string;
export type CertificateStatus = "unknown" | "trusted" | "rejected";
import { SubjectOptions } from "../misc/subject";
import { CertificatePurpose } from "node-opcua-crypto";
export type KeyLength = 1024 | 2048 | 3072 | 4096;
export declare function quote(str?: string): string;
export interface ProcessAltNamesParam {
    dns?: string[];
    ip?: string[];
    applicationUri?: string;
}
export interface CreateCertificateSigningRequestOptions extends ProcessAltNamesParam {
    subject?: SubjectOptions | string;
}
export interface CreateCertificateSigningRequestWithConfigOptions extends CreateCertificateSigningRequestOptions {
    rootDir: Filename;
    configFile: Filename;
    privateKey: Filename;
    purpose: CertificatePurpose;
}
export interface StartDateEndDateParam {
    startDate?: Date;
    endDate?: Date;
    validity?: number;
}
export interface CreateSelfSignCertificateParam extends ProcessAltNamesParam, StartDateEndDateParam {
    subject?: SubjectOptions | string;
}
export interface CreateSelfSignCertificateWithConfigParam extends CreateSelfSignCertificateParam {
    rootDir: Filename;
    configFile: Filename;
    privateKey: Filename;
    purpose: CertificatePurpose;
}
export interface Params extends ProcessAltNamesParam, StartDateEndDateParam {
    subject?: SubjectOptions | string;
    privateKey?: string;
    configFile?: string;
    rootDir?: string;
    outputFile?: string;
    reason?: string;
}
export declare function adjustDate(params: StartDateEndDateParam): void;
export declare function adjustApplicationUri(params: Params): void;
