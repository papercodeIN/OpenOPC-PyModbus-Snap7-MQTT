type func = (...args: any[]) => any;
export declare function assert(cond: boolean | unknown | null | undefined | func, message?: string): void;
export default assert;
export declare function renderError(err: unknown): Error;
