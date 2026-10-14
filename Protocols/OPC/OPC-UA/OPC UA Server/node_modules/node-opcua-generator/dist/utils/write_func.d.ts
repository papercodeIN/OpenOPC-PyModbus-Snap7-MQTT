import { LineFile1 } from "./line_file";
export interface WriteFunc {
    (...args: string[]): void;
    indent(): void;
    pop(): void;
}
export declare const makeWrite: (f: LineFile1) => WriteFunc;
