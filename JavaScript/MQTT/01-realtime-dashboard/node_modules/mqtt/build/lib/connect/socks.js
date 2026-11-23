"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = openSocks;
const debug_1 = __importDefault(require("debug"));
const stream_1 = require("stream");
const socks_1 = require("socks");
const dns = __importStar(require("dns"));
const util_1 = require("util");
const assert_1 = __importDefault(require("assert"));
const debug = (0, debug_1.default)('mqttjs:socks');
class ProxyStream extends stream_1.Duplex {
    _flowing = false;
    _socket;
    constructor() {
        super({ autoDestroy: false });
        this.cork();
    }
    _start(socket) {
        debug('proxy stream started');
        (0, assert_1.default)(!this._socket);
        if (this.destroyed) {
            socket.destroy(this.errored);
            return;
        }
        this._socket = socket;
        if (!this._flowing)
            socket.pause();
        socket.on('data', this._onData);
        socket.on('end', this._onEnd);
        socket.on('error', this._onError);
        socket.on('close', this._onClose);
        socket.emit('connect');
        this.uncork();
    }
    _write(chunk, encoding, callback) {
        (0, assert_1.default)(this._socket);
        this._socket.write(chunk, callback);
    }
    _read(size) {
        this._flowing = true;
        this._socket?.resume?.();
    }
    _destroy(error, callback) {
        this._socket?.destroy?.(error);
        callback(error);
    }
    _onData = (chunk) => {
        (0, assert_1.default)(this._socket);
        this._flowing = this.push(chunk);
        if (!this._flowing)
            this._socket.pause();
    };
    _onEnd = () => {
        debug('proxy stream received EOF');
        this.push(null);
    };
    _onClose = () => {
        debug('proxy stream closed');
        this.destroy();
    };
    _onError = (err) => {
        debug('proxy stream died with error %s', err);
        this.destroy(err);
    };
}
function fatal(e) {
    try {
        if (e.code === undefined)
            e.code = 'SOCKS';
        return e;
    }
    catch {
        return e;
    }
}
function typeFromProtocol(proto) {
    switch (proto) {
        case 'socks5h:':
            return [5, true];
        case 'socks4a:':
            return [4, true];
        case 'socks5:':
            return [5, false];
        case 'socks4:':
            return [4, false];
        default:
            return [undefined, false];
    }
}
function parseSocksUrl(url) {
    const parsedUrl = new URL(url);
    if (parsedUrl.pathname || parsedUrl.hash || parsedUrl.search) {
        throw fatal(new Error('bad SOCKS URL'));
    }
    const [type, resolveThroughProxy] = typeFromProtocol(parsedUrl.protocol);
    if (!type) {
        throw fatal(new Error('bad SOCKS URL: invalid protocol'));
    }
    const port = parseInt(parsedUrl.port, 10);
    if (Number.isNaN(port)) {
        throw fatal(new Error('bad SOCKS URL: invalid port'));
    }
    const proxy = {
        host: parsedUrl.hostname,
        port,
        type,
    };
    return [proxy, resolveThroughProxy];
}
async function connectSocks(destinationHost, destinationPort, socksUrl, stream, options = {}) {
    const lookup = options.lookup ?? (0, util_1.promisify)(dns.lookup);
    const [proxy, resolveThroughProxy] = parseSocksUrl(socksUrl);
    if (!resolveThroughProxy) {
        debug('resolving %s locally', destinationHost);
        destinationHost = (await lookup(destinationHost, {
            family: proxy.type === 4 ? 4 : 0,
        })).address;
    }
    debug('establishing SOCKS%d connection to %s:%d via %s:%d', proxy.type, destinationHost, destinationPort, proxy.host, proxy.port);
    const socksClient = new socks_1.SocksClient({
        command: 'connect',
        destination: {
            host: destinationHost,
            port: destinationPort,
        },
        proxy: { ...proxy },
        timeout: options.timeout,
    });
    socksClient.connect();
    socksClient.on('established', ({ socket }) => stream._start(socket));
    socksClient.on('error', (e) => {
        debug('SOCKS failed: %s', e);
        stream.destroy(fatal(e));
    });
}
function openSocks(destinationHost, destinationPort, socksUrl, options) {
    debug('SOCKS connection to %s:%d via %s', destinationHost, destinationPort, socksUrl);
    const stream = new ProxyStream();
    connectSocks(destinationHost, destinationPort, socksUrl, stream, options).catch((e) => {
        debug('SOCKS failed: %s', e);
        stream.destroy(e);
    });
    return stream;
}
//# sourceMappingURL=socks.js.map