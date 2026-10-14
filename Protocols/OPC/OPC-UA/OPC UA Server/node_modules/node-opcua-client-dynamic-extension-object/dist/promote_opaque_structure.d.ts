import { IBasicSessionAsync2 } from "node-opcua-pseudo-session";
import { Variant } from "node-opcua-variant";
export interface PseudoDataValue {
    value: Variant;
}
export declare function extractDataValueToPromote(dataValues: PseudoDataValue[]): PseudoDataValue[];
/**
 *
 * @private
 */
export declare function promoteOpaqueStructure(session: IBasicSessionAsync2, dataValues: PseudoDataValue[]): Promise<void>;
