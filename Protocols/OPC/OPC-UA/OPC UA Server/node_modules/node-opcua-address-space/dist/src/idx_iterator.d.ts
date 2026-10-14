export declare class IndexIterator {
    private limits;
    current: number[] | null;
    constructor(limits: number[]);
    reset(): void;
    increment(): void;
    next(): number[];
}
