"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransportPairDirect = void 0;
const source_1 = require("../source");
const half_com_channel_1 = require("./half_com_channel");
class TransportPairDirect {
    constructor() {
        this.client = new half_com_channel_1.HalfComChannel();
        this.server = new half_com_channel_1.HalfComChannel();
        this.client.on("send_data", (data) => {
            this.server.onReceiveData(data);
        });
        this.server.on("send_data", (data) => {
            this.client.onReceiveData(data);
        });
        this.server.on("ending", () => {
            this.client.onReceiveEnd();
        });
        this.client.on("ending", () => {
            this.server.onReceiveEnd();
        });
        this.server.on("end", (err) => {
            //
        });
        this.server.on("data", (data) => {
            const func = this.popResponse();
            if (func) {
                func(this.server, data);
            }
        });
        this.url = "fake://localhost:2033/SomeAddress";
    }
    initialize(done) {
        (0, source_1.setFakeTransport)(this.client);
        done();
    }
    shutdown(done) {
        // this.client.end();
        // this.server.end();
        if (done) {
            setImmediate(done);
        }
    }
    popResponse() {
        if (!this._responses) {
            return null;
        }
        return this._responses.shift();
    }
    pushResponse(func) {
        this._responses = this._responses || [];
        this._responses.push(func);
    }
}
exports.TransportPairDirect = TransportPairDirect;
//# sourceMappingURL=transport_pair_direct.js.map