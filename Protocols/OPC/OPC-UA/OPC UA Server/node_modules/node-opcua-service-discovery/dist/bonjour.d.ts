import { Bonjour, Service, ServiceConfig } from "sterfive-bonjour-service";
export declare function acquireBonjour(): Bonjour;
export declare function releaseBonjour(bonjour: Bonjour, callback: () => void): void;
export declare function acquireBonjour2(): Bonjour;
export declare function releaseBonjour2(bonjour: Bonjour): void;
export interface Announcement {
    port: number;
    path: string;
    name: string;
    host: string;
    capabilities: string[];
}
export declare function announcementToServiceConfig(announcement: Announcement): ServiceConfig;
export declare function isSameService(a?: ServiceConfig, b?: ServiceConfig): boolean;
export declare const serviceToString: (service: ServiceConfig) => string;
export declare function _announceServerOnMulticastSubnet(multicastDNS: Bonjour, serviceConfig: ServiceConfig): Promise<Service>;
export declare class BonjourHolder {
    serviceConfig?: ServiceConfig;
    private _multicastDNS?;
    private _service?;
    private pendingAnnouncement;
    /**
     *
     * @param announcement
     * @returns
     */
    announcedOnMulticastSubnet(announcement: Announcement): Promise<boolean>;
    isStarted(): boolean;
    /**
     *
     * @param announcement
     * @param callback
     * @private
     */
    announcedOnMulticastSubnetWithCallback(announcement: Announcement, callback: (err: Error | null, result?: boolean) => void): void;
    /**
     * @private
     */
    stopAnnouncedOnMulticastSubnet(): Promise<void>;
    stopAnnouncedOnMulticastSubnetWithCallback(callback: (err: Error | null) => void): void;
}
