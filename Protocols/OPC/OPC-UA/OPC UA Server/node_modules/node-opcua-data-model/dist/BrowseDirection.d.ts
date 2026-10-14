/**
 * @module node-opcua-data-model
 */
import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
import { Enum } from "node-opcua-enum";
export declare enum BrowseDirection {
    Forward = 0,// return forward references.
    Inverse = 1,// return inverse references.
    Both = 2,// return forward and inverse references.
    Invalid = 3
}
export declare const schemaBrowseDirection: {
    name: string;
    enumValues: typeof BrowseDirection;
};
export declare function encodeBrowseDirection(value: BrowseDirection, stream: OutputBinaryStream): void;
export declare function decodeBrowseDirection(stream: BinaryStream, _value?: BrowseDirection): BrowseDirection;
export declare const _enumerationBrowseDirection: Enum;
