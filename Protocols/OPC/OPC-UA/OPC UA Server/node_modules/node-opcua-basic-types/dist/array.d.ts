import { BinaryStream, OutputBinaryStream } from "node-opcua-binary-stream";
/**

 * @param arr     the array to encode.
 * @param stream  the stream.
 * @param encodeElementFunc   The  function to encode a single array element.
 */
export declare function encodeArray(arr: any[] | null, stream: OutputBinaryStream, encodeElementFunc: (value: any, stream: OutputBinaryStream) => void): void;
/**
 * decode an array from a BinaryStream
 * @param stream  the stream.
 * @param decodeElementFunc   The  function to decode a single array element.
 *                            This function returns the element decoded from the stream
 * @returns an array of elements or nul
 */
export declare function decodeArray(stream: BinaryStream, decodeElementFunc: (stream: BinaryStream) => any): any[] | null;
