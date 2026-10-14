import { VariantOptions } from "node-opcua-variant";
import { UInt32, UInt16, UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { DTDataSetMeta } from "./dt_data_set_meta";
import { EnumMessageSecurityMode } from "./enum_message_security_mode";
import { DTEndpointDescription } from "./dt_endpoint_description";
import { DTKeyValuePair } from "./dt_key_value_pair";
import { DTDataSetReaderTransport } from "./dt_data_set_reader_transport";
import { DTDataSetReaderMessage } from "./dt_data_set_reader_message";
import { DTSubscribedDataSet } from "./dt_subscribed_data_set";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |DataSetReaderDataType                                       |
 * | isAbstract|false                                                       |
 */
export interface DTDataSetReader extends DTStructure {
    name: UAString;
    enabled: boolean;
    publisherId: VariantOptions;
    writerGroupId: UInt16;
    dataSetWriterId: UInt16;
    dataSetMetaData: DTDataSetMeta;
    dataSetFieldContentMask: UInt32;
    messageReceiveTimeout: number;
    keyFrameCount: UInt32;
    headerLayoutUri: UAString;
    securityMode: EnumMessageSecurityMode;
    securityGroupId: UAString;
    securityKeyServices: DTEndpointDescription[];
    dataSetReaderProperties: DTKeyValuePair[];
    transportSettings: DTDataSetReaderTransport;
    messageSettings: DTDataSetReaderMessage;
    subscribedDataSet: DTSubscribedDataSet;
}
export interface UDTDataSetReader extends ExtensionObject, DTDataSetReader {
}
