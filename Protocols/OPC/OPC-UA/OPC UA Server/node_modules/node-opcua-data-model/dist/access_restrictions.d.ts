export declare enum AccessRestrictionsFlag {
    SigningRequired = 1,
    EncryptionRequired = 2,
    SessionRequired = 4,
    ApplyRestrictionsToBrowse = 8,
    None = 0
}
export declare function makeAccessRestrictionsFlag(str: string | number | null): AccessRestrictionsFlag;
export declare function accessRestrictionsFlagToString(flags: AccessRestrictionsFlag): string;
