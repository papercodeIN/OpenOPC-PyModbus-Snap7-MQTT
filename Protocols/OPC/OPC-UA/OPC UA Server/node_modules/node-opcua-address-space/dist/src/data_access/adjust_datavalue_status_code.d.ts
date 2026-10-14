import { StatusCode } from "node-opcua-status-code";
import { DataValue } from "node-opcua-data-value";
import { UAVariableImpl } from "../ua_variable_impl";
export declare function adjustDataValueStatusCode(variable: UAVariableImpl, dataValue: DataValue, acceptValueOutOfRange: boolean): StatusCode;
