"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterServerManagerHidden = void 0;
/**
 * @module node-opcua-server
 */
const events_1 = require("events");
/**
 * a IRegisterServerManager that hides the server from any local discover server
 *
 */
class RegisterServerManagerHidden extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.discoveryServerEndpointUrl = "";
    }
    stop(callback) {
        setImmediate(callback);
    }
    start(callback) {
        setImmediate(callback);
    }
    dispose() {
        //
    }
}
exports.RegisterServerManagerHidden = RegisterServerManagerHidden;
//# sourceMappingURL=register_server_manager_hidden.js.map