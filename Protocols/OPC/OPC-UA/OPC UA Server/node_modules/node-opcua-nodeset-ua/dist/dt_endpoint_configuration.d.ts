import { Int32 } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |EndpointConfiguration                                       |
 * | isAbstract|false                                                       |
 */
export interface DTEndpointConfiguration extends DTStructure {
    operationTimeout: Int32;
    useBinaryEncoding: boolean;
    maxStringLength: Int32;
    maxByteStringLength: Int32;
    maxArrayLength: Int32;
    maxMessageSize: Int32;
    maxBufferSize: Int32;
    channelLifetime: Int32;
    securityTokenLifetime: Int32;
}
export interface UDTEndpointConfiguration extends ExtensionObject, DTEndpointConfiguration {
}
