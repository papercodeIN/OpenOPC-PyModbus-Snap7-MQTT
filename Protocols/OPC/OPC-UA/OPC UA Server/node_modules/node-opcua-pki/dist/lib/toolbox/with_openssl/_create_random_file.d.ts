import { ExecuteOptions } from "./execute_openssl";
export declare function createRandomFile(randomFile: string, options: ExecuteOptions): Promise<void>;
export declare function createRandomFileIfNotExist(randomFile: string, options: ExecuteOptions): Promise<void>;
export declare function useRandFile(): boolean;
