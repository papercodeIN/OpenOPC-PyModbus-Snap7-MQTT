import { LocalizedText } from "node-opcua-data-model";
import { UInt32 } from "node-opcua-basic-types";
import { ExtensionObject } from "node-opcua-extension-object";
import { DTStructure } from "./dt_structure";
import { EnumServerState } from "./enum_server_state";
import { DTBuildInfo } from "./dt_build_info";
/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |ServerStatusDataType                                        |
 * | isAbstract|false                                                       |
 */
export interface DTServerStatus extends DTStructure {
    startTime: Date;
    currentTime: Date;
    state: EnumServerState;
    buildInfo: DTBuildInfo;
    secondsTillShutdown: UInt32;
    shutdownReason: LocalizedText;
}
export interface UDTServerStatus extends ExtensionObject, DTServerStatus {
}
