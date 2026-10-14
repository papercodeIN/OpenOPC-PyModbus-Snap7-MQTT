import { NodeId } from "node-opcua-nodeid";
import { IBasicSessionAsync2 } from "node-opcua-pseudo-session";
import { AnyConstructorFunc } from "node-opcua-schemas";
/**
 *
 */
export declare function getExtensionObjectConstructor(session: IBasicSessionAsync2, dataTypeNodeId: NodeId): Promise<AnyConstructorFunc>;
