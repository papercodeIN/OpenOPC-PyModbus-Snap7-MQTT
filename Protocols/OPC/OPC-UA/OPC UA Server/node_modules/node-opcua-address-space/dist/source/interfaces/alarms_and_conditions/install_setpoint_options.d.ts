import { UAVariableT } from "node-opcua-address-space-base";
import { DataType } from "node-opcua-basic-types";
import { NodeId } from "node-opcua-nodeid";
export interface InstallSetPointOptions {
    setpointNode?: UAVariableT<number, DataType.Double> | UAVariableT<number, DataType.Float> | null;
}
export interface SetPointSupport {
    setpointNodeNode?: UAVariableT<number, DataType.Double> | UAVariableT<number, DataType.Float>;
    setpointNode: UAVariableT<NodeId, DataType.NodeId>;
}
