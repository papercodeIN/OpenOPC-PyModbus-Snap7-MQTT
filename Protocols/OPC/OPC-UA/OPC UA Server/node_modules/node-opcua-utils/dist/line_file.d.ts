/**
 * @module node-opcua-utils
 */
export declare class LineFile {
    private _line;
    constructor();
    write(...args: string[]): void;
    toString(endOfLine?: "\n" | "\r"): string;
}
