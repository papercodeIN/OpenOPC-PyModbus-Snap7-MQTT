/** MQTT subscribe lifecycle with reconnect handling and injectable client. */

import fs from 'node:fs';
import mqtt from 'mqtt';

export function sanitizeError(error) {
  let message = error?.message ? error.message : String(error);
  message = message.replace(/([a-z][a-z0-9+.-]*:\/\/)[^/@\s]+@/gi, '$1***@');
  return message.replace(/[\r\n]+/g, ' ').trim().slice(0, 300);
}

function randomSuffix() {
  const bytes = new Uint8Array(4);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes);
  else bytes.forEach((_, index) => { bytes[index] = Math.floor(Math.random() * 256); });
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function buildOptions(config) {
  const options = {
    protocol: config.useTls ? 'mqtts' : 'mqtt',
    hostname: config.host,
    port: config.port,
    clientId: config.clientId || `mqtt-sub-${randomSuffix()}`,
    keepalive: config.keepalive,
    connectTimeout: config.connectTimeout,
    reconnectPeriod: config.reconnectPeriod,
    clean: true,
    protocolVersion: 4,
  };
  if (config.username) options.username = config.username;
  if (config.password) options.password = config.password;
  if (config.useTls) {
    options.rejectUnauthorized = !config.tlsInsecure;
    if (config.caFile) options.ca = fs.readFileSync(config.caFile);
    if (config.certFile) options.cert = fs.readFileSync(config.certFile);
    if (config.keyFile) options.key = fs.readFileSync(config.keyFile);
  }
  return options;
}

export class MqttSubscriber {
  constructor({ createClient, logger, onEvent, onMessage, onStatus } = {}) {
    this.createClient = createClient ?? ((options) => mqtt.connect(options));
    this.logger = logger ?? { debug() {}, info() {}, warn() {}, error() {} };
    this.onEvent = onEvent ?? (() => {});
    this.onMessage = onMessage ?? (() => {});
    this.onStatus = onStatus ?? (() => {});
    this.client = null;
    this.config = null;
    this.subscribed = [];
    this.status = 'closed';
  }

  _setStatus(status) {
    if (this.status === status) return;
    this.status = status;
    try {
      this.onStatus(status);
    } catch {
      /* an observer must never break the subscription */
    }
  }

  /** True only while the broker session is actually up. */
  isConnected() {
    return this.status === 'connected' && Boolean(this.client);
  }

  _event(level, message) {
    try {
      this.onEvent(level, message);
    } catch {
      /* observer errors must not affect the subscription */
    }
  }

  connect(config) {
    if (this.client) throw new Error('Already connected — disconnect before reconnecting.');
    this.config = config;
    let options;
    try {
      options = buildOptions(config);
    } catch (error) {
      throw new Error(`TLS configuration error: ${sanitizeError(error)}`);
    }
    const client = this.createClient(options);
    this.client = client;
    this._setStatus('connecting');

    client.on('error', (error) => {
      this.logger.error('mqtt client error', { error: sanitizeError(error) });
      this._event('error', sanitizeError(error));
    });
    client.on('message', (topic, payload, packet) => {
      try {
        this.onMessage({ topic, payload, qos: packet && packet.qos ? packet.qos : 0, timestamp: Date.now() });
      } catch (error) {
        this.logger.error('message handler failed', { error: sanitizeError(error) });
      }
    });
    client.on('reconnect', () => {
      this._setStatus('connecting');
      this._event('warn', 'Connection lost — reconnecting…');
    });
    client.on('offline', () => {
      this._setStatus('offline');
      this._event('warn', 'Client offline');
    });
    client.on('close', () => {
      if (this.client === client) this._setStatus('offline');
      this._event('warn', 'Connection closed');
    });

    client.on('connect', () => {
      this._setStatus('connected');
      this._subscribe();
    });

    return new Promise((resolve, reject) => {
      const fail = (error) => {
        cleanup();
        // Keep the object reusable: a failed handshake must not leave a dead client behind.
        if (this.client === client) this.client = null;
        this._setStatus('closed');
        try { client.end?.(true); } catch { /* ignore */ }
        reject(error);
      };
      const timer = setTimeout(() => {
        fail(new Error(`Connection timed out after ${config.connectTimeout} ms (host ${config.host}:${config.port}).`));
      }, config.connectTimeout);

      const onConnect = () => { cleanup(); this._event('success', 'Connected to broker'); resolve(); };
      const onError = (error) => fail(new Error(`Connection failed: ${sanitizeError(error)}`));
      const cleanup = () => {
        clearTimeout(timer);
        client.off?.('connect', onConnect);
        client.off?.('error', onError);
      };
      client.once('connect', onConnect);
      client.once('error', onError);
    });
  }

  _subscribe() {
    const client = this.client;
    if (!client || !this.config) return;
    const topics = {};
    for (const filter of this.config.topics) topics[filter] = { qos: this.config.qos };
    try {
      client.subscribe(topics, (error) => {
        if (error) {
          this.logger.error('subscription failed', { error: sanitizeError(error) });
          this._event('error', `Subscription failed: ${sanitizeError(error)}`);
          return;
        }
        this.subscribed = [...this.config.topics];
        this.logger.info('subscribed', { topics: this.subscribed, qos: this.config.qos });
        this._event('success', `Subscribed to ${this.subscribed.length} topic filter(s)`);
      });
    } catch (error) {
      this.logger.error('subscription failed', { error: sanitizeError(error) });
      this._event('error', `Subscription failed: ${sanitizeError(error)}`);
    }
  }

  setSubscriptions(topics, qos) {
    if (!this.config) throw new Error('Not connected to a broker.');
    const next = Array.isArray(topics) ? [...topics] : [];
    const removed = this.subscribed.filter((filter) => !next.includes(filter));
    this.config = Object.freeze({ ...this.config, topics: next, qos: qos ?? this.config.qos });
    const resubscribe = () => this._subscribe();
    if (removed.length && this.client) {
      try {
        this.client.unsubscribe(removed, () => resubscribe());
        return;
      } catch {
        /* fall through to a plain resubscribe */
      }
    }
    resubscribe();
  }

  end() {
    const client = this.client;
    this.client = null;
    this._setStatus('closed');
    if (!client) return Promise.resolve();
    return new Promise((resolve) => {
      let done = false;
      const finish = () => { if (!done) { done = true; resolve(); } };
      client.once?.('end', finish);
      try {
        client.end?.(true);
      } catch {
        finish();
      }
      setTimeout(finish, 2000).unref?.();
    });
  }
}
