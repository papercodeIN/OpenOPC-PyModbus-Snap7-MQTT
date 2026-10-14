"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientSessionKeepAliveManager = void 0;
/**
 * @module node-opcua-client
 */
const events_1 = require("events");
const chalk_1 = __importDefault(require("chalk"));
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_common_1 = require("node-opcua-common");
const node_opcua_constants_1 = require("node-opcua-constants");
const node_opcua_basic_types_1 = require("node-opcua-basic-types");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_nodeid_1 = require("node-opcua-nodeid");
const node_opcua_secure_channel_1 = require("node-opcua-secure-channel");
const serverStatusStateNodeId = (0, node_opcua_nodeid_1.coerceNodeId)(node_opcua_constants_1.VariableIds.Server_ServerStatus_State);
const debugLog = (0, node_opcua_debug_1.make_debugLog)(__filename);
const doDebug = (0, node_opcua_debug_1.checkDebugFlag)(__filename);
const warningLog = (0, node_opcua_debug_1.make_warningLog)(__filename);
class ClientSessionKeepAliveManager extends events_1.EventEmitter {
    constructor(session) {
        super();
        this.transactionInProgress = false;
        this.count = 0;
        this.session = session;
        this.timerId = undefined;
        this.pingTimeout = 0;
        this.checkInterval = 0;
        this.count = 0;
    }
    start(keepAliveInterval) {
        (0, node_opcua_assert_1.assert)(!this.timerId);
        /* istanbul ignore next*/
        if (this.session.timeout < 600) {
            warningLog(`[NODE-OPCUA-W13] ClientSessionKeepAliveManager detected that the session timeout (${this.session.timeout} ms) is really too small: please adjust it to a greater value ( at least 1000))`);
        }
        /* istanbul ignore next*/
        if (this.session.timeout < 100) {
            throw new Error(`ClientSessionKeepAliveManager detected that the session timeout (${this.session.timeout} ms) is really too small: please adjust it to a greater value ( at least 1000))`);
        }
        const selectedCheckInterval = keepAliveInterval ||
            Math.min(Math.floor(Math.min((this.session.timeout * 2) / 3, 20000)), node_opcua_secure_channel_1.ClientSecureChannelLayer.defaultTransportTimeout);
        this.checkInterval = selectedCheckInterval;
        this.pingTimeout = Math.floor(Math.min(Math.max(50, selectedCheckInterval / 2), 20000));
        // make sure first one is almost immediate
        this.timerId = setTimeout(() => this.ping_server(), this.pingTimeout);
    }
    stop() {
        if (this.timerId) {
            debugLog("ClientSessionKeepAliveManager#stop");
            clearTimeout(this.timerId);
            this.timerId = undefined;
        }
        else {
            debugLog("warning ClientSessionKeepAliveManager#stop ignore (already stopped)");
        }
    }
    ping_server() {
        this._ping_server().then((delta) => {
            if (!this.session || this.session.hasBeenClosed()) {
                return; // stop here
            }
            if (this.timerId) {
                const timeout = Math.max(1, this.checkInterval - delta);
                this.timerId = setTimeout(() => this.ping_server(), timeout);
            }
        });
    }
    /**
     * @private
     * when a session is opened on a server, the client shall send request on a regular basis otherwise the server
     * session object might time out.
     * start_ping make sure that ping_server is called on a regular basis to prevent session to timeout.
     *
     */
    async _ping_server() {
        const session = this.session;
        if (!session || session.isReconnecting) {
            debugLog("ClientSessionKeepAliveManager#ping_server => no session available");
            return 0;
        }
        if (!this.timerId) {
            return 0; // keep-alive has been canceled ....
        }
        const now = Date.now();
        const timeSinceLastServerContact = now - session.lastResponseReceivedTime.getTime();
        if (timeSinceLastServerContact < this.pingTimeout) {
            debugLog("ClientSessionKeepAliveManager#ping_server skipped because last communication with server was not that long ago ping timeout=", Math.round(this.pingTimeout), "timeSinceLastServerContact  = ", timeSinceLastServerContact);
            // no need to send a ping yet
            return timeSinceLastServerContact - this.pingTimeout;
        }
        if (session.isReconnecting) {
            debugLog("ClientSessionKeepAliveManager#ping_server skipped because client is reconnecting");
            return 0;
        }
        if (session.hasBeenClosed()) {
            debugLog("ClientSessionKeepAliveManager#ping_server skipped because client is reconnecting");
            return 0;
        }
        debugLog("ClientSessionKeepAliveManager#ping_server timeSinceLastServerContact=", timeSinceLastServerContact, "timeout", this.session.timeout);
        if (this.transactionInProgress) {
            // readVariable already taking place ! Ignore
            return 0;
        }
        this.transactionInProgress = true;
        // Server_ServerStatus_State
        return new Promise((resolve) => {
            session.read({
                nodeId: serverStatusStateNodeId,
                attributeId: node_opcua_basic_types_1.AttributeIds.Value
            }, (err, dataValue) => {
                this.transactionInProgress = false;
                if (err || !dataValue || !dataValue.value) {
                    if (err) {
                        warningLog(chalk_1.default.cyan(" warning : ClientSessionKeepAliveManager#ping_server "), chalk_1.default.yellow(err.message));
                    }
                    /**
                     * @event failure
                     * raised when the server is not responding or is responding with en error to
                     * the keep alive read Variable value transaction
                     */
                    this.emit("failure");
                    // also simulate a connection by closing the channel abruptly from our end ... 
                    warningLog("Keep alive has failed, considering a network outage is in place, forcing a reconnection");
                    terminateConnection(session._client);
                    resolve(0);
                    return;
                }
                if (dataValue.statusCode.isGood()) {
                    const newState = dataValue.value.value;
                    // istanbul ignore next
                    if (newState !== this.lastKnownState && this.lastKnownState) {
                        warningLog("ClientSessionKeepAliveManager#Server state has changed = ", node_opcua_common_1.ServerState[newState], " was ", node_opcua_common_1.ServerState[this.lastKnownState]);
                    }
                    this.lastKnownState = newState;
                    this.count++; // increase successful counter
                }
                debugLog("emit keepalive");
                this.emit("keepalive", this.lastKnownState, this.count);
                resolve(0);
            });
        });
    }
}
exports.ClientSessionKeepAliveManager = ClientSessionKeepAliveManager;
function terminateConnection(client) {
    if (!client)
        return;
    const channel = client._secureChannel;
    if (!channel) {
        return;
    }
    channel.forceConnectionBreak();
}
//# sourceMappingURL=client_session_keepalive_manager.js.map