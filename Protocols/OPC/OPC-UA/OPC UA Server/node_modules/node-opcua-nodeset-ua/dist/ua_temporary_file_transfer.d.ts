import { UAObject, UAMethod, UAProperty } from "node-opcua-address-space-base";
import { DataType } from "node-opcua-variant";
/**
 * |                |                                                            |
 * |----------------|------------------------------------------------------------|
 * |namespace       |http://opcfoundation.org/UA/                                |
 * |nodeClass       |ObjectType                                                  |
 * |typedDefinition |TemporaryFileTransferType i=15744                           |
 * |isAbstract      |false                                                       |
 */
export interface UATemporaryFileTransfer_Base {
    clientProcessingTimeout: UAProperty<number, DataType.Double>;
    generateFileForRead: UAMethod;
    generateFileForWrite: UAMethod;
    closeAndCommit: UAMethod;
}
export interface UATemporaryFileTransfer extends UAObject, UATemporaryFileTransfer_Base {
}
