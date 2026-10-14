import { LineFile } from "node-opcua-utils";
export declare class LineFile1 extends LineFile {
    constructor();
    save(filename: string): void;
    saveFormat(filename: string, formatter: (code: string) => string): void;
}
