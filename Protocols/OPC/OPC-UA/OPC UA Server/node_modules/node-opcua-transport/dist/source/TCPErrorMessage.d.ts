/**
 * @module node-opcua-transport
 */
import { UAString } from "node-opcua-basic-types";
import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
import { BaseUAObject } from "node-opcua-factory";
import { StatusCode } from "node-opcua-status-code";
export declare class TCPErrorMessage extends BaseUAObject {
    static possibleFields: string[];
    statusCode: StatusCode;
    reason: UAString;
    constructor(options?: {
        statusCode?: StatusCode;
        reason?: string;
    });
    encode(stream: OutputBinaryStream): void;
    decode(stream: BinaryStream): void;
}
