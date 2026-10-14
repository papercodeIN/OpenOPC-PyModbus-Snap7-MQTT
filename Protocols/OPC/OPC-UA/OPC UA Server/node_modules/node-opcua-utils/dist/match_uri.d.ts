/**
 * @module node-opcua-utils
 */
/**
 * returns true if two endpoint matches the same address:
 *
 * @see https://www.dnscheck.co/faq
 * @see https://tools.ietf.org/html/rfc4343 : Domain Name System (DNS) Case Insensitivity Clarification
 *
 */
export declare function matchUri(endpointUri1: string | null, endpointUri2: string | null): boolean;
