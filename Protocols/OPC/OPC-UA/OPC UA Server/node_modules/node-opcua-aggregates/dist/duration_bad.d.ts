import { UAVariable } from "node-opcua-address-space";
import { DataValue } from "node-opcua-data-value";
/**Retrieve the percentage of data (0 to 100) in the interval which has Bad StatusCode. */
export declare function getDurationBadData(node: UAVariable, processingInterval: number, startDate: Date, endDate: Date, callback: (err: Error | null, dataValues?: DataValue[]) => void): void;
