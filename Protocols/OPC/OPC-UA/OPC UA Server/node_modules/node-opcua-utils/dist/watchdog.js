"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchDog = void 0;
/**
 * @module node-opcua-utils
 */
const events_1 = require("events");
const node_opcua_assert_1 = require("node-opcua-assert");
const get_clock_tick_1 = require("./get_clock_tick");
function hasExpired(watchDogData, currentTime) {
    const elapsedTime = currentTime - watchDogData.lastSeen;
    return elapsedTime > watchDogData.timeout;
}
function keepAliveFunc() {
    (0, node_opcua_assert_1.assert)(this._watchDog instanceof WatchDog);
    // istanbul ignore next
    if (!this._watchDogData || !this._watchDog) {
        throw new Error("Internal error");
    }
    (0, node_opcua_assert_1.assert)(typeof this._watchDogData.key === "number");
    this._watchDogData.lastSeen = this._watchDog.getCurrentSystemTick();
    if (this.onClientSeen) {
        this.onClientSeen();
    }
}
class WatchDog extends events_1.EventEmitter {
    static lastSeenToDuration(lastSeen) {
        return (0, get_clock_tick_1.get_clock_tick)() - lastSeen;
    }
    /**
     * returns the number of subscribers using the WatchDog object.
     */
    get subscriberCount() {
        return Object.keys(this._watchdogDataMap).length;
    }
    constructor() {
        super();
        this._watchdogDataMap = {};
        this._counter = 0;
        this._currentTime = this.getCurrentSystemTick();
        this._visitSubscriberB = this._visit_subscriber.bind(this);
        this._timer = null; // as NodeJS.Timer;
    }
    /**
     * add a subscriber to the WatchDog.

     *
     * add a subscriber to the WatchDog.
     *
     * This method modifies the subscriber be adding a
     * new method to it called 'keepAlive'
     * The subscriber must also provide a "watchdogReset". watchdogReset will be called
     * if the subscriber failed to call keepAlive withing the timeout period.
     * @param subscriber
     * @param timeout
     * @return the numerical key associated with this subscriber
     */
    addSubscriber(subscriber, timeout) {
        this._currentTime = this.getCurrentSystemTick();
        timeout = timeout || 1000;
        (0, node_opcua_assert_1.assert)(typeof timeout === "number", " invalid timeout ");
        (0, node_opcua_assert_1.assert)(typeof subscriber.watchdogReset === "function", " the subscriber must provide a watchdogReset method ");
        (0, node_opcua_assert_1.assert)(typeof subscriber.keepAlive !== "function" || subscriber.keepAlive === WatchDog.emptyKeepAlive);
        this._counter += 1;
        const key = this._counter;
        subscriber._watchDog = this;
        subscriber._watchDogData = {
            key,
            lastSeen: this._currentTime,
            subscriber,
            timeout,
            visitCount: 0
        };
        this._watchdogDataMap[key] = subscriber._watchDogData;
        if (subscriber.onClientSeen) {
            subscriber.onClientSeen();
        }
        subscriber.keepAlive = keepAliveFunc.bind(subscriber);
        // start timer when the first subscriber comes in
        if (this.subscriberCount === 1) {
            (0, node_opcua_assert_1.assert)(this._timer === null);
            this._start_timer();
        }
        (0, node_opcua_assert_1.assert)(this._timer !== null);
        return key;
    }
    removeSubscriber(subscriber) {
        if (!subscriber._watchDog) {
            return; // already removed !!!
        }
        if (!subscriber._watchDogData) {
            throw new Error("Internal error");
        }
        (0, node_opcua_assert_1.assert)(subscriber._watchDog instanceof WatchDog);
        (0, node_opcua_assert_1.assert)(typeof subscriber._watchDogData.key === "number");
        (0, node_opcua_assert_1.assert)(typeof subscriber.keepAlive === "function");
        (0, node_opcua_assert_1.assert)(Object.prototype.hasOwnProperty.call(this._watchdogDataMap, subscriber._watchDogData.key));
        delete this._watchdogDataMap[subscriber._watchDogData.key];
        delete subscriber._watchDog;
        // leave it as it might be useful, delete subscriber._watchDogData;
        subscriber.keepAlive = WatchDog.emptyKeepAlive;
        // delete timer when the last subscriber comes out
        if (this.subscriberCount === 0) {
            this._stop_timer();
        }
    }
    shutdown() {
        (0, node_opcua_assert_1.assert)(this._timer === null && Object.keys(this._watchdogDataMap).length === 0, " leaking subscriber in watchdog");
    }
    getCurrentSystemTick() {
        return (0, get_clock_tick_1.get_clock_tick)();
    }
    _visit_subscriber() {
        this._currentTime = this.getCurrentSystemTick();
        const expiredSubscribers = Object.values(this._watchdogDataMap).filter((watchDogData) => {
            watchDogData.visitCount += 1;
            return hasExpired(watchDogData, this._currentTime);
        });
        if (expiredSubscribers.length) {
            this.emit("timeout", expiredSubscribers);
        }
        expiredSubscribers.forEach((watchDogData) => {
            this.removeSubscriber(watchDogData.subscriber);
            watchDogData.subscriber.watchdogReset();
        });
    }
    _start_timer() {
        (0, node_opcua_assert_1.assert)(this._timer === null, " setInterval already called ?");
        this._timer = setInterval(this._visitSubscriberB, 1000);
    }
    _stop_timer() {
        (0, node_opcua_assert_1.assert)(this._timer !== null, "_stop_timer already called ?");
        if (this._timer !== null) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }
}
exports.WatchDog = WatchDog;
WatchDog.emptyKeepAlive = () => {
    /* */
};
//# sourceMappingURL=watchdog.js.map