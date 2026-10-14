"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _ClientBaseImpl_insideRepairConnection, _ClientBaseImpl_shouldRepairAgain;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientBaseImpl = void 0;
/**
 * @module node-opcua-client-private
 */
// tslint:disable:no-unused-expression
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const async_1 = __importDefault(require("async"));
const chalk_1 = __importDefault(require("chalk"));
const global_mutex_1 = require("@ster5/global-mutex");
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_common_1 = require("node-opcua-common");
const web_1 = require("node-opcua-crypto/web");
const node_opcua_date_time_1 = require("node-opcua-date-time");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_common_2 = require("node-opcua-common");
const node_opcua_hostname_1 = require("node-opcua-hostname");
const node_opcua_secure_channel_1 = require("node-opcua-secure-channel");
const node_opcua_service_discovery_1 = require("node-opcua-service-discovery");
const node_opcua_service_endpoints_1 = require("node-opcua-service-endpoints");
const node_opcua_service_secure_channel_1 = require("node-opcua-service-secure-channel");
const node_opcua_status_code_1 = require("node-opcua-status-code");
const node_opcua_utils_1 = require("node-opcua-utils");
const node_opcua_certificate_manager_1 = require("node-opcua-certificate-manager");
const node_opcua_service_session_1 = require("node-opcua-service-session");
const client_base_1 = require("../client_base");
const verify_1 = require("../verify");
const debugLog = (0, node_opcua_debug_1.make_debugLog)(__filename);
const doDebug = (0, node_opcua_debug_1.checkDebugFlag)(__filename);
const errorLog = (0, node_opcua_debug_1.make_errorLog)(__filename);
const warningLog = (0, node_opcua_debug_1.make_warningLog)(__filename);
const traceInternalState = false;
const defaultConnectionStrategy = {
    initialDelay: 1000,
    maxDelay: 20 * 1000, // 20 seconds
    maxRetry: -1, // infinite
    randomisationFactor: 0.1
};
function __findEndpoint(endpointUrl, params, _callback) {
    if (this.isUnusable()) {
        return _callback(new Error("Client is not usable"));
    }
    const masterClient = this;
    doDebug && debugLog("findEndpoint : endpointUrl = ", endpointUrl);
    doDebug && debugLog(" params ", params);
    (0, node_opcua_assert_1.assert)(!masterClient._tmpClient);
    const callback = (err, result) => {
        masterClient._tmpClient = undefined;
        _callback(err, result);
    };
    const securityMode = params.securityMode;
    const securityPolicy = params.securityPolicy;
    const connectionStrategy = params.connectionStrategy;
    const options = {
        applicationName: params.applicationName,
        applicationUri: params.applicationUri,
        certificateFile: params.certificateFile,
        clientCertificateManager: params.clientCertificateManager,
        clientName: "EndpointFetcher",
        // use same connectionStrategy as parent
        connectionStrategy: params.connectionStrategy,
        // connectionStrategy: {
        //     maxRetry: 0 /* no- retry */,
        //     maxDelay: 2000
        // },
        privateKeyFile: params.privateKeyFile
    };
    const client = new TmpClient(options);
    masterClient._tmpClient = client;
    let selectedEndpoint;
    const allEndpoints = [];
    const tasks = [
        (innerCallback) => {
            // rebind backoff handler
            masterClient.listeners("backoff").forEach((handler) => client.on("backoff", handler));
            // istanbul ignore next
            if (doDebug) {
                client.on("backoff", (retryCount, delay) => {
                    debugLog("finding Endpoint => reconnecting ", " retry count", retryCount, " next attempt in ", delay / 1000, "seconds");
                });
            }
            client.connect(endpointUrl, (err) => {
                if (err) {
                    // let's improve the error message with meaningful info
                    err.message =
                        "Fail to connect to server at " +
                            endpointUrl +
                            " to collect server's certificate (in findEndpoint) \n" +
                            " (err =" +
                            err.message +
                            ")";
                    warningLog(err.message);
                }
                return innerCallback(err);
            });
        },
        (innerCallback) => {
            client.getEndpoints((err, endpoints) => {
                if (err) {
                    err.message = "error in getEndpoints \n" + err.message;
                    return innerCallback(err);
                }
                // istanbul ignore next
                if (!endpoints) {
                    return innerCallback(new Error("Internal Error"));
                }
                for (const endpoint of endpoints) {
                    if (endpoint.securityMode === securityMode && endpoint.securityPolicyUri === securityPolicy) {
                        if (selectedEndpoint) {
                            errorLog("Warning more than one endpoint matching !", endpoint.endpointUrl, selectedEndpoint.endpointUrl);
                        }
                        selectedEndpoint = endpoint; // found it
                    }
                }
                innerCallback();
            });
        },
        (innerCallback) => {
            client.disconnect(innerCallback);
        }
    ];
    async_1.default.series(tasks, (err) => {
        if (err) {
            client.disconnect(() => {
                callback(err);
            });
            return;
        }
        if (!selectedEndpoint) {
            return callback(new Error("Cannot find an Endpoint matching " +
                " security mode: " +
                securityMode.toString() +
                " policy: " +
                securityPolicy.toString()));
        }
        // istanbul ignore next
        if (doDebug) {
            debugLog(chalk_1.default.bgWhite.red("xxxxxxxxxxxxxxxxxxxxx => selected EndPoint = "), selectedEndpoint.toString());
        }
        const result = {
            endpoints: allEndpoints,
            selectedEndpoint
        };
        callback(null, result);
    });
}
/**
 * check if certificate is trusted or untrusted
 */
async function _verify_serverCertificate(certificateManager, serverCertificate) {
    const status = await certificateManager.checkCertificate(serverCertificate);
    if (status !== node_opcua_status_code_1.StatusCodes.Good) {
        // istanbul ignore next
        if (doDebug) {
            // do it again for debug purposes
            const status1 = await certificateManager.verifyCertificate(serverCertificate);
            debugLog(status1);
        }
        warningLog("serverCertificate = ", (0, web_1.makeSHA1Thumbprint)(serverCertificate).toString("hex"));
        warningLog("serverCertificate = ", serverCertificate.toString("base64"));
        throw new Error("server Certificate verification failed with err " + status?.toString());
    }
}
const forceEndpointDiscoveryOnConnect = !!parseInt(process.env.NODEOPCUA_CLIENT_FORCE_ENDPOINT_DISCOVERY || "0", 10);
debugLog("forceEndpointDiscoveryOnConnect = ", forceEndpointDiscoveryOnConnect);
class ClockAdjustment {
    constructor() {
        debugLog("installPeriodicClockAdjustment ", node_opcua_date_time_1.periodicClockAdjustment.timerInstallationCount);
        (0, node_opcua_date_time_1.installPeriodicClockAdjustment)();
    }
    dispose() {
        (0, node_opcua_date_time_1.uninstallPeriodicClockAdjustment)();
        debugLog("uninstallPeriodicClockAdjustment ", node_opcua_date_time_1.periodicClockAdjustment.timerInstallationCount);
    }
}
/*
 *    "disconnected"  ---[connect]----------------------> "connecting"
 *
 *    "connecting"    ---[(connection successful)]------> "connected"
 *
 *    "connecting"    ---[(connection failure)]---------> "disconnected"
 *
 *    "connecting"    ---[disconnect]-------------------> "disconnecting" --> "disconnected"
 *
 *    "connecting"    ---[lost of connection]-----------> "reconnecting" ->[reconnection]
 *
 *    "reconnecting"  ---[reconnection successful]------> "reconnecting_newchannel_connected"
 *
 *    "reconnecting_newchannel_connected" --(session failure) -->"reconnecting"
 *
 *    "reconnecting"  ---[reconnection failure]---------> [reconnection] ---> "reconnecting"
 *
 *    "reconnecting"  ---[disconnect]-------------------> "disconnecting" --> "disconnected"
 */
