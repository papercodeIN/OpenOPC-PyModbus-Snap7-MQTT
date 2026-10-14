/***
 * @module node-opcua-basic-types
 */
import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
import { UAString } from "./string";
export declare function validateLocaleId(value: unknown): boolean;
export type LocaleId = UAString;
export declare function encodeLocaleId(localeId: LocaleId, stream: OutputBinaryStream): void;
export declare function decodeLocaleId(stream: BinaryStream): LocaleId;
