"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HalfComChannel = void 0;
/* eslint-disable @typescript-eslint/no-empty-function */
const events_1 = require("events");
const node_opcua_assert_1 = require("node-opcua-assert");
class HalfComChannel extends events_1.EventEmitter {
    constructor() {
        super();
        this.destroyed = false;
        this._ended = false;
        this._timeoutId = null;
        this.timeout = 0;
        this._hasEnded = false;
    }
    write(data) {
        if (typeof data === "string") {
            data = Buffer.from(data);
        }
        (0, node_opcua_assert_1.assert)(data instanceof Buffer, "HalfComChannel.write expecting a buffer");
        const copy = Buffer.concat([data]);
        this.emit("send_data", copy);
    }
    onReceiveEnd(err) {
        this.end();
    }
    onReceiveData(data) {
        (0, node_opcua_assert_1.assert)(data instanceof Buffer);
        this._triggerTimeoutTimer();
        this.emit("data", data);
    }
    _disconnectOtherParty() {
        if (!this._hasEnded) {
            (0, node_opcua_assert_1.assert)(!this._hasEnded, "half communication channel has already ended !");
            this._hasEnded = true;
            this.emit("ending");
        }
    }
    end() {
        if (this._hasEnded)
            return;
        if (this._ended)
            return;
        this._ended = true;
        if (this._timeoutId)
            clearTimeout(this._timeoutId);
        this._timeoutId = null;
        HalfComChannel;
        this.timeout = 0;
        this._disconnectOtherParty();
        this.emit("end");
        this.destroy();
    }
    destroy(err) {
        if (this.destroyed)
            return;
        this.destroyed = true;
        if (this._timeoutId)
            clearTimeout(this._timeoutId);
        this._timeoutId = null;
        this.timeout = 0;
        err && this.emit("error", err);
        // this.emit("end", err);
        this._disconnectOtherParty();
        const hasError = !!err;
        this.emit("close", hasError);
    }
    setKeepAlive(enable, initialDelay) {
        return this;
    }
    setNoDelay(noDelay) {
        return this;
    }
    setTimeout(timeout, callback) {
        this.timeout = timeout;
        this._triggerTimeoutTimer();
        return this;
    }
    _triggerTimeoutTimer() {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
            this._timeoutId = null;
        }
        if (this.timeout > 0 && !this._hasEnded) {
            this._timeoutId = setTimeout(() => {
                this.emit("timeout");
            }, this.timeout);
        }
    }
}
exports.HalfComChannel = HalfComChannel;
//# sourceMappingURL=half_com_channel.js.map