let g_ClientCounter = 0;
/**
 * @internal
 */
// tslint:disable-next-line: max-classes-per-file
class ClientBaseImpl extends node_opcua_common_1.OPCUASecureObject {
    /**
     * total number of requests that been canceled due to timeout
     */
    get timedOutRequestCount() {
        return this._timedOutRequestCount + (this._secureChannel ? this._secureChannel.timedOutRequestCount : 0);
    }
    /**
     * total number of transactions performed by the client
   x  */
    get transactionsPerformed() {
        return this._transactionsPerformed + (this._secureChannel ? this._secureChannel.transactionsPerformed : 0);
    }
    /**
     * is true when the client has already requested the server end points.
     */
    get knowsServerEndpoint() {
        return this._serverEndpoints && this._serverEndpoints.length > 0;
    }
    /**
     * true if the client is trying to reconnect to the server after a connection break.
     */
    get isReconnecting() {
        return (!!(this._secureChannel && this._secureChannel.isConnecting) ||
            this._internalState === "reconnecting_newchannel_connected" ||
            this._internalState === "reconnecting");
    }
    /**
     * true if the connection strategy is set to automatically try to reconnect in case of failure
     */
    get reconnectOnFailure() {
        return this.connectionStrategy.maxRetry > 0 || this.connectionStrategy.maxRetry === -1;
    }
    /**
     * total number of bytes read by the client
     */
    get bytesRead() {
        return this._byteRead + (this._secureChannel ? this._secureChannel.bytesRead : 0);
    }
    /**
     * total number of bytes written by the client
     */
    get bytesWritten() {
        return this._byteWritten + (this._secureChannel ? this._secureChannel.bytesWritten : 0);
    }
    isUnusable() {
        return (this._internalState === "disconnected" ||
            this._internalState === "disconnecting" ||
            this._internalState === "panic" ||
            this._internalState === "uninitialized");
    }
    _setInternalState(internalState) {
        const previousState = this._internalState;
        if (doDebug || traceInternalState) {
            (traceInternalState ? warningLog : debugLog)(chalk_1.default.cyan(`  Client ${this._instanceNumber} ${this.clientName} : _internalState from    `), chalk_1.default.yellow(previousState), "to", chalk_1.default.yellow(internalState));
        }
        if (this._internalState === "disconnecting" || this._internalState === "disconnected") {
            if (internalState === "reconnecting") {
                errorLog("Internal error, cannot switch to reconnecting when already disconnecting");
            } // when disconnecting, we cannot accept any other state
        }
        this._internalState = internalState;
    }
    emit(eventName, ...others) {
        // istanbul ignore next
        if (doDebug) {
            debugLog(chalk_1.default.cyan(`  Client ${this._instanceNumber} ${this.clientName} emitting `), chalk_1.default.magentaBright(eventName));
        }
        return super.emit(eventName, ...others);
    }
    constructor(options) {
        options = options || {};
        if (!options.clientCertificateManager) {
            options.clientCertificateManager = (0, node_opcua_certificate_manager_1.getDefaultCertificateManager)("PKI");
        }
        options.privateKeyFile = options.privateKeyFile || options.clientCertificateManager.privateKey;
        options.certificateFile =
            options.certificateFile || path_1.default.join(options.clientCertificateManager.rootDir, "own/certs/client_certificate.pem");
        super(options);
        this._internalState = "uninitialized";
        _ClientBaseImpl_insideRepairConnection.set(this, false);
        _ClientBaseImpl_shouldRepairAgain.set(this, false);
        this._setInternalState("uninitialized");
        this._instanceNumber = g_ClientCounter++;
        this.applicationName = options.applicationName || "NodeOPCUA-Client";
        (0, node_opcua_assert_1.assert)(!this.applicationName.match(/^locale=/), "applicationName badly converted from LocalizedText");
        (0, node_opcua_assert_1.assert)(!this.applicationName.match(/urn:/), "applicationName should not be a URI");
        // we need to delay _applicationUri initialization
        this._applicationUri = options.applicationUri || this._getBuiltApplicationUri();
        this.clientCertificateManager = options.clientCertificateManager;
        this._secureChannel = null;
        this._reconnectionIsCanceled = false;
        this.endpointUrl = "";
        this.clientName = options.clientName || "ClientSession";
        // must be ZERO with Spec 1.0.2
        this.protocolVersion = 0;
        this._sessions = [];
        this._serverEndpoints = [];
        this.defaultSecureTokenLifetime = options.defaultSecureTokenLifetime || 600000;
        this.defaultTransactionTimeout = options.defaultTransactionTimeout;
        this.tokenRenewalInterval = options.tokenRenewalInterval || 0;
        (0, node_opcua_assert_1.assert)(isFinite(this.tokenRenewalInterval) && this.tokenRenewalInterval >= 0);
        this.securityMode = (0, node_opcua_service_secure_channel_1.coerceMessageSecurityMode)(options.securityMode);
        this.securityPolicy = (0, node_opcua_secure_channel_1.coerceSecurityPolicy)(options.securityPolicy);
        this.serverCertificate = options.serverCertificate;
        this.keepSessionAlive = typeof options.keepSessionAlive === "boolean" ? options.keepSessionAlive : false;
        this.keepAliveInterval = options.keepAliveInterval;
        // statistics...
        this._byteRead = 0;
        this._byteWritten = 0;
        this._transactionsPerformed = 0;
        this._timedOutRequestCount = 0;
        this.connectionStrategy = (0, node_opcua_secure_channel_1.coerceConnectionStrategy)(options.connectionStrategy || defaultConnectionStrategy);
        /***
         * @property keepPendingSessionsOnDisconnect²
         * @type {boolean}
         */
        this.keepPendingSessionsOnDisconnect = options.keepPendingSessionsOnDisconnect || false;
        this.discoveryUrl = options.discoveryUrl || "";
        this._setInternalState("disconnected");
        this._transportSettings = options.transportSettings || {};
        this._transportTimeout = options.transportTimeout;
    }
    _cancel_reconnection(callback) {
        // _cancel_reconnection is invoked during disconnection
        // when we detect that a reconnection is in progress...
        // istanbul ignore next
        if (!this.isReconnecting) {
            warningLog("internal error: _cancel_reconnection should only be used when reconnecting is in progress");
        }
        debugLog("canceling reconnection : ", this.clientName);
        this._reconnectionIsCanceled = true;
        // istanbul ignore next
        if (!this._secureChannel) {
            debugLog("_cancel_reconnection:  Nothing to do for !", this.clientName, " because secure channel doesn't exist");
            return callback(); // nothing to do
        }
        this._secureChannel.abortConnection(( /*err?: Error*/) => {
            this._secureChannel = null;
            callback();
        });
        this.once("reconnection_canceled", () => {
            /* empty */
        });
    }
    _recreate_secure_channel(callback) {
        debugLog("_recreate_secure_channel... while internalState is", this._internalState);
        if (!this.knowsServerEndpoint) {
            debugLog("Cannot reconnect , server endpoint is unknown");
            return callback(new Error("Cannot reconnect, server endpoint is unknown - this.knowsServerEndpoint = false"));
        }
        (0, node_opcua_assert_1.assert)(this.knowsServerEndpoint);
        this._setInternalState("reconnecting");
        this.emit("start_reconnection"); // send after callback
        const infiniteConnectionRetry = {
            initialDelay: this.connectionStrategy.initialDelay,
            maxDelay: this.connectionStrategy.maxDelay,
            maxRetry: -1
        };
        const _when_internal_error = (err, callback) => {
            errorLog("INTERNAL ERROR", err.message);
            callback(err);
        };
        const _when_reconnectionIsCanceled = (callback) => {
            doDebug && debugLog("attempt to recreate a new secure channel : suspended because reconnection is canceled !");
            this.emit("reconnection_canceled");
            return callback(new Error("Reconnection has been canceled - " + this.clientName));
        };
        const _failAndRetry = (err, message, callback) => {
            debugLog("failAndRetry; ", message);
            if (this._reconnectionIsCanceled) {
                return _when_reconnectionIsCanceled(callback);
            }
            this._destroy_secure_channel();
            warningLog("client = ", this.clientName, message, err.message);
            // else
            // let retry a little bit later
            this.emit("reconnection_attempt_has_failed", err, message); // send after callback
            setImmediate(_attempt_to_recreate_secure_channel, callback);
        };
        const _when_connected = (callback) => {
            this.emit("after_reconnection", null); // send after callback
            (0, node_opcua_assert_1.assert)(this._secureChannel, "expecting a secureChannel here ");
            // a new channel has be created and a new connection is established
            debugLog(chalk_1.default.bgWhite.red("ClientBaseImpl:  RECONNECTED                !!!"));
            this._setInternalState("reconnecting_newchannel_connected");
            return callback();
        };
        const _attempt_to_recreate_secure_channel = (callback) => {
            debugLog("attempt to recreate a new secure channel");
            if (this._reconnectionIsCanceled) {
                return _when_reconnectionIsCanceled(callback);
            }
            if (this._secureChannel) {
                doDebug && debugLog("attempt to recreate a new secure channel, while channel already exists");
                // are we reentrant ?
                const err = new Error("_internal_create_secure_channel failed, this._secureChannel is supposed to be null");
                return _when_internal_error(err, callback);
            }
            (0, node_opcua_assert_1.assert)(!this._secureChannel, "_attempt_to_recreate_secure_channel,  expecting this._secureChannel not to exist");
            this._internal_create_secure_channel(infiniteConnectionRetry, (err) => {
                if (err) {
                    // istanbul ignore next
                    if (this._secureChannel) {
                        const err = new Error("_internal_create_secure_channel failed, expecting this._secureChannel not to exist");
                        return _when_internal_error(err, callback);
                    }
                    if (err.message.match(/ECONNREFUSED|ECONNABORTED|ETIMEDOUT/)) {
                        return _failAndRetry(err, "create secure channel failed with ECONNREFUSED|ECONNABORTED|ETIMEDOUT\n" + err.message, callback);
                    }
                    if (err.message.match("Backoff aborted.")) {
                        return _failAndRetry(err, "cannot create secure channel (backoff aborted)", callback);
                    }
                    if (err.message.match("BadCertificateInvalid") ||
                        err.message.match(/socket has been disconnected by third party/)) {
                        warningLog("the server certificate has changed,  we need to retrieve server certificate again: ", err.message);
                        const oldServerCertificate = this.serverCertificate;
                        warningLog("old server certificate ", oldServerCertificate ? (0, web_1.makeSHA1Thumbprint)(oldServerCertificate).toString("hex") : "undefined");
                        // the server may have shut down the channel because its certificate
                        // has changed ....
                        // let request the server certificate again ....
                        return this.fetchServerCertificate(this.endpointUrl, (err1) => {
                            if (err1) {
                                return _failAndRetry(err1, "Failing to fetch new server certificate", callback);
                            }
                            const newServerCertificate = this.serverCertificate;
                            warningLog("new server certificate ", (0, web_1.makeSHA1Thumbprint)(newServerCertificate).toString("hex"));
                            const sha1Old = oldServerCertificate ? (0, web_1.makeSHA1Thumbprint)(oldServerCertificate) : null;
                            const sha1New = newServerCertificate ? (0, web_1.makeSHA1Thumbprint)(newServerCertificate) : null;
                            if (sha1Old === sha1New) {
                                warningLog("server certificate has not changed, but was expected to have changed");
                                return _failAndRetry(new Error("Server Certificate not changed"), "Failing to fetch new server certificate", callback);
                            }
                            this._internal_create_secure_channel(infiniteConnectionRetry, (err3) => {
                                if (err3) {
                                    return _failAndRetry(err3, "trying to create new channel with new certificate", callback);
                                }
                                return _when_connected(callback);
                            });
                        });
                    }
                    else {
                        return _failAndRetry(err, "cannot create secure channel", callback);
                    }
                }
                else {
                    return _when_connected(callback);
                }
            });
        };
        // create a secure channel
        // a new secure channel must be established
        _attempt_to_recreate_secure_channel(callback);
    }
    _internal_create_secure_channel(connectionStrategy, callback) {
        (0, node_opcua_assert_1.assert)(this._secureChannel === null);
        (0, node_opcua_assert_1.assert)(typeof this.endpointUrl === "string");
        debugLog("_internal_create_secure_channel creating new ClientSecureChannelLayer _internalState =", this._internalState, this.clientName);
        const secureChannel = new node_opcua_secure_channel_1.ClientSecureChannelLayer({
            connectionStrategy,
            defaultSecureTokenLifetime: this.defaultSecureTokenLifetime,
            parent: this,
            securityMode: this.securityMode,
            securityPolicy: this.securityPolicy,
            serverCertificate: this.serverCertificate,
            tokenRenewalInterval: this.tokenRenewalInterval,
            transportSettings: this._transportSettings,
            transportTimeout: this._transportTimeout,
            defaultTransactionTimeout: this.defaultTransactionTimeout
        });
        secureChannel.on("backoff", (count, delay) => {
            this.emit("backoff", count, delay);
        });
        secureChannel.on("abort", () => {
            this.emit("abort");
        });
        secureChannel.protocolVersion = this.protocolVersion;
        this._secureChannel = secureChannel;
        this.emit("secure_channel_created", secureChannel);
        async_1.default.series([
            // ------------------------------------------------- STEP 2 : OpenSecureChannel
            (innerCallback) => {
                debugLog("_internal_create_secure_channel before secureChannel.create");
                secureChannel.create(this.endpointUrl, (err) => {
                    debugLog("_internal_create_secure_channel after secureChannel.create");
                    if (!this._secureChannel) {
                        debugLog("_secureChannel has been closed during the transaction !");
                        return innerCallback(new Error("Secure Channel Closed"));
                    }
                    if (!err) {
                        this._install_secure_channel_event_handlers(secureChannel);
                    }
                    innerCallback(err);
                });
            },
            // ------------------------------------------------- STEP 3 : GetEndpointsRequest
            (innerCallback) => {
                (0, node_opcua_assert_1.assert)(this._secureChannel !== null);
                if (!this.knowsServerEndpoint) {
                    this._setInternalState("connecting");
                    this.getEndpoints((err /*, endpoints?: EndpointDescription[]*/) => {
                        if (!this._secureChannel) {
                            debugLog("_secureChannel has been closed during the transaction ! (while getEndpoints)");
                            return innerCallback(new Error("Secure Channel Closed"));
                        }
                        innerCallback(err ? err : undefined);
                    });
                }
                else {
                    // end points are already known
                    innerCallback();
                }
            }
        ], (err) => {
            if (err) {
                doDebug && debugLog(this.clientName, " : Inner create secure channel has failed", err.message);
                if (this._secureChannel) {
                    this._secureChannel.abortConnection(() => {
                        this._destroy_secure_channel();
                        callback(err);
                    });
                }
                else {
                    callback(err);
                }
            }
            else {
                (0, node_opcua_assert_1.assert)(this._secureChannel !== null);
                callback(null, secureChannel);
            }
        });
    }
    static async createCertificate(clientCertificateManager, certificateFile, applicationName, applicationUri) {
        if (!fs_1.default.existsSync(certificateFile)) {
            const hostname = (0, node_opcua_hostname_1.getHostname)();
            // this.serverInfo.applicationUri!;
            await clientCertificateManager.createSelfSignedCertificate({
                applicationUri,
                dns: [hostname],
                // ip: await getIpAddresses(),
                outputFile: certificateFile,
                subject: (0, node_opcua_certificate_manager_1.makeSubject)(applicationName, hostname),
                startDate: new Date(),
                validity: 365 * 10 // 10 years
            });
        }
        // istanbul ignore next
        if (!fs_1.default.existsSync(certificateFile)) {
            throw new Error(" cannot locate certificate file " + certificateFile);
        }
    }
    async createDefaultCertificate() {
        // istanbul ignore next
        if (this._inCreateDefaultCertificate) {
            errorLog("Internal error : re-entrancy in createDefaultCertificate!");
        }
        this._inCreateDefaultCertificate = true;
        if (!fs_1.default.existsSync(this.certificateFile)) {
            await (0, global_mutex_1.withLock)({ fileToLock: this.certificateFile + ".mutex" }, async () => {
                if (fs_1.default.existsSync(this.certificateFile)) {
                    // the file may have been created in between
                    return;
                }
                warningLog("Creating default certificate ... please wait");
                await ClientBaseImpl.createCertificate(this.clientCertificateManager, this.certificateFile, this.applicationName, this._getBuiltApplicationUri());
                debugLog("privateKey      = ", this.privateKeyFile);
                debugLog("                = ", this.clientCertificateManager.privateKey);
                debugLog("certificateFile = ", this.certificateFile);
                const certificate = this.getCertificate();
                const privateKey = this.getPrivateKey();
            });
        }
        this._inCreateDefaultCertificate = false;
    }
    _getBuiltApplicationUri() {
        if (!this._applicationUri) {
            this._applicationUri = (0, node_opcua_common_2.makeApplicationUrn)((0, node_opcua_hostname_1.getHostname)(), this.applicationName);
        }
        return this._applicationUri;
    }
    async initializeCM() {
        if (!this.clientCertificateManager) {
            // this usually happen when the client  has been already disconnected,
            // disconnect
            errorLog("[NODE-OPCUA-E08] initializeCM: clientCertificateManager is null\n" +
                "                 This happen when you disconnected the client, to free resources.\n" +
                "                 Please create a new OPCUAClient instance if you want to reconnect");
            return;
        }
        await this.clientCertificateManager.initialize();
        await this.createDefaultCertificate();
        // istanbul ignore next
        if (!fs_1.default.existsSync(this.privateKeyFile)) {
            throw new Error(" cannot locate private key file " + this.privateKeyFile);
        }
        if (this.isUnusable())
            return;
        await this.clientCertificateManager.withLock2(async () => {
            await (0, verify_1.performCertificateSanityCheck)(this, "client", this.clientCertificateManager, this._getBuiltApplicationUri());
        });
    }
    _handleUnrecoverableConnectionFailure(err, callback) {
        debugLog(err.message);
        this.emit("connection_failed", err);
        this._setInternalState("disconnected");
        return callback(err);
    }
    _handleDisconnectionWhileConnecting(err, callback) {
        debugLog(err.message);
        this.emit("connection_failed", err);
        this._setInternalState("disconnected");
        return callback(err);
    }
    _handleSuccessfulConnection(callback) {
        debugLog(" Connected successfully  to ", this.endpointUrl);
        this.emit("connected");
        this._setInternalState("connected");
        callback();
    }
    connect(...args) {
        const endpointUrl = args[0];
        const callback = args[1];
        (0, node_opcua_assert_1.assert)(typeof callback === "function", "expecting a callback");
        if (typeof endpointUrl !== "string" || endpointUrl.length <= 0) {
            errorLog("[NODE-OPCUA-E03] OPCUAClient#connect expects a valid endpoint : " + endpointUrl);
            callback(new Error("Invalid endpoint"));
            return;
        }
        (0, node_opcua_assert_1.assert)(typeof endpointUrl === "string" && endpointUrl.length > 0);
        // istanbul ignore next
        if (this._internalState !== "disconnected") {
            callback(new Error(`client#connect failed, as invalid internal state = ${this._internalState}`));
            return;
        }
        // prevent illegal call to connect
        if (this._secureChannel !== null) {
            setImmediate(() => callback(new Error("connect already called")));
            return;
        }
        this._setInternalState("connecting");
        this.initializeCM()
            .then(() => {
            debugLog("ClientBaseImpl#connect ", endpointUrl, this.clientName);
            if (this._internalState === "disconnecting" || this._internalState === "disconnected") {
                return this._handleDisconnectionWhileConnecting(new Error("premature disconnection 1"), callback);
            }
            if (!this.serverCertificate &&
                (forceEndpointDiscoveryOnConnect || this.securityMode !== node_opcua_service_secure_channel_1.MessageSecurityMode.None)) {
                debugLog("Fetching certificates from endpoints");
                this.fetchServerCertificate(endpointUrl, (err, adjustedEndpointUrl) => {
                    if (err) {
                        return this._handleUnrecoverableConnectionFailure(err, callback);
                    }
                    if (this.isUnusable()) {
                        return this._handleDisconnectionWhileConnecting(new Error("premature disconnection 2"), callback);
                    }
                    if (forceEndpointDiscoveryOnConnect) {
                        debugLog("connecting with adjusted endpoint : ", adjustedEndpointUrl, "  was =", endpointUrl);
                        this._connectStep2(adjustedEndpointUrl, callback);
                    }
                    else {
                        debugLog("connecting with endpoint : ", endpointUrl);
                        this._connectStep2(endpointUrl, callback);
                    }
                });
            }
            else {
                this._connectStep2(endpointUrl, callback);
            }
        })
            .catch((err) => {
            return this._handleUnrecoverableConnectionFailure(err, callback);
        });
    }
    /**
     * @private
     */
    _connectStep2(endpointUrl, callback) {
        // prevent illegal call to connect
        (0, node_opcua_assert_1.assert)(this._secureChannel === null);
        this.endpointUrl = endpointUrl;
        this._clockAdjuster = this._clockAdjuster || new ClockAdjustment();
        client_base_1.OPCUAClientBase.registry.register(this);
        debugLog("__connectStep2 ", this._internalState);
        this._internal_create_secure_channel(this.connectionStrategy, (err) => {
            if (!err) {
                this._handleSuccessfulConnection(callback);
            }
            else {
                client_base_1.OPCUAClientBase.registry.unregister(this);
                if (this._clockAdjuster) {
                    this._clockAdjuster.dispose();
                    this._clockAdjuster = undefined;
                }
                debugLog(chalk_1.default.red("SecureChannel creation has failed with error :", err.message));
                if (err.message.match(/ECONNABORTED/)) {
                    debugLog(chalk_1.default.yellow("- The client cannot to :" + endpointUrl + ". Connection has been aborted."));
                    err = new Error("The connection has been aborted");
                    this._handleUnrecoverableConnectionFailure(err, callback);
                }
                else if (err.message.match(/ECONNREF/)) {
                    debugLog(chalk_1.default.yellow("- The client cannot to :" + endpointUrl + ". Server is not reachable."));
                    err = new Error("The connection cannot be established with server " +
                        endpointUrl +
                        " .\n" +
                        "Please check that the server is up and running or your network configuration.\n" +
                        "Err = (" +
                        err.message +
                        ")");
                    this._handleUnrecoverableConnectionFailure(err, callback);
                }
                else if (err.message.match(/disconnecting/)) {
                    /* */
                    this._handleDisconnectionWhileConnecting(err, callback);
                }
                else {
                    err = new Error("The connection may have been rejected by server,\n" + "Err = (" + err.message + ")");
                    this._handleUnrecoverableConnectionFailure(err, callback);
                }
            }
        });
    }
    performMessageTransaction(request, callback) {
        if (!this._secureChannel) {
            // this may happen if the Server has closed the connection abruptly for some unknown reason
            // or if the tcp connection has been broken.
            return callback(new Error("performMessageTransaction: No SecureChannel , connection may have been canceled abruptly by server"));
        }
        if (this._internalState !== "connected" &&
            this._internalState !== "reconnecting_newchannel_connected" &&
            this._internalState !== "connecting" &&
            this._internalState !== "reconnecting") {
            return callback(new Error("performMessageTransaction: Invalid client state = " +
                this._internalState +
                " while performing a transaction " +
                request.schema.name));
        }
        (0, node_opcua_assert_1.assert)(this._secureChannel);
        (0, node_opcua_assert_1.assert)(request);
        (0, node_opcua_assert_1.assert)(request.requestHeader);
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        this._secureChannel.performMessageTransaction(request, callback);
    }
    /**
     *
     * return the endpoint information matching  security mode and security policy.

     */
    findEndpointForSecurity(securityMode, securityPolicy) {
        securityMode = (0, node_opcua_service_secure_channel_1.coerceMessageSecurityMode)(securityMode);
        securityPolicy = (0, node_opcua_secure_channel_1.coerceSecurityPolicy)(securityPolicy);
        (0, node_opcua_assert_1.assert)(this.knowsServerEndpoint, "Server end point are not known yet");
        return this._serverEndpoints.find((endpoint) => {
            return endpoint.securityMode === securityMode && endpoint.securityPolicyUri === securityPolicy;
        });
    }
    /**
     *
     * return the endpoint information matching the specified url , security mode and security policy.

     */
    findEndpoint(endpointUrl, securityMode, securityPolicy) {
        (0, node_opcua_assert_1.assert)(this.knowsServerEndpoint, "Server end point are not known yet");
        if (!this._serverEndpoints || this._serverEndpoints.length === 0) {
            return undefined;
        }
        return this._serverEndpoints.find((endpoint) => {
            return ((0, node_opcua_utils_1.matchUri)(endpoint.endpointUrl, endpointUrl) &&
                endpoint.securityMode === securityMode &&
                endpoint.securityPolicyUri === securityPolicy);
        });
    }
    getEndpoints(...args) {
        if (args.length === 1) {
            return this.getEndpoints({}, args[0]);
        }
        const options = args[0];
        const callback = args[1];
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        options.localeIds = options.localeIds || [];
        options.profileUris = options.profileUris || [];
        const request = new node_opcua_service_endpoints_1.GetEndpointsRequest({
            endpointUrl: options.endpointUrl || this.endpointUrl,
            localeIds: options.localeIds,
            profileUris: options.profileUris,
            requestHeader: {
                auditEntryId: null
            }
        });
        this.performMessageTransaction(request, (err, response) => {
            if (err) {
                return callback(err);
            }
            this._serverEndpoints = [];
            // istanbul ignore next
            if (!response || !(response instanceof node_opcua_service_endpoints_1.GetEndpointsResponse)) {
                return callback(new Error("Internal Error"));
            }
            if (response && response.endpoints) {
                this._serverEndpoints = response.endpoints;
            }
            callback(null, this._serverEndpoints);
        });
    }
    /**
     * @deprecated
     */
    getEndpointsRequest(options, callback) {
        warningLog("note: ClientBaseImpl#getEndpointsRequest is deprecated, use ClientBaseImpl#getEndpoints instead");
        return this.getEndpoints(options, callback);
    }
    findServers(...args) {
        if (args.length === 1) {
            return this.findServers({}, args[0]);
        }
        const options = args[0];
        const callback = args[1];
        const request = new node_opcua_service_discovery_1.FindServersRequest({
            endpointUrl: options.endpointUrl || this.endpointUrl,
            localeIds: options.localeIds || [],
            serverUris: options.serverUris || []
        });
        this.performMessageTransaction(request, (err, response) => {
            if (err) {
                return callback(err);
            }
            /* istanbul ignore next */
            if (!response || !(response instanceof node_opcua_service_discovery_1.FindServersResponse)) {
                return callback(new Error("Internal Error"));
            }
            response.servers = response.servers || [];
            callback(null, response.servers);
        });
    }
    findServersOnNetwork(...args) {
        if (args.length === 1) {
            return this.findServersOnNetwork({}, args[0]);
        }
        const options = args[0];
        const callback = args[1];
        const request = new node_opcua_service_discovery_1.FindServersOnNetworkRequest(options);
        this.performMessageTransaction(request, (err, response) => {
            if (err) {
                return callback(err);
            }
            /* istanbul ignore next */
            if (!response || !(response instanceof node_opcua_service_discovery_1.FindServersOnNetworkResponse)) {
                return new Error("Internal Error");
            }
            response.servers = response.servers || [];
            callback(null, response.servers);
        });
    }
    _removeSession(session) {
        const index = this._sessions.indexOf(session);
        if (index >= 0) {
            const s = this._sessions.splice(index, 1)[0];
            // assert(s === session);
            // assert(session._client === this);
            session._client = null;
        }
        (0, node_opcua_assert_1.assert)(this._sessions.indexOf(session) === -1);
    }
    _closeSession(session, deleteSubscriptions, callback) {
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        (0, node_opcua_assert_1.assert)(typeof deleteSubscriptions === "boolean");
        // istanbul ignore next
        if (!this._secureChannel) {
            return callback(null); // new Error("no channel"));
        }
        (0, node_opcua_assert_1.assert)(this._secureChannel);
        if (!this._secureChannel.isValid()) {
            return callback(null);
        }
        debugLog(chalk_1.default.bgWhite.green("_closeSession ") + this._secureChannel.channelId);
        const request = new node_opcua_service_session_1.CloseSessionRequest({
            deleteSubscriptions
        });
        session.performMessageTransaction(request, (err, response) => {
            if (err) {
                callback(err);
            }
            else {
                callback(err, response);
            }
        });
    }
    closeSession(...args) {
        const session = args[0];
        const deleteSubscriptions = args[1];
        const callback = args[2];
        (0, node_opcua_assert_1.assert)(typeof deleteSubscriptions === "boolean");
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        (0, node_opcua_assert_1.assert)(session);
        (0, node_opcua_assert_1.assert)(session._client === this, "session must be attached to this");
        session._closed = true;
        // todo : send close session on secure channel
        this._closeSession(session, deleteSubscriptions, (err, response) => {
            session.emitCloseEvent(node_opcua_status_code_1.StatusCodes.Good);
            this._removeSession(session);
            session.dispose();
            (0, node_opcua_assert_1.assert)(this._sessions.indexOf(session) === -1);
            (0, node_opcua_assert_1.assert)(session._closed, "session must indicate it is closed");
            callback(err ? err : undefined);
        });
    }
    // eslint-disable-next-line max-statements
    disconnect(...args) {
        const callback = args[0];
        (0, node_opcua_assert_1.assert)(typeof callback === "function", "expecting a callback function here");
        this._reconnectionIsCanceled = true;
        if (this._tmpClient) {
            warningLog("disconnecting client while tmpClient exists", this._tmpClient.clientName);
            this._tmpClient.disconnect((err) => {
                this._tmpClient = undefined;
                // retry disconnect on main client
                this.disconnect(callback);
            });
            return;
        }
        if (this._internalState === "disconnected" || this._internalState === "disconnecting") {
            if (this._internalState === "disconnecting") {
                warningLog("[NODE-OPCUA-W26] OPCUAClient#disconnect called while already disconnecting");
            }
            return callback();
        }
        debugLog("disconnecting client! (will set reconnectionIsCanceled to true");
        this._reconnectionIsCanceled = true;
        debugLog("ClientBaseImpl#disconnect", this.endpointUrl);
        if (this.isReconnecting && !this._reconnectionIsCanceled) {
            debugLog("ClientBaseImpl#disconnect called while reconnection is in progress");
            // let's abort the reconnection process
            this._cancel_reconnection((err) => {
                debugLog("ClientBaseImpl#disconnect reconnection has been canceled", this.applicationName);
                (0, node_opcua_assert_1.assert)(!err, " why would this fail ?");
                // sessions cannot be cancelled properly and must be discarded.
                this.disconnect(callback);
            });
            return;
        }
        if (this._sessions.length && !this.keepPendingSessionsOnDisconnect) {
            debugLog("warning : disconnection : closing pending sessions");
            // disconnect has been called whereas living session exists
            // we need to close them first .... (unless keepPendingSessionsOnDisconnect)
            this._close_pending_sessions(( /*err*/) => {
                this.disconnect(callback);
            });
            return;
        }
        debugLog("Disconnecting !");
        this._setInternalState("disconnecting");
        if (this.clientCertificateManager) {
            const tmp = this.clientCertificateManager;
            // (this as any).clientCertificateManager = null;
            tmp.dispose();
        }
        if (this._sessions.length) {
            // transfer active session to  orphan and detach them from channel
            const tmp = [...this._sessions];
            for (const session of tmp) {
                this._removeSession(session);
            }
            this._sessions = [];
        }
        (0, node_opcua_assert_1.assert)(this._sessions.length === 0, " attempt to disconnect a client with live sessions ");
        client_base_1.OPCUAClientBase.registry.unregister(this);
        if (this._clockAdjuster) {
            this._clockAdjuster.dispose();
            this._clockAdjuster = undefined;
        }
        if (this._secureChannel) {
            let tmpChannel = this._secureChannel;
            this._secureChannel = null;
            debugLog("Closing channel");
            tmpChannel.close(() => {
                this._secureChannel = tmpChannel;
                tmpChannel = null;
                this._destroy_secure_channel();
                this._setInternalState("disconnected");
                callback();
            });
        }
        else {
            this._setInternalState("disconnected");
            //    this.emit("close", null);
            callback();
        }
    }
    // override me !
    _on_connection_reestablished(callback) {
        callback();
    }
    toString() {
        let str = "\n";
        str += "  defaultSecureTokenLifetime.... " + this.defaultSecureTokenLifetime + "\n";
        str += "  securityMode.................. " + node_opcua_service_secure_channel_1.MessageSecurityMode[this.securityMode] + "\n";
        str += "  securityPolicy................ " + this.securityPolicy.toString() + "\n";
        str += "  certificate fingerprint....... " + (0, web_1.makeSHA1Thumbprint)(this.getCertificate()).toString("hex") + "\n";
        str +=
            "  server certificate fingerprint " +
                (this.serverCertificate ? (0, web_1.makeSHA1Thumbprint)(this.serverCertificate).toString("hex") : "") +
                "\n";
        // this.serverCertificate = options.serverCertificate || null + "\n";
        str += "  keepSessionAlive.............. " + this.keepSessionAlive + "\n";
        str += "  bytesRead..................... " + this.bytesRead + "\n";
        str += "  bytesWritten.................. " + this.bytesWritten + "\n";
        str += "  transactionsPerformed......... " + this.transactionsPerformed + "\n";
        str += "  timedOutRequestCount.......... " + this.timedOutRequestCount + "\n";
        str += "  connectionStrategy." + "\n";
        str += "        .maxRetry............... " + this.connectionStrategy.maxRetry + "\n";
        str += "        .initialDelay........... " + this.connectionStrategy.initialDelay + "\n";
        str += "        .maxDelay............... " + this.connectionStrategy.maxDelay + "\n";
        str += "        .randomisationFactor.... " + this.connectionStrategy.randomisationFactor + "\n";
        str += "  keepSessionAlive.............. " + this.keepSessionAlive + "\n";
        str += "  applicationName............... " + this.applicationName + "\n";
        str += "  applicationUri................ " + this._getBuiltApplicationUri() + "\n";
        str += "  clientName.................... " + this.clientName + "\n";
        str += "  reconnectOnFailure............ " + this.reconnectOnFailure + "\n";
        str += "  isReconnecting................ " + this.isReconnecting + "\n";
        str += "  (internal state).............. " + this._internalState + "\n";
        str += "  sessions count................ " + this.getSessions().length + "\n";
        if (this._secureChannel) {
            str += "secureChannel:\n" + this._secureChannel.toString();
        }
        return str;
    }
    getSessions() {
        return this._sessions;
    }
    getTransportSettings() {
        return this._secureChannel.getTransportSettings();
    }
    _addSession(session) {
        (0, node_opcua_assert_1.assert)(!session._client || session._client === this);
        (0, node_opcua_assert_1.assert)(this._sessions.indexOf(session) === -1, "session already added");
        session._client = this;
        this._sessions.push(session);
    }
    fetchServerCertificate(endpointUrl, callback) {
        const discoveryUrl = this.discoveryUrl.length > 0 ? this.discoveryUrl : endpointUrl;
        debugLog("OPCUAClientImpl : getting serverCertificate");
        // we have not been given the serverCertificate but this certificate
        // is required as the connection is to be secured.
        //
        // Let's explore the server endpoint that matches our security settings
        // This will give us the missing Certificate as well from the server.
        // todo :
        // Once we have the certificate, we cannot trust it straight away
        // we have to verify that the certificate is valid and not outdated and not revoked.
        // if the certificate is self-signed the certificate must appear in the trust certificate
        // list.
        // if the certificate has been certified by an Certificate Authority we have to
        // verify that the certificates in the chain are valid and not revoked.
        //
        const certificateFile = this.certificateFile;
        const privateKeyFile = this.privateKeyFile;
        const applicationName = this.applicationName;
        const applicationUri = this._applicationUri;
        const params = {
            connectionStrategy: this.connectionStrategy,
            endpointMustExist: false,
            // Node: May be the discovery endpoint only support security mode NONE
            //       what should we do ?
            securityMode: this.securityMode,
            securityPolicy: this.securityPolicy,
            applicationName,
            applicationUri,
            certificateFile,
            privateKeyFile,
            clientCertificateManager: this.clientCertificateManager
        };
        return __findEndpoint.call(this, discoveryUrl, params, (err, result) => {
            if (err) {
                return callback(err);
            }
            // istanbul ignore next
            if (!result) {
                const err1 = new Error("internal error");
                return callback(err1);
            }
            const endpoint = result.selectedEndpoint;
            if (!endpoint) {
                // no matching end point can be found ...
                const err1 = new Error("cannot find endpoint for securityMode=" +
                    node_opcua_service_secure_channel_1.MessageSecurityMode[this.securityMode] +
                    " policy = " +
                    this.securityPolicy);
                return callback(err1);
            }
            (0, node_opcua_assert_1.assert)(endpoint);
            _verify_serverCertificate(this.clientCertificateManager, endpoint.serverCertificate)
                .then(() => {
                this.serverCertificate = endpoint.serverCertificate;
                callback(null, endpoint.endpointUrl);
            })
                .catch((err1) => {
                warningLog("[NODE-OPCUA-W25] client's server certificate verification has failed ", err1.message);
                warningLog("                 clientCertificateManager.rootDir = ", this.clientCertificateManager.rootDir);
                const f = (b) => "                 " + b.toString("base64").replace(/(.{80})/g, "$1\n                 ");
                const chain = (0, web_1.split_der)(endpoint.serverCertificate);
                warningLog(`                  server certificate contains ${chain.length} elements`);
                for (let i = 0; i < chain.length; i++) {
                    const c = chain[i];
                    warningLog("certificate", i, "\n" + f(c));
                }
                if (chain.length > 1) {
                    warningLog("                 verify also that the issuer certificate is trusted and the issuer's certificate is present in the issuer.cert folder\n" +
                        "                 of the client certificate manager located in ", this.clientCertificateManager.rootDir);
                }
                else {
                    warningLog("                 verify that the server certificate is trusted or that server certificate issuer's certificate is present in the issuer folder");
                }
                return callback(err1);
            });
        });
    }
    _accumulate_statistics() {
        if (this._secureChannel) {
            // keep accumulated statistics
            this._byteWritten += this._secureChannel.bytesWritten;
            this._byteRead += this._secureChannel.bytesRead;
            this._transactionsPerformed += this._secureChannel.transactionsPerformed;
            this._timedOutRequestCount += this._secureChannel.timedOutRequestCount;
            // istanbul ignore next
            if (doDebug) {
                const h = `Client ${this._instanceNumber} ${this.clientName}`;
                debugLog(chalk_1.default.cyan(`${h} byteWritten          = `), this._byteWritten);
                debugLog(chalk_1.default.cyan(`${h} byteRead             = `), this._byteRead);
                debugLog(chalk_1.default.cyan(`${h} transactions         = `), this._transactionsPerformed);
                debugLog(chalk_1.default.cyan(`${h} timedOutRequestCount = `), this._timedOutRequestCount);
            }
        }
    }
    _destroy_secure_channel() {
        if (this._secureChannel) {
            // istanbul ignore next
            if (doDebug) {
                debugLog(" DESTROYING SECURE CHANNEL (isTransactionInProgress ?", this._secureChannel.isTransactionInProgress(), ")");
            }
            this._accumulate_statistics();
            const secureChannel = this._secureChannel;
            this._secureChannel = null;
            secureChannel.dispose();
            secureChannel.removeAllListeners();
        }
    }
    _close_pending_sessions(callback) {
        const sessions = [...this._sessions];
        async_1.default.map(sessions, (session, next) => {
            (0, node_opcua_assert_1.assert)(session._client === this);
            // note: to prevent next to be call twice
            let _next_already_call = false;
            session.close((err) => {
                if (_next_already_call) {
                    return;
                }
                _next_already_call = true;
                // We should not bother if we have an error here
                // Session may fail to close , if they haven't been activate and forcefully closed by server
                // in a attempt to preserve resources in the case of a DDOS attack for instance.
                if (err) {
                    const msg = session.authenticationToken ? session.authenticationToken.toString() : "";
                    debugLog(" failing to close session " + msg);
                }
                next();
            });
        }, (err) => {
            // istanbul ignore next
            if (this._sessions.length > 0) {
                debugLog(this._sessions
                    .map((s) => (s.authenticationToken ? s.authenticationToken.toString() : ""))
                    .join(" "));
            }
            (0, node_opcua_assert_1.assert)(this._sessions.length === 0, " failed to disconnect exiting sessions ");
            callback(err);
        });
    }
    _install_secure_channel_event_handlers(secureChannel) {
        (0, node_opcua_assert_1.assert)(this instanceof ClientBaseImpl);
        secureChannel.on("send_chunk", (chunk) => {
            /**
             * notify the observer that a message_chunk has been sent
             * @event send_chunk
             * @param message_chunk
             */
            this.emit("send_chunk", chunk);
        });
        secureChannel.on("receive_chunk", (chunk) => {
            /**
             * notify the observer that a message_chunk has been received
             * @event receive_chunk
             * @param message_chunk
             */
            this.emit("receive_chunk", chunk);
        });
        secureChannel.on("send_request", (message) => {
            /**
             * notify the observer that a request has been sent to the server.
             * @event send_request
             * @param message
             */
            this.emit("send_request", message);
        });
        secureChannel.on("receive_response", (message) => {
            /**
             * notify the observer that a response has been received from the server.
             * @event receive_response
             * @param message
             */
            this.emit("receive_response", message);
        });
        secureChannel.on("lifetime_75", (token) => {
            // secureChannel requests a new token
            debugLog("SecureChannel Security Token ", token.tokenId, "live time was =", token.revisedLifetime, " is about to expired , it's time to request a new token");
            // forward message to upper level
            this.emit("lifetime_75", token, secureChannel);
        });
        secureChannel.on("security_token_renewed", (token) => {
            // forward message to upper level
            this.emit("security_token_renewed", secureChannel, token);
        });
        secureChannel.on("close", (err) => {
            if (err) {
                this._setInternalState("panic");
            }
            debugLog(chalk_1.default.yellow.bold(" ClientBaseImpl emitting close"), err?.message);
            this._destroy_secure_channel();
            if (!err || !this.reconnectOnFailure) {
                if (err) {
                    /**
                     * @event connection_lost
                     */
                    this.emit("connection_lost", err?.message); // instead of "close"
                }
                // this is a normal close operation initiated by us
                this.emit("close", err); // instead of "close"
            }
            else {
                if (this.reconnectOnFailure &&
                    this._internalState !== "reconnecting" &&
                    this._internalState !== "reconnecting_newchannel_connected") {
                    debugLog(" ClientBaseImpl emitting connection_lost");
                    this._setInternalState("reconnecting");
                    /**
                     * @event connection_lost
                     */
                    this.emit("connection_lost", err?.message); // instead of "close"
                    this._repairConnection();
                }
            }
        });
        secureChannel.on("timed_out_request", (request) => {
            /**
             * send when a request has timed out without receiving a response
             * @event timed_out_request
             * @param request
             */
            this.emit("timed_out_request", request);
        });
    }
    _repairConnection() {
        doDebug && debugLog("_repairConnection = ", this._internalState);
        if (this.isUnusable())
            return;
        const duration = ClientBaseImpl.retryDelay;
        if (duration) {
            this.emit("startingDelayBeforeReconnection", duration);
            setTimeout(() => {
                if (this.isUnusable())
                    return;
                this.__innerRepairConnection();
            }, duration);
        }
        else {
            this.__innerRepairConnection();
        }
    }
    __innerRepairConnection() {
        if (this.isUnusable())
            return;
        debugLog("Entering _repairConnection ", this._internalState);
        if (__classPrivateFieldGet(this, _ClientBaseImpl_insideRepairConnection, "f")) {
            errorLog("_repairConnection already in progress internal state = ", this._internalState);
            __classPrivateFieldSet(this, _ClientBaseImpl_shouldRepairAgain, true, "f");
            return;
        }
        this.emit("repairConnectionStarted");
        __classPrivateFieldSet(this, _ClientBaseImpl_insideRepairConnection, true, "f");
        debugLog("recreating new secure channel ", this._internalState);
        this._recreate_secure_channel((err1) => {
            debugLog("secureChannel#on(close) => _recreate_secure_channel returns ", err1 ? err1.message : "OK");
            if (err1) {
                debugLog("_recreate_secure_channel has failed: err = ", err1.message);
                this.emit("close", err1);
                __classPrivateFieldSet(this, _ClientBaseImpl_insideRepairConnection, false, "f");
                if (__classPrivateFieldGet(this, _ClientBaseImpl_shouldRepairAgain, "f")) {
                    __classPrivateFieldSet(this, _ClientBaseImpl_shouldRepairAgain, false, "f");
                    this._repairConnection();
                }
                else {
                    this._setInternalState("disconnected");
                }
                return;
            }
            else {
                if (this.isUnusable())
                    return;
                this._finalReconnectionStep((err2) => {
                    if (err2) {
                        // istanbul ignore next
                        if (doDebug) {
                            debugLog("connection_reestablished has failed");
                            debugLog("err= ", err2.message);
                        }
                        // we still need to retry connecting here !!!
                        debugLog("Disconnected following reconnection failure", err2.message);
                        debugLog(`I will retry OPCUA client reconnection in ${client_base_1.OPCUAClientBase.retryDelay / 1000} seconds`);
                        __classPrivateFieldSet(this, _ClientBaseImpl_insideRepairConnection, false, "f");
                        __classPrivateFieldSet(this, _ClientBaseImpl_shouldRepairAgain, false, "f");
                        this._destroy_secure_channel();
                        // this._setInternalState("reconnecting_failed");
                        setTimeout(() => this._repairConnection(), client_base_1.OPCUAClientBase.retryDelay);
                        return;
                    }
                    else {
                        /**
                         * @event connection_reestablished
                         *        send when the connection is reestablished after a connection break
                         */
                        __classPrivateFieldSet(this, _ClientBaseImpl_insideRepairConnection, false, "f");
                        __classPrivateFieldSet(this, _ClientBaseImpl_shouldRepairAgain, false, "f");
                        this._setInternalState("connected");
                        this.emit("connection_reestablished");
                    }
                });
            }
        });
    }
    _finalReconnectionStep(callback) {
        // now delegate to upper class the
        if (this._on_connection_reestablished) {
            (0, node_opcua_assert_1.assert)(typeof this._on_connection_reestablished === "function");
            this._on_connection_reestablished((err2) => {
                callback(err2);
            });
        }
        else {
            callback();
        }
    }
    /**
     *
     * @internal
     * @private
     */
    __createSession_step2(session, callback) {
        throw new Error("Please override");
    }
    _activateSession(session, userIdentity, callback) {
        throw new Error("Please override");
    }
}
exports.ClientBaseImpl = ClientBaseImpl;
_ClientBaseImpl_insideRepairConnection = new WeakMap(), _ClientBaseImpl_shouldRepairAgain = new WeakMap();
/**
 * @internal
 * @private
 *
 * timeout to wait before client attempt to reconnect in case of failure
 *
 */
