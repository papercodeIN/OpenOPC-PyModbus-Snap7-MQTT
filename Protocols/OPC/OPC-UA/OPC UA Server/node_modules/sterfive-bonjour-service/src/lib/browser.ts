import { EventEmitter } from 'events'
import Service, { ServiceRecord } from './service'
import { toString as ServiceToString, toType as ServiceToType } from './service-types'
import DnsTxt from './dns-txt'
import * as mDNS from 'multicast-dns'
import { MulticastDNS } from 'multicast-dns'
import { RemoteInfo } from 'dgram'

const dnsEqual = require('dns-equal')

const TLD = '.local'
const WILDCARD = '_services._dns-sd._udp' + TLD

export interface BrowserConfig {
    type: string
    protocol?: 'tcp' | 'udp'
    subtypes?: Array<string>
    txt?: Record<string, string>
}

/**
 * Start a browser
 *
 * The browser listens for services by querying for PTR records of a given
 * type, protocol and domain, e.g. _http._tcp.local.
 *
 * If no type is given, a wild card search is performed.
 *
 * An internal list of online services is kept which starts out empty. When
 * ever a new service is discovered, it's added to the list and an "up" event
 * is emitted with that service. When it's discovered that the service is no
 * longer available, it is removed from the list and a "down" event is emitted
 * with that service.
 */

export class Browser extends EventEmitter {
    private mdns?: MulticastDNS
    private onresponse?: (response: mDNS.ResponsePacket, rinfo: RemoteInfo) => void
    private serviceMap: { [key: string]: any } = {}

    private txt?: DnsTxt
    private name?: string
    private wildcard: boolean = false

    private _services: Array<any> = []

    constructor(mdns: MulticastDNS, opts: any, onup?: (service: Service) => void) {
        super()

        if (typeof opts === 'function') return new Browser(mdns, null, opts)

        this.mdns = mdns

        if (opts != null && opts.txt != null) {
            this.txt = new DnsTxt(opts.txt)
        } else {
            this.txt = new DnsTxt()
        }

        if (!opts || !opts.type) {
            this.name = WILDCARD
            this.wildcard = true
        } else {
            this.name = ServiceToString({ name: opts.type, protocol: opts.protocol || 'tcp' }) + TLD
            if (opts.name) this.name = opts.name + '.' + this.name
            this.wildcard = false
        }

        if (onup) this.on('up', onup)

        this.start()
    }

    public start() {
        if (this.onresponse || this.name === undefined) return

        const self = this

        // List of names for the browser to listen for. In a normal search this will
        // be the primary name stored on the browser. In case of a wildcard search
        // the names will be determined at runtime as responses come in.
        const nameMap: { [key: string]: any } = {}
        if (!this.wildcard) nameMap[this.name] = true

        this.onresponse = (packet: mDNS.ResponsePacket, rinfo: RemoteInfo) => {
            if (self.wildcard) {
                packet.answers.forEach((answer) => {
                    if (answer.type !== 'PTR' || answer.name !== self.name || answer.name in nameMap) return
                    nameMap[answer.data] = true
                    self.mdns?.query(answer.data, 'PTR')
                })
            }

            Object.keys(nameMap).forEach((name) => {
                // unregister all services shutting down
                self.goodbyes(name, packet).forEach(self.removeService.bind(self))

                // register all new services
                const matches = self.buildServicesFor(name, packet, self.txt, rinfo)
                if (matches.length === 0) return

                matches.forEach((service: Service) => {
                    if (self.serviceMap[service.fqdn]) return // ignore already registered services
                    self.addService(service)
                })
            })
        }

        this.mdns?.on('response', this.onresponse!)
        this.update()
    }

    public stop() {
        if (!this.onresponse) return
        this.mdns?.removeListener('response', this.onresponse)
        this.onresponse = undefined
    }

    public update() {
        this.mdns?.query(this.name || '', 'PTR')
    }

    public get services() {
        return this._services
    }

    private addService(service: Service) {
        this._services.push(service)
        this.serviceMap[service.fqdn] = true
        this.emit('up', service)
    }

    private removeService(fqdn: string) {
        let service, index
        this._services.some(function (s, i) {
            if (dnsEqual(s.fqdn, fqdn)) {
                service = s
                index = i
                return true
            }
        })
        if (!service || index === undefined) return
        this._services.splice(index, 1)
        delete this.serviceMap[fqdn]
        this.emit('down', service)
    }

    // PTR records with a TTL of 0 is considered a "goodbye" announcement. I.e. a
    // DNS response broadcasted when a service shuts down in order to let the
    // network know that the service is no longer going to be available.
    //
    // For more info see:
    // https://tools.ietf.org/html/rfc6762#section-8.4
    //
    // This function returns an array of all resource records considered a goodbye
    // record
    private goodbyes(name: string, packet: any) {
        return packet.answers
            .concat(packet.additionals)
            .filter((rr: ServiceRecord) => rr.type === 'PTR' && rr.ttl === 0 && dnsEqual(rr.name, name))
            .map((rr: ServiceRecord) => rr.data)
    }

    private buildServicesFor(name: string, packet: any, txt: any, referer: any) {
        const records = packet.answers.concat(packet.additionals).filter((rr: ServiceRecord) => rr.ttl > 0) // ignore goodbye messages

        return records
            .filter((rr: ServiceRecord) => rr.type === 'PTR' && dnsEqual(rr.name, name))
            .map((ptr: ServiceRecord) => {
                const service: { [key: string]: any } = {
                    addresses: []
                }

                records
                    .filter((rr: ServiceRecord) => {
                        return (rr.type === 'SRV' || rr.type === 'TXT') && dnsEqual(rr.name, ptr.data)
                    })
                    .forEach((rr: ServiceRecord) => {
                        if (rr.type === 'SRV') {
                            const parts = rr.name.split('.')
                            const name = parts[0]
                            const types = ServiceToType(parts.slice(1, -1).join('.'))
                            service.name = name
                            service.fqdn = rr.name
                            service.host = rr.data.target
                            service.referer = referer
                            service.port = rr.data.port
                            service.type = types.name
                            service.protocol = types.protocol
                            service.subtypes = types.subtypes
                        } else if (rr.type === 'TXT') {
                            service.rawTxt = rr.data
                            service.txt = this.txt?.decodeAll(rr.data)
                        }
                    })

                if (!service.name) return

                records
                    .filter((rr: ServiceRecord) => (rr.type === 'A' || rr.type === 'AAAA') && dnsEqual(rr.name, service.host))
                    .forEach((rr: ServiceRecord) => service.addresses.push(rr.data))

                return service
            })
            .filter((rr: ServiceRecord) => !!rr)
    }
}

export default Browser
