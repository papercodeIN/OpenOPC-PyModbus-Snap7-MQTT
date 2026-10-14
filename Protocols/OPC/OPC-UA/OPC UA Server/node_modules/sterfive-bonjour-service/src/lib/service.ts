/**
 * Bonjour Service - Service Definition
 */

import { NetworkInterfaceInfo, networkInterfaces, hostname } from 'os'
import { EventEmitter } from 'events'
import * as mDNS from 'multicast-dns'

import { toString as ServiceToString } from './service-types'
import DnsTxt from './dns-txt'

const TLD: string = '.local'

export interface ServiceConfig extends Omit<mDNS.Options,"type"> {
    name: string
    type?: string
    port: number
    protocol?: 'tcp' | 'udp'
    host?: string
    fqdn?: string
    subtypes?: Array<string>
    txt?: Record<string, string>
    probe?: boolean
}

export interface ServiceRecord {
    name: string
    type: 'PTR' | 'SRV' | 'TXT' | 'A' | 'AAAA'
    ttl: number
    data: { [key: string]: any } | string | any
}

export interface ServiceReferer {
    address: string
    family: 'IPv4' | 'IPv6'
    port: number
    size: number
}

/**
 * Provide PTR record
 * @param service
 * @returns
 */
function RecordPTR(service: Service): ServiceRecord {
    return {
        name: `${service.type}${TLD}`,
        type: 'PTR',
        ttl: 28800,
        data: service.fqdn
    }
}

/**
 * Provide SRV record
 * @param service
 * @returns
 */
function RecordSRV(service: Service): ServiceRecord {
    return {
        name: service.fqdn,
        type: 'SRV',
        ttl: 120,
        data: {
            port: service.port,
            target: service.host
        }
    }
}

/**
 * Provide TXT record
 * @param service
 * @returns
 */
function RecordTXT(service: Service): ServiceRecord {
    const txtService = new DnsTxt()
    return {
        name: service.fqdn,
        type: 'TXT',
        ttl: 4500,
        data: txtService.encode(service.txt)
    }
}

/**
 * Provide A record
 * @param service
 * @param ip
 * @returns
 */
function RecordA(service: Service, ip: string): ServiceRecord {
    return {
        name: service.host,
        type: 'A',
        ttl: 120,
        data: ip
    }
}

/**
 * Provide AAAA record
 * @param service
 * @param ip
 * @returns
 */
function RecordAAAA(service: Service, ip: string): ServiceRecord {
    return {
        name: service.host,
        type: 'AAAA',
        ttl: 120,
        data: ip
    }
}

export class Service extends EventEmitter {
    public name: string
    public type: string
    public protocol: 'tcp' | 'udp'
    public port: number
    public host: string
    public fqdn: string
    public txt?: Record<string, string>
    public subtypes?: Array<string>
    public addresses?: Array<string>
    public referer?: ServiceReferer

    public probe: boolean = true

    public published: boolean = false
    public activated: boolean = false
    public destroyed: boolean = false

    public _broadCastTimeout: NodeJS.Timer | undefined

    public start?: any
    public stop?: any

    constructor(config: ServiceConfig) {
        super()

        if (!config.name) throw new Error('Required name not given')
        if (!config.type) throw new Error('Required type not given')
        if (!config.port) throw new Error('Required port not given')

        this.name = config.name
        this.protocol = config.protocol || 'tcp'
        this.type = ServiceToString({ name: config.type, protocol: this.protocol })
        this.port = config.port
        this.host = config.host || hostname()
        this.fqdn = `${this.name}.${this.type}${TLD}`
        this.txt = config.txt
        this.subtypes = config.subtypes
    }

    public records(): ServiceRecord[] {
        const records: ServiceRecord[] = [RecordPTR(this), RecordSRV(this), RecordTXT(this)]

        // Create record per interface address
        const ifaces: Array<NetworkInterfaceInfo[]> = Object.values(networkInterfaces()) as unknown as NetworkInterfaceInfo[][]
        for (let iface of ifaces) {
            let addrs = iface
            for (let addr of addrs) {
                if (addr.internal || addr.mac === '00:00:00:00:00:00') continue
                switch (addr.family) {
                    case 'IPv4':
                        records.push(RecordA(this, addr.address))
                        break
                    case 'IPv6':
                        records.push(RecordAAAA(this, addr.address))
                        break
                }
            }
        }

        // Return all records
        return records
    }
}

export default Service
