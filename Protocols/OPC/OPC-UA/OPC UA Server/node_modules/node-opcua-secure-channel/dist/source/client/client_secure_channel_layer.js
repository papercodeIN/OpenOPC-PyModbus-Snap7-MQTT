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
var _ClientSecureChannelLayer_instances, _a, _ClientSecureChannelLayer__counter, _ClientSecureChannelLayer__bytesRead, _ClientSecureChannelLayer__bytesWritten, _ClientSecureChannelLayer__timeDrift, _ClientSecureChannelLayer_requestedTransportSettings, _ClientSecureChannelLayer__lastRequestId, _ClientSecureChannelLayer__transport, _ClientSecureChannelLayer__pending_transport, _ClientSecureChannelLayer_parent, _ClientSecureChannelLayer_messageChunker, _ClientSecureChannelLayer_requestedLifetime, _ClientSecureChannelLayer_tokenRenewalInterval, _ClientSecureChannelLayer_messageBuilder, _ClientSecureChannelLayer__requests, _ClientSecureChannelLayer___in_normal_close_operation, _ClientSecureChannelLayer__timeout_request_count, _ClientSecureChannelLayer__securityTokenTimeoutId, _ClientSecureChannelLayer_transportTimeout, _ClientSecureChannelLayer_connectionStrategy, _ClientSecureChannelLayer_serverCertificate, _ClientSecureChannelLayer_receiverPublicKey, _ClientSecureChannelLayer__isOpened, _ClientSecureChannelLayer_lastError, _ClientSecureChannelLayer_startReceivingTick, _ClientSecureChannelLayer__isDisconnecting, _ClientSecureChannelLayer_tokenStack, _ClientSecureChannelLayer__dispose_transports, _ClientSecureChannelLayer__install_message_builder, _ClientSecureChannelLayer__closeWithError, _ClientSecureChannelLayer__on_transaction_completed, _ClientSecureChannelLayer__on_message_received, _ClientSecureChannelLayer__record_transaction_statistics, _ClientSecureChannelLayer__cancel_pending_transactions, _ClientSecureChannelLayer__on_transport_closed, _ClientSecureChannelLayer__on_security_token_about_to_expire, _ClientSecureChannelLayer__cancel_security_token_watchdog, _ClientSecureChannelLayer__install_security_token_watchdog, _ClientSecureChannelLayer__build_client_nonce, _ClientSecureChannelLayer__send_open_secure_channel_request, _ClientSecureChannelLayer__on_connection, _ClientSecureChannelLayer__backoff_completion, _ClientSecureChannelLayer__connect, _ClientSecureChannelLayer__establish_connection, _ClientSecureChannelLayer__renew_security_token, _ClientSecureChannelLayer__on_receive_message_chunk, _ClientSecureChannelLayer_makeRequestId, _ClientSecureChannelLayer_undoRequestId, _ClientSecureChannelLayer__make_timeout_callback, _ClientSecureChannelLayer__adjustRequestTimeout, _ClientSecureChannelLayer__performMessageTransaction, _ClientSecureChannelLayer__internal_perform_transaction, _ClientSecureChannelLayer__send_chunk, _ClientSecureChannelLayer__construct_asymmetric_security_header, _ClientSecureChannelLayer__get_security_options_for_OPN, _ClientSecureChannelLayer__get_security_options_for_MSG, _ClientSecureChannelLayer__get_security_options, _ClientSecureChannelLayer__sendSecureOpcUARequest;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientSecureChannelLayer = exports.requestHandleNotSetValue = void 0;
exports.coerceConnectionStrategy = coerceConnectionStrategy;
/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/**
 * @module node-opcua-secure-channel
 */
const crypto_1 = require("crypto");
const events_1 = require("events");
const util_1 = require("util");
const chalk_1 = __importDefault(require("chalk"));
const async_1 = __importDefault(require("async"));
const web_1 = require("node-opcua-crypto/web");
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_binary_stream_1 = require("node-opcua-binary-stream");
const node_opcua_utils_1 = require("node-opcua-utils");
const node_opcua_chunkmanager_1 = require("node-opcua-chunkmanager");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_service_secure_channel_1 = require("node-opcua-service-secure-channel");
const node_opcua_status_code_1 = require("node-opcua-status-code");
const node_opcua_transport_1 = require("node-opcua-transport");
const node_opcua_transport_2 = require("node-opcua-transport");
const node_opcua_common_1 = require("node-opcua-common");
const message_builder_1 = require("../message_builder");
const message_chunker_1 = require("../message_chunker");
const message_header_to_string_1 = require("../message_header_to_string");
const security_policy_1 = require("../security_policy");
const services_1 = require("../services");
const debugLog = (0, node_opcua_debug_1.make_debugLog)("SecureChannel");
const errorLog = (0, node_opcua_debug_1.make_errorLog)("SecureChannel");
const doDebug = (0, node_opcua_debug_1.checkDebugFlag)("SecureChannel");
const warningLog = (0, node_opcua_debug_1.make_warningLog)("SecureChannel");
const checkChunks = doDebug && false;
const doDebug1 = false;
// set checkTimeout to true to enable timeout trace checking
const checkTimeout = !!process.env.NODEOPCUACHECKTIMEOUT || false;
const common_1 = require("../common");
const utils_1 = require("../utils");
const duration_to_string_1 = require("./duration_to_string");
const token_stack_1 = require("../token_stack");
// tslint:disable-next-line: no-var-requires
const backoff = require("backoff");
exports.requestHandleNotSetValue = 0xdeadbeef;
function process_request_callback(requestData, err, response) {
    (0, node_opcua_assert_1.assert)(typeof requestData.callback === "function");
    const request = requestData.request;
    if (!response && !err && requestData.msgType !== "CLO") {
        // this case happens when CLO is called and when some pending transactions
        // remains in the queue...
        err = new Error(" Connection has been closed by client , but this transaction cannot be honored");
    }
    if (response && response instanceof services_1.ServiceFault) {
        response.responseHeader.stringTable = [...(response.responseHeader.stringTable || [])];
        err = new Error(" serviceResult = " + response.responseHeader.serviceResult.toString());
        //  "  returned by server \n response:" + response.toString() + "\n  request: " + request.toString());
        err.response = response;
        err.request = request;
        response = undefined;
    }
    const theCallbackFunction = requestData.callback;
    /* istanbul ignore next */
    if (!theCallbackFunction) {
        throw new Error("Internal error");
    }
    (0, node_opcua_assert_1.assert)(requestData.msgType === "CLO" || (err && !response) || (!err && response));
    // let set callback to undefined to prevent callback to be called again
    requestData.callback = undefined;
    theCallbackFunction(err || null, !err && response !== null ? response : undefined);
}
function coerceConnectionStrategy(options) {
    options = options || {};
    const maxRetry = options.maxRetry === undefined ? 10 : options.maxRetry;
    const initialDelay = options.initialDelay || 10;
    const maxDelay = options.maxDelay || 10000;
    const randomisationFactor = options.randomisationFactor === undefined ? 0 : options.randomisationFactor;
    return {
        initialDelay,
        maxDelay,
        maxRetry,
        randomisationFactor
    };
}
/**
 * a ClientSecureChannelLayer represents the client side of the OPCUA secure channel.
 */
