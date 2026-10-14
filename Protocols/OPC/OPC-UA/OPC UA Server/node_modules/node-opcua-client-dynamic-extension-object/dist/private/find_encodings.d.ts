import { NodeId } from "node-opcua-nodeid";
import { ISessionForBrowseAll } from "node-opcua-pseudo-session";
import { DataTypeAndEncodingId } from "node-opcua-schemas";
export declare function _findEncodings(session: ISessionForBrowseAll, dataTypeNodeId: NodeId): Promise<DataTypeAndEncodingId>;
