import { type IStream } from '../shared';
export interface SocksConnectionOptions {
    timeout?: number;
    lookup?: (hostname: string) => Promise<{
        address: string;
    }>;
}
export default function openSocks(destinationHost: string, destinationPort: number, socksUrl: string, options?: SocksConnectionOptions): IStream;
