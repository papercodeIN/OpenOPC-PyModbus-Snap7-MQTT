import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
import { BaseUAObject, DecodeDebugOptions, IStructuredTypeSchema } from "node-opcua-factory";
import { StatusCode } from "node-opcua-status-code";
import { Int32, UAString } from "node-opcua-basic-types";
export declare const schemaDiagnosticInfo: IStructuredTypeSchema;
export declare class DiagnosticInfo extends BaseUAObject {
    static schema: IStructuredTypeSchema;
    static possibleFields: string[];
    symbolicId: Int32;
    namespaceURI: Int32;
    locale: Int32;
    localizedText: Int32;
    additionalInfo: UAString;
    innerStatusCode: StatusCode;
    innerDiagnosticInfo: DiagnosticInfo;
    /**
     */
    constructor(options?: DiagnosticInfoOptions);
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
    decodeDebug(stream: BinaryStream, options: DecodeDebugOptions): void;
    static filterForResponse(diagnostic: DiagnosticInfo, requestedDiagnostics: number, diagnosticInfoMask: DiagnosticInfo_Mask): DiagnosticInfo;
}
export interface DiagnosticInfoOptions {
    symbolicId?: Int32;
    namespaceURI?: Int32;
    locale?: Int32;
    localizedText?: Int32;
    additionalInfo?: UAString;
    innerStatusCode?: StatusCode;
    innerDiagnosticInfo?: DiagnosticInfo;
}
export declare enum DiagnosticInfo_ServiceLevelMask {
    None = 0,
    SymbolicId = 1,
    LocalizedText = 2,
    AdditionalInfo = 4,
    InnerStatusCode = 8,
    InnerDiagnostics = 16
}
export declare enum DiagnosticInfo_OperationLevelMask {
    SymbolicId = 32,
    LocalizedText = 64,
    AdditionalInfo = 128,
    InnerStatusCode = 256,
    InnerDiagnostics = 512
}
type DiagnosticInfo_Mask = typeof DiagnosticInfo_ServiceLevelMask | typeof DiagnosticInfo_OperationLevelMask;
export declare const RESPONSE_DIAGNOSTICS_MASK_ALL = 1023;
export declare function filterDiagnosticInfoLevel(returnDiagnostics: number, diagnostic: DiagnosticInfo | null, diagnosticInfoMask: DiagnosticInfo_Mask): DiagnosticInfo | null;
export declare function filterDiagnosticOperationLevel(returnDiagnostics: number, diagnostic: DiagnosticInfo | null): DiagnosticInfo | null;
export declare function filterDiagnosticServiceLevel(returnDiagnostics: number, diagnostic: DiagnosticInfo | null): DiagnosticInfo | null;
export declare enum DiagnosticInfo_EncodingByte {
    SymbolicId = 1,
    NamespaceURI = 2,
    LocalizedText = 4,
    Locale = 8,
    AdditionalInfo = 16,
    InnerStatusCode = 32,
    InnerDiagnosticInfo = 64
}
export declare function encodeDiagnosticInfo(value: DiagnosticInfo | null, stream: OutputBinaryStream): void;
export declare function decodeDiagnosticInfo(stream: BinaryStream, _value?: DiagnosticInfo | null): DiagnosticInfo;
export {};
