"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _TokenStack_tokenStack, _TokenStack_clientKeyProvider, _TokenStack_serverKeyProvider;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenStack = void 0;
const node_opcua_assert_1 = require("node-opcua-assert");
const node_opcua_debug_1 = require("node-opcua-debug");
const chalk_1 = __importDefault(require("chalk"));
const debugLog = (0, node_opcua_debug_1.make_debugLog)("TOKEN");
const doDebug = (0, node_opcua_debug_1.checkDebugFlag)("TOKEN");
const warningLog = (0, node_opcua_debug_1.make_warningLog)("TOKEN");
function hasTokenReallyExpired(token) {
    const now = new Date();
    const age = now.getTime() - token.createdAt.getTime();
    return age > token.revisedLifetime * 1.25;
}
class TokenStack {
    constructor(channelId) {
        _TokenStack_tokenStack.set(this, []);
        _TokenStack_clientKeyProvider.set(this, void 0);
        _TokenStack_serverKeyProvider.set(this, void 0);
        this.id = 0;
        this.id = channelId;
        __classPrivateFieldSet(this, _TokenStack_clientKeyProvider, {
            getDerivedKey: (tokenId) => {
                const d = this.getTokenDerivedKeys(tokenId);
                if (!d)
                    return null;
                return d.derivedClientKeys;
            }
        }, "f");
        __classPrivateFieldSet(this, _TokenStack_serverKeyProvider, {
            getDerivedKey: (tokenId) => {
                const d = this.getTokenDerivedKeys(tokenId);
                if (!d)
                    return null;
                return d.derivedServerKeys;
            }
        }, "f");
    }
    serverKeyProvider() { return __classPrivateFieldGet(this, _TokenStack_serverKeyProvider, "f"); }
    clientKeyProvider() { return __classPrivateFieldGet(this, _TokenStack_clientKeyProvider, "f"); }
    pushNewToken(securityToken, derivedKeys) {
        this.removeOldTokens();
        // TODO: make sure this list doesn't grow indefinitely
        const _tokenStack = __classPrivateFieldGet(this, _TokenStack_tokenStack, "f");
        (0, node_opcua_assert_1.assert)(_tokenStack.length === 0 || _tokenStack[0].securityToken.tokenId !== securityToken.tokenId);
        _tokenStack.push({
            derivedKeys,
            securityToken
        });
        /* istanbul ignore next */
        if (doDebug) {
            debugLog("id=", this.id, chalk_1.default.cyan("Pushing new token with id "), securityToken.tokenId, this.tokenIds());
        }
    }
    tokenIds() {
        return __classPrivateFieldGet(this, _TokenStack_tokenStack, "f").map((a) => a.securityToken.tokenId);
    }
    getToken(tokenId) {
        const token = __classPrivateFieldGet(this, _TokenStack_tokenStack, "f").find((a) => a.securityToken.tokenId === tokenId);
        if (!token)
            return null;
        return token.securityToken;
    }
    getTokenDerivedKeys(tokenId) {
        const token = __classPrivateFieldGet(this, _TokenStack_tokenStack, "f").find((a) => a.securityToken.tokenId === tokenId);
        if (!token)
            return null;
        if (hasTokenReallyExpired(token.securityToken)) {
            return null;
        }
        return token.derivedKeys;
    }
    removeOldTokens() {
        // remove all expired tokens
        __classPrivateFieldSet(this, _TokenStack_tokenStack, __classPrivateFieldGet(this, _TokenStack_tokenStack, "f").filter((token) => !hasTokenReallyExpired(token.securityToken)), "f");
    }
}
exports.TokenStack = TokenStack;
_TokenStack_tokenStack = new WeakMap(), _TokenStack_clientKeyProvider = new WeakMap(), _TokenStack_serverKeyProvider = new WeakMap();
//# sourceMappingURL=token_stack.js.map