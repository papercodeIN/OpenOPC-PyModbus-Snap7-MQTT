import { LockOptions, CheckOptions } from "proper-lockfile";
export declare const defaultStaleDuration: number;
interface MutexOption extends LockOptions {
    fileToLock: string;
}
export declare function withLock<T>(options: MutexOption, action: () => Promise<T>): Promise<T>;
export declare function isLocked(fileToLock: string, options?: CheckOptions): Promise<boolean>;
export {};
//# sourceMappingURL=index.d.ts.map