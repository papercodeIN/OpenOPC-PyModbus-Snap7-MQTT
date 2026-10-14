/**
 * extract FullyQualifiedDomainName of this computer
 */
export declare function extractFullyQualifiedDomainName(): Promise<string>;
export declare function prepareFQDN(): Promise<void>;
export declare function getFullyQualifiedDomainName(optional_max_length?: number): string;
export declare function getHostname(): string;
export declare function resolveFullyQualifiedDomainName(str: string): string;
