import { IUserManager, UARoleSet } from "node-opcua-address-space";
import { NodeId } from "node-opcua-nodeid";
import { IdentityMappingRuleType } from "node-opcua-types";
import { ServerSession } from "./server_session";
export type ValidUserFunc = (this: ServerSession, username: string, password: string) => boolean;
export type ValidUserAsyncFunc = (this: ServerSession, username: string, password: string, callback: (err: Error | null, isAuthorized?: boolean) => void) => void;
export interface IUserManagerEx extends IUserManager {
    /** synchronous function to check the credentials - can be overruled by isValidUserAsync */
    isValidUser?: ValidUserFunc;
    /** asynchronous function to check if the credentials - overrules isValidUser */
    isValidUserAsync?: ValidUserAsyncFunc;
}
export type UserManagerOptions = IUserManagerEx | UAUserManagerBase;
export interface IUAUserManager extends IUserManager {
    getUserRoles(user: string): NodeId[];
    isValidUser(session: ServerSession, username: string, password: string): Promise<boolean>;
    getIdentitiesForRole(role: NodeId): IdentityMappingRuleType[];
}
export declare abstract class UAUserManagerBase implements IUAUserManager {
    getUserRoles(user: string): NodeId[];
    isValidUser(session: ServerSession, username: string, password: string): Promise<boolean>;
    getIdentitiesForRole(role: NodeId): IdentityMappingRuleType[];
    bind(roleSet: UARoleSet): void;
}
export declare class UAUserManager1 extends UAUserManagerBase {
    private options;
    constructor(options: IUserManagerEx);
    getUserRoles(user: string): NodeId[];
    isValidUser(session: ServerSession, username: string, password: string): Promise<boolean>;
    getIdentitiesForRole(role: NodeId): IdentityMappingRuleType[];
}
export declare function makeUserManager(options?: UserManagerOptions): UAUserManagerBase;
