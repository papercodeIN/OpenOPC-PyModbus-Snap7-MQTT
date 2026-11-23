/**
 * Server-side MQTT bridge.
 *
 * Browsers cannot open a raw TCP socket, so MQTT over TCP (the normal broker port,
 * usually 1883) is handled here: this process keeps the TCP connection and streams
 * messages to the page over Server-Sent Events. No credentials are written to disk.
 */

import mqtt from 'mqtt';

export class BrokerInputError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BrokerInputError';
  }
}

export function sanitizeError(error) {
  let message = error?.message ? error.message : String(error);
  message = message.replace(/([a-z][a-z0-9+.-]*:\/\/)[^/@\s]+@/gi, '$1***@');
  return message.replace(/[\r\n]+/g, ' ').trim().slice(0, 300);
}

export function isValidTopicFilter(filter) {
  if (typeof filter !== 'string' || !filter || filter.length > 128 || /\s/.test(filter)) return false;
  const levels = filter.split('/');
  for (let index = 0; index < levels.length; index += 1) {
    const level = levels[index];
    if (level.includes('#') && (level !== '#' || index !== levels.length - 1)) return false;
    if (level.includes('+') && level !== '+') return false;
  }
  return true;
}

function integerField(value, name, min, max, fallback) {
  if (value === undefined || value === null || value === '') return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new BrokerInputError(`${name} must be an integer between ${min} and ${max}.`);
  }
  return parsed;
}

/** Normalise and validate browser input for a TCP connection. Throws BrokerInputError. */
export function normalizeBrokerInput(input = {}, defaults = {}) {
  const host = String(input.host ?? defaults.host ?? '127.0.0.1').trim();
  if (!host) throw new BrokerInputError('Broker host must not be empty.');
  if (host.length > 255 || /[\s/]/.test(host)) {
    throw new BrokerInputError('Broker host must be a hostname or IP address without spaces or slashes.');
  }

  const tls = input.tls === undefined ? Boolean(defaults.tls) : Boolean(input.tls);
  const port = integerField(input.port ?? defaults.port, 'Broker port', 1, 65535, tls ? 8883 : 1883);

  const clientId = String(input.clientId ?? '').trim().slice(0, 128);
  if (/[\x00-\x1f]/.test(clientId)) throw new BrokerInputError('Client ID must not contain control characters.');

  const username = String(input.username ?? '');
  const password = String(input.password ?? '');
  if (username.length > 256 || password.length > 256) {
    throw new BrokerInputError('Username and password must be 256 characters or fewer.');
  }

  const rawTopics = Array.isArray(input.topics) ? input.topics : defaults.topics ?? [];
  if (rawTopics.length === 0) throw new BrokerInputError('Add at least one topic filter to subscribe to.');
  if (rawTopics.length > 50) throw new BrokerInputError('A maximum of 50 topic filters is supported.');

  const seen = new Set();
  const topics = rawTopics.map((item) => {
    const filter = typeof item === 'string' ? item : String(item?.filter ?? '');
    if (!isValidTopicFilter(filter)) {
      throw new BrokerInputError(`Invalid topic filter "${filter}" — use / levels, # only at the end, + for one level.`);
    }
    if (seen.has(filter)) throw new BrokerInputError(`Duplicate topic filter "${filter}".`);
    seen.add(filter);
    return { filter, qos: integerField(item?.qos, 'QoS', 0, 2, 0) };
  });

  return {
    host,
    port,
    tls,
    username,
    password,
    clientId,
    topics,
    keepalive: integerField(input.keepalive ?? defaults.keepalive, 'Keep alive', 5, 3600, 60),
    connectTimeout: integerField(input.connectTimeout ?? defaults.connectTimeout, 'Connect timeout', 1000, 120000, 15000),
    reconnectPeriod: integerField(input.reconnectPeriod ?? defaults.reconnectPeriod, 'Reconnect period', 0, 600000, 5000),
  };
}

export class BrokerBridge {
  constructor({ logger, createClient, onEvent = () => {} } = {}) {
    this.logger = logger ?? { debug() {}, info() {}, warn() {}, error() {} };
    this.createClient = createClient ?? ((options) => mqtt.connect(options));
    this.onEvent = onEvent;
    this.client = null;
    this.info = null;
    this.state = 'disconnected';
    this.subscribed = [];
    this.received = 0;
    this.lastMessageAt = null;
    this.lastError = null;
    this.connectedAt = null;
  }

  _emit(type, payload) {
    try {
      this.onEvent(type, payload);
    } catch {
      /* an observer must never break the bridge */
    }
  }

  _status(state, detail = '') {
    if (this.state === state) {
      this._emit('status', { ...this.getState(), detail });
      return;
    }
    this.state = state;
    this._emit('status', { ...this.getState(), detail });
  }

  getState() {
    return {
      state: this.state,
      connected: this.state === 'connected',
      transport: 'tcp',
      broker: this.info ? `${this.info.tls ? 'mqtts' : 'mqtt'}://${this.info.host}:${this.info.port}` : null,
      topics: this.subscribed.map((item) => item.filter),
      received: this.received,
      lastMessageAt: this.lastMessageAt,
      connectedAt: this.connectedAt,
      lastError: this.lastError,
    };
  }

