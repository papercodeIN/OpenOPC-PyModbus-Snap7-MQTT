/** MQTT connection and publish operations with injectable client for tests. */

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
  else bytes.forEach((_, i) => { bytes[i] = Math.floor(Math.random() * 256); });
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function buildOptions(config) {
  const options = {
    protocol: config.useTls ? 'mqtts' : 'mqtt',
    hostname: config.host,
    port: config.port,
    clientId: config.clientId || `mqtt-pub-${randomSuffix()}`,
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

export class MqttPublisher {
  constructor({ createClient, logger, onEvent, onStatus } = {}) {
    this.createClient = createClient ?? ((options) => mqtt.connect(options));
    this.logger = logger ?? { debug() {}, info() {}, warn() {}, error() {} };
    this.onEvent = onEvent ?? (() => {});
    this.onStatus = onStatus ?? (() => {});
    this.client = null;
    this.status = 'closed';
    this.lastError = null;
  }

  _setStatus(status) {
    if (this.status === status) return;
    this.status = status;
    try {
      this.onStatus(status);
    } catch {
      /* an observer must never break the client */
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
      /* observer errors must not affect publishing */
    }
  }

  connect(config) {
    if (this.client) throw new Error('Already connected — disconnect before reconnecting.');
    let options;
    try {
      options = buildOptions(config);
    } catch (error) {
      throw new Error(`TLS configuration error: ${sanitizeError(error)}`);
    }
    const client = this.createClient(options);
    this.client = client;
    this._setStatus('connecting');

    client.on('connect', () => {
      this.lastError = null;
      this._setStatus('connected');
    });
    client.on('error', (error) => {
      this.lastError = error;
      this.logger.error('mqtt client error', { error: sanitizeError(error) });
      this._event('error', sanitizeError(error));
    });
    client.on('reconnect', () => {
      this._setStatus('connecting');
      this._event('warn', 'Reconnecting to the broker');
    });
    client.on('offline', () => {
      this._setStatus('offline');
      this.logger.warn('mqtt client offline');
    });
    client.on('close', () => {
      if (this.client === client) this._setStatus('offline');
      this.logger.info('mqtt connection closed');
    });
    client.on('end', () => {
      if (this.client === client) this._setStatus('closed');
    });

    return new Promise((resolve, reject) => {
      const fail = (error) => {
        cleanup();
        // A failed handshake must leave the object reusable: drop the client so a
        // long-running service can retry instead of being stuck on "Already connected".
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

  publish(topic, payloadValue, { qos = 0, retain = false, format = 'text', timeoutMs = 0 } = {}) {
    const client = this.client;
    if (!client) return Promise.reject(new Error('Not connected to a broker.'));
    const payload = format === 'json' ? JSON.stringify(payloadValue) : String(payloadValue);
    return new Promise((resolve, reject) => {
      let settled = false;
      let timer = null;
      const finish = (error) => {
        if (settled) return;
        settled = true;
        if (timer) clearTimeout(timer);
        if (!error) resolve();
        else if (error.code === 'ETIMEDOUT') reject(error);
        else reject(new Error(`Publish failed: ${sanitizeError(error)}`));
      };
      if (timeoutMs > 0) {
        // A queued publish on a dead connection would otherwise never settle.
        timer = setTimeout(() => {
          const error = new Error(`Publish timed out after ${timeoutMs} ms.`);
          error.code = 'ETIMEDOUT';
          finish(error);
        }, timeoutMs);
        timer.unref?.();
      }
      try {
        client.publish(topic, payload, { qos, retain }, (error) => finish(error));
      } catch (error) {
        finish(error);
      }
    });
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
        // Graceful close flushes queued QoS 0 PUBLISH packets before DISCONNECT.
        client.end?.(false);
      } catch {
        finish();
      }
      setTimeout(finish, 2000).unref?.();
    });
  }
}
