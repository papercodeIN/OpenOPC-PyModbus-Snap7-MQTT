"use strict";
/**
 * @module node-opcua-client
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPCUAClient = void 0;
const opcua_client_impl_1 = require("./private/opcua_client_impl");
class OPCUAClient {
    static create(options) {
        return new opcua_client_impl_1.OPCUAClientImpl(options);
    }
    static async createSession(endpointUrl, userIdentity, clientOptions) {
        return opcua_client_impl_1.OPCUAClientImpl.createSession(endpointUrl, userIdentity, clientOptions);
    }
    static set minimumRevisedSessionTimeout(minimumRevisedSessionTimeout) {
        opcua_client_impl_1.OPCUAClientImpl.minimumRevisedSessionTimeout = minimumRevisedSessionTimeout;
    }
    static get minimumRevisedSessionTimeout() {
        return opcua_client_impl_1.OPCUAClientImpl.minimumRevisedSessionTimeout;
    }
}
exports.OPCUAClient = OPCUAClient;
//# sourceMappingURL=opcua_client.js.map