ClientBaseImpl.retryDelay = 1000;
// tslint:disable-next-line: max-classes-per-file
class TmpClient extends ClientBaseImpl {
    constructor(options) {
        options.clientName = (options.clientName || "") + "_TmpClient";
        super(options);
    }
    connect(endpoint, callback) {
        debugLog("connecting to TmpClient");
        // istanbul ignore next
        if (this._internalState !== "disconnected") {
            callback(new Error("TmpClient#connect: invalid internal state = " + this._internalState));
            return;
        }
        this._setInternalState("connecting");
        this._connectStep2(endpoint, (err) => {
            if (this.isUnusable()) {
                return this._handleUnrecoverableConnectionFailure(new Error("premature disconnection 4"), callback);
            }
            callback(err);
        });
    }
}
// tslint:disable:no-var-requires
// tslint:disable:max-line-length
const thenify_ex_1 = require("thenify-ex");
ClientBaseImpl.prototype.connect = (0, thenify_ex_1.withCallback)(ClientBaseImpl.prototype.connect);
ClientBaseImpl.prototype.disconnect = (0, thenify_ex_1.withCallback)(ClientBaseImpl.prototype.disconnect);
ClientBaseImpl.prototype.getEndpoints = (0, thenify_ex_1.withCallback)(ClientBaseImpl.prototype.getEndpoints);
ClientBaseImpl.prototype.findServers = (0, thenify_ex_1.withCallback)(ClientBaseImpl.prototype.findServers);
ClientBaseImpl.prototype.findServersOnNetwork = (0, thenify_ex_1.withCallback)(ClientBaseImpl.prototype.findServersOnNetwork);
client_base_1.OPCUAClientBase.create = (options) => {
    return new ClientBaseImpl(options);
};
//# sourceMappingURL=client_base_impl.js.map