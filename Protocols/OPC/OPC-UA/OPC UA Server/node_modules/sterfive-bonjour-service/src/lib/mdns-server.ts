import flatten              from 'array-flatten'
import { ServiceRecord }    from './service'
import deepEqual            from 'fast-deep-equal/es6'

import dnsEqual             from 'dns-equal'

import mDNS, { QueryPacket, MulticastDNS } from 'multicast-dns'

function makeIsDuplicateRecord(a: ServiceRecord): (b: ServiceRecord) => boolean {
    return (b: ServiceRecord) => {
        return a.type === b.type && a.name === b.name && deepEqual(a.data, b.data)
    }
}

function makeUnique<T>(): (obj: T) => boolean {
    const set: Array<T> = []
    return (obj: T) => {
        if (~set.indexOf(obj)) return false
        set.push(obj)
        return true
    }
}

export class Server {
    public mdns: MulticastDNS
    private registry: Record<string, ServiceRecord[]> = {}
    private errorCallback: Function

    constructor(opts?: mDNS.Options, errorCallback?: Function) {
        this.mdns = mDNS(opts)
        this.mdns.setMaxListeners(0)
        this.mdns.on('query', this.respondToQuery.bind(this))
        this.errorCallback =
            errorCallback ??
            function (err: Error) {
                throw err
            }
    }

    public register(records: ServiceRecord[] | ServiceRecord) {
        // Register a record
        const shouldRegister = (record: ServiceRecord) => {
            let subRegistry = this.registry[record.type]
            if (!subRegistry) {
                subRegistry = this.registry[record.type] = []
            } else if (subRegistry.some(makeIsDuplicateRecord(record))) {
                return
            }
            subRegistry.push(record)
        }

        if (Array.isArray(records)) {
            // Multiple records
            records.forEach(shouldRegister)
        } else {
            // Single record
            shouldRegister(records)
        }
    }

    public unregister(records: ServiceRecord[] | ServiceRecord) {
        // Unregister a record
        const shouldUnregister = (record: ServiceRecord) => {
            let type = record.type
            if (!(type in this.registry)) {
                return
            }
            this.registry[type] = this.registry[type].filter((i: ServiceRecord) => i.name !== record.name)
        }

        if (Array.isArray(records)) {
            // Multiple records
            records.forEach(shouldUnregister)
        } else {
            // Single record
            shouldUnregister(records)
        }
    }

    private respondToQuery(query: QueryPacket): void {
        let self = this
        query.questions.forEach((question) => {
            const type = question.type
            const name = question.name

            // generate the answers section
            const answers: ServiceRecord[] =
                (type as string) === 'ANY'
                    ? (flatten.depth(
                          Object.keys(self.registry).map(self.recordsFor.bind(self, name)),
                          1
                      ) as unknown as ServiceRecord[])
                    : self.recordsFor(name, type)

            if (answers.length === 0) return

            // generate the additionals section
            let additionals: ServiceRecord[] = []
            if ((type as string) !== 'ANY') {
                answers.forEach((answer) => {
                    if (answer.type !== 'PTR') return
                    additionals = additionals
                        .concat(self.recordsFor(answer.data, 'SRV'))
                        .concat(self.recordsFor(answer.data, 'TXT'))
                })

                // to populate the A and AAAA records, we need to get a set of unique
                // targets from the SRV record
                additionals
                    .filter(function (record) {
                        return record.type === 'SRV'
                    })
                    .map(function (record) {
                        return record.data.target
                    })
                    .filter(makeUnique())
                    .forEach(function (target) {
                        additionals = additionals.concat(self.recordsFor(target, 'A')).concat(self.recordsFor(target, 'AAAA'))
                    })
            }

            self.mdns.respond({ answers, additionals }, (err?: Error | null) => {
                if (err) {
                    this.errorCallback(err)
                }
            })
        })
    }

    private recordsFor(name: string, type: string): ServiceRecord[] {
        if (!(type in this.registry)) {
            return []
        }

        return this.registry[type].filter((record: ServiceRecord) => {
            const _name = ~name.indexOf('.') ? record.name : record.name.split('.')[0]
            return dnsEqual(_name, name)
        })
    }
}

export default Server
