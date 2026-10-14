export declare class ObjectRegistry {
    static doDebug: boolean;
    static registries: any;
    private _objectTypeName?;
    private readonly _cache;
    constructor();
    getClassName(): string;
    register(obj: any): void;
    unregister(obj: any): void;
    count(): number;
    toString(): string;
}
