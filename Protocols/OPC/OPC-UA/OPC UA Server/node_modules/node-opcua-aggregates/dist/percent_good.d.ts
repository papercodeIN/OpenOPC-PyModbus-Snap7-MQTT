import { UAVariable } from "node-opcua-address-space";
import { DataValue } from "node-opcua-data-value";
/**
 *
 * @param node 	Retrieve the percentage of data (0 to 100) in the interval which has Good StatusCode.
 */
export declare function getPercentGoodData(node: UAVariable, processingInterval: number, startDate: Date, endDate: Date, callback: (err: Error | null, dataValues?: DataValue[]) => void): void;
