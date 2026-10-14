"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findServers = findServers;
exports.findServersOnNetwork = findServersOnNetwork;
/**
 * @module node-opcua-client
 */
const async_1 = __importDefault(require("async"));
const client_base_impl_1 = require("../private/client_base_impl");
function findServers(discoveryServerEndpointUri, callback) {
    const client = new client_base_impl_1.ClientBaseImpl({ connectionStrategy: { maxRetry: 3 } });
    let servers = [];
    let endpoints = [];
    async_1.default.series([
        (innerCallback) => {
            client.connect(discoveryServerEndpointUri, innerCallback);
        },
        (innerCallback) => {
            client.findServers((err, _servers) => {
                if (_servers) {
                    servers = _servers;
                }
                innerCallback(err ? err : undefined);
            });
        },
        (innerCallback) => {
            client.getEndpoints({ endpointUrl: undefined }, (err, _endpoints) => {
                if (_endpoints) {
                    endpoints = _endpoints;
                }
                innerCallback(err ? err : undefined);
            });
        }
    ], (err) => {
        client.disconnect(() => {
            callback(err ? err : null, { servers, endpoints });
        });
    });
}
function findServersOnNetwork(discoveryServerEndpointUri, callback) {
    const client = new client_base_impl_1.ClientBaseImpl({ connectionStrategy: { maxRetry: 3 } });
    client.connect(discoveryServerEndpointUri, (err) => {
        if (!err) {
            client.findServersOnNetwork((err1, servers) => {
                client.disconnect(() => {
                    callback(err1, servers);
                });
            });
        }
        else {
            client.disconnect(() => {
                callback(err);
            });
        }
    });
}
// tslint:disable:no-var-requires
const thenify_ex_1 = require("thenify-ex");
module.exports.findServersOnNetwork = (0, thenify_ex_1.withCallback)(module.exports.findServersOnNetwork);
module.exports.findServers = (0, thenify_ex_1.withCallback)(module.exports.findServers);
//# sourceMappingURL=findservers.js.map