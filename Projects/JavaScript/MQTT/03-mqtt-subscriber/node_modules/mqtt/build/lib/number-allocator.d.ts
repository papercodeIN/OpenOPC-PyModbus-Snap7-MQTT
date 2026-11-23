export declare class NumberAllocator {
    private used;
    private min;
    private max;
    private lowWaterMark;
    constructor(min: number, max: number);
    firstVacant(): number | null;
    alloc(): number | null;
    use(num: number): boolean;
    free(num: number): void;
    clear(): void;
}
