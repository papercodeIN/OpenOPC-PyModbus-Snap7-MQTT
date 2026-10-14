import * as mDNS from 'multicast-dns'
import Registry from './lib/registry'
import Server from './lib/mdns-server'
import Browser, { BrowserConfig } from './lib/browser'
import Service, { ServiceConfig, ServiceReferer } from './lib/service'

export class Bonjour {
    private server: Server
    private registry: Registry
    private timerId: NodeJS.Timer | undefined

    /**
     * Setup bonjour service with optional config
     * @param opts ServiceConfig | undefined
     * @param errorCallback Function | undefined
     */
    constructor(opts?: ServiceConfig, errorCallback?: Function | undefined) {
        this.server = new Server(opts as unknown as mDNS.Options, errorCallback)
        this.registry = new Registry(this.server)
    }

    /**
     * Publish a service for the device with options
     * @param opts
     * @returns
     */
    public publish(opts: ServiceConfig): Service {
        return this.registry.publish(opts)
    }

    /**
     * Unpublish all services for the device
     * @param callback
     * @returns
     */
    public unpublishAll(callback?: CallableFunction | undefined): void {
        return this.registry.unpublishAll(callback)
    }

    /**
     * Find services on the network with options
     * @param opts BrowserConfig
     * @param onup Callback when up event received
     * @returns
     */
    public find(opts: BrowserConfig | undefined = undefined, onup?: (service: Service) => void): Browser {
        return new Browser(this.server.mdns, opts, onup)
    }

    /**
     * Find a single device and close browser
     * @param opts BrowserConfig
     * @param timeout Timeout (ms) if not device is found, default 10s
     * @param callback Callback when device found
     * @returns
     */
    public findOne(opts: BrowserConfig | undefined = undefined, timeout = 10000, callback?: CallableFunction): Browser {
        if (this.timerId) {
            clearTimeout(this.timerId)
            this.timerId = undefined
        }
        const browser: Browser = new Browser(this.server.mdns, opts)
        browser.once('up', (service: Service) => {
            if (this.timerId !== undefined) {
                clearTimeout(this.timerId)
                this.timerId = undefined
            }
            browser.stop()
            if (callback) callback(service)
        })
        this.timerId = setTimeout(() => {
            browser.stop()
            if (callback) callback(null)
        }, timeout)
        return browser
    }

    /**
     * Destroy the class
     */
    public destroy(callback?: () => void) {
        if (this.timerId) {
            clearTimeout(this.timerId)
            this.timerId = undefined
        }
        this.registry.destroy()
        this.server.mdns.destroy(callback);
    }
}

export { Service, ServiceReferer, ServiceConfig, Browser, BrowserConfig }

export default Bonjour
