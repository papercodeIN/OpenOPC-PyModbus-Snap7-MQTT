import { setTimeout } from 'timers'
import flatten from 'array-flatten'
import dnsEqual from 'dns-equal'
import * as mDNS from 'multicast-dns'
import { MulticastDNS } from 'multicast-dns'
import Server from './mdns-server'
import Service, { ServiceConfig, ServiceRecord } from './service'

const REANNOUNCE_MAX_MS: number = 60 * 60 * 1000
const REANNOUNCE_FACTOR: number = 3

export class Registry {
    private server: Server
    private services: Array<Service> = []

    constructor(server: Server) {
        this.server = server
    }

    public publish(config: ServiceConfig): Service {
        function start(service: Service, registry: Registry, opts: Service) {
            if (service.activated) return
            service.activated = true

            registry.services.push(service)

            if (!(service instanceof Service)) return

            if (opts.probe) {
                registry.probe(registry.server.mdns, service, (exists: boolean) => {
                    if (exists) {
                        service.stop()
                        console.log(new Error('Service name is already in use on the network'))
                        return
                    }
                    registry.announce(registry.server, service)
                })
            } else {
                registry.announce(registry.server, service)
            }
        }

        function stop(service: Service, registry: Registry, callback?: CallableFunction) {
            if (!service.activated) return

            if (!(service instanceof Service)) return
            registry.teardown(registry.server, service, callback)

            const index = registry.services.indexOf(service)
            if (index !== -1) registry.services.splice(index, 1)
        }

        let service = new Service(config)
        service.start = start.bind(null, service, this)
        service.stop = stop.bind(null, service, this)
        service.start({ probe: config.probe !== false })
        return service
    }

    public unpublishAll(callback: CallableFunction | undefined) {
        this.teardown(this.server, this.services, callback)
        this.services = []
    }

    public destroy() {
        this.services.map((service) => {
            if (service._broadCastTimeout) {
                clearTimeout(service._broadCastTimeout)
                service._broadCastTimeout = undefined
            }
            service.destroyed = true
        })
    }

    /**
     * Check if a service name is already in use on the network.
     *
     * Used before announcing the new service.
     *
     * To guard against race conditions where multiple services are started
     * simultaneously on the network, wait a random amount of time (between
     * 0 and 250 ms) before probing.
     *
     */
    private probe(mdns: MulticastDNS, service: Service, callback: CallableFunction) {
        let sent: boolean = false
        let retries: number = 0
        let timer: NodeJS.Timer

        const send = () => {
            // abort if the service have or is being stopped in the meantime
            if (!service.activated || service.destroyed) return

            mdns.query(service.fqdn, 'ANY' as any, function () {
                // This function will optionally be called with an error object. We'll
                // just silently ignore it and retry as we normally would
                sent = true
                timer = setTimeout(++retries < 3 ? send : done, 250)
                timer.unref()
            })
        }

        const matchRR = (rr: { name: string }): boolean => {
            return dnsEqual(rr.name, service.fqdn)
        }

        const onresponse = (packet: mDNS.ResponsePacket) => {
            // Apparently conflicting Multicast DNS responses received *before*
            // the first probe packet is sent MUST be silently ignored (see
            // discussion of stale probe packets in RFC 6762 Section 8.2,
            // "Simultaneous Probe Tiebreaking" at
            // https://tools.ietf.org/html/rfc6762#section-8.2
            if (!sent) return
            if (packet.answers.some(matchRR) || packet.additionals.some(matchRR)) done(true)
        }

        const done = (exists: boolean) => {
            mdns.removeListener('response', onresponse)
            clearTimeout(timer)
            callback(!!exists)
        }

        mdns.on('response', onresponse)
        setTimeout(send, Math.random() * 250)
    }

    /**
     * Initial service announcement
     *
     * Used to announce new services when they are first registered.
     *
     * Broadcasts right away, then after 3 seconds, 9 seconds, 27 seconds,
     * and so on, up to a maximum interval of one hour.
     */
    private announce(server: Server, service: Service) {
        let delay = 1000
        const packet: ServiceRecord[] = service.records()

        // Register the records
        server.register(packet)

        const broadcast = () => {
            if (!service.activated || service.destroyed) return

            service._broadCastTimeout = undefined

            server.mdns.respond({ answers: packet }, () => {
                // This function will optionally be called with an error object. We'll
                // just silently ignore it and retry as we normally would
                if (!service.published) {
                    service.activated = true
                    service.published = true
                    service.emit('up')
                }
                delay = delay * REANNOUNCE_FACTOR
                if (delay < REANNOUNCE_MAX_MS && !service.destroyed) {
                    service._broadCastTimeout = setTimeout(broadcast, delay)
                }
            })
        }
        service._broadCastTimeout = setTimeout(broadcast, 1)
    }

    /**
     * Stop the given services
     *
     * Besides removing a service from the mDNS registry, a "goodbye"
     * message is sent for each service to let the network know about the
     * shutdown.
     */
    private teardown(server: Server, serviceOrServices: Array<Service> | Service, callback: any) {
        let services = Array.isArray(serviceOrServices) ? serviceOrServices : [serviceOrServices]

        services = services.filter((service: Service) => service.activated) as Service[] // ignore services not currently starting or started

        const records = flatten.depth(
            services.map((service) => {
                service.activated = false
                const records = service.records()
                records.forEach((record: ServiceRecord) => {
                    record.ttl = 0 // prepare goodbye message
                })
                return records
            }),
            1
        ) as unknown as ServiceRecord[]

        if (records.length === 0) return callback && callback()
        server.unregister(records)

        // send goodbye message
        server.mdns.respond(records, function () {
            ;(services as Array<Service>).forEach(function (service) {
                service.published = false
            })
            if (typeof callback === 'function') {
                callback.apply(null, arguments)
            }
        })
    }
}

export default Registry
