import { Byte, UAString } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { EnumServerState } from "./enum_server_state";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |RedundantServerDataType                                     |
 * | isAbstract|false                                                       |
 */
export interface DTRedundantServer extends DTStructure {
    serverId: UAString;
    serviceLevel: Byte;
    serverState: EnumServerState;
}
export interface UDTRedundantServer extends ExtensionObject, DTRedundantServer {
}
