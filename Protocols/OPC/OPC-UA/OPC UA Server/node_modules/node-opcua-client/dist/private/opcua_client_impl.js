"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _OPCUAClientImpl_instances, _OPCUAClientImpl_createSession_step3;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPCUAClientImpl = void 0;
/**
 * @module node-opcua-client-private
 */
const util_1 = require("util");
const crypto_1 = require("crypto");
const chalk_1 = __importDefault(require("chalk"));
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_buffer_utils_1 = require("node-opcua-buffer-utils");
const web_1 = require("node-opcua-crypto/web");
const node_opcua_data_model_1 = require("node-opcua-data-model");
const node_opcua_debug_1 = require("node-opcua-debug");
const node_opcua_hostname_1 = require("node-opcua-hostname");
const node_opcua_secure_channel_1 = require("node-opcua-secure-channel");
const node_opcua_service_endpoints_1 = require("node-opcua-service-endpoints");
const node_opcua_service_secure_channel_1 = require("node-opcua-service-secure-channel");
const node_opcua_service_session_1 = require("node-opcua-service-session");
const node_opcua_status_code_1 = require("node-opcua-status-code");
const node_opcua_utils_1 = require("node-opcua-utils");
const node_opcua_pseudo_session_1 = require("node-opcua-pseudo-session");
const opcua_client_1 = require("../opcua_client");
const reconnection_1 = require("./reconnection/reconnection");
const client_base_impl_1 = require("./client_base_impl");
const client_session_impl_1 = require("./client_session_impl");
const node_opcua_client_dynamic_extension_object_1 = require("node-opcua-client-dynamic-extension-object");
const doDebug = (0, node_opcua_debug_1.checkDebugFlag)(__filename);
const debugLog = (0, node_opcua_debug_1.make_debugLog)(__filename);
const errorLog = (0, node_opcua_debug_1.make_errorLog)(__filename);
const warningLog = (0, node_opcua_debug_1.make_warningLog)(__filename);
function validateServerNonce(serverNonce) {
    return !(serverNonce && serverNonce.length < 32) || (serverNonce && serverNonce.length === 0);
}
function verifyEndpointDescriptionMatches(client, responseServerEndpoints) {
    // The Server returns its EndpointDescriptions in the response. Clients use this information to
    // determine whether the list of EndpointDescriptions returned from the Discovery Endpoint matches
    // the Endpoints that the Server has. If there is a difference then the Client shall close the
    // Session and report an error.
    // The Server returns all EndpointDescriptions for the serverUri
    // specified by the Client in the request. The Client only verifies EndpointDescriptions with a
    // transportProfileUri that matches the profileUri specified in the original GetEndpoints request.
    // A Client may skip this check if the EndpointDescriptions were provided by a trusted source
    // such as the Administrator.
    // serverEndpoints:
    // The Client shall verify this list with the list from a Discovery Endpoint if it used a Discovery Endpoint
    // fetch to the EndpointDescriptions.
    // ToDo
    return true;
}
const hasDeprecatedSecurityPolicy = (userIdentity) => {
    return (userIdentity.securityPolicyUri === node_opcua_secure_channel_1.SecurityPolicy.Basic128Rsa15 ||
        userIdentity.securityPolicyUri === node_opcua_secure_channel_1.SecurityPolicy.Basic128);
};
const ordered = [
    // obsolete
    node_opcua_secure_channel_1.SecurityPolicy.Basic128Rsa15,
    node_opcua_secure_channel_1.SecurityPolicy.Basic192Rsa15,
    node_opcua_secure_channel_1.SecurityPolicy.Basic256,
    node_opcua_secure_channel_1.SecurityPolicy.None,
    node_opcua_secure_channel_1.SecurityPolicy.Basic128,
    node_opcua_secure_channel_1.SecurityPolicy.Basic192,
    node_opcua_secure_channel_1.SecurityPolicy.Basic256Rsa15,
    node_opcua_secure_channel_1.SecurityPolicy.Basic256Sha256,
    node_opcua_secure_channel_1.SecurityPolicy.Aes128_Sha256_RsaOaep,
    node_opcua_secure_channel_1.SecurityPolicy.Aes256_Sha256_RsaPss
];
const _compareSecurityPolicy = (a, b) => {
    if (a === b) {
        return 0;
    }
    if (!a && b)
        return 1;
    if (a && !b)
        return -1;
    const rankA = ordered.indexOf(a);
    const rankB = ordered.indexOf(b);
    return rankB - rankA;
};
const compareSecurityPolicy = (a, b) => {
    return _compareSecurityPolicy(a.securityPolicyUri, b.securityPolicyUri);
};
function findUserTokenPolicy(endpointDescription, userTokenType) {
    endpointDescription.userIdentityTokens = endpointDescription.userIdentityTokens || [];
    let r = endpointDescription.userIdentityTokens.filter((userIdentity) => userIdentity.tokenType === userTokenType);
    if (r.length === 0) {
        return null;
    }
    if (r.length > 1) {
        // avoid  Basic128Rsa15 & Basic128 encryption algorithm
        // note: some servers (S7) sometime provides multiple policyId with various encryption algorithm
        //       when the connection is Encrypted.
        //       even though there is no need to further encrypt a password.
        //       Further more, Basic128Rsa15 & Basic128 encryption algorithm are flawed and not working any more
        //       with nodejs 21.11.1 onwards
        r = r.filter((userIdentity) => !hasDeprecatedSecurityPolicy(userIdentity));
    }
    if (r.length > 1) {
        if (endpointDescription.securityMode === node_opcua_service_secure_channel_1.MessageSecurityMode.SignAndEncrypt) {
            // no encryption will do if available
            const unencrypted = r.find((userIdentity) => userIdentity.securityPolicyUri === node_opcua_secure_channel_1.SecurityPolicy.None || !userIdentity.securityPolicyUri);
            if (unencrypted)
                return unencrypted;
        }
        // if not then use the strongest encryption,
        r = r.sort(compareSecurityPolicy);
    }
    return r.length === 0 ? null : r[0];
}
function createAnonymousIdentityToken(context) {
    const endpoint = context.endpoint;
    const userTokenPolicy = findUserTokenPolicy(endpoint, node_opcua_service_endpoints_1.UserTokenType.Anonymous);
    if (!userTokenPolicy) {
        throw new Error("Cannot find ANONYMOUS user token policy in end point description");
    }
    return new node_opcua_service_session_1.AnonymousIdentityToken({ policyId: userTokenPolicy.policyId });
}
/**
 *
 * @param context
 * @param certificate - the user certificate
 * @param privateKey  - the private key associated with the user certificate
 */