class ClientSecureChannelLayer extends events_1.EventEmitter {
    /**
     * true if the secure channel is trying to establish the connection with the server. In this case, the client
     * may be in the middle of the backoff connection process.
     *
     */
    get isConnecting() {
        return !!this.__call;
    }
    get bytesRead() {
        return __classPrivateFieldGet(this, _ClientSecureChannelLayer__bytesRead, "f") + (__classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f") ? __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f").bytesRead : 0);
    }
    get bytesWritten() {
        return __classPrivateFieldGet(this, _ClientSecureChannelLayer__bytesWritten, "f") + (__classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f") ? __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f").bytesWritten : 0);
    }
    get timeDrift() {
        return __classPrivateFieldGet(this, _ClientSecureChannelLayer__timeDrift, "f");
    }
    get transactionsPerformed() {
        return __classPrivateFieldGet(this, _ClientSecureChannelLayer__lastRequestId, "f");
    }
    get timedOutRequestCount() {
        return __classPrivateFieldGet(this, _ClientSecureChannelLayer__timeout_request_count, "f");
    }
    constructor(options) {
        super();
        _ClientSecureChannelLayer_instances.add(this);
        _ClientSecureChannelLayer__counter.set(this, _a.g_counter++);
        _ClientSecureChannelLayer__bytesRead.set(this, 0);
        _ClientSecureChannelLayer__bytesWritten.set(this, 0);
        _ClientSecureChannelLayer__timeDrift.set(this, 0);
        _ClientSecureChannelLayer_requestedTransportSettings.set(this, void 0);
        _ClientSecureChannelLayer__lastRequestId.set(this, void 0);
        _ClientSecureChannelLayer__transport.set(this, void 0);
        _ClientSecureChannelLayer__pending_transport.set(this, void 0);
        _ClientSecureChannelLayer_parent.set(this, void 0);
        _ClientSecureChannelLayer_messageChunker.set(this, void 0);
        _ClientSecureChannelLayer_requestedLifetime.set(this, void 0);
        _ClientSecureChannelLayer_tokenRenewalInterval.set(this, void 0);
        _ClientSecureChannelLayer_messageBuilder.set(this, void 0);
        _ClientSecureChannelLayer__requests.set(this, void 0);
        _ClientSecureChannelLayer___in_normal_close_operation.set(this, void 0);
        _ClientSecureChannelLayer__timeout_request_count.set(this, void 0);
        _ClientSecureChannelLayer__securityTokenTimeoutId.set(this, void 0);
        _ClientSecureChannelLayer_transportTimeout.set(this, void 0);
        _ClientSecureChannelLayer_connectionStrategy.set(this, void 0);
        _ClientSecureChannelLayer_serverCertificate.set(this, void 0); // the receiverCertificate => Receiver is Server
        _ClientSecureChannelLayer_receiverPublicKey.set(this, void 0);
        _ClientSecureChannelLayer__isOpened.set(this, void 0);
        _ClientSecureChannelLayer_lastError.set(this, void 0);
        _ClientSecureChannelLayer_startReceivingTick.set(this, 0);
        _ClientSecureChannelLayer__isDisconnecting.set(this, false);
        _ClientSecureChannelLayer_tokenStack.set(this, void 0);
        /**
         * @private internal function
         */
        this.beforeSecurityRenew = async () => { };
        this.defaultTransactionTimeout = options.defaultTransactionTimeout || _a.defaultTransactionTimeout;
        this.activeSecurityToken = null;
        __classPrivateFieldSet(this, _ClientSecureChannelLayer_receiverPublicKey, null, "f");
        this.endpointUrl = "";
        if (global.hasResourceLeakDetector && !global.ResourceLeakDetectorStarted) {
            throw new Error("ClientSecureChannelLayer not in ResourceLeakDetectorStarted");
        }
        (0, node_opcua_assert_1.assert)(this instanceof _a);
        __classPrivateFieldSet(this, _ClientSecureChannelLayer__isOpened, false, "f");
        __classPrivateFieldSet(this, _ClientSecureChannelLayer__transport, undefined, "f");
        __classPrivateFieldSet(this, _ClientSecureChannelLayer__lastRequestId, 0, "f");
        __classPrivateFieldSet(this, _ClientSecureChannelLayer_parent, options.parent, "f");
        this.protocolVersion = 0;
        __classPrivateFieldSet(this, _ClientSecureChannelLayer_tokenStack, new token_stack_1.TokenStack(1), "f");
        __classPrivateFieldSet(this, _ClientSecureChannelLayer_requestedLifetime, options.defaultSecureTokenLifetime || 30000, "f");
        __classPrivateFieldSet(this, _ClientSecureChannelLayer_tokenRenewalInterval, options.tokenRenewalInterval || 0, "f");
        this.securityMode = (0, node_opcua_service_secure_channel_1.coerceMessageSecurityMode)(options.securityMode);
        this.securityPolicy = (0, security_policy_1.coerceSecurityPolicy)(options.securityPolicy);
        __classPrivateFieldSet(this, _ClientSecureChannelLayer_serverCertificate, (0, common_1.extractFirstCertificateInChain)(options.serverCertificate), "f");
        (0, node_opcua_assert_1.assert)(this.securityMode == node_opcua_service_secure_channel_1.MessageSecurityMode.None || __classPrivateFieldGet(this, _ClientSecureChannelLayer_serverCertificate, "f"));
        // use to send Request => we use client keys
        __classPrivateFieldSet(this, _ClientSecureChannelLayer_messageChunker, new message_chunker_1.MessageChunker({
            securityMode: this.securityMode
            // note maxMessageSize cannot be set at this stage, transport is not known
        }), "f");
        __classPrivateFieldSet(this, _ClientSecureChannelLayer__requests, {}, "f");
        __classPrivateFieldSet(this, _ClientSecureChannelLayer___in_normal_close_operation, false, "f");
        __classPrivateFieldSet(this, _ClientSecureChannelLayer__timeout_request_count, 0, "f");
        __classPrivateFieldSet(this, _ClientSecureChannelLayer__securityTokenTimeoutId, null, "f");
        __classPrivateFieldSet(this, _ClientSecureChannelLayer_transportTimeout, options.transportTimeout || _a.defaultTransportTimeout, "f");
        __classPrivateFieldSet(this, _ClientSecureChannelLayer_requestedTransportSettings, options.transportSettings || {}, "f");
        __classPrivateFieldSet(this, _ClientSecureChannelLayer_connectionStrategy, coerceConnectionStrategy(options.connectionStrategy), "f");
        this.channelId = 0;
    }
    getTransportSettings() {
        const { maxMessageSize } = __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f") ? __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f").getTransportSettings() : { maxMessageSize: 2048 };
        return { maxMessageSize: maxMessageSize || 0 };
    }
    get transportTimeout() {
        return __classPrivateFieldGet(this, _ClientSecureChannelLayer_transportTimeout, "f");
    }
    getPrivateKey() {
        return __classPrivateFieldGet(this, _ClientSecureChannelLayer_parent, "f") ? __classPrivateFieldGet(this, _ClientSecureChannelLayer_parent, "f").getPrivateKey() : null;
    }
    getCertificateChain() {
        return __classPrivateFieldGet(this, _ClientSecureChannelLayer_parent, "f") ? __classPrivateFieldGet(this, _ClientSecureChannelLayer_parent, "f").getCertificateChain() : null;
    }
    getCertificate() {
        return __classPrivateFieldGet(this, _ClientSecureChannelLayer_parent, "f") ? __classPrivateFieldGet(this, _ClientSecureChannelLayer_parent, "f").getCertificate() : null;
    }
    toString() {
        let str = "";
        str += "\n securityMode ............. : " + node_opcua_service_secure_channel_1.MessageSecurityMode[this.securityMode];
        str += "\n securityPolicy............ : " + this.securityPolicy;
        str += "\n securityToken ............ : " + (this.activeSecurityToken ? this.activeSecurityToken.toString() : "null");
        str += "\n timedOutRequestCount.....  : " + this.timedOutRequestCount;
        str += "\n transportTimeout ......... : " + __classPrivateFieldGet(this, _ClientSecureChannelLayer_transportTimeout, "f");
        str += "\n is transaction in progress : " + this.isTransactionInProgress();
        str += "\n is connecting ............ : " + this.isConnecting;
        str += "\n is disconnecting ......... : " + __classPrivateFieldGet(this, _ClientSecureChannelLayer__isDisconnecting, "f");
        str += "\n is opened ................ : " + this.isOpened();
        str += "\n is valid ................. : " + this.isValid();
        str += "\n channelId ................ : " + this.channelId;
        str += "\n transportParameters: ..... : ";
        str += "\n   maxMessageSize (to send) : " + (__classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f")?.parameters?.maxMessageSize || "<not set>");
        str += "\n   maxChunkCount  (to send) : " + (__classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f")?.parameters?.maxChunkCount || "<not set>");
        str += "\n   receiveBufferSize(server): " + (__classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f")?.parameters?.receiveBufferSize || "<not set>");
        str += "\n   sendBufferSize (to send) : " + (__classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f")?.parameters?.sendBufferSize || "<not set>");
        str += "\ntime drift with server      : " + (0, duration_to_string_1.durationToString)(__classPrivateFieldGet(this, _ClientSecureChannelLayer__timeDrift, "f"));
        str += "\n";
        return str;
    }
    isTransactionInProgress() {
        return Object.keys(__classPrivateFieldGet(this, _ClientSecureChannelLayer__requests, "f")).length > 0;
    }
    /**
     * establish a secure channel with the provided server end point.
     *
     * @example
     *
     *    ```javascript
     *
     *    const secureChannel  = new ClientSecureChannelLayer({});
     *
     *    secureChannel.on("end", function(err) {
     *         console.log("secure channel has ended",err);
     *         if(err) {
     *            console.log(" the connection was closed by an external cause such as server shutdown");
     *        }
     *    });
     *    secureChannel.create("opc.tcp://localhost:1234/UA/Sample", (err) => {
     *         if(err) {
     *              console.log(" cannot establish secure channel" , err);
     *         } else {
     *              console.log("secure channel has been established");
     *         }
     *    });
     *
     *    ```
     */
    create(endpointUrl, callback) {
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        if (this.securityMode !== node_opcua_service_secure_channel_1.MessageSecurityMode.None) {
            // istanbul ignore next
            if (!__classPrivateFieldGet(this, _ClientSecureChannelLayer_serverCertificate, "f")) {
                return callback(new Error("ClientSecureChannelLayer#create : expecting a server certificate when securityMode is not None"));
            }
            // take the opportunity of this async method to perform some async pre-processing
            if (!__classPrivateFieldGet(this, _ClientSecureChannelLayer_receiverPublicKey, "f")) {
                (0, web_1.extractPublicKeyFromCertificate)(__classPrivateFieldGet(this, _ClientSecureChannelLayer_serverCertificate, "f"), (err, publicKey) => {
                    /* istanbul ignore next */
                    if (err) {
                        return callback(err);
                    }
                    /* istanbul ignore next */
                    if (!publicKey) {
                        throw new Error("Internal Error");
                    }
                    __classPrivateFieldSet(this, _ClientSecureChannelLayer_receiverPublicKey, (0, crypto_1.createPublicKey)(publicKey), "f");
                    this.create(endpointUrl, callback);
                });
                return;
            }
        }
        this.endpointUrl = endpointUrl;
        const transport = new node_opcua_transport_1.ClientTCP_transport(__classPrivateFieldGet(this, _ClientSecureChannelLayer_requestedTransportSettings, "f"));
        transport.timeout = __classPrivateFieldGet(this, _ClientSecureChannelLayer_transportTimeout, "f");
        doDebug &&
            debugLog("ClientSecureChannelLayer#create creating ClientTCP_transport with  transport.timeout = ", transport.timeout);
        (0, node_opcua_assert_1.assert)(!__classPrivateFieldGet(this, _ClientSecureChannelLayer__pending_transport, "f"));
        __classPrivateFieldSet(this, _ClientSecureChannelLayer__pending_transport, transport, "f");
        __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__establish_connection).call(this, transport, endpointUrl, (err) => {
            if (err) {
                doDebug && debugLog(chalk_1.default.red("cannot connect to server"));
                __classPrivateFieldSet(this, _ClientSecureChannelLayer__pending_transport, undefined, "f");
                transport.dispose();
                return callback(err);
            }
            __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__on_connection).call(this, transport, callback);
        });
    }
    dispose() {
        __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__dispose_transports).call(this);
        this.abortConnection(() => {
            /* empty */
        });
        __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__cancel_security_token_watchdog).call(this);
    }
    sabotageConnection() {
        __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__closeWithError).call(this, new Error("Sabotage"), node_opcua_status_code_1.StatusCodes.Bad);
    }
    /**
     * forceConnectionBreak is a private api method that
     * can be used to simulate a connection break or
     * terminate the channel in case of a socket timeout that
     * do not produce a socket close event
     * @private
     */
    forceConnectionBreak() {
        const transport = __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f");
        if (!transport) {
            return;
        }
        transport.forceConnectionBreak();
    }
    abortConnection(callback) {
        if (__classPrivateFieldGet(this, _ClientSecureChannelLayer__isDisconnecting, "f")) {
            doDebug && debugLog("abortConnection already aborting!");
            return callback();
        }
        __classPrivateFieldSet(this, _ClientSecureChannelLayer__isDisconnecting, true, "f");
        doDebug && debugLog("abortConnection ", !!this.__call);
        async_1.default.series([
            (inner_callback) => {
                if (this.__call) {
                    this.__call.once("abort", () => inner_callback());
                    this.__call._cancelBackoff = true;
                    this.__call.abort();
                    this.__call = null;
                }
                else {
                    inner_callback();
                }
            },
            (inner_callback) => {
                if (!__classPrivateFieldGet(this, _ClientSecureChannelLayer__pending_transport, "f")) {
                    return inner_callback();
                }
                __classPrivateFieldGet(this, _ClientSecureChannelLayer__pending_transport, "f").disconnect(() => {
                    inner_callback();
                });
            },
            (inner_callback) => {
                if (!__classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f")) {
                    return inner_callback();
                }
                __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f").disconnect(() => {
                    inner_callback();
                });
            }
        ], () => {
            callback();
        });
    }
    /**
     * perform a OPC-UA message transaction, asynchronously.
     * During a transaction, the client sends a request to the server. The provided callback will be invoked
     * at a later stage with the reply from the server, or the error.
     *
     * preconditions:
     *   - the channel must be opened
     *
     * @example
     *
     *    ```javascript
     *    let secure_channel ; // get a  ClientSecureChannelLayer somehow
     *
     *    const request = new BrowseRequest({...});
     *    secure_channel.performMessageTransaction(request, (err,response) => {
     *       if (err) {
     *         // an error has occurred
     *       } else {
     *          assert(response instanceof BrowseResponse);
     *         // do something with response.
     *       }
     *    });
     *    ```
     *
     */
    performMessageTransaction(request, callback) {
        __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__performMessageTransaction).call(this, "MSG", request, callback);
    }
    isValid() {
        if (!__classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f")) {
            return false;
        }
        return __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f").isValid();
    }
    isOpened() {
        return this.isValid() && __classPrivateFieldGet(this, _ClientSecureChannelLayer__isOpened, "f");
    }
    getDisplayName() {
        if (!__classPrivateFieldGet(this, _ClientSecureChannelLayer_parent, "f")) {
            return "";
        }
        return "" + (__classPrivateFieldGet(this, _ClientSecureChannelLayer_parent, "f").applicationName ? __classPrivateFieldGet(this, _ClientSecureChannelLayer_parent, "f").applicationName + " " : "") + __classPrivateFieldGet(this, _ClientSecureChannelLayer_parent, "f").clientName;
    }
    cancelPendingTransactions(callback) {
        (0, node_opcua_assert_1.assert)(typeof callback === "function", "expecting a callback function, but got " + callback);
        // istanbul ignore next
        if (doDebug) {
            debugLog("cancelPendingTransactions ", this.getDisplayName(), " = ", Object.keys(__classPrivateFieldGet(this, _ClientSecureChannelLayer__requests, "f"))
                .map((k) => __classPrivateFieldGet(this, _ClientSecureChannelLayer__requests, "f")[k].request.constructor.name)
                .join(" "));
        }
        for (const key of Object.keys(__classPrivateFieldGet(this, _ClientSecureChannelLayer__requests, "f"))) {
            // kill timer id
            const transaction = __classPrivateFieldGet(this, _ClientSecureChannelLayer__requests, "f")[key];
            if (transaction.callback) {
                transaction.callback(new Error("Transaction has been canceled because client channel  is being closed"));
            }
        }
        callback();
    }
    /**
     * Close a client SecureChannel ,by sending a CloseSecureChannelRequest to the server.
     *
     * After this call, the connection is closed and no further transaction can be made.
     */
    close(callback) {
        (0, node_opcua_assert_1.assert)(typeof callback === "function", "expecting a callback function, but got " + callback);
        // cancel any pending transaction
        this.cancelPendingTransactions(( /* err?: Error */) => {
            // what the specs says:
            // --------------------
            //   The client closes the connection by sending a CloseSecureChannelRequest and closing the
            //   socket gracefully. When the server receives this message it shall release all resources
            //   allocated for the channel. The server does not send a CloseSecureChannel response
            //
            // ( Note : some servers do  send a CloseSecureChannel though !)
            // there is no need for the security token expiration event to trigger anymore
            __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__cancel_security_token_watchdog).call(this);
            doDebug && debugLog("Sending CloseSecureChannelRequest to server");
            const request = new services_1.CloseSecureChannelRequest();
            __classPrivateFieldSet(this, _ClientSecureChannelLayer___in_normal_close_operation, true, "f");
            if (!__classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f") || __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f").isDisconnecting()) {
                this.dispose();
                return callback(new Error("Transport disconnected"));
            }
            __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__performMessageTransaction).call(this, "CLO", request, (err) => {
                // istanbul ignore next
                if (err) {
                    warningLog("CLO transaction terminated with error: ", err.message);
                }
                if (__classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f")) {
                    __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f").disconnect(() => {
                        callback();
                    });
                }
                else {
                    this.dispose();
                    callback();
                }
            });
        });
    }
    /**
     * @private internal use only : (used for test)
     */
    getTransport() {
        return __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f");
    }
    /**
     * @private internal use only : (use for testing purpose)
     */
    _getMessageBuilder() {
        return __classPrivateFieldGet(this, _ClientSecureChannelLayer_messageBuilder, "f");
    }
}
exports.ClientSecureChannelLayer = ClientSecureChannelLayer;
_a = ClientSecureChannelLayer, _ClientSecureChannelLayer__counter = new WeakMap(), _ClientSecureChannelLayer__bytesRead = new WeakMap(), _ClientSecureChannelLayer__bytesWritten = new WeakMap(), _ClientSecureChannelLayer__timeDrift = new WeakMap(), _ClientSecureChannelLayer_requestedTransportSettings = new WeakMap(), _ClientSecureChannelLayer__lastRequestId = new WeakMap(), _ClientSecureChannelLayer__transport = new WeakMap(), _ClientSecureChannelLayer__pending_transport = new WeakMap(), _ClientSecureChannelLayer_parent = new WeakMap(), _ClientSecureChannelLayer_messageChunker = new WeakMap(), _ClientSecureChannelLayer_requestedLifetime = new WeakMap(), _ClientSecureChannelLayer_tokenRenewalInterval = new WeakMap(), _ClientSecureChannelLayer_messageBuilder = new WeakMap(), _ClientSecureChannelLayer__requests = new WeakMap(), _ClientSecureChannelLayer___in_normal_close_operation = new WeakMap(), _ClientSecureChannelLayer__timeout_request_count = new WeakMap(), _ClientSecureChannelLayer__securityTokenTimeoutId = new WeakMap(), _ClientSecureChannelLayer_transportTimeout = new WeakMap(), _ClientSecureChannelLayer_connectionStrategy = new WeakMap(), _ClientSecureChannelLayer_serverCertificate = new WeakMap(), _ClientSecureChannelLayer_receiverPublicKey = new WeakMap(), _ClientSecureChannelLayer__isOpened = new WeakMap(), _ClientSecureChannelLayer_lastError = new WeakMap(), _ClientSecureChannelLayer_startReceivingTick = new WeakMap(), _ClientSecureChannelLayer__isDisconnecting = new WeakMap(), _ClientSecureChannelLayer_tokenStack = new WeakMap(), _ClientSecureChannelLayer_instances = new WeakSet(), _ClientSecureChannelLayer__dispose_transports = function _ClientSecureChannelLayer__dispose_transports() {
    if (__classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f")) {
        __classPrivateFieldSet(this, _ClientSecureChannelLayer__bytesRead, __classPrivateFieldGet(this, _ClientSecureChannelLayer__bytesRead, "f") + (__classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f").bytesRead || 0), "f");
        __classPrivateFieldSet(this, _ClientSecureChannelLayer__bytesWritten, __classPrivateFieldGet(this, _ClientSecureChannelLayer__bytesWritten, "f") + (__classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f").bytesWritten || 0), "f");
        __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f").dispose();
        __classPrivateFieldSet(this, _ClientSecureChannelLayer__transport, undefined, "f");
    }
    if (__classPrivateFieldGet(this, _ClientSecureChannelLayer__pending_transport, "f")) {
        __classPrivateFieldSet(this, _ClientSecureChannelLayer__bytesRead, __classPrivateFieldGet(this, _ClientSecureChannelLayer__bytesRead, "f") + (__classPrivateFieldGet(this, _ClientSecureChannelLayer__pending_transport, "f").bytesRead || 0), "f");
        __classPrivateFieldSet(this, _ClientSecureChannelLayer__bytesWritten, __classPrivateFieldGet(this, _ClientSecureChannelLayer__bytesWritten, "f") + (__classPrivateFieldGet(this, _ClientSecureChannelLayer__pending_transport, "f").bytesWritten || 0), "f");
        __classPrivateFieldGet(this, _ClientSecureChannelLayer__pending_transport, "f").dispose();
        __classPrivateFieldSet(this, _ClientSecureChannelLayer__pending_transport, undefined, "f");
    }
}, _ClientSecureChannelLayer__install_message_builder = function _ClientSecureChannelLayer__install_message_builder() {
    // istanbul ignore next
    if (!__classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f") || !__classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f").parameters) {
        throw new Error("internal error");
    }
    // use to receive Server response
    __classPrivateFieldSet(this, _ClientSecureChannelLayer_messageBuilder, new message_builder_1.MessageBuilder(__classPrivateFieldGet(this, _ClientSecureChannelLayer_tokenStack, "f").serverKeyProvider(), {
        name: "client",
        privateKey: this.getPrivateKey() || undefined,
        securityMode: this.securityMode,
        maxChunkSize: __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f").receiveBufferSize || 0,
        maxChunkCount: __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f").maxChunkCount || 0,
        maxMessageSize: __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f").maxMessageSize || 0
    }), "f");
    /* istanbul ignore next */
    if (node_opcua_transport_2.doTraceChunk) {
        console.log(chalk_1.default.cyan((0, node_opcua_utils_1.timestamp)()), "   MESSAGE BUILDER LIMITS", "maxMessageSize = ", __classPrivateFieldGet(this, _ClientSecureChannelLayer_messageBuilder, "f").maxMessageSize, "maxChunkCount = ", __classPrivateFieldGet(this, _ClientSecureChannelLayer_messageBuilder, "f").maxChunkCount, "maxChunkSize = ", __classPrivateFieldGet(this, _ClientSecureChannelLayer_messageBuilder, "f").maxChunkSize, "(", __classPrivateFieldGet(this, _ClientSecureChannelLayer_messageBuilder, "f").maxChunkSize * __classPrivateFieldGet(this, _ClientSecureChannelLayer_messageBuilder, "f").maxChunkCount, ")");
    }
    __classPrivateFieldGet(this, _ClientSecureChannelLayer_messageBuilder, "f")
        .on("message", (response, msgType, securityHeader, requestId, channelId) => {
        this.emit("message", response, msgType, securityHeader, requestId, channelId);
        __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__on_message_received).call(this, response, msgType, securityHeader, requestId);
    })
        .on("startChunk", () => {
        //
        if (utils_1.doPerfMonitoring) {
            __classPrivateFieldSet(this, _ClientSecureChannelLayer_startReceivingTick, (0, node_opcua_utils_1.get_clock_tick)(), "f");
        }
    })
        .on("abandon", (requestId) => {
        const requestData = __classPrivateFieldGet(this, _ClientSecureChannelLayer__requests, "f")[requestId];
        // istanbul ignore next
        if (doDebug) {
            debugLog("request id = ", requestId, "message was ", requestData);
        }
        const err = new services_1.ServiceFault({
            responseHeader: {
                requestHandle: requestId,
                serviceResult: node_opcua_status_code_1.StatusCodes.BadOperationAbandoned
            }
        });
        const callback = requestData.callback;
        delete __classPrivateFieldGet(this, _ClientSecureChannelLayer__requests, "f")[requestId];
        callback && callback(null, err);
    })
        .on("error", (err, statusCode, requestId) => {
        // istanbul ignore next
        if (!requestId) {
            return;
        }
        const requestData = __classPrivateFieldGet(this, _ClientSecureChannelLayer__requests, "f")[requestId];
        // istanbul ignore next
        doDebug && debugLog("request id = ", requestId, err, "message was ", requestData);
        if (utils_1.doTraceClientRequestContent) {
            errorLog(" message was 2:", requestData?.request?.toString() || "<null>");
        }
        if (!requestData) {
            warningLog("requestData not found for requestId = ", requestId);
            // istanbul ignore next
            doDebug && warningLog("err = ", err);
            return;
        }
        const callback = requestData.callback;
        delete __classPrivateFieldGet(this, _ClientSecureChannelLayer__requests, "f")[requestId];
        callback && callback(err, undefined);
        __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__closeWithError).call(this, err, statusCode);
        return;
    });
}, _ClientSecureChannelLayer__closeWithError = function _ClientSecureChannelLayer__closeWithError(err, statusCode) {
    if (__classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f")) {
        __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f").prematureTerminate(err, statusCode);
    }
    this.dispose();
}, _ClientSecureChannelLayer__on_transaction_completed = function _ClientSecureChannelLayer__on_transaction_completed(transactionStatistics) {
    /* istanbul ignore next */
    if (utils_1.doTraceStatistics) {
        // dump some statistics about transaction ( time and sizes )
        (0, utils_1._dump_client_transaction_statistics)(transactionStatistics);
    }
    this.emit("end_transaction", transactionStatistics);
}, _ClientSecureChannelLayer__on_message_received = function _ClientSecureChannelLayer__on_message_received(response, msgType, securityHeader, requestId) {
    /* istanbul ignore next */
    if (response.responseHeader.requestHandle !== requestId) {
        warningLog(msgType, response.toString());
        errorLog(chalk_1.default.red.bgWhite.bold("xxxxx  <<<<<< _on_message_received  ERROR!   requestHandle !== requestId"), "requestId=", requestId, __classPrivateFieldGet(this, _ClientSecureChannelLayer__requests, "f")[requestId]?.constructor.name, "response.responseHeader.requestHandle=", response.responseHeader.requestHandle, response.schema.name.padStart(30));
    }
    if (response instanceof services_1.OpenSecureChannelResponse) {
        if (this.channelId === 0) {
            this.channelId = response.securityToken?.channelId || 0;
        }
        else {
            if (this.channelId !== response.securityToken?.channelId) {
                warningLog("channelId is supposed to be  ", this.channelId, " but is ", response.securityToken?.channelId);
            }
        }
    }
    else {
    }
    /* istanbul ignore next */
    if (utils_1.doTraceClientMessage) {
        (0, utils_1.traceClientResponseMessage)(response, this.channelId, __classPrivateFieldGet(this, _ClientSecureChannelLayer__counter, "f"));
    }
    const requestData = __classPrivateFieldGet(this, _ClientSecureChannelLayer__requests, "f")[requestId];
    /* istanbul ignore next */
    if (!requestData) {
        if (__classPrivateFieldGet(this, _ClientSecureChannelLayer___in_normal_close_operation, "f")) {
            // may be some responses that are received from the server
            // after the communication is closed. We can just ignore them
            // ( this happens with Dotnet C# stack for instance)
            return;
        }
        errorLog(chalk_1.default.cyan.bold("xxxxx  <<<<<< _on_message_received for unknown or timeout request "), requestId, response.schema.name.padStart(30), response.responseHeader.serviceResult.toString(), this.channelId);
        throw new Error(" =>  invalid requestId =" + requestId);
    }
    const request = requestData.request;
    /* istanbul ignore next */
    if (utils_1.doPerfMonitoring) {
        requestData.startReceivingTick = __classPrivateFieldGet(this, _ClientSecureChannelLayer_startReceivingTick, "f");
    }
    delete __classPrivateFieldGet(this, _ClientSecureChannelLayer__requests, "f")[requestId];
    /* istanbul ignore next */
    if (response.responseHeader.requestHandle !== request.requestHeader.requestHandle) {
        const expected = request.requestHeader.requestHandle;
        const actual = response.responseHeader.requestHandle;
        if (actual !== 0x0) {
            // note some old OPCUA Server, like siemens with OPCUA 1.2 may send 0x00 as a
            // requestHandle, this is not harmful. THis happened with OpenSecureChannelRequest
            // so we only display the warning message if we have a real random discrepancy between the two requestHandle.
            const moreInfo = "Request= " + request.schema.name + " Response = " + response.schema.name;
            const message = " WARNING SERVER responseHeader.requestHandle is invalid" +
                ": expecting 0x" +
                expected.toString(16) +
                "(" +
                expected +
                ")" +
                "  but got 0x" +
                actual.toString(16) +
                "(" +
                actual +
                ")" +
                " ";
            debugLog(chalk_1.default.red.bold(message), chalk_1.default.yellow(moreInfo));
            warningLog(chalk_1.default.red.bold(message), chalk_1.default.yellow(moreInfo));
            warningLog(request.toString());
        }
    }
    requestData.response = response;
    /* istanbul ignore next */
    if (utils_1.doPerfMonitoring) {
        // record tick2 : after response message has been received, before message processing
        requestData.startReceivingTick = __classPrivateFieldGet(this, _ClientSecureChannelLayer_messageBuilder, "f")._tick1;
    }
    requestData.bytesRead = __classPrivateFieldGet(this, _ClientSecureChannelLayer_messageBuilder, "f").totalMessageSize;
    /* istanbul ignore next */
    if (utils_1.doPerfMonitoring) {
        // record tick3 : after response message has been received, before message processing
        requestData.endReceivingTick = (0, node_opcua_utils_1.get_clock_tick)();
    }
    process_request_callback(requestData, null, response);
    if (utils_1.doPerfMonitoring) {
        // record tick4 after callback
        requestData.afterProcessingTick = (0, node_opcua_utils_1.get_clock_tick)();
    } // store some statistics
    __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__record_transaction_statistics).call(this, requestData);
    // notify that transaction is completed
    __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__on_transaction_completed).call(this, this.last_transaction_stats);
}, _ClientSecureChannelLayer__record_transaction_statistics = function _ClientSecureChannelLayer__record_transaction_statistics(requestData) {
    const request = requestData.request;
    const response = requestData.response;
    // ---------------------------------------------------------------------------------------------------------|-
    //      _tick0                _tick1                         _tick2                       _tick3          _tick4
    //          sending request
    //        |---------------------|  waiting response
    //                              |------------------------------|      receiving response
    //                                                             |---------------------------| process.resp
    //                                                                                  |---------------|
    this.last_transaction_stats = {
        bytesRead: requestData.bytesRead,
        bytesWritten: requestData.bytesWritten_after - requestData.bytesWritten_before,
        lap_processing_response: requestData.afterProcessingTick - requestData.endReceivingTick,
        lap_receiving_response: requestData.endReceivingTick - requestData.startReceivingTick,
        lap_sending_request: requestData.afterSendTick - requestData.beforeSendTick,
        lap_transaction: requestData.afterProcessingTick - requestData.beforeSendTick,
        lap_waiting_response: requestData.startReceivingTick - requestData.afterSendTick,
        request,
        response
    };
    if (utils_1.doTraceStatistics) {
        (0, utils_1._dump_client_transaction_statistics)(this.last_transaction_stats);
    }
}, _ClientSecureChannelLayer__cancel_pending_transactions = function _ClientSecureChannelLayer__cancel_pending_transactions(err) {
    if (doDebug && __classPrivateFieldGet(this, _ClientSecureChannelLayer__requests, "f")) {
        debugLog("_cancel_pending_transactions  ", Object.keys(__classPrivateFieldGet(this, _ClientSecureChannelLayer__requests, "f")), __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f") ? __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f").name : "no transport");
    }
    if (__classPrivateFieldGet(this, _ClientSecureChannelLayer__requests, "f")) {
        for (const requestData of Object.values(__classPrivateFieldGet(this, _ClientSecureChannelLayer__requests, "f"))) {
            if (requestData) {
                const request = requestData.request;
                doDebug &&
                    debugLog("Cancelling pending transaction ", requestData.key, requestData.msgType, request?.schema.name);
                process_request_callback(requestData, err);
            }
        }
    }
    __classPrivateFieldSet(this, _ClientSecureChannelLayer__requests, {}, "f");
}, _ClientSecureChannelLayer__on_transport_closed = function _ClientSecureChannelLayer__on_transport_closed(err) {
    doDebug && debugLog(" =>ClientSecureChannelLayer#_on_transport_closed  err=", err ? err.message : "null");
    if (__classPrivateFieldGet(this, _ClientSecureChannelLayer___in_normal_close_operation, "f")) {
        err = undefined;
    }
    if (utils_1.doTraceClientMessage) {
        (0, utils_1.traceClientConnectionClosed)(err, this.channelId, __classPrivateFieldGet(this, _ClientSecureChannelLayer__counter, "f"));
    }
    this.emit("close", err);
    __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__dispose_transports).call(this);
    __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__cancel_pending_transactions).call(this, err);
    __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__cancel_security_token_watchdog).call(this);
    this.dispose();
}, _ClientSecureChannelLayer__on_security_token_about_to_expire = function _ClientSecureChannelLayer__on_security_token_about_to_expire(securityToken) {
    /* istanbul ignore next */
    doDebug &&
        debugLog(" client: Security Token ", securityToken.tokenId, " is about to expired, let's raise lifetime_75 event ");
    this.emit("lifetime_75", securityToken);
    __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__renew_security_token).call(this);
}, _ClientSecureChannelLayer__cancel_security_token_watchdog = function _ClientSecureChannelLayer__cancel_security_token_watchdog() {
    if (__classPrivateFieldGet(this, _ClientSecureChannelLayer__securityTokenTimeoutId, "f")) {
        clearTimeout(__classPrivateFieldGet(this, _ClientSecureChannelLayer__securityTokenTimeoutId, "f"));
        __classPrivateFieldSet(this, _ClientSecureChannelLayer__securityTokenTimeoutId, null, "f");
    }
}, _ClientSecureChannelLayer__install_security_token_watchdog = function _ClientSecureChannelLayer__install_security_token_watchdog(securityToken) {
    // install timer event to raise a 'lifetime_75' when security token is about to expired
    // so that client can request for a new security token
    // note that, for speedup in test,
    // it is possible to tweak this interval for test by specifying a tokenRenewalInterval value
    //
    let lifeTime = securityToken.revisedLifetime;
    lifeTime = Math.max(lifeTime, 20);
    const percent = 75 / 100.0;
    let timeout = __classPrivateFieldGet(this, _ClientSecureChannelLayer_tokenRenewalInterval, "f") || lifeTime * percent;
    timeout = Math.min(timeout, (lifeTime * 75) / 100);
    timeout = Math.max(timeout, 50);
    // istanbul ignore next
    if (doDebug) {
        debugLog(chalk_1.default.red.bold(" time until next security token renewal = "), timeout, "( lifetime = ", lifeTime + " -  tokenRenewalInterval =" + __classPrivateFieldGet(this, _ClientSecureChannelLayer_tokenRenewalInterval, "f"));
    }
    (0, node_opcua_assert_1.assert)(__classPrivateFieldGet(this, _ClientSecureChannelLayer__securityTokenTimeoutId, "f") === null);
    // security token renewal should happen without overlapping
    __classPrivateFieldSet(this, _ClientSecureChannelLayer__securityTokenTimeoutId, setTimeout(() => {
        __classPrivateFieldSet(this, _ClientSecureChannelLayer__securityTokenTimeoutId, null, "f");
        __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__on_security_token_about_to_expire).call(this, securityToken);
    }, timeout), "f");
}, _ClientSecureChannelLayer__build_client_nonce = function _ClientSecureChannelLayer__build_client_nonce() {
    if (this.securityMode === node_opcua_service_secure_channel_1.MessageSecurityMode.None) {
        return undefined;
    }
    // create a client Nonce if secure mode is requested
    // Release 1.02 page 23 OPC Unified Architecture, Part 4 Table 7 – OpenSecureChannel Service Parameters
    // clientNonce
    // "This parameter shall have a length equal to key size used for the symmetric
    //  encryption algorithm that is identified by the securityPolicyUri"
    const cryptoFactory = (0, security_policy_1.getCryptoFactory)(this.securityPolicy);
    /* istanbul ignore next */
    if (!cryptoFactory) {
        // this securityPolicy may not be support yet ... let's return null
        return undefined;
    }
    return (0, crypto_1.randomBytes)(cryptoFactory.symmetricKeyLength);
}, _ClientSecureChannelLayer__send_open_secure_channel_request = function _ClientSecureChannelLayer__send_open_secure_channel_request(isInitial, callback) {
    // Verify that we have a valid and known Security policy
    if (this.securityPolicy !== security_policy_1.SecurityPolicy.None) {
        const cryptoFactory = (0, security_policy_1.getCryptoFactory)(this.securityPolicy);
        if (!cryptoFactory) {
            return callback(new Error(`_open_secure_channel_request :  invalid securityPolicy : ${this.securityPolicy} `));
        }
    }
    (0, node_opcua_assert_1.assert)(this.securityMode !== node_opcua_service_secure_channel_1.MessageSecurityMode.Invalid, "invalid security mode");
    // from the specs:
    // The OpenSecureChannel Messages are not signed or encrypted if the SecurityMode is None. The
    // nonces  are ignored and should be set to null. The SecureChannelId and the TokenId are still
    // assigned but no security is applied to Messages exchanged via the channel.
    const msgType = "OPN";
    const requestType = isInitial ? services_1.SecurityTokenRequestType.Issue : services_1.SecurityTokenRequestType.Renew;
    const clientNonce = __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__build_client_nonce).call(this);
    __classPrivateFieldSet(this, _ClientSecureChannelLayer__isOpened, !isInitial, "f");
    // OpenSecureChannel
    const msg = new services_1.OpenSecureChannelRequest({
        clientNonce,
        clientProtocolVersion: this.protocolVersion,
        requestHeader: {
            auditEntryId: null
        },
        requestType: requestType,
        requestedLifetime: __classPrivateFieldGet(this, _ClientSecureChannelLayer_requestedLifetime, "f"),
        securityMode: this.securityMode
    });
    const startDate = new Date();
    __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__performMessageTransaction).call(this, msgType, msg, (err, response) => {
        // istanbul ignore next
        if (response && response.responseHeader && response.responseHeader.serviceResult !== node_opcua_status_code_1.StatusCodes.Good) {
            warningLog("OpenSecureChannelRequest Error: response.responseHeader.serviceResult ", response.constructor.name, response.responseHeader.serviceResult.toString());
            err = new Error(response.responseHeader.serviceResult.toString());
        }
        if (!err && response) {
            const openSecureChannelResponse = response;
            // record channelId for future transactions
            this.channelId = openSecureChannelResponse.securityToken.channelId;
            // istanbul ignore next
            if (openSecureChannelResponse.securityToken.tokenId <= 0 && msgType !== "OPN") {
                return callback(new Error(`_open_secure_channel_request : response has an  invalid token ${openSecureChannelResponse.securityToken.tokenId} Id or msgType ${msgType} `));
            }
            const securityToken = openSecureChannelResponse.securityToken;
            // Check time
            const endDate = new Date();
            const midDate = new Date((startDate.getTime() + endDate.getTime()) / 2);
            if (securityToken.createdAt) {
                const delta = securityToken.createdAt.getTime() - midDate.getTime();
                __classPrivateFieldSet(this, _ClientSecureChannelLayer__timeDrift, delta, "f");
                if (Math.abs(delta) > _a.maxClockSkew) {
                    warningLog(`[NODE-OPCUA-W33]  client : server token creation date exposes a time discrepancy ${(0, duration_to_string_1.durationToString)(delta)}\n` +
                        "remote server clock doesn't match this computer date !\n" +
                        " please check both server and client clocks are properly set !\n" +
                        ` server time :${chalk_1.default.cyan(securityToken.createdAt?.toISOString())}\n` +
                        ` client time :${chalk_1.default.cyan(midDate.toISOString())}\n` +
                        ` transaction duration = ${(0, duration_to_string_1.absoluteDurationToString)(endDate.getTime() - startDate.getTime())}\n` +
                        ` server URL = ${this.endpointUrl} \n` +
                        ` token.createdAt  has been updated to reflect client time`);
                }
            }
            securityToken.createdAt = midDate;
            const serverNonce = openSecureChannelResponse.serverNonce;
            let derivedKeys = null;
            if (this.securityMode !== node_opcua_service_secure_channel_1.MessageSecurityMode.None) {
                // verify that server nonce if provided is at least 32 bytes long
                /* istanbul ignore next */
                if (!openSecureChannelResponse.serverNonce) {
                    warningLog(" client : server nonce is missing !");
                    return callback(new Error(" Invalid server nonce"));
                }
                // This parameter shall have a length equal to key size used for the symmetric
                // encryption algorithm that is identified by the securityPolicyUri.
                /* istanbul ignore next */
                if (openSecureChannelResponse.serverNonce.length !== clientNonce?.length) {
                    warningLog(" client : server nonce is invalid  (invalid length)!");
                    return callback(new Error(" Invalid server nonce length"));
                }
                const cryptoFactory = (0, security_policy_1.getCryptoFactory)(__classPrivateFieldGet(this, _ClientSecureChannelLayer_messageBuilder, "f").securityPolicy);
                derivedKeys = (0, security_policy_1.computeDerivedKeys)(cryptoFactory, serverNonce, clientNonce);
                // istanbul ignore next
                if (doDebug) {
                    debugLog("Server has send a new security Token");
                }
            }
            __classPrivateFieldGet(this, _ClientSecureChannelLayer_tokenStack, "f").pushNewToken(securityToken, derivedKeys);
            this.emit("security_token_created", securityToken);
            __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__install_security_token_watchdog).call(this, securityToken);
            this.activeSecurityToken = securityToken;
            __classPrivateFieldSet(this, _ClientSecureChannelLayer__isOpened, true, "f");
        }
        callback(err || undefined);
    });
}, _ClientSecureChannelLayer__on_connection = function _ClientSecureChannelLayer__on_connection(transport, callback) {
    (0, node_opcua_assert_1.assert)(__classPrivateFieldGet(this, _ClientSecureChannelLayer__pending_transport, "f") === transport);
    __classPrivateFieldSet(this, _ClientSecureChannelLayer__pending_transport, undefined, "f");
    __classPrivateFieldSet(this, _ClientSecureChannelLayer__transport, transport, "f");
    // install message chunker limits:
    __classPrivateFieldGet(this, _ClientSecureChannelLayer_messageChunker, "f").maxMessageSize = __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f")?.maxMessageSize || 0;
    __classPrivateFieldGet(this, _ClientSecureChannelLayer_messageChunker, "f").maxChunkCount = __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f")?.maxChunkCount || 0;
    __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__install_message_builder).call(this);
    __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f").on("chunk", (messageChunk) => {
        this.emit("receive_chunk", messageChunk);
        __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__on_receive_message_chunk).call(this, messageChunk);
    });
    __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f").on("close", (err) => __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__on_transport_closed).call(this, err));
    __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f").on("connection_break", () => {
        doDebug && debugLog(chalk_1.default.red("Client => CONNECTION BREAK  <="));
        __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__on_transport_closed).call(this, new Error("Connection Break"));
    });
    setImmediate(() => {
        doDebug && debugLog(chalk_1.default.red("Client now sending OpenSecureChannel"));
        const isInitial = true;
        __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__send_open_secure_channel_request).call(this, isInitial, callback);
    });
}, _ClientSecureChannelLayer__backoff_completion = function _ClientSecureChannelLayer__backoff_completion(err, lastError, transport, callback) {
    // Node 20.11.1 on windows now reports a AggregateError when a connection is refused
    // this is a workaround to fix the error message, that is empty when the error is
    // an AggregateError
    const fixError = (err) => {
        if (!err)
            return err;
        if (err.errors) {
            const _err = err;
            err.message = _err.errors.map((e) => e.message).join("\n");
        }
        return err;
    };
    if (this.__call) {
        transport.numberOfRetry = transport.numberOfRetry || 0;
        transport.numberOfRetry += this.__call.getNumRetries();
        this.__call.removeAllListeners();
        this.__call = null;
        if (err) {
            const err_ = fixError(lastError || err);
            callback(err_);
        }
        else {
            callback();
        }
    }
}, _ClientSecureChannelLayer__connect = function _ClientSecureChannelLayer__connect(transport, endpointUrl, _i_callback) {
    const on_connect = (err) => {
        doDebug && debugLog("Connection => err", err ? err.message : "null");
        // force Backoff to fail if err is not ECONNRESET or ECONNREFUSED
        // this mean that the connection to the server has succeeded but for some reason
        // the server has denied the connection
        // the cause could be:
        //   - invalid protocol version specified by client
        //   - server going to shutdown
        //   - server too busy -
        //   - server shielding itself from a DDOS attack
        if (err) {
            let should_abort = __classPrivateFieldGet(this, _ClientSecureChannelLayer__isDisconnecting, "f");
            if (err.message.match(/ECONNRESET/)) {
                // this situation could arise when the socket try to connect and timeouts...  should_abort = false;
            }
            if (err.message.match(/BadProtocolVersionUnsupported/)) {
                should_abort = true;
            }
            if (err.message.match(/BadTcpInternalError/)) {
                should_abort = true;
            }
            if (err.message.match(/BadTcpMessageTooLarge/)) {
                should_abort = true;
            }
            if (err.message.match(/BadTcpEndpointUriInvalid/)) {
                should_abort = true;
            }
            if (err.message.match(/BadTcpMessageTypeInvalid/)) {
                should_abort = true;
            }
            __classPrivateFieldSet(this, _ClientSecureChannelLayer_lastError, err, "f");
            if (this.__call) {
                // connection cannot be establish ? if not, abort the backoff process
                if (should_abort) {
                    doDebug && debugLog(" Aborting backoff process prematurely - err = ", err.message);
                    this.__call.abort();
                }
                else {
                    doDebug && debugLog(" backoff - keep trying - err = ", err.message);
                }
            }
        }
        _i_callback(err);
    };
    transport.connect(endpointUrl, on_connect);
}, _ClientSecureChannelLayer__establish_connection = function _ClientSecureChannelLayer__establish_connection(transport, endpointUrl, callback) {
    transport.protocolVersion = this.protocolVersion;
    __classPrivateFieldSet(this, _ClientSecureChannelLayer_lastError, undefined, "f");
    if (__classPrivateFieldGet(this, _ClientSecureChannelLayer_connectionStrategy, "f").maxRetry === 0) {
        doDebug && debugLog(chalk_1.default.cyan("max Retry === 0 =>  No backoff required -> call the _connect function directly"));
        this.__call = 0;
        return __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__connect).call(this, transport, endpointUrl, callback);
    }
    const connectFunc = (callback2) => {
        return __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__connect).call(this, transport, endpointUrl, callback2);
    };
    const completionFunc = (err) => {
        return __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__backoff_completion).call(this, err, __classPrivateFieldGet(this, _ClientSecureChannelLayer_lastError, "f"), transport, callback);
    };
    this.__call = backoff.call(connectFunc, completionFunc);
    if (__classPrivateFieldGet(this, _ClientSecureChannelLayer_connectionStrategy, "f").maxRetry >= 0) {
        const maxRetry = Math.max(__classPrivateFieldGet(this, _ClientSecureChannelLayer_connectionStrategy, "f").maxRetry, 1);
        doDebug && debugLog(chalk_1.default.cyan("backoff will failed after "), maxRetry);
        this.__call.failAfter(maxRetry);
    }
    else {
        // retry will be infinite
        doDebug && debugLog(chalk_1.default.cyan("backoff => starting a infinite retry"));
    }
    const onBackoffFunc = (retryCount, delay) => {
        doDebug &&
            debugLog(chalk_1.default.bgWhite.cyan(" Backoff #"), retryCount, "delay = ", delay, " ms", " maxRetry ", __classPrivateFieldGet(this, _ClientSecureChannelLayer_connectionStrategy, "f").maxRetry);
        // Do something when backoff starts, e.g. show to the
        // user the delay before next reconnection attempt.
        this.emit("backoff", retryCount, delay);
    };
    this.__call.on("backoff", onBackoffFunc);
    this.__call.on("abort", () => {
        doDebug && debugLog(chalk_1.default.bgWhite.cyan(` abort #   after ${this.__call.getNumRetries()} retries.`));
        // Do something when backoff starts, e.g. show to the
        // user the delay before next reconnection attempt.
        this.emit("abort");
        setImmediate(() => {
            __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__backoff_completion).call(this, undefined, new Error("Connection abandoned"), transport, callback);
        });
    });
    this.__call.setStrategy(new backoff.ExponentialStrategy(__classPrivateFieldGet(this, _ClientSecureChannelLayer_connectionStrategy, "f")));
    this.__call.start();
}, _ClientSecureChannelLayer__renew_security_token = function _ClientSecureChannelLayer__renew_security_token() {
    this.beforeSecurityRenew()
        .then(() => {
        // istanbul ignore next
        doDebug && debugLog("ClientSecureChannelLayer#_renew_security_token");
        // istanbul ignore next
        if (!this.isValid()) {
            // this may happen if the communication has been closed by the client or the sever
            warningLog("Invalid socket => Communication has been lost, cannot renew token");
            return;
        }
        const isInitial = false;
        __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__send_open_secure_channel_request).call(this, isInitial, (err) => {
            /* istanbul ignore else */
            if (!err) {
                doDebug && debugLog(" token renewed");
                this.emit("security_token_renewed", this.activeSecurityToken);
            }
            else {
                errorLog("ClientSecureChannelLayer: Warning: securityToken hasn't been renewed -> err ", err.message);
            }
        });
    })
        .catch((err) => {
        errorLog("ClientSecureChannelLayer#beforeSecurityRenew error", err);
    });
}, _ClientSecureChannelLayer__on_receive_message_chunk = function _ClientSecureChannelLayer__on_receive_message_chunk(messageChunk) {
    /* istanbul ignore next */
    if (doDebug1) {
        const _stream = new node_opcua_binary_stream_1.BinaryStream(messageChunk);
        const messageHeader = (0, node_opcua_chunkmanager_1.readMessageHeader)(_stream);
        debugLog("CLIENT RECEIVED " + chalk_1.default.yellow(JSON.stringify(messageHeader) + ""));
        debugLog("\n" + (0, node_opcua_debug_1.hexDump)(messageChunk));
        debugLog((0, message_header_to_string_1.messageHeaderToString)(messageChunk));
    }
    __classPrivateFieldGet(this, _ClientSecureChannelLayer_messageBuilder, "f").feed(messageChunk);
}, _ClientSecureChannelLayer_makeRequestId = function _ClientSecureChannelLayer_makeRequestId() {
    __classPrivateFieldSet(this, _ClientSecureChannelLayer__lastRequestId, __classPrivateFieldGet(this, _ClientSecureChannelLayer__lastRequestId, "f") + 1, "f");
    return __classPrivateFieldGet(this, _ClientSecureChannelLayer__lastRequestId, "f");
}, _ClientSecureChannelLayer_undoRequestId = function _ClientSecureChannelLayer_undoRequestId() {
    __classPrivateFieldSet(this, _ClientSecureChannelLayer__lastRequestId, __classPrivateFieldGet(this, _ClientSecureChannelLayer__lastRequestId, "f") - 1, "f");
    return __classPrivateFieldGet(this, _ClientSecureChannelLayer__lastRequestId, "f");
}, _ClientSecureChannelLayer__make_timeout_callback = function _ClientSecureChannelLayer__make_timeout_callback(request, callback, timeout) {
    let localCallback = callback;
    const optionalTrace = !checkTimeout || new Error().stack;
    let hasTimedOut = false;
    let timerId = setTimeout(() => {
        timerId = null;
        hasTimedOut = true;
        if (checkTimeout) {
            warningLog(" Timeout .... waiting for response for ", request.constructor.name, request.requestHeader.toString());
            warningLog(" Timeout was ", timeout, "ms");
            warningLog(request.toString());
            warningLog(optionalTrace);
        }
        modified_callback(new Error("Transaction has timed out ( timeout = " + timeout + " ms , request = " + request.constructor.name + ")"));
        __classPrivateFieldSet(this, _ClientSecureChannelLayer__timeout_request_count, __classPrivateFieldGet(this, _ClientSecureChannelLayer__timeout_request_count, "f") + 1, "f");
        this.emit("timed_out_request", request);
    }, timeout);
    const modified_callback = (err, response) => {
        /* istanbul ignore next */
        if (doDebug) {
            debugLog(chalk_1.default.cyan("------------------------------------- Client receiving response "), request.constructor.name, request.requestHeader.requestHandle, response ? response.constructor.name : "null", "err=", err ? err.message : "null", "securityTokenId=", this.activeSecurityToken?.tokenId);
        }
        if (response && utils_1.doTraceClientResponseContent) {
            (0, utils_1.traceClientResponseContent)(response, this.channelId);
        }
        if (!localCallback) {
            return; // already processed by time  out
        }
        // when response === null we are processing the timeout , therefore there is no need to clearTimeout
        if (!hasTimedOut && timerId) {
            clearTimeout(timerId);
        }
        timerId = null;
        if (!err && response) {
            this.emit("receive_response", response);
        }
        (0, node_opcua_assert_1.assert)(!err || util_1.types.isNativeError(err));
        delete __classPrivateFieldGet(this, _ClientSecureChannelLayer__requests, "f")[request.requestHeader.requestHandle];
        // invoke user callback if it has not been intercepted first ( by a abrupt disconnection for instance )
        try {
            localCallback.call(this, err || null, response);
        }
        catch (err1) {
            errorLog("ERROR !!! callback has thrown en error ", err1);
        }
        finally {
            localCallback = null;
        }
    };
    return modified_callback;
}, _ClientSecureChannelLayer__adjustRequestTimeout = function _ClientSecureChannelLayer__adjustRequestTimeout(request) {
    let timeout = request.requestHeader.timeoutHint ||
        this.defaultTransactionTimeout ||
        _a.defaultTransactionTimeout;
    timeout = Math.max(_a.minTransactionTimeout, timeout);
    /* istanbul ignore next */
    if (request.requestHeader.timeoutHint != timeout) {
        debugLog("Adjusted timeout = ", request.requestHeader.timeoutHint);
    }
    request.requestHeader.timeoutHint = timeout;
    return timeout;
}, _ClientSecureChannelLayer__performMessageTransaction = function _ClientSecureChannelLayer__performMessageTransaction(msgType, request, callback) {
    this.emit("beforePerformTransaction", msgType, request);
    /* istanbul ignore next */
    if (!this.isValid()) {
        return callback(new Error("ClientSecureChannelLayer => Socket is closed ! while processing " + request.constructor.name));
    }
    const timeout = __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__adjustRequestTimeout).call(this, request);
    const modifiedCallback = __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__make_timeout_callback).call(this, request, callback, timeout);
    const transactionData = {
        callback: modifiedCallback,
        msgType: msgType,
        request: request
    };
    __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__internal_perform_transaction).call(this, transactionData);
}, _ClientSecureChannelLayer__internal_perform_transaction = function _ClientSecureChannelLayer__internal_perform_transaction(transactionData) {
    if (!__classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f")) {
        setTimeout(() => {
            transactionData.callback(new Error("Client not connected"));
        }, 100);
        return;
    }
    const msgType = transactionData.msgType;
    const request = transactionData.request;
    /* istanbul ignore next */
    if (request.requestHeader.requestHandle !== exports.requestHandleNotSetValue) {
        errorLog(chalk_1.default.bgRed.white("xxxxx   >>>>>> request has already been set with a requestHandle"), request.requestHeader.requestHandle, request.constructor.name);
        errorLog(Object.keys(__classPrivateFieldGet(this, _ClientSecureChannelLayer__requests, "f")).join(" "));
        errorLog(new Error("Investigate me"));
    }
    // get a new requestId
    request.requestHeader.requestHandle = __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer_makeRequestId).call(this);
    /* istanbul ignore next */
    if (utils_1.doTraceClientMessage) {
        (0, utils_1.traceClientRequestMessage)(request, this.channelId, __classPrivateFieldGet(this, _ClientSecureChannelLayer__counter, "f"));
    }
    const requestData = {
        callback: transactionData.callback,
        msgType: msgType,
        request: request,
        bytesRead: 0,
        bytesWritten_after: 0,
        bytesWritten_before: this.bytesWritten,
        beforeSendTick: 0,
        afterSendTick: 0,
        startReceivingTick: 0,
        endReceivingTick: 0,
        afterProcessingTick: 0,
        key: "",
        chunk_count: 0
    };
    __classPrivateFieldGet(this, _ClientSecureChannelLayer__requests, "f")[request.requestHeader.requestHandle] = requestData;
    /* istanbul ignore next */
    if (utils_1.doPerfMonitoring) {
        const stats = requestData;
        // record tick0 : before request is being sent to server
        stats.beforeSendTick = (0, node_opcua_utils_1.get_clock_tick)();
    }
    // check that limits are OK
    __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__sendSecureOpcUARequest).call(this, msgType, request);
}, _ClientSecureChannelLayer__send_chunk = function _ClientSecureChannelLayer__send_chunk(requestId, chunk) {
    const requestData = __classPrivateFieldGet(this, _ClientSecureChannelLayer__requests, "f")[requestId];
    if (chunk) {
        this.emit("send_chunk", chunk);
        /* istanbul ignore next */
        if (checkChunks) {
            (0, node_opcua_chunkmanager_1.verify_message_chunk)(chunk);
            debugLog(chalk_1.default.yellow("CLIENT SEND chunk "));
            debugLog(chalk_1.default.yellow((0, message_header_to_string_1.messageHeaderToString)(chunk)));
            debugLog(chalk_1.default.red((0, node_opcua_debug_1.hexDump)(chunk)));
        }
        (0, node_opcua_assert_1.assert)(__classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f"));
        __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f")?.write(chunk);
        requestData.chunk_count += 1;
    }
    else {
        // last chunk ....
        /* istanbul ignore next */
        if (checkChunks) {
            debugLog(chalk_1.default.yellow("CLIENT SEND done."));
        }
        if (requestData) {
            if (utils_1.doPerfMonitoring) {
                requestData.afterSendTick = (0, node_opcua_utils_1.get_clock_tick)();
            }
            requestData.bytesWritten_after = this.bytesWritten;
            if (requestData.msgType === "CLO") {
                setTimeout(() => {
                    // We sdo not expect any response from the server for a CLO message
                    if (requestData.callback) {
                        // if server do not initiates the disconnection, we may need to call the callback
                        // from here
                        requestData.callback(null, undefined);
                        requestData.callback = undefined;
                    }
                }, 100);
            }
        }
    }
}, _ClientSecureChannelLayer__construct_asymmetric_security_header = function _ClientSecureChannelLayer__construct_asymmetric_security_header() {
    const calculateMaxSenderCertificateSize = () => {
        /**
         * The SenderCertificate, including any chains, shall be small enough to fit
         * into a single MessageChunk and leave room for at least one byte of body
         * information.The maximum size for the SenderCertificate can be calculated
         * with this formula:
         */
        const cryptoFactory = (0, security_policy_1.getCryptoFactory)(this.securityPolicy);
        if (!cryptoFactory) {
            // we have a unknown security policy
            // let's assume that maxSenderCertificateSize is not an issue
            return 1 * 8192;
        }
        const { signatureLength, blockPaddingSize } = cryptoFactory;
        const securityPolicyUriLength = this.securityPolicy.length;
        const messageChunkSize = __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f")?.parameters?.sendBufferSize || 0;
        const padding = blockPaddingSize;
        const extraPadding = 0; // ???
        const asymmetricSignatureSize = signatureLength;
        const maxSenderCertificateSize = messageChunkSize -
            12 - // Header size
            4 - // SecurityPolicyUriLength
            securityPolicyUriLength - // UTF-8 encoded string
            4 - // SenderCertificateLength
            4 - // ReceiverCertificateThumbprintLength
            20 - // ReceiverCertificateThumbprint
            8 - // SequenceHeader size
            1 - // Minimum body size
            1 - // PaddingSize if present
            padding - // Padding if present
            extraPadding - // ExtraPadding if present
            asymmetricSignatureSize; // If present
        return maxSenderCertificateSize;
    };
    switch (this.securityMode) {
        case node_opcua_service_secure_channel_1.MessageSecurityMode.None:
            {
                return new services_1.AsymmetricAlgorithmSecurityHeader({
                    securityPolicyUri: (0, security_policy_1.toURI)(this.securityPolicy),
                    receiverCertificateThumbprint: null,
                    senderCertificate: null
                });
            }
            break;
        case node_opcua_service_secure_channel_1.MessageSecurityMode.Sign:
        case node_opcua_service_secure_channel_1.MessageSecurityMode.SignAndEncrypt: {
            // get a partial portion of the client certificate chain that matches the maxSenderCertificateSize
            const maxSenderCertificateSize = calculateMaxSenderCertificateSize();
            const partialCertificateChain = (0, node_opcua_common_1.getPartialCertificateChain)(this.getCertificateChain(), maxSenderCertificateSize);
            // get the thumbprint of the  receiverCertificate certificate
            const evaluateReceiverThumbprint = () => {
                if (this.securityMode === node_opcua_service_secure_channel_1.MessageSecurityMode.None) {
                    return null;
                }
                const chain = (0, web_1.split_der)(__classPrivateFieldGet(this, _ClientSecureChannelLayer_serverCertificate, "f"));
                (0, node_opcua_assert_1.assert)(chain.length === 1);
                const receiverCertificateThumbprint = (0, common_1.getThumbprint)(__classPrivateFieldGet(this, _ClientSecureChannelLayer_serverCertificate, "f"));
                doDebug && debugLog("XXXXXXserver certificate thumbprint = ", receiverCertificateThumbprint.toString("hex"));
                return receiverCertificateThumbprint;
            };
            const receiverCertificateThumbprint = evaluateReceiverThumbprint();
            if (this.securityPolicy === security_policy_1.SecurityPolicy.Invalid) {
                warningLog("SecurityPolicy is invalid", this.securityPolicy.toString());
            }
            const securityHeader = new services_1.AsymmetricAlgorithmSecurityHeader({
                securityPolicyUri: (0, security_policy_1.toURI)(this.securityPolicy),
                /**
                 * The thumbprint of the X.509 v3 Certificate assigned to the receiving application Instance.
                 * The thumbprint is the CertificateDigest of the DER encoded form of the Certificate.
                 * This indicates what public key was used to encrypt the MessageChunk.
                 * This field shall be null if the Message is not encrypted.
                 */
                receiverCertificateThumbprint,
                /**
                 * The X.509 v3 Certificate assigned to the sending application Instance.
                 * This is a DER encoded blob.
                 * The structure of an X.509 v3 Certificate is defined in X.509 v3.
                 * The DER format for a Certificate is defined in X690
                 * This indicates what Private Key was used to sign the MessageChunk.
                 * The Stack shall close the channel and report an error to the application
                 * if the SenderCertificate is too large for the buffer size supported by the transport layer.
                 * This field shall be null if the Message is not signed.
                 * If the Certificate is signed by a CA, the DER encoded CA Certificate may be
                 * appended after the Certificate in the byte array. If the CA Certificate is also
                 * signed by another CA this process is repeated until the entire Certificate chain
                 * is in the buffer or if MaxSenderCertificateSize limit is reached (the process
                 * stops after the last whole Certificate that can be added without exceeding
                 * the MaxSenderCertificateSize limit).
                 * Receivers can extract the Certificates from the byte array by using the Certificate
                 * size contained in DER header (see X.509 v3).
                 */
                senderCertificate: partialCertificateChain // certificate of the private key used to sign the message
            });
            /* istanbul ignore next */
            if (utils_1.dumpSecurityHeader) {
                warningLog("HEADER !!!! ", securityHeader.toString());
            }
            return securityHeader;
            break;
        }
        default:
            /* istanbul ignore next */
            throw new Error("invalid security mode");
    }
}, _ClientSecureChannelLayer__get_security_options_for_OPN = function _ClientSecureChannelLayer__get_security_options_for_OPN() {
    // The OpenSecureChannel Messages are signed and encrypted if the SecurityMode is
    // not None(even  if the SecurityMode is Sign).
    if (this.securityMode === node_opcua_service_secure_channel_1.MessageSecurityMode.None) {
        return null;
    }
    const senderPrivateKey = this.getPrivateKey();
    /* istanbul ignore next */
    if (!senderPrivateKey) {
        throw new Error("invalid or missing senderPrivateKey : necessary to sign");
    }
    const cryptoFactory = (0, security_policy_1.getCryptoFactory)(this.securityPolicy);
    /* istanbul ignore next */
    if (!cryptoFactory) {
        throw new Error("Internal Error: ServerSecureChannelLayer must have a crypto strategy");
    }
    /* istanbul ignore next */
    if (!__classPrivateFieldGet(this, _ClientSecureChannelLayer_receiverPublicKey, "f")) {
        throw new Error("Internal error: invalid receiverPublicKey");
    }
    const receiverPublicKey = __classPrivateFieldGet(this, _ClientSecureChannelLayer_receiverPublicKey, "f");
    const keyLength = (0, web_1.rsaLengthPublicKey)(receiverPublicKey);
    const signatureLength = (0, web_1.rsaLengthPrivateKey)(senderPrivateKey);
    const options = {
        // for signing
        signatureLength,
        signBufferFunc: (chunk) => cryptoFactory.asymmetricSign(chunk, senderPrivateKey),
        // for encrypting
        cipherBlockSize: keyLength,
        plainBlockSize: keyLength - cryptoFactory.blockPaddingSize,
        encryptBufferFunc: (chunk) => cryptoFactory.asymmetricEncrypt(chunk, receiverPublicKey)
    };
    return options;
}, _ClientSecureChannelLayer__get_security_options_for_MSG = function _ClientSecureChannelLayer__get_security_options_for_MSG(tokenId) {
    if (this.securityMode === node_opcua_service_secure_channel_1.MessageSecurityMode.None) {
        return null;
    }
    const derivedClientKeys = __classPrivateFieldGet(this, _ClientSecureChannelLayer_tokenStack, "f").clientKeyProvider().getDerivedKey(tokenId);
    // istanbul ignore next
    if (!derivedClientKeys) {
        errorLog("derivedKeys not set but security mode = ", node_opcua_service_secure_channel_1.MessageSecurityMode[this.securityMode]);
        return null;
    }
    const options = (0, security_policy_1.getOptionsForSymmetricSignAndEncrypt)(this.securityMode, derivedClientKeys);
    return options;
}, _ClientSecureChannelLayer__get_security_options = function _ClientSecureChannelLayer__get_security_options(msgType) {
    if (msgType == "OPN") {
        const securityHeader = __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__construct_asymmetric_security_header).call(this);
        const securityOptions = __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__get_security_options_for_OPN).call(this);
        return {
            securityHeader,
            securityOptions
        };
    }
    else {
        const securityToken = this.activeSecurityToken;
        const tokenId = securityToken ? securityToken.tokenId : 0;
        const securityHeader = new node_opcua_service_secure_channel_1.SymmetricAlgorithmSecurityHeader({ tokenId });
        const securityOptions = __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__get_security_options_for_MSG).call(this, tokenId);
        return {
            securityHeader,
            securityOptions
        };
    }
}, _ClientSecureChannelLayer__sendSecureOpcUARequest = function _ClientSecureChannelLayer__sendSecureOpcUARequest(msgType, request) {
    const evaluateChunkSize = () => {
        // use chunk size that has been negotiated by the transport layer
        if (__classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f")?.parameters && __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f")?.parameters.sendBufferSize) {
            return __classPrivateFieldGet(this, _ClientSecureChannelLayer__transport, "f").parameters.sendBufferSize;
        }
        return 0;
    };
    const { securityOptions, securityHeader } = __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__get_security_options).call(this, msgType);
    const requestId = request.requestHeader.requestHandle;
    const chunkSize = evaluateChunkSize();
    let options = {
        channelId: this.channelId,
        securityOptions: {
            channelId: this.channelId,
            requestId,
            chunkSize,
            cipherBlockSize: 0,
            plainBlockSize: 0,
            sequenceHeaderSize: 0,
            signatureLength: 0,
            ...securityOptions
        },
        securityHeader: securityHeader
    };
    /* istanbul ignore next */
    if (utils_1.doTraceClientRequestContent) {
        (0, utils_1.traceClientRequestContent)(request, this.channelId, this.activeSecurityToken);
    }
    this.emit("send_request", request, msgType, securityHeader);
    const statusCode = __classPrivateFieldGet(this, _ClientSecureChannelLayer_messageChunker, "f").chunkSecureMessage(msgType, options, request, (chunk) => __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__send_chunk).call(this, requestId, chunk));
    if (statusCode.isNotGood()) {
        // chunkSecureMessage has refused to send the message
        const response = new services_1.ServiceFault({
            responseHeader: {
                requestHandle: requestId,
                serviceResult: statusCode,
                stringTable: [statusCode.toString()]
            }
        });
        __classPrivateFieldGet(this, _ClientSecureChannelLayer_instances, "m", _ClientSecureChannelLayer__on_message_received).call(this, response, "ERR", securityHeader, request.requestHeader.requestHandle);
    }
};
ClientSecureChannelLayer.g_counter = 0;
ClientSecureChannelLayer.minTransactionTimeout = 5 * 1000; // 5 sec
ClientSecureChannelLayer.defaultTransactionTimeout = 15 * 1000; // 15 seconds
ClientSecureChannelLayer.defaultTransportTimeout = 60 * 1000; // 60 seconds
/**
 *
 * maxClockSkew: The amount of clock skew that can be tolerated between server and client clocks
 *
 * from https://reference.opcfoundation.org/Core/Part6/v104/docs/6.3
 *
 *  The amount of clock skew that can be tolerated depends on the system security requirements
 *  and applications shall allow administrators to configure the acceptable clock skew when
 *  verifying times. A suitable default value is 5 minutes.
 */
ClientSecureChannelLayer.maxClockSkew = 5 * 60 * 1000; // 5 minutes
//# sourceMappingURL=client_secure_channel_layer.js.map