import { UAVariable } from "node-opcua-address-space";
import { DataValue } from "node-opcua-data-value";
export declare function getCountData(node: UAVariable, processingInterval: number, startDate: Date, endDate: Date, callback: (err: Error | null, dataValues?: DataValue[]) => void): void;
