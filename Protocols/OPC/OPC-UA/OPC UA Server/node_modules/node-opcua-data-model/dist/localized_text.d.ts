import { LocaleId, UAString } from "node-opcua-basic-types";
import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
import { BaseUAObject, DecodeDebugOptions, IStructuredTypeSchema } from "node-opcua-factory";
export declare function coerceLocalizedText(value?: null | string | LocalizedTextOptions): LocalizedText | null;
export interface LocalizedTextOptions {
    locale?: LocaleId;
    text?: UAString;
}
export declare class LocalizedText extends BaseUAObject {
    static get schema(): IStructuredTypeSchema;
    get schema(): IStructuredTypeSchema;
    static possibleFields: string[];
    static coerce(value?: null | string | LocalizedTextOptions): LocalizedText | null;
    locale: LocaleId;
    text: UAString;
    constructor(options?: LocalizedTextOptions | string | null);
    toString(): string;
    encode(stream: OutputBinaryStream): void;
    decodeDebug(stream: BinaryStream, options: DecodeDebugOptions): void;
    decode(stream: BinaryStream): void;
}
export type LocalizedTextLike = LocalizedTextOptions | string;
export declare function encodeLocalizedText(value: LocalizedText, stream: OutputBinaryStream): void;
export declare function decodeLocalizedText(stream: BinaryStream, value?: LocalizedText): LocalizedText;
