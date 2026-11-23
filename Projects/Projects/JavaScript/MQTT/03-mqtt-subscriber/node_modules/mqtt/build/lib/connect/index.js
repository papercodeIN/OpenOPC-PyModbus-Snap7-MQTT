"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectAsync = connectAsync;
const debug_1 = __importDefault(require("debug"));
const url_1 = __importDefault(require("url"));
const client_1 = __importDefault(require("../client"));
const is_browser_1 = __importDefault(require("../is-browser"));
if (typeof process?.nextTick !== 'function') {
    process.nextTick = setImmediate;
}
const debug = (0, debug_1.default)('mqttjs');
let protocols = null;
function getDefaultWebSocketProtocol() {
    if (typeof location !== 'undefined') {
        return location.protocol === 'https:' ? 'wss' : 'ws';
    }
    if (typeof document !== 'undefined') {
        return new URL(document.URL).protocol === 'https:' ? 'wss' : 'ws';
    }
    return 'ws';
}
function parseAuthOptions(opts) {
    let matches;
    if (opts.auth) {
        matches = opts.auth.match(/^(.+):(.+)$/);
        if (matches) {
            const [, username, password] = matches;
            opts.username = username;
            opts.password = password;
        }
        else {
            opts.username = opts.auth;
        }
    }
}
function connect(brokerUrl, opts) {
    debug('connecting to an MQTT broker...');
    if (typeof brokerUrl === 'object' && !opts) {
        opts = brokerUrl;
        brokerUrl = '';
    }
    opts = opts || {};
    if (brokerUrl && typeof brokerUrl === 'string') {
        const parsedUrl = url_1.default.parse(brokerUrl, true);
        const parsedOptions = {};
        const isRelativeWebSocketUrl = !parsedUrl.protocol &&
            !parsedUrl.hostname &&
            parsedUrl.path?.startsWith('/') &&
            (is_browser_1.default || opts.forceNativeWebSocket);
        if (parsedUrl.port != null) {
            parsedOptions.port = Number(parsedUrl.port);
        }
        parsedOptions.host = parsedUrl.hostname;
        parsedOptions.query = parsedUrl.query;
        parsedOptions.auth = parsedUrl.auth;
        parsedOptions.protocol = parsedUrl.protocol;
        parsedOptions.path = parsedUrl.path;
        opts = { ...parsedOptions, ...opts };
        if (!opts.protocol && !isRelativeWebSocketUrl) {
            throw new Error('Missing protocol');
        }
        opts.protocol = (opts.protocol || getDefaultWebSocketProtocol()).replace(/:$/, '');
    }
    opts.unixSocket = opts.unixSocket || opts.protocol?.includes('+unix');
    if (opts.unixSocket) {
        opts.protocol = opts.protocol.replace('+unix', '');
    }
    else if (!opts.protocol?.startsWith('ws') &&
        !opts.protocol?.startsWith('wx')) {
        delete opts.path;
    }
    parseAuthOptions(opts);
    if (opts.query && typeof opts.query.clientId === 'string') {
        opts.clientId = opts.query.clientId;
    }
    if (is_browser_1.default || opts.unixSocket) {
        opts.socksProxy = undefined;
    }
    else if (opts.socksProxy === undefined &&
        typeof process !== 'undefined') {
        opts.socksProxy = process.env['MQTTJS_SOCKS_PROXY'];
    }
    if (opts.cert && opts.key) {
        if (opts.protocol) {
            if (['mqtts', 'wss', 'wxs', 'alis'].indexOf(opts.protocol) === -1) {
                switch (opts.protocol) {
                    case 'mqtt':
                        opts.protocol = 'mqtts';
                        break;
                    case 'ws':
                        opts.protocol = 'wss';
                        break;
                    case 'wx':
                        opts.protocol = 'wxs';
                        break;
                    case 'ali':
                        opts.protocol = 'alis';
                        break;
                    default:
                        throw new Error(`Unknown protocol for secure connection: "${opts.protocol}"!`);
                }
            }
        }
        else {
            throw new Error('Missing secure protocol key');
        }
    }
    if (!protocols) {
        protocols = {};
        if (!is_browser_1.default && !opts.forceNativeWebSocket) {
            protocols.ws = require('./ws').streamBuilder;
            protocols.wss = require('./ws').streamBuilder;
            protocols.mqtt = require('./tcp').default;
            protocols.tcp = require('./tcp').default;
            protocols.ssl = require('./tls').default;
            protocols.tls = protocols.ssl;
            protocols.mqtts = require('./tls').default;
        }
        else {
            protocols.ws = require('./ws').browserStreamBuilder;
            protocols.wss = require('./ws').browserStreamBuilder;
            protocols.wx = require('./wx').default;
            protocols.wxs = require('./wx').default;
            protocols.ali = require('./ali').default;
            protocols.alis = require('./ali').default;
        }
    }
    if (!protocols[opts.protocol]) {
        const isSecure = ['mqtts', 'wss'].indexOf(opts.protocol) !== -1;
        opts.protocol = [
            'mqtt',
            'mqtts',
            'ws',
            'wss',
            'wx',
            'wxs',
            'ali',
            'alis',
        ].filter((key, index) => {
            if (isSecure && index % 2 === 0) {
                return false;
            }
            return typeof protocols[key] === 'function';
        })[0];
    }
    if (opts.clean === false && !opts.clientId) {
        throw new Error('Missing clientId for unclean clients');
    }
    if (opts.protocol) {
        opts.defaultProtocol = opts.protocol;
    }
    function wrapper(client) {
        if (opts.servers) {
            if (!client._reconnectCount ||
                client._reconnectCount === opts.servers.length) {
                client._reconnectCount = 0;
            }
            opts.host = opts.servers[client._reconnectCount].host;
            opts.port = opts.servers[client._reconnectCount].port;
            opts.protocol = !opts.servers[client._reconnectCount].protocol
                ? opts.defaultProtocol
                : opts.servers[client._reconnectCount].protocol;
            opts.hostname = opts.host;
            client._reconnectCount++;
        }
        debug('calling streambuilder for', opts.protocol);
        return protocols[opts.protocol](client, opts);
    }
    const client = new client_1.default(wrapper, opts);
    client.on('error', () => {
    });
    return client;
}
function connectAsync(brokerUrl, opts, allowRetries = true) {
    return new Promise((resolve, reject) => {
        const client = connect(brokerUrl, opts);
        const promiseResolutionListeners = {
            connect: (connack) => {
                removePromiseResolutionListeners();
                resolve(client);
            },
            end: () => {
                removePromiseResolutionListeners();
                resolve(client);
            },
            error: (err) => {
                removePromiseResolutionListeners();
                client.end();
                reject(err);
            },
        };
        if (allowRetries === false) {
            promiseResolutionListeners.close = () => {
                promiseResolutionListeners.error(new Error("Couldn't connect to server"));
            };
        }
        function removePromiseResolutionListeners() {
            Object.keys(promiseResolutionListeners).forEach((eventName) => {
                client.off(eventName, promiseResolutionListeners[eventName]);
            });
        }
        Object.keys(promiseResolutionListeners).forEach((eventName) => {
            client.on(eventName, promiseResolutionListeners[eventName]);
        });
    });
}
exports.default = connect;
//# sourceMappingURL=index.js.map