import { ProcessAltNamesParam } from "../common";
export declare const exportedEnvVars: any;
export declare function setEnv(varName: string, value: string): void;
export declare function hasEnv(varName: string): boolean;
export declare function getEnv(varName: string): string;
export declare function getEnvironmentVarNames(): any[];
export declare function processAltNames(params: ProcessAltNamesParam): void;