  async connect(input, defaults = {}) {
    if (this.client) throw new BrokerInputError('Already connected — disconnect before connecting again.');
    const options = normalizeBrokerInput(input, defaults);

    const clientOptions = {
      protocol: options.tls ? 'mqtts' : 'mqtt',
      hostname: options.host,
      port: options.port,
      clientId: options.clientId || `mqtt-dash-${Math.random().toString(16).slice(2, 10)}`,
      keepalive: options.keepalive,
      connectTimeout: options.connectTimeout,
      reconnectPeriod: options.reconnectPeriod,
      clean: true,
      protocolVersion: 4,
    };
    if (options.username) clientOptions.username = options.username;
    if (options.password) clientOptions.password = options.password;

    this.info = options;
    this.subscribed = options.topics;
    this._status('connecting', `${options.host}:${options.port}`);

    const client = this.createClient(clientOptions);
    this.client = client;

    client.on('message', (topic, payload, packet) => {
      this.received += 1;
      this.lastMessageAt = Date.now();
      this._emit('message', {
        topic,
        qos: packet?.qos ?? 0,
        ts: this.lastMessageAt,
        payloadBase64: Buffer.from(payload).toString('base64'),
      });
    });
    // Persistent handler: mqtt.js reconnects on its own, and every new session
    // needs the subscriptions replayed and the state reported as connected.
    client.on('connect', () => {
      this.connectedAt = Date.now();
      this.lastError = null;
      this._status('connected', `${options.host}:${options.port}`);
      this._emit('event', { level: 'success', message: `TCP connection established to ${options.host}:${options.port}` });
      this._subscribe((error) => {
        if (error) this._emit('event', { level: 'error', message: error.message });
      });
    });
    client.on('error', (error) => {
      this.lastError = sanitizeError(error);
      this.logger.error('mqtt bridge error', { error: this.lastError });
      this._emit('event', { level: 'error', message: `MQTT error: ${this.lastError}` });
    });
    client.on('reconnect', () => this._status('reconnecting', 'Attempting reconnect'));
    client.on('offline', () => this._status('offline', 'Broker unreachable'));
    client.on('close', () => {
      if (this.client === client && this.state !== 'disconnected') this._status('offline', 'Connection closed');
    });
    client.on('end', () => {
      if (this.client !== client) return;
      this.subscribed = [];
      this._status('disconnected', 'Connection ended');
    });

    return new Promise((resolve, reject) => {
      const fail = (error) => {
        cleanup();
        if (this.client === client) this.client = null;
        this.subscribed = [];
        this.lastError = sanitizeError(error);
        this._status('disconnected', this.lastError);
        try { client.end?.(true); } catch { /* ignore */ }
        reject(new Error(this.lastError));
      };
      const timer = setTimeout(() => {
        fail(new Error(`Connection timed out after ${options.connectTimeout} ms (${options.host}:${options.port}).`));
      }, options.connectTimeout);

      const onConnect = () => {
        cleanup();
        resolve(this.getState());
      };
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

  _subscribe(done = () => {}) {
    const client = this.client;
    if (!client) {
      done(new Error('Not connected to a broker.'));
      return;
    }
    const map = {};
    for (const item of this.subscribed) map[item.filter] = { qos: item.qos };
    try {
      client.subscribe(map, (error) => {
        if (error) {
          this._emit('event', { level: 'error', message: `Subscription failed: ${sanitizeError(error)}` });
          done(new Error(`Subscription failed: ${sanitizeError(error)}`));
          return;
        }
        this.logger.info('bridge subscribed', { topics: Object.keys(map) });
        this._emit('event', { level: 'success', message: `Subscribed to ${this.subscribed.length} topic filter(s)` });
        this._status('connected', 'Subscribed');
        done(null);
      });
    } catch (error) {
      done(new Error(`Subscription failed: ${sanitizeError(error)}`));
    }
  }

  async setSubscriptions(rawTopics) {
    if (!this.client) throw new BrokerInputError('Not connected to a broker.');
    const checked = normalizeBrokerInput({ ...this.info, topics: rawTopics, host: this.info.host }).topics;
    this.subscribed = checked;
    const map = {};
    for (const item of checked) map[item.filter] = { qos: item.qos };
    await new Promise((resolve, reject) => {
      this.client.subscribe(map, (error) => (error ? reject(new Error(sanitizeError(error))) : resolve()));
    });
    this._emit('event', { level: 'info', message: `Subscriptions updated (${checked.length})` });
    this._status('connected', 'Subscribed');
    return this.getState();
  }

  async disconnect() {
    const client = this.client;
    this.client = null;
    this.subscribed = [];
    if (!client) {
      this._status('disconnected', 'Not connected');
      return this.getState();
    }
    await new Promise((resolve) => {
      let done = false;
      const finish = () => { if (!done) { done = true; resolve(); } };
      client.once?.('end', finish);
      try { client.end?.(false); } catch { finish(); }
      setTimeout(finish, 2000).unref?.();
    });
    this._status('disconnected', 'Disconnected');
    this._emit('event', { level: 'info', message: 'Disconnected from broker' });
    return this.getState();
  }
}
