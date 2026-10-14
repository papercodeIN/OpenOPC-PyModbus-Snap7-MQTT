import { DerivedKeys } from "node-opcua-crypto/web";
import { DerivedKeys1 } from "./security_policy";
import { DateTime } from "node-opcua-basic-types";
export interface ISecurityToken {
    tokenId: number;
    createdAt: DateTime;
    revisedLifetime: number;
    channelId: number;
}
export interface SecurityTokenAndDerivedKeys {
    securityToken: ISecurityToken;
    derivedKeys: DerivedKeys1 | null;
}
export interface IDerivedKeyProvider {
    getDerivedKey(tokenId: number): DerivedKeys | null;
}
export declare class TokenStack {
    #private;
    private id;
    constructor(channelId: number);
    serverKeyProvider(): IDerivedKeyProvider;
    clientKeyProvider(): IDerivedKeyProvider;
    pushNewToken(securityToken: ISecurityToken, derivedKeys: DerivedKeys1 | null): void;
    private tokenIds;
    getToken(tokenId: number): ISecurityToken | null;
    getTokenDerivedKeys(tokenId: number): DerivedKeys1 | null;
    removeOldTokens(): void;
}
