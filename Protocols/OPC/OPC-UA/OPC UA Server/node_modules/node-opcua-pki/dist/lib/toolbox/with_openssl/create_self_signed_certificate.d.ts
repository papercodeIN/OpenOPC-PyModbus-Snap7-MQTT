import { CreateSelfSignCertificateWithConfigParam } from "../common";
/**
 * @param certificate: the filename of the certificate to create
 */
export declare function createSelfSignedCertificate(certificate: string, params: CreateSelfSignCertificateWithConfigParam): Promise<void>;
