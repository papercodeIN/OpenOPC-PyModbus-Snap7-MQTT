import { Name, SubjectPublicKeyInfo } from "@peculiar/asn1-x509";
import { Attributes } from "./attributes";
/**
 * ```asn1
 * CertificationRequestInfo ::= SEQUENCE {
 *   version       INTEGER { v1(0) } (v1,...),
 *   subject       Name,
 *   subjectPKInfo SubjectPublicKeyInfo{{ PKInfoAlgorithms }},
 *   attributes    [0] Attributes{{ CRIAttributes }}
 * }
 * ```
 */
export declare class CertificationRequestInfo {
    version: number;
    subject: Name;
    subjectPKInfo: SubjectPublicKeyInfo;
    attributes: Attributes;
    constructor(params?: Partial<CertificationRequestInfo>);
}
