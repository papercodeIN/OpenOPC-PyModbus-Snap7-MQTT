/**
 * Subscriber service: one MQTT/TCP subscription held by the local server,
 * with messages broadcast to every open browser tab.
 */

import { loadConfig, ConfigError } from './config.js';
import { MqttSubscriber, sanitizeError } from './subscriber.js';

export class ServiceError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ServiceError';
    this.status = status;
  }
}

const silentLogger = { debug() {}, info() {}, warn() {}, error() {} };

function overridesFrom(input = {}, { topics = false } = {}) {
  const text = (value, max) => String(value ?? '').slice(0, max);
  const env = {};
  if (input.host !== undefined) env.MQTT_HOST = text(input.host, 255).trim();
  if (input.port !== undefined) env.MQTT_PORT = String(input.port).trim();
  if (input.clientId !== undefined) env.MQTT_CLIENT_ID = text(input.clientId, 128).trim();
  if (input.username !== undefined) env.MQTT_USERNAME = text(input.username, 256);
  if (input.password !== undefined) env.MQTT_PASSWORD = text(input.password, 256);
  if (input.tls !== undefined) {
    env.MQTT_USE_TLS = input.tls ? 'true' : 'false';
    if (!input.tls) env.MQTT_TLS_INSECURE = 'false';
  }
  if (input.keepalive !== undefined) env.MQTT_KEEPALIVE = String(input.keepalive);
  if (input.connectTimeout !== undefined) env.MQTT_CONNECT_TIMEOUT = String(input.connectTimeout);
  if (input.reconnectPeriod !== undefined) env.MQTT_RECONNECT_PERIOD = String(input.reconnectPeriod);
  if (input.jsonParsing !== undefined) env.MQTT_JSON_PARSING = input.jsonParsing ? 'true' : 'false';
  if (topics) {
    const list = Array.isArray(input.topics) ? input.topics : [];
    const filters = list.map((item) => (typeof item === 'string' ? item : item?.filter ?? ''));
    // An empty entry would be silently dropped by the parser; force a clear error instead.
    env.MQTT_TOPICS = filters.some((filter) => !filter) ? '' : filters.join(',');
    if (input.qos !== undefined) env.MQTT_QOS = String(input.qos);
  }
  return env;
}

export class SubscriberService {
  constructor({ env = process.env, createSubscriber, logger = silentLogger, now = Date.now } = {}) {
    this.env = env;
    this.logger = logger;
    this.now = now;
    this.createSubscriber =
      createSubscriber ??
      (() =>
        new MqttSubscriber({
          logger: this.logger,
          onEvent: (level, message) => this._log(level, message),
          onStatus: (status) => {
            if (status === 'connected') this.lastError = null;
            this._log('info', `Broker connection: ${status}`);
            this._changed();
          },
        }));

    this.listeners = new Set();
    this.subscriber = null;
    this.config = null;
    this.broker = null;
    this.received = 0;
    this.lastMessageAt = null;
    this.connectedAt = null;
    this.lastError = null;
  }

  on(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  _emit(event) {
    for (const listener of [...this.listeners]) {
      try {
        listener(event);
      } catch {
        /* an observer must never break the stream */
      }
    }
  }

  _log(level, message) {
    this._emit({ kind: 'log', level, message, at: this.now() });
  }

  _changed() {
    this._emit({ kind: 'state', state: this.state() });
  }

  state() {
    const status = this.subscriber?.status ?? 'disconnected';
    return {
      connected: Boolean(this.subscriber?.isConnected?.()),
      status,
      hasSession: Boolean(this.subscriber),
      transport: 'tcp',
      broker: this.broker
        ? {
            url: `${this.broker.tls ? 'mqtts' : 'mqtt'}://${this.broker.host}:${this.broker.port}`,
            host: this.broker.host,
            port: this.broker.port,
            tls: this.broker.tls,
          }
        : null,
      topics: this.config?.topics ?? [],
      qos: this.config?.qos ?? null,
      clientId: this.config?.clientId || null,
      jsonParsing: this.config?.jsonParsing ?? true,
      received: this.received,
      lastMessageAt: this.lastMessageAt,
      connectedAt: this.connectedAt,
      lastError: this.lastError,
    };
  }

  _config(input, options) {
    try {
      return loadConfig({ ...this.env, ...overridesFrom(input, options) });
    } catch (error) {
      if (error instanceof ConfigError) throw new ServiceError(400, error.message);
      throw error;
    }
  }

  async connect(input = {}) {
    if (this.subscriber) {
      throw new ServiceError(409, 'Already connected — disconnect before connecting again.');
    }
    const config = this._config(input, { topics: true });
    const subscriber = this.createSubscriber();
    subscriber.onMessage = (message) => this._handleMessage(message);
    subscriber.onEvent = (level, message) => this._log(level === 'error' ? 'error' : level, message);

    try {
      await subscriber.connect(config);
    } catch (error) {
      try {
        await subscriber.end?.();
      } catch {
        /* already closed */
      }
      this.lastError = sanitizeError(error);
      this._log('error', `Connection failed: ${this.lastError}`);
      this._changed();
      throw new ServiceError(502, this.lastError);
    }

    this.subscriber = subscriber;
    this.config = config;
    this.broker = { host: config.host, port: config.port, tls: config.useTls };
    this.connectedAt = this.now();
    this.lastError = null;
    this._log('success', `TCP connection established to ${this.broker.host}:${this.broker.port}`);
    this._changed();
    return this.state();
  }

  _handleMessage(message) {
    this.received += 1;
    this.lastMessageAt = this.now();
    const payload = Buffer.from(message.payload ?? []);
    const text = payload.toString('utf8');
    this._emit({
      kind: 'message',
      // Counters travel with the frame so an open page never shows a stale total.
      received: this.received,
      lastMessageAt: this.lastMessageAt,
      message: {
        topic: message.topic,
        qos: message.qos ?? 0,
        at: this.lastMessageAt,
        bytes: payload.length,
        payloadBase64: payload.toString('base64'),
        text,
      },
    });
  }

  async updateSubscriptions(input = {}) {
    if (!this.subscriber) throw new ServiceError(409, 'Not connected to a broker.');
    const config = this._config(input, { topics: true });
    this.subscriber.setSubscriptions(config.topics, config.qos);
    this.config = config;
    this._log('info', `Subscriptions updated: ${config.topics.join(', ')}`);
    this._changed();
    return this.state();
  }

  async disconnect() {
    const subscriber = this.subscriber;
    this.subscriber = null;
    this.config = null;
    this.broker = null;
    if (subscriber) {
      await subscriber.end().catch(() => {});
      this._log('info', 'Disconnected from broker');
    }
    this._changed();
    return this.state();
  }
}
