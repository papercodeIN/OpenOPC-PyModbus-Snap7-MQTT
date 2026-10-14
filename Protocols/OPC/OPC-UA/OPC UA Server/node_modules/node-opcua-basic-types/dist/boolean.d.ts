import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
export declare function isValidBoolean(value: unknown): boolean;
export declare function randomBoolean(): boolean;
export declare function encodeBoolean(value: boolean, stream: OutputBinaryStream): void;
export declare function decodeBoolean(stream: BinaryStream, _value?: boolean): boolean;
export declare function coerceBoolean(value: boolean | string | number | null | undefined): boolean;
export type UABoolean = boolean;
export declare const encodeUABoolean: typeof encodeBoolean;
export declare const decodeUABoolean: typeof decodeBoolean;
