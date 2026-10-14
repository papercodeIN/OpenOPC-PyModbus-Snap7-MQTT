import { LockOptions } from "proper-lockfile";
export declare const defaultStaleDuration: number;
interface MutexOption extends LockOptions {
    lockfile: string;
}
export declare function withLock<T>(options: MutexOption, action: () => Promise<T>): Promise<T>;
export {};
//# sourceMappingURL=index%20copy.d.ts.map