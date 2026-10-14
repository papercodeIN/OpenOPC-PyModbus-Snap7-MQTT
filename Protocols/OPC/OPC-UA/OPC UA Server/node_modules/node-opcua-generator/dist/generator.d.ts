import { ConstructorFunc } from "node-opcua-factory";
export declare const verbose = false;
export declare function generateCode(schemaName: string, localSchemaFile: string, generatedCodeFolder?: string): Promise<void>;
export declare function generateTypeScriptCodeFromSchema(schemaName: string): Promise<void>;
export declare function registerObject(schema: string, generateCodeFolder?: string): Promise<ConstructorFunc | null>;
export declare function unregisterObject(schema: {
    name: string;
}, folder: string): void;