function createX509IdentityToken(context, certificate, privateKey) {
    const endpoint = context.endpoint;
    (0, node_opcua_assert_1.assert)(endpoint instanceof node_opcua_service_endpoints_1.EndpointDescription);
    const userTokenPolicy = findUserTokenPolicy(endpoint, node_opcua_service_endpoints_1.UserTokenType.Certificate);
    // istanbul ignore next
    if (!userTokenPolicy) {
        throw new Error("Cannot find Certificate (X509) user token policy in end point description");
    }
    let securityPolicy = (0, node_opcua_secure_channel_1.fromURI)(userTokenPolicy.securityPolicyUri);
    // if the security policy is not specified we use the session security policy
    if (securityPolicy === node_opcua_secure_channel_1.SecurityPolicy.Invalid) {
        securityPolicy = context.securityPolicy;
    }
    const userIdentityToken = new node_opcua_service_session_1.X509IdentityToken({
        certificateData: certificate,
        policyId: userTokenPolicy.policyId
    });
    const serverCertificate = context.serverCertificate;
    (0, node_opcua_assert_1.assert)(serverCertificate instanceof Buffer);
    const serverNonce = context.serverNonce || Buffer.alloc(0);
    (0, node_opcua_assert_1.assert)(serverNonce instanceof Buffer);
    // see Release 1.02 155 OPC Unified Architecture, Part 4
    const cryptoFactory = (0, node_opcua_secure_channel_1.getCryptoFactory)(securityPolicy);
    // istanbul ignore next
    if (!cryptoFactory) {
        throw new Error(" Unsupported security Policy");
    }
    /**
     * OPCUA Spec 1.04 - part 4
     * page 28:
     * 5.6.3.1
     * ...
     * If the token is an X509IdentityToken then the proof is a signature generated with private key
     * associated with the Certificate. The data to sign is created by appending the last serverNonce to
     * the **serverCertificate** specified in the CreateSession response. If a token includes a secret then it
     * should be encrypted using the public key from the serverCertificate.
     *
     * page 155:
     * Token Encryption and Proof of Possession
     * 7.36.2.1 Overview
     * The Client shall always prove possession of a UserIdentityToken when it passes it to the Server.
     * Some tokens include a secret such as a password which the Server will accept as proof. In order
     * to protect these secrets the Token may be encrypted before it is passed to the Server. Other types
     * of tokens allow the Client to create a signature with the secret associated with the Token. In these
     * cases, the Client proves possession of a UserIdentityToken by creating a signature with the secret
     * and passing it to the Server
     *
     * page 159:
     * 7.36.5 X509IdentityTokens
     * The X509IdentityToken is used to pass an X.509 v3 Certificate which is issued by the user.
     * This token shall always be accompanied by a Signature in the userTokenSignature parameter of
     * ActivateSession if required by the SecurityPolicy. The Server should specify a SecurityPolicy for
     * the UserTokenPolicy if the SecureChannel has a SecurityPolicy of None.
     */
    // now create the proof of possession, by creating a signature
    // The data to sign is created by appending the last serverNonce to the serverCertificate
    // The signature generated with private key associated with the User Certificate
    const userTokenSignature = (0, node_opcua_secure_channel_1.computeSignature)(serverCertificate, serverNonce, privateKey, securityPolicy);
    return { userIdentityToken, userTokenSignature };
}
function createUserNameIdentityToken(session, userName, password) {
    // assert(endpoint instanceof EndpointDescription);
    (0, node_opcua_assert_1.assert)(userName === null || typeof userName === "string");
    (0, node_opcua_assert_1.assert)(password === null || typeof password === "string");
    const endpoint = session.endpoint;
    (0, node_opcua_assert_1.assert)(endpoint instanceof node_opcua_service_endpoints_1.EndpointDescription);
    /**
     * OPC Unified Architecture 1.0.4:  Part 4 155
     * Each UserIdentityToken allowed by an Endpoint shall have a UserTokenPolicy specified in the
     * EndpointDescription. The UserTokenPolicy specifies what SecurityPolicy to use when encrypting
     * or signing. If this SecurityPolicy is omitted then the Client uses the SecurityPolicy in the
     * EndpointDescription. If the matching SecurityPolicy is set to None then no encryption or signature
     * is required.
     *
     */
    const userTokenPolicy = findUserTokenPolicy(endpoint, node_opcua_service_endpoints_1.UserTokenType.UserName);
    // istanbul ignore next
    if (!userTokenPolicy) {
        throw new Error("Cannot find USERNAME user token policy in end point description");
    }
    let securityPolicy = (0, node_opcua_secure_channel_1.fromURI)(userTokenPolicy.securityPolicyUri);
    // if the security policy is not specified we use the session security policy
    if (securityPolicy === node_opcua_secure_channel_1.SecurityPolicy.Invalid) {
        securityPolicy = session.securityPolicy;
    }
    let identityToken;
    let serverCertificate = session.serverCertificate;
    // if server does not provide certificate use unencrypted password
    if (!serverCertificate || serverCertificate.length === 0) {
        identityToken = new node_opcua_service_session_1.UserNameIdentityToken({
            encryptionAlgorithm: null,
            password: Buffer.from(password, "utf-8"),
            policyId: userTokenPolicy ? userTokenPolicy.policyId : null,
            userName
        });
        return identityToken;
    }
    (0, node_opcua_assert_1.assert)(serverCertificate instanceof Buffer);
    serverCertificate = (0, web_1.toPem)(serverCertificate, "CERTIFICATE");
    const publicKey = (0, crypto_1.createPublicKey)((0, web_1.extractPublicKeyFromCertificateSync)(serverCertificate));
    const serverNonce = session.serverNonce || Buffer.alloc(0);
    (0, node_opcua_assert_1.assert)(serverNonce instanceof Buffer);
    // If None is specified for the UserTokenPolicy and SecurityPolicy is None
    // then the password only contains the UTF-8 encoded password.
    // note: this means that password is sent in clear text to the server
    // note: OPCUA specification discourages use of unencrypted password
    //       but some old OPCUA server may only provide this policy and we
    //       still have to support in the client?
    if (securityPolicy === node_opcua_secure_channel_1.SecurityPolicy.None) {
        identityToken = new node_opcua_service_session_1.UserNameIdentityToken({
            encryptionAlgorithm: null,
            password: Buffer.from(password, "utf-8"),
            policyId: userTokenPolicy.policyId,
            userName
        });
        return identityToken;
    }
    // see Release 1.02 155 OPC Unified Architecture, Part 4
    const cryptoFactory = (0, node_opcua_secure_channel_1.getCryptoFactory)(securityPolicy);
    // istanbul ignore next
    if (!cryptoFactory) {
        throw new Error(" Unsupported security Policy " + securityPolicy.toString());
    }
    identityToken = new node_opcua_service_session_1.UserNameIdentityToken({
        encryptionAlgorithm: cryptoFactory.asymmetricEncryptionAlgorithm,
        password: Buffer.from(password, "utf-8"),
        policyId: userTokenPolicy.policyId,
        userName
    });
    // now encrypt password as requested
    const lenBuf = (0, node_opcua_buffer_utils_1.createFastUninitializedBuffer)(4);
    lenBuf.writeUInt32LE(identityToken.password.length + serverNonce.length, 0);
    const block = Buffer.concat([lenBuf, identityToken.password, serverNonce]);
    identityToken.password = cryptoFactory.asymmetricEncrypt(block, publicKey);
    return identityToken;
}
function _adjustRevisedSessionTimeout(revisedSessionTimeout, requestedTimeout) {
    // Some old OPCUA Servers are known to report an invalid revisedSessionTimeout
    // such as Siemens SimoCode Pro V.
    // we need to adjust the value here, by guessing a sensible sessionTimeout value to use instead.
    if (revisedSessionTimeout < 1e-10) {
        warningLog(`the revisedSessionTimeout ${revisedSessionTimeout} reported by the server is inconsistent and has been adjusted back to requestedTimeout ${requestedTimeout}`);
        return requestedTimeout;
    }
    if (revisedSessionTimeout < OPCUAClientImpl.minimumRevisedSessionTimeout) {
        warningLog(`the revisedSessionTimeout ${revisedSessionTimeout} is smaller than the minimum timeout (OPCUAClientImpl.minimumRevisedSessionTimeout = ${OPCUAClientImpl.minimumRevisedSessionTimeout}) and has been clamped to this value`);
        return OPCUAClientImpl.minimumRevisedSessionTimeout;
    }
    return revisedSessionTimeout;
}
class OPCUAClientImpl extends client_base_impl_1.ClientBaseImpl {
    static create(options) {
        return new OPCUAClientImpl(options);
    }
    constructor(options) {
        options = options || {};
        super(options);
        _OPCUAClientImpl_instances.add(this);
        this.dataTypeExtractStrategy = options.dataTypeExtractStrategy || node_opcua_client_dynamic_extension_object_1.DataTypeExtractStrategy.Auto;
        // @property endpointMustExist {Boolean}
        // if set to true , create Session will only accept connection from server which endpoint_url has been reported
        // by GetEndpointsRequest.
        // By default, the client is strict.
        if (Object.prototype.hasOwnProperty.call(options, "endpoint_must_exist")) {
            if (Object.prototype.hasOwnProperty.call(options, "endpointMustExist")) {
                throw new Error("endpoint_must_exist is deprecated! you must now use endpointMustExist instead of endpoint_must_exist ");
            }
            warningLog("Warning: endpoint_must_exist is now deprecated, use endpointMustExist instead");
            options.endpointMustExist = options.endpoint_must_exist;
        }
        this.endpointMustExist = (0, node_opcua_utils_1.isNullOrUndefined)(options.endpointMustExist) ? true : !!options.endpointMustExist;
        this.requestedSessionTimeout = options.requestedSessionTimeout || 60000; // 1 minute
        this.___sessionName_counter = 0;
        this.endpoint = undefined;
    }
    /**
     * @internal
     * @param args
     *
     */
    createSession(...args) {
        if (args.length === 1) {
            return this.createSession({ type: node_opcua_service_endpoints_1.UserTokenType.Anonymous }, args[0]);
        }
        const userIdentityInfo = args[0] || { type: node_opcua_service_endpoints_1.UserTokenType.Anonymous };
        const callback = args[1];
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        this._createSession((err, session) => {
            if (err) {
                callback(err);
            }
            else {
                /* istanbul ignore next */
                if (!session) {
                    return callback(new Error("Internal Error"));
                }
                this._addSession(session);
                this._activateSession(session, userIdentityInfo, (err1, session2) => {
                    if (err1) {
                        session.close(true).then(() => {
                            callback(err1, null);
                        }).catch((err2) => {
                            err2;
                            callback(err1, null);
                        });
                    }
                    else {
                        callback(null, session2);
                    }
                });
            }
        });
    }
    createSession2(...args) {
        if (args.length === 1) {
            return this.createSession2({ type: node_opcua_service_endpoints_1.UserTokenType.Anonymous }, args[0]);
        }
        const userIdentityInfo = args[0];
        const callback = args[1];
        if (!this._secureChannel) {
            // we do not have a connection anymore
            return callback(new Error("Connection is closed"));
        }
        if (this._internalState === "disconnected" || this._internalState === "disconnecting") {
            return callback(new Error(`disconnecting`));
        }
        return this.createSession(args[0], (err, session) => {
            if (err && err.message.match(/BadTooManySessions/)) {
                const delayToRetry = 5; // seconds
                errorLog(`TooManySession .... we need to retry later  ... in  ${delayToRetry} secondes ${this._internalState}`);
                this._retryCreateSessionTimer = setTimeout(() => {
                    errorLog(`TooManySession .... now retrying (${this._internalState})`);
                    this.createSession2(userIdentityInfo, callback);
                }, delayToRetry * 1000);
                return;
            }
            callback(err, session);
        });
    }
    changeSessionIdentity(...args) {
        warningLog("[NODE-OPCUA-W34] OPCUAClient.changeSessionIdentity(session,userIdentity) is deprecated use ClientSession.changeUser(userIdentity) instead");
        const session = args[0];
        const userIdentityInfo = args[1];
        const callback = args[2];
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        session.changeUser(userIdentityInfo, callback);
    }
    /**
     * @internal
     */
    closeSession(...args) {
        if (this._retryCreateSessionTimer) {
            clearTimeout(this._retryCreateSessionTimer);
            this._retryCreateSessionTimer = undefined;
        }
        super.closeSession(...args);
    }
    toString() {
        let str = client_base_impl_1.ClientBaseImpl.prototype.toString.call(this);
        str += "  requestedSessionTimeout....... " + this.requestedSessionTimeout + "\n";
        str += "  endpointUrl................... " + this.endpointUrl + "\n";
        str += "  serverUri..................... " + this.serverUri + "\n";
        return str;
    }
    /**
     *
     * @example
     *
     * ```javascript
     *
     * const session = await OPCUAClient.createSession(endpointUrl);
     * const dataValue = await session.read({ nodeId, attributeId: AttributeIds.Value });
     * await session.close();
     *
     * ```
     * @stability experimental
     *
     * @param endpointUrl
     * @param userIdentity
     * @returns session
     *
     *
     * const create
     */
    static async createSession(endpointUrl, userIdentity, clientOptions) {
        const client = opcua_client_1.OPCUAClient.create(clientOptions || {});
        await client.connect(endpointUrl);
        const session = await client.createSession2(userIdentity);
        const oldClose = session.close;
        session.close = (0, thenify_ex_1.withCallback)((...args) => {
            if (args.length === 1) {
                return session.close(true, args[0]);
            }
            const deleteSubscriptions = args[0];
            const callback = args[1];
            session.close = oldClose;
            oldClose.call(session, deleteSubscriptions, (err) => {
                client.disconnect((err) => {
                    callback(err);
                });
            });
        });
        return session;
    }
    /**
     *
     * @param connectionPoint
     * @param func
     * @returns
     */
    async withSessionAsync(connectionPoint, func) {
        (0, node_opcua_assert_1.assert)(typeof func === "function");
        (0, node_opcua_assert_1.assert)(func.length === 1, "expecting a single argument in func");
        const endpointUrl = typeof connectionPoint === "string" ? connectionPoint : connectionPoint.endpointUrl;
        const userIdentity = typeof connectionPoint === "string" ? { type: node_opcua_service_endpoints_1.UserTokenType.Anonymous } : connectionPoint.userIdentity;
        this.on("backoff", (count, delay) => {
            warningLog("cannot connect to ", endpointUrl, "attempt #" + count, " retrying in ", delay);
        });
        await this.connect(endpointUrl);
        try {
            const session = await this.createSession2(userIdentity);
            let result;
            // always need this 
            await (0, node_opcua_pseudo_session_1.readNamespaceArray)(session);
            try {
                result = await func(session);
                return result;
            }
            catch (err) {
                errorLog(err);
                throw err;
            }
            finally {
                await session.close();
            }
        }
        catch (err) {
            errorLog(err.message);
            throw err;
        }
        finally {
            await this.disconnect();
        }
    }
    async withSubscriptionAsync(connectionPoint, parameters, func) {
        return await this.withSessionAsync(connectionPoint, async (session) => {
            (0, node_opcua_assert_1.assert)(session, " session must exist");
            const client1 = this;
            if (client1.beforeSubscriptionRecreate) {
                await client1.beforeSubscriptionRecreate(session);
            }
            const subscription = await session.createSubscription2(parameters);
            try {
                const result = await func(session, subscription);
                return result;
            }
            catch (err) {
                errorLog("withSubscriptionAsync inner function failed ", err.message);
                throw err;
            }
            finally {
                await subscription.terminate();
            }
        });
    }
    reactivateSession(session, callback) {
        const internalSession = session;
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        if (!this._secureChannel) {
            return callback(new Error(" client must be connected first"));
        }
        // istanbul ignore next
        if (!this.__resolveEndPoint() || !this.endpoint) {
            return callback(new Error(" End point must exist " +
                this._secureChannel.endpointUrl +
                "  securityMode = " +
                node_opcua_service_secure_channel_1.MessageSecurityMode[this.securityMode] +
                "  securityPolicy = " +
                this.securityPolicy));
        }
        (0, node_opcua_assert_1.assert)(!internalSession._client || (0, node_opcua_utils_1.matchUri)(internalSession._client.endpointUrl, this.endpointUrl), "cannot reactivateSession on a different endpoint");
        const old_client = internalSession._client;
        debugLog("OPCUAClientImpl#reactivateSession");
        this._activateSession(internalSession, internalSession.userIdentityInfo, (err /*, newSession?: ClientSessionImpl*/) => {
            if (!err) {
                if (old_client !== this) {
                    // remove session from old client:
                    if (old_client) {
                        old_client._removeSession(internalSession);
                        (0, node_opcua_assert_1.assert)(old_client._sessions.indexOf(internalSession) === -1);
                    }
                    this._addSession(internalSession);
                    (0, node_opcua_assert_1.assert)(internalSession._client === this);
                    (0, node_opcua_assert_1.assert)(!internalSession._closed, "session should not vbe closed");
                    (0, node_opcua_assert_1.assert)(this._sessions.indexOf(internalSession) !== -1);
                }
                callback();
            }
            else {
                // istanbul ignore next
                if (doDebug) {
                    debugLog(chalk_1.default.red.bgWhite("reactivateSession has failed !"), err.message);
                }
                callback(err);
            }
        });
    }
    /**
     * @internal
     * @private
     */
    _on_connection_reestablished(callback) {
        super._on_connection_reestablished(( /*err?: Error*/) => {
            (0, reconnection_1.repair_client_sessions)(this, callback);
        });
    }
    /**
     *
     * @internal
     * @private
     */
    __createSession_step2(session, callback) {
        (0, util_1.callbackify)(node_opcua_hostname_1.extractFullyQualifiedDomainName)(() => {
            __classPrivateFieldGet(this, _OPCUAClientImpl_instances, "m", _OPCUAClientImpl_createSession_step3).call(this, session, callback);
        });
    }
    /**
     * @internal
     * @private
     */
    _activateSession(session, userIdentityInfo, callback) {
        // see OPCUA Part 4 - $7.35
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        // istanbul ignore next
        if (!this._secureChannel) {
            return callback(new Error(" No secure channel"));
        }
        const serverCertificate = session.serverCertificate;
        // If the securityPolicyUri is None and none of the UserTokenPolicies requires encryption,
        // the Client shall ignore the ApplicationInstanceCertificate (serverCertificate)
        (0, node_opcua_assert_1.assert)(serverCertificate === null || serverCertificate instanceof Buffer);
        const serverNonce = session.serverNonce;
        (0, node_opcua_assert_1.assert)(!serverNonce || serverNonce instanceof Buffer);
        // make sure session is attached to this client
        const _old_client = session._client;
        session._client = this;
        const context = {
            endpoint: this.endpoint,
            securityPolicy: this._secureChannel.securityPolicy,
            serverCertificate,
            serverNonce: serverNonce // please check this !
        };
        this.createUserIdentityToken(context, userIdentityInfo, (err, data) => {
            if (err) {
                session._client = _old_client;
                return callback(err);
            }
            data = data;
            const userIdentityToken = data.userIdentityToken;
            const userTokenSignature = data.userTokenSignature;
            // TODO. fill the ActivateSessionRequest
            // see 5.6.3.2 Parameters OPC Unified Architecture, Part 4 30 Release 1.02
            const request = new node_opcua_service_session_1.ActivateSessionRequest({
                // This is a signature generated with the private key associated with the
                // clientCertificate. The SignatureAlgorithm shall be the AsymmetricSignatureAlgorithm
                // specified in the SecurityPolicy for the Endpoint. The SignatureData type is defined in 7.30.
                clientSignature: this.computeClientSignature(this._secureChannel, serverCertificate, serverNonce) || undefined,
                // These are the SoftwareCertificates which have been issued to the Client application.
                // The productUri contained in the SoftwareCertificates shall match the productUri in the
                // ApplicationDescription passed by the Client in the CreateSession requests. Certificates without
                // matching productUri should be ignored.  Servers may reject connections from Clients if they are
                // not satisfied with the SoftwareCertificates provided by the Client.
                // This parameter only needs to be specified in the first ActivateSession request
                // after CreateSession.
                // It shall always be omitted if the maxRequestMessageSize returned from the Server in the
                // CreateSession response is less than one megabyte.
                // The SignedSoftwareCertificate type is defined in 7.31.
                clientSoftwareCertificates: [],
                // List of locale ids in priority order for localized strings. The first LocaleId in the list
                // has the highest priority. If the Server returns a localized string to the Client, the Server
                // shall return the translation with the highest priority that it can. If it does not have a
                // translation for any of the locales identified in this list, then it shall return the string
                // value that it has and include the locale id with the string.
                // See Part 3 for more detail on locale ids. If the Client fails to specify at least one locale id,
                // the Server shall use any that it has.
                // This parameter only needs to be specified during the first call to ActivateSession during
                // a single application Session. If it is not specified the Server shall keep using the current
                // localeIds for the Session.
                localeIds: [],
                // The credentials of the user associated with the Client application. The Server uses these
                // credentials to determine whether the Client should be allowed to activate a Session and what
                // resources the Client has access to during this Session. The UserIdentityToken is an extensible
                // parameter type defined in 7.35.
                // The EndpointDescription specifies what UserIdentityTokens the Server shall accept.
                userIdentityToken,
                // If the Client specified a user   identity token that supports digital signatures,
                // then it shall create a signature and pass it as this parameter. Otherwise the parameter
                // is omitted.
                // The SignatureAlgorithm depends on the identity token type.
                userTokenSignature
            });
            request.requestHeader.authenticationToken = session.authenticationToken;
            session.lastRequestSentTime = new Date();
            this.performMessageTransaction(request, (err1, response) => {
                if (!err1 && response && response.responseHeader.serviceResult === node_opcua_status_code_1.StatusCodes.Good) {
                    /* istanbul ignore next */
                    if (!(response instanceof node_opcua_service_session_1.ActivateSessionResponse)) {
                        return callback(new Error("Internal Error"));
                    }
                    if (!validateServerNonce(response.serverNonce)) {
                        return callback(new Error("Invalid server Nonce"));
                    }
                    session._client = this;
                    session.serverNonce = response.serverNonce;
                    session.lastResponseReceivedTime = new Date();
                    if (this.keepSessionAlive) {
                        session.startKeepAliveManager(this.keepAliveInterval);
                    }
                    session.userIdentityInfo = userIdentityInfo;
                    return callback(null, session);
                }
                else {
                    // restore client
                    session._client = _old_client;
                    /* istanbul ignore next */
                    if (!err1 && response) {
                        err1 = new Error(response.responseHeader.serviceResult.toString());
                    }
                    session._client = _old_client;
                    return callback(err1);
                }
            });
        });
    }
    /**
     *
     * @private
     */
    _nextSessionName() {
        if (!this.___sessionName_counter) {
            this.___sessionName_counter = 0;
        }
        this.___sessionName_counter += 1;
        return this.clientName + this.___sessionName_counter;
    }
    /**
     *
     * @private
     */
    _getApplicationUri() {
        const certificate = this.getCertificate();
        let applicationUri;
        if (certificate) {
            const e = (0, web_1.exploreCertificate)(certificate);
            if (e.tbsCertificate.extensions?.subjectAltName?.uniformResourceIdentifier) {
                applicationUri = e.tbsCertificate.extensions.subjectAltName.uniformResourceIdentifier[0];
            }
            else {
                errorLog("Certificate has no extensions.subjectAltName.uniformResourceIdentifier, ");
                errorLog((0, web_1.toPem)(certificate, "CERTIFICATE"));
                applicationUri = this._getBuiltApplicationUri();
            }
        }
        else {
            applicationUri = this._getBuiltApplicationUri();
        }
        return applicationUri;
    }
    /**
     *
     * @private
     */
    __resolveEndPoint() {
        this.securityPolicy = this.securityPolicy || node_opcua_secure_channel_1.SecurityPolicy.None;
        let endpoint = this.findEndpoint(this._secureChannel.endpointUrl, this.securityMode, this.securityPolicy);
        this.endpoint = endpoint;
        // this is explained here : see OPCUA Part 4 Version 1.02 $5.4.1 page 12:
        //   A  Client  shall verify the  HostName  specified in the  Server Certificate  is the same as the  HostName
        //   contained in the  endpointUrl  provided in the  EndpointDescription. If there is a difference  then  the
        //   Client  shall report the difference and may close the  SecureChannel.
        if (!this.endpoint) {
            if (this.endpointMustExist) {
                warningLog("OPCUAClientImpl#endpointMustExist = true and endpoint with url ", this._secureChannel.endpointUrl, " cannot be found");
                const infos = this._serverEndpoints.map((endpoint) => `${endpoint.endpointUrl} ${node_opcua_service_secure_channel_1.MessageSecurityMode[endpoint.securityMode]}, ${endpoint.securityPolicyUri} `);
                warningLog("Valid endpoints are ");
                warningLog("   " + infos.join("\n   "));
                return false;
            }
            else {
                // fallback :
                // our strategy is to take the first server_end_point that match the security settings
                // ( is this really OK ?)
                // this will permit us to access a OPCUA Server using it's IP address instead of its hostname
                endpoint = this.findEndpointForSecurity(this.securityMode, this.securityPolicy);
                if (!endpoint) {
                    return false;
                }
                this.endpoint = endpoint;
            }
        }
        return true;
    }
    /**
     *
     * @private
     */
    _createSession(callback) {
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        (0, node_opcua_assert_1.assert)(this._secureChannel);
        if (!this.__resolveEndPoint() || !this.endpoint) {
            /* istanbul ignore next */
            if (this._serverEndpoints) {
                warningLog("server endpoints =", this._serverEndpoints
                    .map((endpoint) => endpoint.endpointUrl +
                    " " +
                    node_opcua_service_secure_channel_1.MessageSecurityMode[endpoint.securityMode] +
                    " " +
                    endpoint.securityPolicyUri +
                    " " +
                    endpoint.userIdentityTokens?.map((u) => node_opcua_service_endpoints_1.UserTokenType[u.tokenType]).join(","))
                    .join("\n"));
            }
            return callback(new Error(" End point must exist " +
                this._secureChannel.endpointUrl +
                "  securityMode = " +
                node_opcua_service_secure_channel_1.MessageSecurityMode[this.securityMode] +
                "  securityPolicy = " +
                this.securityPolicy));
        }
        this.serverUri = this.endpoint.server.applicationUri || "invalid application uri";
        this.endpointUrl = this._secureChannel.endpointUrl;
        const session = new client_session_impl_1.ClientSessionImpl(this);
        session.name = this._nextSessionName();
        this.__createSession_step2(session, callback);
    }
    /**
     *
     * @private
     */
    computeClientSignature(channel, serverCertificate, serverNonce) {
        return (0, node_opcua_secure_channel_1.computeSignature)(serverCertificate, serverNonce || Buffer.alloc(0), this.getPrivateKey(), channel.securityPolicy);
    }
    /**
     *
     * @private
     */
    createUserIdentityToken(context, userIdentityInfo, callback) {
        function coerceUserIdentityInfo(identityInfo) {
            if (!identityInfo) {
                return { type: node_opcua_service_endpoints_1.UserTokenType.Anonymous };
            }
            if (Object.prototype.hasOwnProperty.call(identityInfo, "type")) {
                return identityInfo;
            }
            if (Object.prototype.hasOwnProperty.call(identityInfo, "userName")) {
                identityInfo.type = node_opcua_service_endpoints_1.UserTokenType.UserName;
                return identityInfo;
            }
            if (Object.prototype.hasOwnProperty.call(identityInfo, "certificateData")) {
                identityInfo.type = node_opcua_service_endpoints_1.UserTokenType.Certificate;
                return identityInfo;
            }
            identityInfo.type = node_opcua_service_endpoints_1.UserTokenType.Anonymous;
            return identityInfo;
        }
        userIdentityInfo = coerceUserIdentityInfo(userIdentityInfo);
        (0, node_opcua_assert_1.assert)(typeof callback === "function");
        if (null === userIdentityInfo) {
            return callback(null, {
                userIdentityToken: null,
                userTokenSignature: {}
            });
        }
        let userIdentityToken;
        let userTokenSignature = {
            algorithm: undefined,
            signature: undefined
        };
        try {
            switch (userIdentityInfo.type) {
                case node_opcua_service_endpoints_1.UserTokenType.Anonymous:
                    userIdentityToken = createAnonymousIdentityToken(context);
                    break;
                case node_opcua_service_endpoints_1.UserTokenType.UserName: {
                    const userName = userIdentityInfo.userName || "";
                    const password = userIdentityInfo.password || "";
                    userIdentityToken = createUserNameIdentityToken(context, userName, password);
                    break;
                }
                case node_opcua_service_endpoints_1.UserTokenType.Certificate: {
                    const certificate = userIdentityInfo.certificateData;
                    const privateKey = (0, web_1.makePrivateKeyFromPem)(userIdentityInfo.privateKey);
                    ({ userIdentityToken, userTokenSignature } = createX509IdentityToken(context, certificate, privateKey));
                    break;
                }
                default:
                    debugLog(" userIdentityInfo = ", userIdentityInfo);
                    return callback(new Error("CLIENT: Invalid userIdentityInfo"));
            }
        }
        catch (err) {
            if (typeof err === "string") {
                return callback(new Error("Create identity token failed " + userIdentityInfo.type + " " + err));
            }
            return callback(err);
        }
        return callback(null, { userIdentityToken, userTokenSignature });
    }
}
exports.OPCUAClientImpl = OPCUAClientImpl;
_OPCUAClientImpl_instances = new WeakSet(), _OPCUAClientImpl_createSession_step3 = function _OPCUAClientImpl_createSession_step3(session, callback) {
    (0, node_opcua_assert_1.assert)(typeof callback === "function");
    (0, node_opcua_assert_1.assert)(this.serverUri !== undefined, " must have a valid server URI " + this.serverUri);
    (0, node_opcua_assert_1.assert)(this.endpointUrl !== undefined, " must have a valid server endpointUrl");
    (0, node_opcua_assert_1.assert)(this.endpoint);
    // istanbul ignore next
    if (!this._secureChannel) {
        return callback(new Error("Invalid channel"));
    }
    const applicationUri = this._getApplicationUri();
    const applicationDescription = {
        applicationName: new node_opcua_data_model_1.LocalizedText({ text: this.applicationName, locale: null }),
        applicationType: node_opcua_service_endpoints_1.ApplicationType.Client,
        applicationUri,
        discoveryProfileUri: undefined,
        discoveryUrls: [],
        gatewayServerUri: undefined,
        productUri: "NodeOPCUA-Client"
    };
    // note : do not confuse CreateSessionRequest.clientNonce with OpenSecureChannelRequest.clientNonce
    //        which are two different nonce, with different size (although they share the same name )
    this.clientNonce = (0, crypto_1.randomBytes)(32);
    // recycle session name if already exists
    const sessionName = session.name;
    const request = new node_opcua_service_session_1.CreateSessionRequest({
        clientCertificate: this.getCertificate(),
        clientDescription: applicationDescription,
        clientNonce: this.clientNonce,
        endpointUrl: this.endpointUrl,
        maxResponseMessageSize: 800000,
        requestedSessionTimeout: this.requestedSessionTimeout,
        serverUri: this.serverUri,
        sessionName
    });
    // a client Nonce must be provided if security mode is set
    (0, node_opcua_assert_1.assert)(this._secureChannel.securityMode === node_opcua_service_secure_channel_1.MessageSecurityMode.None || request.clientNonce !== null);
    this.performMessageTransaction(request, (err, response) => {
        /* istanbul ignore next */
        if (err) {
            debugLog("__createSession_step3 has failed", err.message);
            return callback(err);
            //                 // we could have an invalid state here or a connection error
            //                 errorLog("error: ", err.message, " retrying in ... 5 secondes");
            //                 setTimeout(() => {
            //                     errorLog(" .... now retrying");
            //                     this.__createSession_step3(session, callback);
            //                 }, 5 * 1000);
            //                 return;
        }
        /* istanbul ignore next */
        if (!response || !(response instanceof node_opcua_service_session_1.CreateSessionResponse)) {
            return callback(new Error("internal error"));
        }
        if (response.responseHeader.serviceResult === node_opcua_status_code_1.StatusCodes.BadTooManySessions) {
            return callback(new Error(response.responseHeader.serviceResult.toString()));
        }
        if (response.responseHeader.serviceResult !== node_opcua_status_code_1.StatusCodes.Good) {
            err = new Error("Error " + response.responseHeader.serviceResult.name + " " + response.responseHeader.serviceResult.description);
            return callback(err);
        }
        // istanbul ignore next
        if (!validateServerNonce(response.serverNonce)) {
            return callback(new Error("Invalid server Nonce"));
        }
        // todo: verify SignedSoftwareCertificates and  response.serverSignature
        session.name = request.sessionName || "";
        session.sessionId = response.sessionId;
        session.authenticationToken = response.authenticationToken;
        session.timeout = _adjustRevisedSessionTimeout(response.revisedSessionTimeout, this.requestedSessionTimeout);
        session.serverNonce = response.serverNonce;
        session.serverCertificate = response.serverCertificate;
        session.serverSignature = response.serverSignature;
        debugLog("revised session timeout = ", session.timeout, response.revisedSessionTimeout);
        response.serverEndpoints = response.serverEndpoints || [];
        if (!verifyEndpointDescriptionMatches(this, response.serverEndpoints)) {
            errorLog("Endpoint description previously retrieved with GetEndpointsDescription");
            errorLog("CreateSessionResponse.serverEndpoints= ");
            errorLog(response.serverEndpoints);
            return callback(new Error("Invalid endpoint descriptions Found"));
        }
        // this._serverEndpoints = response.serverEndpoints;
        session.serverEndpoints = response.serverEndpoints;
        callback(null, session);
    });
};
OPCUAClientImpl.minimumRevisedSessionTimeout = 100.0;
// tslint:disable:no-var-requires
// tslint:disable:max-line-length
const thenify_ex_1 = require("thenify-ex");
/**

 *
 * @example
 *     // create a anonymous session
 *     const session = await client.createSession();
 *
 * @example
 *     // create a session with a userName and password
 *     const userIdentityInfo  = {
 *          type: UserTokenType.UserName,
 *          userName: "JoeDoe",
 *          password:"secret"
 *     };
 *     const session = client.createSession(userIdentityInfo);
 *
 */
OPCUAClientImpl.prototype.createSession = (0, thenify_ex_1.withCallback)(OPCUAClientImpl.prototype.createSession);
OPCUAClientImpl.prototype.createSession2 = (0, thenify_ex_1.withCallback)(OPCUAClientImpl.prototype.createSession2);
/**
 */
OPCUAClientImpl.prototype.changeSessionIdentity = (0, thenify_ex_1.withCallback)(OPCUAClientImpl.prototype.changeSessionIdentity);
/**
 * @example
 *    const session  = await client.createSession();
 *    await client.closeSession(session);
 */
OPCUAClientImpl.prototype.closeSession = (0, thenify_ex_1.withCallback)(OPCUAClientImpl.prototype.closeSession);
OPCUAClientImpl.prototype.reactivateSession = (0, thenify_ex_1.withCallback)(OPCUAClientImpl.prototype.reactivateSession);
//# sourceMappingURL=opcua_client_impl.js.map