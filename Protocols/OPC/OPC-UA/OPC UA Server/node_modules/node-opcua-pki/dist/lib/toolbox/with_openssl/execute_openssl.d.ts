export interface ExecuteOptions {
    cwd?: string;
    hideErrorMessage?: boolean;
}
export declare function execute(cmd: string, options: ExecuteOptions): Promise<string>;
export declare function find_openssl(): Promise<string>;
export declare function ensure_openssl_installed(): Promise<void>;
export declare function executeOpensslAsync(cmd: string, options: ExecuteOpenSSLOptions): Promise<string>;
export declare function execute_openssl_no_failure(cmd: string, options: ExecuteOpenSSLOptions): Promise<string | undefined>;
export interface ExecuteOpenSSLOptions extends ExecuteOptions {
    openssl_conf?: string;
}
export declare function execute_openssl(cmd: string, options: ExecuteOpenSSLOptions): Promise<string>;
