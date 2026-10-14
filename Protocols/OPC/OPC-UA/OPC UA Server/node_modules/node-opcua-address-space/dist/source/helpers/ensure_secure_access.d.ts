import { BaseNode } from "node-opcua-address-space-base";
/**
 * this method install the access right restriction on the given node and its children
 * values will only be available to user with role Administrator or supervisor and
 * with a signed and encrypted channel.
 *
 * @param node the node which permissions are to be adjusted
 */
export declare function ensureObjectIsSecure(node: BaseNode): void;
